/* ==========================================================================
   major-query.js — 全能专业查询模块
   功能：模糊搜索、门类筛选、选科要求反筛、多维排序、专业详情、收藏、对比
   ========================================================================== */

(() => {
  'use strict';
  const { CFG, SUBJECTS, Cache, State } = APP;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const FAV_KEY = CFG.cachePrefix + 'favmajors';

  /* ---------------- 收藏 ---------------- */
  const Fav = {
    list: [],
    init() {
      try { this.list = JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch (e) { this.list = []; }
    },
    has(name) { return this.list.indexOf(name) >= 0; },
    toggle(name) {
      const i = this.list.indexOf(name);
      if (i >= 0) this.list.splice(i, 1); else this.list.push(name);
      try { localStorage.setItem(FAV_KEY, JSON.stringify(this.list)); } catch (e) {}
      return i < 0;
    },
    save() { try { localStorage.setItem(FAV_KEY, JSON.stringify(this.list)); } catch (e) {} },
  };

  /* ---------------- 状态 ---------------- */
  const Q = {
    kw: '',
    cat: 'all',          // 门类索引 | 'all'
    req: 'all',          // 选科要求筛选：all | unlimited | needPhys | needChem
    onlyMine: false,
    sort: 'count',
    view: 'list',        // list | grid
    results: [],
    total: 0,
    corrected: null,
  };

  /* ---------------- 工具 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g,
      c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  const fmt = n => (n || 0).toLocaleString('zh-CN');
  function debounce(fn, ms) {
    let t; return function () {
      clearTimeout(t); const a = arguments, self = this;
      t = setTimeout(() => fn.apply(self, a), ms);
    };
  }
  function hl(text, kw) {
    const t = esc(text);
    if (!kw) return t;
    // 高亮关键词中的中文部分
    const cjk = kw.replace(/[^\u4e00-\u9fa5]/g, '');
    if (!cjk) return t;
    let out = t;
    for (const ch of new Set(cjk)) {
      out = out.split(ch).join(`<mark style="background:var(--swiss-red);color:#fff;padding:0 1px">${ch}</mark>`);
    }
    return out;
  }

  /* ============================================================
     主渲染
     ============================================================ */
  async function render(host) {
    host.innerHTML = `<section class="panel"><div class="wrap">
      <div class="state"><div class="spin"></div><b>正在加载专业索引…</b>
      <p>首次加载约 130KB，之后将缓存到本地。</p></div></div></section>`;

    try { await Search.load(); }
    catch (e) {
      host.innerHTML = `<section class="panel"><div class="wrap">
        <div class="state"><b>索引加载失败</b><p>${esc(e.message)}</p></div></div></section>`;
      return;
    }
    Fav.init();
    drawShell(host);
    runSearch();
  }

  function drawShell(host) {
    const cats = Search.categories();
    host.innerHTML = `
    <section class="panel">
      <div class="wrap">
        <div class="panel-head">
          <div>
            <h2>专业查询 · 全能检索</h2>
            <p>覆盖全国 <b>${fmt(Search.majorCount())}</b> 个专业名称、<b>${fmt(Search.uniCount())}</b> 所院校。
               支持中文、拼音全拼、拼音首字母、简称别名与错别字模糊匹配。</p>
          </div>
          <span class="sec-num">03 / MAJOR SEARCH</span>
        </div>

        <!-- 搜索框 -->
        <div class="mq-search">
          <div class="search-box">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
            <input id="mqKw" class="input" type="search" autocomplete="off" spellcheck="false"
              placeholder="搜专业或院校：临床医学 / lcyx / 计算机 / 北大 / 护理 / wsyy">
          </div>
          <button class="btn" id="mqClear">清空</button>
        </div>
        <div class="mq-hint" id="mqHint">
          试试：<a href="#" data-q="临床医学">临床医学</a>
          <a href="#" data-q="lcyx">lcyx</a>
          <a href="#" data-q="计算机">计算机</a>
          <a href="#" data-q="会计">会计</a>
          <a href="#" data-q="学前教育">学前教育</a>
          <a href="#" data-q="北大">北大</a>
          <a href="#" data-q="护理">护理</a>
        </div>

        <!-- 筛选条 -->
        <div class="mq-filters">
          <div class="field">
            <label for="mqCat">学科门类</label>
            <select id="mqCat" class="select">
              <option value="all">全部门类（${fmt(Search.majorCount())}）</option>
              ${cats.map((c, i) => `<option value="${i}">${esc(c)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="mqReq">选科要求</label>
            <select id="mqReq" class="select">
              <option value="all">不限要求</option>
              <option value="unlimited">仅看「不限选科」的专业</option>
              <option value="needPhys">仅看要求物理的专业</option>
              <option value="needChem">仅看要求化学的专业</option>
              <option value="mine">仅看「我符合选科」的专业</option>
            </select>
          </div>
          <div class="field">
            <label for="mqSort">排序方式</label>
            <select id="mqSort" class="select">
              <option value="count">开设院校数（多→少）</option>
              <option value="countAsc">开设院校数（少→多）</option>
              <option value="name">专业名称</option>
              <option value="unlimited">不限选科占比</option>
              <option value="phys">要求物理比例</option>
              <option value="related">相关度</option>
            </select>
          </div>
          <div class="field">
            <label>视图</label>
            <div class="seg" role="group">
              <button data-view="list" aria-pressed="true">列表</button>
              <button data-view="grid" aria-pressed="false">卡片</button>
            </div>
          </div>
        </div>

        <!-- 我的选科 -->
        <div class="mq-subj">
          <span class="mq-subj-label">我的选科</span>
          <div class="subj-chips" id="mqSubj">
            ${SUBJECTS.map(s => `<button class="chip${State.mySubjects.includes(s.key) ? ' on' : ''}"
              data-subj="${s.key}">${s.short}</button>`).join('')}
          </div>
          <span class="combo-badge" id="mqBadge">未选择</span>
          <button class="btn btn-sm" id="mqFavBtn">我的收藏 <span class="num">${Fav.list.length}</span></button>
        </div>

        <div class="stat-line mt-24" id="mqStats"></div>
        <div id="mqResult"></div>
      </div>
    </section>`;

    // —— 事件绑定 ——
    const kwEl = $('#mqKw');
    kwEl.value = Q.kw;
    kwEl.oninput = debounce(() => { Q.kw = kwEl.value; runSearch(); }, 160);
    kwEl.onkeydown = (e) => { if (e.key === 'Enter') { Q.kw = kwEl.value; runSearch(); } };
    $('#mqClear').onclick = () => {
      kwEl.value = ''; Q.kw = ''; Q.cat = 'all'; Q.req = 'all'; Q.onlyMine = false;
      $('#mqCat').value = 'all'; $('#mqReq').value = 'all';
      runSearch(); kwEl.focus();
    };
    $$('#mqHint a').forEach(a => a.onclick = (e) => {
      e.preventDefault();
      Q.kw = a.dataset.q; kwEl.value = Q.kw; runSearch();
    });

    $('#mqCat').onchange = e => { Q.cat = e.target.value; runSearch(); };
    $('#mqReq').onchange = e => { Q.req = e.target.value; runSearch(); };
    $('#mqSort').onchange = e => { Q.sort = e.target.value; renderList(); };
    $$('.seg button').forEach(b => b.onclick = () => {
      Q.view = b.dataset.view;
      $$('.seg button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.view === Q.view)));
      renderList();
    });

    $$('#mqSubj .chip').forEach(c => c.onclick = () => {
      const k = c.dataset.subj, i = State.mySubjects.indexOf(k);
      if (i >= 0) State.mySubjects.splice(i, 1);
      else {
        if (State.mySubjects.length >= 3) { toastMsg('最多选择 3 门选考科目'); return; }
        State.mySubjects.push(k);
      }
      c.classList.toggle('on');
      saveSubjects();
      updateBadge();
      runSearch();
    });
    $('#mqFavBtn').onclick = showFavorites;
    updateBadge();
  }

  function saveSubjects() {
    try { localStorage.setItem(CFG.cachePrefix + 'subjects', JSON.stringify(State.mySubjects)); } catch (e) {}
  }
  function updateBadge() {
    const b = $('#mqBadge');
    if (!b) return;
    const n = State.mySubjects.length;
    b.textContent = n ? State.mySubjects.map(s => s === '思想政治' ? '政治' : s).join('+') + `（${n}/3）` : '未选择';
    b.className = 'combo-badge ' + (n === 3 ? 'ok' : 'warn');
  }
  function toastMsg(t) {
    const host = document.querySelector('.toast-host');
    if (!host) return;
    const d = document.createElement('div');
    d.className = 'toast'; d.textContent = t;
    host.appendChild(d);
    setTimeout(() => { d.style.transition = 'opacity .2s'; d.style.opacity = '0'; setTimeout(() => d.remove(), 220); }, 2000);
  }

  /* ============================================================
     执行搜索
     ============================================================ */
  function runSearch() {
    const kw = (Q.kw || '').trim();
    let res = { items: [], total: 0, corrected: null };

    if (kw) {
      res = Search.search(kw, { limit: 300, types: ['major', 'uni'] });
    } else {
      // 无关键词：按门类列出全部专业
      const list = Q.cat === 'all'
        ? Array.from({ length: Search.majorCount() }, (_, i) => i)
        : Search.majorsByCategory(+Q.cat);
      res.items = list.map(i => ({
        type: 'major', idx: i, name: Search.majorName(i), score: 0,
        count: Search.majorRecordCount(i),
      }));
      res.total = res.items.length;
    }

    // —— 门类过滤 ——
    if (Q.cat !== 'all') {
      const ci = +Q.cat;
      res.items = res.items.filter(it => it.type === 'uni' || Search.majorCategoryIndex(it.idx) === ci);
    }
    // —— 选科要求过滤 ——
    if (Q.req !== 'all') {
      const majors = APP.State.majorIndex;
      const nameToRow = buildMajorRowMap();
      res.items = res.items.filter(it => {
        if (it.type !== 'major') return false;
        const row = nameToRow.get(it.name);
        if (!row) return false;
        if (Q.req === 'unlimited') return row[4] >= 60;
        if (Q.req === 'needPhys') return row[5] >= 50;
        if (Q.req === 'needChem') return row[6] >= 50;
        if (Q.req === 'mine') {
          if (!State.mySubjects.length) return true;
          const need = { 物理: row[5], 化学: row[6], 生物: row[7], 政治: row[8], 历史: row[9], 地理: row[10] };
          for (const k in need) {
            if (need[k] > 0 && State.mySubjects.indexOf(k) < 0) return false;
          }
          return true;
        }
        return true;
      });
    }

    Q.results = res.items;
    Q.total = res.items.length;
    Q.corrected = res.corrected;

    renderStats();
    renderList();
  }

  let _rowMap = null;
  function buildMajorRowMap() {
    if (_rowMap) return _rowMap;
    _rowMap = new Map();
    for (const r of State.majorIndex) _rowMap.set(r[0], r);
    return _rowMap;
  }

  function renderStats() {
    const host = $('#mqStats');
    if (!host) return;
    const majN = Q.results.filter(x => x.type === 'major').length;
    const uniN = Q.results.filter(x => x.type === 'uni').length;
    const catName = Q.cat === 'all' ? '全部门类' : Search.categories()[+Q.cat];
    host.innerHTML = `
      <div class="stat-cell"><b>${fmt(majN)}</b><span>匹配专业</span></div>
      <div class="stat-cell"><b>${fmt(uniN)}</b><span>匹配院校</span></div>
      <div class="stat-cell"><b>${esc(catName)}</b><span>当前门类</span></div>
      <div class="stat-cell hl"><b>${fmt(Fav.list.length)}</b><span>已收藏</span></div>`;
  }

  function renderList() {
    const host = $('#mqResult');
    if (!host) return;

    // 纠错提示
    let corrHtml = '';
    if (Q.corrected && !Q.results.length) {
      corrHtml = `<div class="mq-correct">未找到匹配结果，你是不是想搜
        <a href="#" id="mqCorr">「${esc(Q.corrected.name)}」</a>？</div>`;
    }

    if (!Q.results.length) {
      host.innerHTML = corrHtml + `<div class="state">
        <b>没有匹配的专业或院校</b>
        <p>可以尝试：换用专业全称、输入拼音首字母（如 lcyx）、或减少筛选条件。</p></div>`;
      const c = $('#mqCorr');
      if (c) c.onclick = (e) => {
        e.preventDefault();
        Q.kw = Q.corrected.name; $('#mqKw').value = Q.kw; runSearch();
      };
      return;
    }

    let items = Q.results.slice();
    // 排序
    const rowMap = buildMajorRowMap();
    // 任何排序方式下都先按相关度（score）分层，避免"记录数多但相关度低"的词条
    // 抢占首位（如用 "北大" 搜出 "西北大学"）
    const byScore = (a, b) => (b.score || 0) - (a.score || 0);
    const cmp = {
      relate: byScore,
      count: (a, b) => byScore(a, b) || b.count - a.count,
      countAsc: (a, b) => byScore(a, b) || a.count - b.count,
      name: (a, b) => byScore(a, b) || a.name.localeCompare(b.name, 'zh'),
      unlimited: (a, b) => {
        const ra = rowMap.get(a.name) || [], rb = rowMap.get(b.name) || [];
        return byScore(a, b) || (rb[4] || 0) - (ra[4] || 0);
      },
      phys: (a, b) => {
        const ra = rowMap.get(a.name) || [], rb = rowMap.get(b.name) || [];
        return byScore(a, b) || (rb[5] || 0) - (ra[5] || 0);
      },
      related: byScore,
    }[Q.sort] || ((a, b) => byScore(a, b) || b.count - a.count);
    items.sort(cmp);

    const LIMIT = 120;
    const show = items.slice(0, LIMIT);

    if (Q.view === 'grid') {
      host.innerHTML = corrHtml + `<div class="mq-grid">${show.map(majorCard).join('')}</div>` +
        footer(items.length, LIMIT);
    } else {
      host.innerHTML = corrHtml + `<div class="mq-table-wrap">${show.map(majorRow).join('')}</div>` +
        footer(items.length, LIMIT);
    }
    bindResult(host);
  }

  function footer(total, limit) {
    return `<p style="margin-top:16px;font-size:.76rem;color:var(--ink-3)">
      共 ${fmt(total)} 个结果${total > limit ? `，展示前 ${limit} 个（请用关键词缩小范围）` : ''}。点击任意行查看全国选科要求详情。</p>`;
  }

  /* 结果行（列表视图） */
  function majorRow(it) {
    if (it.type === 'uni') {
      return `<div class="mq-row" data-type="uni" data-idx="${it.idx}">
        <div class="mq-row-main">
          <div class="mq-row-title">
            <span class="tag blue">院校</span>
            <b>${hl(it.name, Q.kw)}</b>
            <span class="mq-py">${esc(it.short || '')}</span>
          </div>
          <div class="mq-row-sub">${esc(Search.uniProvince(it.idx))} · ${fmt(it.count)} 个专业记录</div>
        </div>
        <div class="mq-row-side"><span class="tag">查看 →</span></div>
      </div>`;
    }
    const row = buildMajorRowMap().get(it.name) || [];
    const cat = Search.majorCategory(it.idx);
    const unl = row[4] || 0, phy = row[5] || 0, chem = row[6] || 0;
    return `<div class="mq-row" data-type="major" data-idx="${it.idx}" data-name="${esc(it.name)}">
      <div class="mq-row-main">
        <div class="mq-row-title">
          <span class="tag">${esc(cat)}</span>
          <b>${hl(it.name, Q.kw)}</b>
          ${it.short && /^[a-z]+$/.test(it.short) ? `<span class="mq-py">${esc(it.short)}</span>` : ''}
        </div>
        <div class="mq-row-sub">
          ${fmt(row[2] || 0)} 省 · ${fmt(row[3] || 0)} 所院校 · ${fmt(row[1] || 0)} 条记录
        </div>
      </div>
      <div class="mq-row-side">
        <div class="mq-bars">
          <span title="不限选科占比"><i class="g" style="width:${Math.min(unl, 100)}%"></i></span>
          <span title="要求物理占比"><i style="width:${Math.min(phy, 100)}%"></i></span>
          <span title="要求化学占比"><i class="b" style="width:${Math.min(chem, 100)}%"></i></span>
        </div>
        <span class="mq-num">不限 ${unl.toFixed(0)}%</span>
      </div>
      <button class="mq-fav${Fav.has(it.name) ? ' on' : ''}" data-fav="${esc(it.name)}" title="收藏">★</button>
    </div>`;
  }

  /* 结果卡（卡片视图） */
  function majorCard(it) {
    if (it.type === 'uni') {
      return `<div class="mq-card" data-type="uni" data-idx="${it.idx}">
        <div class="mq-card-head"><span class="tag blue">院校</span></div>
        <h4>${hl(it.name, Q.kw)}</h4>
        <div class="mq-card-meta">${esc(Search.uniProvince(it.idx))} · ${fmt(it.count)} 个专业</div>
      </div>`;
    }
    const row = buildMajorRowMap().get(it.name) || [];
    const cat = Search.majorCategory(it.idx);
    return `<div class="mq-card" data-type="major" data-idx="${it.idx}" data-name="${esc(it.name)}">
      <div class="mq-card-head"><span class="tag">${esc(cat)}</span>
        <button class="mq-fav${Fav.has(it.name) ? ' on' : ''}" data-fav="${esc(it.name)}">★</button></div>
      <h4>${hl(it.name, Q.kw)}</h4>
      <div class="mq-card-meta">
        <span>${fmt(row[3] || 0)} 所院校</span>
        <span>${fmt(row[1] || 0)} 条记录</span>
      </div>
      <div class="mq-card-bar">
        <div class="mq-bars"><span title="不限选科"><i class="g" style="width:${Math.min(row[4] || 0, 100)}%"></i></span></div>
        <span class="mq-num">不限 ${(row[4] || 0).toFixed(0)}%</span>
      </div>
    </div>`;
  }

  function bindResult(host) {
    $$('.mq-row, .mq-card', host).forEach(el => {
      el.onclick = (e) => {
        if (e.target.closest('.mq-fav')) return;
        if (el.dataset.type === 'major') openMajor(el.dataset.name);
        else openUniByIndex(+el.dataset.idx);
      };
    });
    $$('.mq-fav', host).forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        const n = b.dataset.fav;
        const added = Fav.toggle(n);
        b.classList.toggle('on', added);
        toastMsg(added ? '已收藏：' + n : '已取消收藏：' + n);
        renderStats();
      };
    });
  }

  /* ============================================================
     专业详情（全屏弹层）
     ============================================================ */
  async function openMajor(name) {
    showModal2(name, '正在汇总各省数据…',
      '<div class="state"><div class="spin"></div><b>统计中…</b></div>');

    const provs = State.provIndex.map(p => p.省份);
    const agg = { 不限: 0, 物理: 0, 化学: 0, 生物: 0, 政治: 0, 历史: 0, 地理: 0, total: 0 };
    const uniList = [];
    const byProv = [];
    const reqCounter = new Map();

    for (const p of provs) {
      let d;
      try { d = await APP.loadProvince(p); } catch (e) { continue; }
      let cnt = 0;
      for (const u of d.院校) {
        let uHas = false;
        for (const m of u[5]) {
          if (m[0] !== name) continue;
          const r = APP.parseReq(d.要求字典[m[1]]);
          cnt++; agg.total++; uHas = true;
          if (r.mode === 0) agg.不限++;
          for (const s of r.subs) {
            const k = s === '思想政治' ? '政治' : s;
            if (agg[k] !== undefined) agg[k]++;
          }
          const lk = r.label;
          reqCounter.set(lk, (reqCounter.get(lk) || 0) + 1);
          uniList.push({ uni: u[1], code: u[0], prov: p, label: r.label, kind: r.kind,
                         level: u[4], dept: u[3] });
        }
      }
      if (cnt) byProv.push({ prov: p, cnt });
    }
    byProv.sort((a, b) => b.cnt - a.cnt);

    const n = agg.total || 1;
    const reqs = Array.from(reqCounter.entries()).sort((a, b) => b[1] - a[1]);
    const idx = Search.majorCount() ? null : null;

    // 相关专业推荐：同门类、名字相近或同前缀
    const related = findRelated(name);

    // 我的选科匹配度
    let mineInfo = '';
    if (State.mySubjects.length) {
      // 抽样统计：用已经扫到的 uniList
      let ok = 0;
      for (const x of uniList) {
        const r = APP.parseReq(agg.total ? x.label : x.label);
        if (APP.satisfies(r, State.mySubjects)) ok++;
      }
      const rate = uniList.length ? ok / uniList.length : 0;
      mineInfo = `<div class="stat-cell ${rate > 0.8 ? '' : 'hl'}">
        <b>${(rate * 100).toFixed(1)}%</b><span>我的选科可报</span></div>`;
    }

    const html = `
      <div class="stat-line">
        <div class="stat-cell hl"><b>${fmt(agg.total)}</b><span>全国记录数</span></div>
        <div class="stat-cell"><b>${byProv.length}</b><span>覆盖省份</span></div>
        <div class="stat-cell"><b>${fmt(uniList.length)}</b><span>开设院校次</span></div>
        <div class="stat-cell"><b>${(agg.不限 / n * 100).toFixed(1)}%</b><span>不限选科</span></div>
        ${mineInfo}
      </div>

      <div class="mq-detail-cols">
        <div>
          <h4 class="mq-h4">各选考科目要求占比</h4>
          <div class="tbl-scroll"><table class="data" style="min-width:auto">
            <thead><tr><th>科目</th><th style="min-width:130px">占比</th><th class="num">数值</th></tr></thead>
            <tbody>
              <tr><td>不限选科</td>
                <td><div class="bar-cell"><div class="bar"><i class="g" style="width:${(agg.不限 / n * 100).toFixed(1)}%"></i></div></div></td>
                <td class="num"><b>${(agg.不限 / n * 100).toFixed(1)}%</b></td></tr>
              ${['物理', '化学', '生物', '政治', '历史', '地理'].map(k => `
                <tr><td>${k}</td>
                  <td><div class="bar-cell"><div class="bar"><i style="width:${(agg[k] / n * 100).toFixed(1)}%"></i></div></div></td>
                  <td class="num"><b>${(agg[k] / n * 100).toFixed(1)}%</b></td></tr>`).join('')}
            </tbody></table></div>
        </div>
        <div>
          <h4 class="mq-h4">选科组合要求分布</h4>
          <div class="tbl-scroll"><table class="data" style="min-width:auto">
            <thead><tr><th>要求内容</th><th class="num">记录数</th><th class="num">占比</th></tr></thead>
            <tbody>${reqs.slice(0, 10).map(([k, v]) => `
              <tr><td>${esc(k)}</td><td class="num">${fmt(v)}</td>
                <td class="num">${(v / n * 100).toFixed(1)}%</td></tr>`).join('')}
            </tbody></table></div>
        </div>
      </div>

      ${related.length ? `
      <h4 class="mq-h4">相关专业推荐</h4>
      <div class="mq-rel">
        ${related.map(r => `<a href="#" data-rel="${esc(r.name)}">
          <span>${esc(r.name)}</span><small>${fmt(r.count)} 所院校</small></a>`).join('')}
      </div>` : ''}

      <h4 class="mq-h4">覆盖省份分布</h4>
      <div class="links">
        ${byProv.slice(0, 40).map(p => `<a href="#school" data-goprov="${esc(p.prov)}">${esc(p.prov)} ${p.cnt}</a>`).join('')}
      </div>

      <h4 class="mq-h4">开设该专业的院校（最多 300 条）</h4>
      <div class="tbl-scroll"><table class="data">
        <thead><tr><th>院校名称</th><th>省份</th><th>层次</th><th>选考科目要求</th>
          ${State.mySubjects.length ? '<th>我能报</th>' : ''}</tr></thead>
        <tbody>${uniList.slice(0, 300).map(x => {
          const ok = State.mySubjects.length
            ? APP.satisfies(APP.parseReq(x.label), State.mySubjects) : null;
          return `<tr>
            <td><b>${esc(x.uni)}</b></td><td>${esc(x.prov)}</td>
            <td style="font-size:.76rem;color:var(--ink-3)">${esc(x.level)}</td>
            <td class="req"><span class="req-badge ${x.kind}">${esc(x.label)}</span></td>
            ${State.mySubjects.length ? `<td>${ok
              ? '<span class="tag green">可报</span>'
              : '<span class="tag" style="color:var(--ink-4)">受限</span>'}</td>` : ''}
          </tr>`;
        }).join('')}</tbody></table></div>

      <div class="row mt-24">
        <button class="btn btn-sm" id="mqCopyMajor">复制院校清单</button>
        <button class="btn btn-sm" id="mqCsvMajor">导出 CSV</button>
        <button class="btn btn-sm" id="mqFavDetail">${Fav.has(name) ? '取消收藏' : '收藏该专业'}</button>
      </div>`;

    const cat = Search.majorCategory(majorIndexOf(name));
    showModal2(name + ' · 全国选科要求', 
      `${esc(cat)}门类 · 全国 ${fmt(agg.total)} 条记录 · 覆盖 ${byProv.length} 个省份 · ${fmt(uniList.length)} 个院校记录`,
      html);

    // 绑定
    $$('#modalBodyInner [data-rel]').forEach(a => a.onclick = (e) => {
      e.preventDefault(); openMajor(a.dataset.rel);
    });
    $$('#modalBodyInner [data-goprov]').forEach(a => a.onclick = (e) => {
      e.preventDefault();
      closeModal2();
      if (window.APP_SELECT_PROVINCE) window.APP_SELECT_PROVINCE(a.dataset.goprov);
    });
    $('#mqCopyMajor').onclick = () => {
      const txt = `${name} · 全国选科要求\n` +
        uniList.slice(0, 300).map(x => `${x.uni}（${x.prov}）— ${x.label}`).join('\n') +
        `\n\n数据来源：${CFG.siteHost}/university/`;
      copyText(txt);
    };
    $('#mqCsvMajor').onclick = () => {
      const rows = [['院校名称', '省份', '层次', '选科科目要求']]
        .concat(uniList.map(x => [x.uni, x.prov, x.level, x.label]));
      downloadCSV(rows, `${name}_全国选科要求.csv`);
    };
    $('#mqFavDetail').onclick = (e) => {
      const added = Fav.toggle(name);
      e.target.textContent = added ? '取消收藏' : '收藏该专业';
      toastMsg(added ? '已收藏' : '已取消收藏');
      renderStats();
    };
  }

  function majorIndexOf(name) {
    if (!Search.majorCount()) return 0;
    for (let i = 0; i < Search.majorCount(); i++) if (Search.majorName(i) === name) return i;
    return 0;
  }

  /* 相关专业推荐 */
  function findRelated(name) {
    const out = [];
    const myIdx = majorIndexOf(name);
    const myCat = Search.majorCategory(myIdx);
    const rowMap = buildMajorRowMap();
    const myRow = rowMap.get(name);

    // 规则1：同前缀（前 2 字相同）
    const pre2 = name.slice(0, 2);
    const pre3 = name.slice(0, 3);
    const scored = [];
    for (let i = 0; i < Search.majorCount(); i++) {
      const nm = Search.majorName(i);
      if (nm === name) continue;
      let sc = 0;
      if (nm.slice(0, 3) === pre3) sc = 100;
      else if (nm.slice(0, 2) === pre2) sc = 60;
      else if (nm.indexOf(pre2) >= 0) sc = 30;
      else if (Search.majorCategory(i) === myCat) sc = 5;
      if (sc > 0) scored.push({ name: nm, sc, count: Search.majorRecordCount(i) });
    }
    scored.sort((a, b) => b.sc - a.sc || b.count - a.count);
    return scored.slice(0, 12);
  }

  /* ============================================================
     按索引打开院校（跳到其省份的查询页）
     ============================================================ */
  async function openUniByIndex(idx) {
    const name = Search.uniName(idx);
    toastMsg('正在定位 ' + name + ' …');
    // 从全局院校索引找到它所属省份
    const row = State.uniIndex.find(r => r[1] === name);
    const prov = row ? row[6][0] : null;
    if (!prov) { toastMsg('未找到该院校的省份信息'); return; }
    await APP.loadProvince(prov);
    closeModal2();
    // 切到院校视图并搜索
    window.APP_GOTO('school');
    setTimeout(() => {
      const q = document.querySelector('#q');
      if (q) { q.value = name; q.dispatchEvent(new Event('input')); }
    }, 500);
  }

  /* ============================================================
     收藏列表
     ============================================================ */
  async function showFavorites() {
    if (!Fav.list.length) {
      showModal2('我的收藏', '还没有收藏任何专业', `<div class="state">
        <b>收藏夹是空的</b>
        <p>在专业查询结果中点击 ★ 即可收藏，方便随时回来查看。数据保存在你的浏览器本地。</p></div>`);
      return;
    }
    const rowMap = buildMajorRowMap();
    const rows = Fav.list.map(n => {
      const row = rowMap.get(n) || [];
      const cat = Search.majorCategory(majorIndexOf(n));
      return { name: n, row, cat };
    });
    showModal2('我的收藏', `共 ${Fav.list.length} 个专业 · 保存在浏览器本地`,
      `<div class="mq-table-wrap">
        ${rows.map(r => `<div class="mq-row" data-type="major" data-name="${esc(r.name)}">
          <div class="mq-row-main">
            <div class="mq-row-title"><span class="tag">${esc(r.cat)}</span><b>${esc(r.name)}</b></div>
            <div class="mq-row-sub">${fmt(r.row[3] || 0)} 所院校 · ${fmt(r.row[1] || 0)} 条记录</div>
          </div>
          <div class="mq-row-side"><span class="mq-num">不限 ${(r.row[4] || 0).toFixed(0)}%</span></div>
          <button class="mq-fav on" data-fav="${esc(r.name)}">★</button>
        </div>`).join('')}
      </div>
      <div class="row mt-24">
        <button class="btn btn-sm" id="favExport">导出收藏清单</button>
        <button class="btn btn-sm" id="favClear">清空收藏</button>
      </div>`);

    $$('#modalBodyInner .mq-row').forEach(el => {
      el.onclick = (e) => { if (!e.target.closest('.mq-fav')) openMajor(el.dataset.name); };
    });
    $$('#modalBodyInner .mq-fav').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        Fav.toggle(b.dataset.fav);
        showFavorites(); renderStats();
      };
    });
    $('#favExport').onclick = () => {
      const data = [['专业名称', '学科门类', '覆盖省份', '开设院校数', '记录数', '不限选科占比']]
        .concat(rows.map(r => [r.name, r.cat, r.row[2] || 0, r.row[3] || 0, r.row[1] || 0, (r.row[4] || 0) + '%']));
      downloadCSV(data, '我的收藏专业.csv');
    };
    $('#favClear').onclick = () => {
      Fav.list = []; Fav.save(); renderStats();
      showModal2('我的收藏', '已清空', '<div class="state"><b>收藏已清空</b></div>');
    };
  }

  /* ---------------- 弹层与导出 ---------------- */
  function showModal2(title, sub, html) {
    const mask = document.querySelector('#modalMask');
    document.querySelector('#modalTitle').textContent = title;
    document.querySelector('#modalSub').textContent = sub || '';
    document.querySelector('#modalBodyInner').innerHTML = html;
    mask.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal2() {
    document.querySelector('#modalMask').classList.remove('open');
    document.body.style.overflow = '';
  }

  function copyText(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(() => toastMsg('已复制到剪贴板'),
        () => fbCopy(txt));
    } else fbCopy(txt);
  }
  function fbCopy(txt) {
    const ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toastMsg('已复制到剪贴板'); }
    catch (e) { toastMsg('复制失败'); }
    ta.remove();
  }
  function downloadCSV(rows, filename) {
    const csv = '\ufeff' + rows
      .map(r => r.map(c => `"${String(c == null ? '' : c).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toastMsg('CSV 已开始下载');
  }

  window.MajorQuery = { render, Q };
})();
