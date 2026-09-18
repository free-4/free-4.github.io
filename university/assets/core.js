/* ==========================================================================
   core.js — 数据层 / 缓存层 / 查询引擎
   选科要求查询系统
   ========================================================================== */

const APP = (() => {
  'use strict';

  /* ---------------------------------------------------------------
     配置
     --------------------------------------------------------------- */
  const CFG = {
    // 数据目录：与 index.html 同级时用相对路径，部署到 shuoweb.com/university/ 即为绝对路径
    dataBase: (() => {
      const p = location.pathname;
      if (p.includes('/university/')) return '/university/data/';
      // 本地 file:// 或沙箱预览
      const dir = p.substring(0, p.lastIndexOf('/') + 1);
      return dir + 'data/';
    })(),
    cachePrefix: 'xkcx_v1_',
    cacheTTL: 7 * 24 * 3600 * 1000,     // 省份数据缓存 7 天
    indexTTL: 24 * 3600 * 1000,          // 索引缓存 24 小时
    siteName: '选科要求查询',
    siteHost: 'shuoweb.com',
  };

  const SUBJECTS = [
    { key: '物理', short: '物理', en: 'PHY' },
    { key: '化学', short: '化学', en: 'CHE' },
    { key: '生物', short: '生物', en: 'BIO' },
    { key: '思想政治', short: '政治', en: 'POL' },
    { key: '历史', short: '历史', en: 'HIS' },
    { key: '地理', short: '地理', en: 'GEO' },
  ];

  /* ---------------------------------------------------------------
     缓存层：localStorage + 内存 + 过期控制 + 容量保护
     --------------------------------------------------------------- */
  const Cache = {
    mem: new Map(),
    available: (() => {
      try {
        const k = '__t__';
        localStorage.setItem(k, '1');
        localStorage.removeItem(k);
        return true;
      } catch (e) { return false; }
    })(),

    get(key, ttl) {
      if (this.mem.has(key)) {
        const e = this.mem.get(key);
        if (!ttl || Date.now() - e.t < ttl) return e.v;
        this.mem.delete(key);
      }
      if (!this.available) return null;
      try {
        const raw = localStorage.getItem(CFG.cachePrefix + key);
        if (!raw) return null;
        const obj = JSON.parse(raw);
        if (ttl && Date.now() - obj.t > ttl) {
          localStorage.removeItem(CFG.cachePrefix + key);
          return null;
        }
        this.mem.set(key, obj);
        return obj.v;
      } catch (e) { return null; }
    },

    set(key, val, immutable) {
      const entry = { v: val, t: Date.now() };
      this.mem.set(key, entry);
      if (!this.available) return;
      try {
        localStorage.setItem(CFG.cachePrefix + key,
          JSON.stringify(immutable ? { v: val, t: entry.t } : entry));
      } catch (e) {
        // 配额超限：清理旧缓存后重试一次
        this.evictOld();
        try {
          localStorage.setItem(CFG.cachePrefix + key, JSON.stringify(entry));
        } catch (e2) { /* 放弃持久化，内存缓存仍生效 */ }
      }
    },

    evictOld() {
      if (!this.available) return;
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(CFG.cachePrefix) === 0) {
          try {
            const o = JSON.parse(localStorage.getItem(k));
            keys.push({ k, t: o.t || 0 });
          } catch (e) { keys.push({ k, t: 0 }); }
        }
      }
      keys.sort((a, b) => a.t - b.t);
      const drop = Math.ceil(keys.length / 3);
      for (let i = 0; i < drop; i++) localStorage.removeItem(keys[i].k);
    },

    /* 缓存体积与条目统计 */
    stats() {
      if (!this.available) return { count: 0, bytes: 0, available: false };
      let count = 0, bytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(CFG.cachePrefix) === 0) {
          count++;
          bytes += (localStorage.getItem(k) || '').length * 2;
        }
      }
      return { count, bytes, available: true };
    },

    clear() {
      this.mem.clear();
      if (!this.available) return;
      const rm = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(CFG.cachePrefix) === 0) rm.push(k);
      }
      rm.forEach(k => localStorage.removeItem(k));
    },

    /* 分片持久化：省份数据按院校分块存，规避 localStorage 单键限制 */
    setChunks(baseKey, arr, chunkSize) {
      const cs = chunkSize || 8;
      const n = Math.ceil(arr.length / cs);
      this.set(baseKey + '_meta', { n, len: arr.length });
      for (let i = 0; i < n; i++) {
        this.set(baseKey + '_c' + i, arr.slice(i * cs, (i + 1) * cs), true);
      }
    },

    getChunks(baseKey) {
      const meta = this.get(baseKey + '_meta');
      if (!meta || !meta.n) return null;
      const out = [];
      for (let i = 0; i < meta.n; i++) {
        const part = this.get(baseKey + '_c' + i, CFG.cacheTTL);
        if (!part) return null;   // 分片缺失 → 视为未命中
        out.push(...part);
      }
      return out.length ? out : null;
    },
  };

  /* ---------------------------------------------------------------
     状态
     --------------------------------------------------------------- */
  const State = {
    province: null,          // 当前省份名
    provData: null,          // { 省份, 要求字典, 院校: [...] }
    provIndex: [],           // provinces.json
    majorIndex: [],          // majors.json
    uniIndex: [],            // universities.json
    summary: null,
    mySubjects: [],          // 我的选科（3 门）
    filtered: [],
    view: 'home',
    cacheHit: false,
  };

  /* ---------------------------------------------------------------
     网络层：抓取 + 缓存 + 进度
     --------------------------------------------------------------- */
  async function fetchJSON(url, opts) {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function loadIndex(name, ttl) {
    const ck = 'idx_' + name;
    const hit = Cache.get(ck, ttl || CFG.indexTTL);
    if (hit) return hit;
    const data = await fetchJSON(CFG.dataBase + name + '.json');
    Cache.set(ck, data);
    return data;
  }

  async function loadProvince(prov) {
    if (State.province === prov && State.provData) return State.provData;

    // 1) 本地缓存
    const cached = Cache.getChunks('prov_' + prov);
    if (cached && cached.length) {
      State.cacheHit = true;
      State.province = prov;
      State.provData = { 省份: prov, 要求字典: cached.__req || [], 院校: cached };
      // 要求字典单独取
      const req = Cache.get('prov_' + prov + '_req');
      if (req) State.provData.要求字典 = req;
      return State.provData;
    }

    // 2) 网络
    State.cacheHit = false;
    const raw = await fetchJSON(CFG.dataBase + encodeURIComponent(prov) + '.json');
    State.province = prov;
    State.provData = raw;
    // 3) 写缓存（分片）
    Cache.set('prov_' + prov + '_req', raw.要求字典 || []);
    Cache.setChunks('prov_' + prov, raw.院校 || [], 8);
    return raw;
  }

  /* ---------------------------------------------------------------
     选科要求解析
     --------------------------------------------------------------- */
  function parseReq(text) {
    const t = (text || '').trim();
    if (!t || t.indexOf('不提科目要求') >= 0) {
      return { mode: 0, subs: [], kind: 'unlimited', label: '不限选科' };
    }
    const all = ['物理', '化学', '生物', '思想政治', '历史', '地理', '技术'];
    const subs = all.filter(s => t.indexOf(s) >= 0);
    let mode = subs.length;
    if (t.indexOf('1门') >= 0) mode = 1;
    else if (t.indexOf('2门') >= 0) mode = 2;
    else if (t.indexOf('3门') >= 0) mode = 3;
    let kind = 'must-' + mode;
    const label = subs.map(s => s === '思想政治' ? '政治' : s).join('+') + ' 必选';
    return { mode, subs, kind, label };
  }

  /* 判断某专业要求是否被"我的选科"满足 */
  function satisfies(req, mine) {
    if (req.mode === 0) return true;
    if (!mine || !mine.length) return false;
    // 模式 1：至少选考其中 1 门
    // 模式 2/3：所有列出的科目都必须选
    if (req.mode === 1) return req.subs.some(s => mine.indexOf(s) >= 0);
    return req.subs.every(s => mine.indexOf(s) >= 0);
  }

  /* 统计当前省份下、给定选科组合的可报情况 */
  function comboStats(provData, mine) {
    let total = 0, ok = 0, uniTotal = 0, uniOk = 0;
    for (const u of provData.院校) {
      uniTotal++;
      let uOk = false;
      for (const m of u[5]) {
        total++;
        const r = parseReq(provData.要求字典[m[1]]);
        if (satisfies(r, mine)) { ok++; uOk = true; }
      }
      if (uOk) uniOk++;
    }
    return {
      total, ok, uniTotal, uniOk,
      rate: total ? ok / total : 0,
      uniRate: uniTotal ? uniOk / uniTotal : 0,
    };
  }

  /* 院校过滤 + 排序 */
  function filterSchools(provData, q, opts) {
    const o = opts || {};
    const kw = (q || '').trim().toLowerCase();
    const out = [];
    for (const u of provData.院校) {
      // 层次过滤
      if (o.level && o.level !== 'all' && u[4] !== o.level) continue;
      // 仅看能报的
      const majors = [];
      for (const m of u[5]) {
        if (o.majorLevel && o.majorLevel !== 'all' && m[2] !== o.majorLevel) continue;
        const r = parseReq(provData.要求字典[m[1]]);
        if (o.onlyMine) {
          if (o.mine && o.mine.length && !satisfies(r, o.mine)) continue;
        }
        majors.push([m[0], m[1], r]);
      }
      if (o.onlyMine && (!o.mine || !o.mine.length) && u[5].length) {
        // 未选科时 onlyMine 无效，保留全部
      }
      // 关键词：命中院校名 或 专业名
      let hit = !kw;
      if (kw && !hit) {
        if (u[1].toLowerCase().indexOf(kw) >= 0) hit = true;
        else if (String(u[0]).indexOf(kw) >= 0) hit = true;
        else if (majors.some(m => m[0].toLowerCase().indexOf(kw) >= 0)) hit = true;
      }
      if (!hit) continue;
      if (!majors.length) continue;
      out.push({
        code: u[0], name: u[1], loc: u[2], dept: u[3], level: u[4],
        majors,
        majorCount: majors.length,
        unlimited: majors.filter(m => m[2].mode === 0).length,
        allOK: o.mine && o.mine.length
          ? majors.every(m => satisfies(m[2], o.mine)) : null,
      });
    }
    // 排序
    const s = o.sort || 'majors';
    if (s === 'majors') out.sort((a, b) => b.majorCount - a.majorCount || a.name.localeCompare(b.name, 'zh'));
    else if (s === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (s === 'tier') out.sort((a, b) => tierOf(a.name) - tierOf(b.name) || b.majorCount - a.majorCount);
    else if (s === 'unlimited') out.sort((a, b) => (b.unlimited / b.majorCount) - (a.unlimited / a.majorCount));
    return out;
  }

  /* 依据校名粗判层次（用于"层次优先"排序，仅作参考） */
  const TIER_KEYWORDS = [
    '清华大学|北京大学|复旦大学|上海交通大学|浙江大学|南京大学|中国科学技术大学|哈尔滨工业大学|西安交通大学|中国人民大学|同济大学|北京航空航天大学|北京理工大学|武汉大学|华中科技大学|中山大学|四川大学|东南大学|南开大学|天津大学|北京师范大学|厦门大学|山东大学|吉林大学|中南大学|湖南大学|重庆大学|兰州大学|东北大学|西北工业大学|中国农业大学|电子科技大学|华南理工大学|大连理工大学|北京邮电大学|上海财经大学|中央财经大学|对外经济贸易大学|中国政法大学|北京外国语大学|上海外国语大学|中央民族大学',
    '211|双一流|中国|中央|国家',
  ];
  function tierOf(name) {
    if (new RegExp(TIER_KEYWORDS[0]).test(name)) return 0;
    if (/大学$/.test(name)) return 3;
    if (/学院$/.test(name)) return 4;
    return 5;
  }

  /* 全局专业名搜索（跨省份索引） */
  function searchMajors(kw, limit) {
    const k = (kw || '').trim().toLowerCase();
    if (!k) return [];
    const out = [];
    for (const r of State.majorIndex) {
      if (r[0].toLowerCase().indexOf(k) >= 0) out.push(r);
      if (out.length >= (limit || 60)) break;
    }
    return out;
  }

  /* 全局院校搜索 */
  function searchUnis(kw, limit) {
    const k = (kw || '').trim().toLowerCase();
    if (!k) return [];
    const out = [];
    for (const r of State.uniIndex) {
      if (r[1].toLowerCase().indexOf(k) >= 0 || String(r[0]).indexOf(k) >= 0) out.push(r);
      if (out.length >= (limit || 60)) break;
    }
    return out;
  }

  /* ---------------------------------------------------------------
     初始化：加载索引
     --------------------------------------------------------------- */
  async function init() {
    const [prov, maj, uni, sum] = await Promise.all([
      loadIndex('provinces'),
      loadIndex('majors'),
      loadIndex('universities'),
      loadIndex('summary'),
    ]);
    State.provIndex = prov;
    State.majorIndex = maj;
    State.uniIndex = uni;
    State.summary = sum;
    return sum;
  }

  return {
    CFG, SUBJECTS, Cache, State,
    loadIndex, loadProvince, fetchJSON,
    parseReq, satisfies, comboStats, filterSchools, searchMajors, searchUnis,
    init, tierOf,
  };
})();
