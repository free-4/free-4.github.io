/* ==========================================================================
   search.js — 模糊搜索引擎
   支持：中文包含 / 拼音全拼 / 拼音首字母 / 别名简称 / 英文 / 错别字纠错 / 多关键词分词
   ========================================================================== */

const Search = (() => {
  'use strict';

  let Majors = null;      // search-majors.json
  let Unis = null;        // search-universities.json
  let AliasMap = null;    // 别名 -> 主键 反查表

  /* ---------------- 加载 ---------------- */
  async function load() {
    if (Majors && Unis) return;
    const base = APP.CFG.dataBase;
    const [m, u] = await Promise.all([
      APP.Cache.get('searchmajors', APP.CFG.indexTTL)
        ? Promise.resolve(APP.Cache.get('searchmajors', APP.CFG.indexTTL))
        : fetch(base + 'search-majors.json').then(r => r.json())
            .then(d => { APP.Cache.set('searchmajors', d, true); return d; }),
      APP.Cache.get('searchunis', APP.CFG.indexTTL)
        ? Promise.resolve(APP.Cache.get('searchunis', APP.CFG.indexTTL))
        : fetch(base + 'search-universities.json').then(r => r.json())
            .then(d => { APP.Cache.set('searchunis', d, true); return d; }),
    ]);
    Majors = m;
    Unis = u;
    buildAliasMap();
  }

  function buildAliasMap() {
    AliasMap = { major: {}, uni: {} };
    Majors.n.forEach((n, i) => {
      const a = Majors.a[i];
      if (a) a.split(';').forEach(x => {
        const k = x.toLowerCase();
        if (!AliasMap.major[k]) AliasMap.major[k] = [];
        AliasMap.major[k].push(i);
      });
    });
    Unis.n.forEach((n, i) => {
      const a = Unis.a[i];
      if (a) a.split(';').forEach(x => {
        const k = x.toLowerCase();
        if (!AliasMap.uni[k]) AliasMap.uni[k] = [];
        AliasMap.uni[k].push(i);
      });
    });
  }

  /* ---------------- 编辑距离（用于错别字纠错，仅短词） ---------------- */
  function editDistance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = new Array(n + 1), cur = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      for (let j = 1; j <= n; j++) {
        const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      }
      const t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }

  /* ---------------- 打分 ---------------- */
  // 分值越高越相关。分两档：
  //   强匹配（>=1000）：名称/拼音/别名的前缀或完整命中 —— 直接进结果
  //   弱匹配（<1000）：子串、逐字包含 —— 仅在高分时才进结果
  function scoreOf(query, name, full, short, alias) {
    const q = query;
    const nm = name.toLowerCase();

    // ===== 强匹配 =====
    if (nm === q) return 10000;
    if (nm.startsWith(q)) return 9000 - name.length;
    if (alias) {
      const al = alias.split(';');
      for (const a of al) {
        const la = a.toLowerCase();
        if (la === q) return 8800;
        if (la.startsWith(q)) return 8400 - name.length;
      }
    }
    // 名称包含查询词。
    // 关键区分：命中位置在"词首"才值得高分；中文里嵌在中间的多为巧合
    // （如 "北大" 命中 "西北大学"），必须显著压低，让真正的简称（北京大学）胜出。
    const idx = nm.indexOf(q);
    if (idx >= 0) {
      const headBonus = idx === 0 ? 0 : 1200;   // 非词首 → 扣 1200 分
      return 8000 - idx * 20 - name.length - headBonus;
    }
    if (full === q) return 7800;
    if (full.startsWith(q)) return 7400 - name.length * 2;
    if (short === q) return 7200;
    if (short.startsWith(q)) {
      // 首字母前缀命中。此时不能按名字长度排序（会把 "军事交通工程" 排到
      // "计算机科学与技术" 前面）。改为：多消耗的音节越少，越接近精确缩写。
      // 同时用"记录数"在后续排序里做主权重，让旗舰专业（记录多）自然靠前。
      const extra = short.length - q.length;      // 前缀之外剩余音节数
      return 7000 - extra * 4;
    }
    // 别名的词边界匹配（别名通常就是简称，值得信任）
    // 但 2 字中文查询过于宽泛（如 "北大" in "西北大学"），必须要求前缀命中
    if (alias) {
      const looseOk = !(q.length <= 2 && /[\u4e00-\u9fa5]/.test(q));
      for (const a of alias.split(';')) {
        const la = a.toLowerCase();
        if (looseOk && la.indexOf(q) >= 0) return 6600 - name.length;
      }
    }
    // 全拼的"词边界前缀"：只认**首个音节**（即整个名字的拼音开头），
    // 避免 "shuxue" 命中 "meishuxue"（美术学）这类中段巧合
    if (q.length >= 3) {
      const segs = fullSegments(full);
      if (segs.length && segs[0].startsWith(q)) return 6400 - name.length;
      // 后续音节命中 → 降级为弱匹配，不给高分
    }
    // 首字母的"前缀"语义：q 匹配某个词的声母开头
    if (q.length >= 2 && isAlpha(q)) {
      const isegs = shortSegments(full, short);
      for (const sg of isegs) {
        if (sg.startsWith(q)) return 6200 - name.length;
      }
    }

    // ===== 弱匹配 =====
    // 全拼子串（要求 q 足够长，避免误命中）
    if (q.length >= 5 && full.indexOf(q) >= 0) return 900 - name.length * 2;
    // 首字母子串（要求 >= 3 字母且落在音节点边界）
    if (q.length >= 3 && isAlpha(q)) {
      const isegs = shortSegments(full, short);
      for (const sg of isegs) {
        if (sg.indexOf(q) >= 0) return 700 - name.length * 2;
      }
    }
    // 逐字包含：要求字序一致，且仅限 2-3 字中文，分数压低
    if (q.length >= 2 && q.length <= 3 && /[\u4e00-\u9fa5]/.test(q)) {
      let pos = 0, ok = true;
      for (const ch of q) {
        const f = nm.indexOf(ch, pos);
        if (f < 0) { ok = false; break; }
        pos = f + 1;
      }
      if (ok) return 300 - name.length * 2;
    }
    return -1;
  }

  function isAlpha(s) { return /^[a-z0-9]+$/.test(s); }

  /* 把拼音全拼按音节点切分：利用首字母串做参照
     如 full=jsjkxyjs short=jsjkxyjs -> 无法切；改用"声母表"切分 */
  const INITIALS = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l',
                    'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];

  let _segCache = new Map();
  function fullSegments(full) {
    // 粗略按元音簇切分音节
    if (_segCache.has(full)) return _segCache.get(full);
    const segs = [];
    let cur = '';
    for (let i = 0; i < full.length; i++) {
      cur += full[i];
      const nxt = full[i + 1];
      // 遇到下一个声母起始且当前已含"元音+辅音尾"（真正的音节收尾，如 xue/xu），才断句
      if (nxt && /[aeiouv][a-z]/.test(cur) && isInitialAt(full, i + 1)) {
        segs.push(cur); cur = '';
      }
    }
    if (cur) segs.push(cur);
    if (_segCache.size < 4000) _segCache.set(full, segs);
    return segs;
  }

  function isInitialAt(s, i) {
    const two = s.slice(i, i + 2);
    if (INITIALS.indexOf(two) >= 0) return true;
    return INITIALS.indexOf(s[i]) >= 0;
  }

  /* 首字母串的音节边界：按全拼的音节数切分 */
  function shortSegments(full, short) {
    const n = fullSegments(full).length;
    if (!n || short.length < n) return [short];
    // 均分近似（每个音节一个声母）
    const segs = [];
    const base = Math.floor(short.length / n);
    let rest = short.length % n;
    let p = 0;
    for (let i = 0; i < n; i++) {
      const len = base + (rest-- > 0 ? 1 : 0);
      if (len <= 0) break;
      segs.push(short.slice(p, p + len));
      p += len;
    }
    return segs.length ? segs : [short];
  }

  // 是否为强匹配（决定是否保留）
  function isStrong(score) { return score >= 1000; }

  /* ---------------- 主搜索 ---------------- */
  function search(query, opts) {
    const o = opts || {};
    const limit = o.limit || 50;
    const raw = (query || '').trim().toLowerCase();
    if (!raw) return { items: [], total: 0, corrected: null };

    // 分词：空格分隔的多关键词
    const tokens = raw.split(/\s+/).filter(Boolean);
    const types = o.types || ['major', 'uni'];

    // —— 先按 token 收集候选（AND 语义）——
    let candidateSets = null;
    for (const tk of tokens) {
      const set = new Set();
      singleMatch(tk, types, set);
      if (candidateSets === null) candidateSets = set;
      else {
        const merged = new Set();
        for (const k of candidateSets) if (set.has(k)) merged.add(k);
        candidateSets = merged;
      }
      if (!candidateSets.size) break;
    }
    const keys = candidateSets ? Array.from(candidateSets) : [];

    // —— 对每个候选打分 ——
    let items = [];
    let weakPool = [];
    for (const k of keys) {
      const sep = k.lastIndexOf(':');
      const type = k.slice(0, sep);
      const idx = +k.slice(sep + 1);
      const isMajor = type === 'major';
      const names = isMajor ? Majors.n : Unis.n;
      const fulls = isMajor ? Majors.p : Unis.p;
      const shorts = isMajor ? Majors.s : Unis.s;
      const aliases = isMajor ? Majors.a : Unis.a;

      // 取所有 token 中最高的分数
      let sc = 0, strong = false;
      for (const tk of tokens) {
        const s = scoreOf(tk, names[idx], fulls[idx], shorts[idx], aliases[idx]);
        if (s > sc) sc = s;
        if (isStrong(s)) strong = true;
      }
      // 过滤策略：
      //  - 有强匹配 → 保留
      //  - 纯弱匹配 → 仅当结果数很少（<15）时才保留，避免淹没真正的结果
      if (!strong) {
        if (sc < 300) continue;
        weakPool.push({ type, idx, name: names[idx], score: sc, rawScore: sc,
          pinyin: fulls[idx], short: shorts[idx], alias: aliases[idx],
          count: isMajor ? Majors.r[idx] : Unis.r[idx] });
        continue;
      }

      items.push({
        type, idx, name: names[idx], score: sc, rawScore: sc,
        pinyin: fulls[idx], short: shorts[idx], alias: aliases[idx],
        count: isMajor ? Majors.r[idx] : Unis.r[idx],
      });
    }

    // 强匹配足够多时丢弃弱匹配，避免噪音
    if (items.length < 15 && weakPool.length) {
      items = items.concat(weakPool.slice(0, 15 - items.length));
    }

    // —— 排序：匹配度优先，热度作为次级权重 ——
    // 同档位内（如都是"首字母前缀"命中）用记录数拉开差距：
    // 计算机科学与技术(814条) 应排在 军事交通工程(1条) 之前。
    // 为了不跨档位影响精度，只对相近分数（差 < 300）的条目应用热度加权。
    for (const it of items) {
      it.score += Math.min(it.count, 2000) / 100;   // 最多 +20 分
    }
    items.sort((a, b) => {
      const d = b.rawScore - a.rawScore;
      if (Math.abs(d) >= 300) return d;            // 档位不同 → 按原始相关度
      return d || (b.count - a.count);             // 同档位 → 记录数多者优先
    });

    // —— 无结果时做纠错提示 ——
    let corrected = null;
    if (!items.length && raw.length >= 2 && raw.length <= 12 && /^[\u4e00-\u9fa5a-z]+$/.test(raw)) {
      corrected = fuzzyCorrect(raw);
    }

    return { items: items.slice(0, limit), total: items.length, corrected };
  }

  /* 单个 token 的匹配（写入 Set，键为 "type:index"） */
  function singleMatch(tk, types, set) {
    const add = (type, i) => set.add(type + ':' + i);
    const isCJK = /[\u4e00-\u9fa5]/.test(tk);

    for (const type of types) {
      const names = type === 'major' ? Majors.n : Unis.n;
      const fulls = type === 'major' ? Majors.p : Unis.p;
      const shorts = type === 'major' ? Majors.s : Unis.s;
      const aliases = type === 'major' ? Majors.a : Unis.a;
      const aliasMap = type === 'major' ? AliasMap.major : AliasMap.uni;

      // 1) 别名精确命中（最快路径，也最准）
      const am = aliasMap[tk];
      if (am) am.forEach(i => add(type, i));

      // 2) 全量扫描
      for (let i = 0; i < names.length; i++) {
        const nm = names[i].toLowerCase();
        if (nm.indexOf(tk) >= 0) { add(type, i); continue; }
        if (fulls[i].indexOf(tk) >= 0) { add(type, i); continue; }
        if (tk.length >= 2 && shorts[i].indexOf(tk) >= 0) { add(type, i); continue; }
        const al = aliases[i];
        if (al && al.toLowerCase().indexOf(tk) >= 0) { add(type, i); continue; }
        // 逐字包含：要求字序一致，且仅限 2-3 字中文
        if (isCJK && tk.length >= 2 && tk.length <= 3) {
          let pos = 0, ok = true;
          for (const ch of tk) {
            const f = nm.indexOf(ch, pos);
            if (f < 0) { ok = false; break; }
            pos = f + 1;
          }
          if (ok) add(type, i);
        }
      }
    }
  }

  /* ---------------- 纠错：找编辑距离最近的候选 ---------------- */
  function fuzzyCorrect(q) {
    const pool = [];
    // 从专业名与别名里找近似
    for (let i = 0; i < Majors.n.length; i++) {
      pool.push({ s: Majors.n[i].toLowerCase(), name: Majors.n[i], type: 'major', i });
      if (Majors.p[i]) pool.push({ s: Majors.p[i], name: Majors.n[i], type: 'major', i });
    }
    let best = null, bestD = 99;
    const maxD = q.length <= 3 ? 1 : 2;
    for (const p of pool) {
      if (Math.abs(p.s.length - q.length) > maxD) continue;
      // 快速预筛：首字符相同或长度接近
      const d = editDistance(q, p.s, maxD);
      if (d < bestD && d <= maxD) { bestD = d; best = p; }
    }
    return best ? { name: best.name, type: best.type, dist: bestD, query: best.s } : null;
  }

  /* ---------------- 按门类取专业 ---------------- */
  function majorsByCategory(catIdx) {
    const out = [];
    for (let i = 0; i < Majors.n.length; i++) {
      if (Majors.c[i] === catIdx) out.push(i);
    }
    // 按记录数降序
    out.sort((a, b) => Majors.r[b] - Majors.r[a]);
    return out;
  }

  function categories() { return Majors ? Majors.cat : []; }
  function majorCount() { return Majors ? Majors.n.length : 0; }
  function uniCount() { return Unis ? Unis.n.length : 0; }
  function majorName(i) { return Majors.n[i]; }
  function majorCategory(i) { return Majors.cat[Majors.c[i]]; }
  function majorCategoryIndex(i) { return Majors.c[i]; }
  function majorRecordCount(i) { return Majors.r[i]; }
  function majorPinyin(i) { return { full: Majors.p[i], short: Majors.s[i] }; }
  function uniName(i) { return Unis.n[i]; }
  function uniProvince(i) { return Unis.prov[Unis.v[i]]; }
  function uniPinyin(i) { return { full: Unis.p[i], short: Unis.s[i] }; }

  return {
    load, search, majorsByCategory, categories,
    majorCount, uniCount, majorName, majorCategory, majorCategoryIndex, majorRecordCount, majorPinyin,
    uniName, uniProvince, uniPinyin,
    editDistance,
  };
})();
