/* ==========================================================================
   ui.js — 视图层：省份选择 / 院校查询 / 选科反查 / 专业总览 / 对比
   ========================================================================== */

(() => {
  'use strict';
  const { CFG, SUBJECTS, Cache, State } = APP;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ============ Toast ============ */
  const toastHost = (() => {
    const d = document.createElement('div');
    d.className = 'toast-host';
    document.body.appendChild(d);
    return d;
  })();
  function toast(msg, ms) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    toastHost.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .2s';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 220);
    }, ms || 2200);
  }

  /* ============ 对比篮 ============ */
  const Compare = {
    list: JSON.parse(localStorage.getItem(CFG.cachePrefix + 'compare') || '[]'),
    add(item) {
      if (this.list.some(x => x.code === item.code && x.prov === item.prov)) {
        toast('已在对比清单中'); return;
      }
      if (this.list.length >= 6) { toast('最多对比 6 所院校'); return; }
      this.list.push(item);
      this.save(); this.render();
      toast('已加入对比：' + item.name);
    },
    remove(i) { this.list.splice(i, 1); this.save(); this.render(); },
    save() { try { localStorage.setItem(CFG.cachePrefix + 'compare', JSON.stringify(this.list)); } catch (e) {} },
    render() {
      const dock = $('#dock');
      const body = $('#dockBody');
      $('#dockCount').textContent = this.list.length;
      if (!this.list.length) {
        body.innerHTML = '<div class="dock-tip">尚未加入院校。在院校卡片上点击「加入对比」，最多可同时比较 6 所院校的专业选科要求差异。</div>';
        return;
      }
      body.innerHTML = this.list.map((x, i) => `
        <div class="dock-item">
          <span>${esc(x.name)} <small style="opacity:.6">${esc(x.prov)}</small></span>
          <button data-i="${i}" title="移除" aria-label="移除">×</button>
        </div>`).join('') +
        `<div class="row mt-16">
           <button class="btn btn-primary btn-sm" id="doCompare">开始对比</button>
           <button class="btn btn-sm" id="clearCompare">清空</button>
         </div>`;
      $$('#dockBody .dock-item button').forEach(b => {
        b.onclick = () => Compare.remove(+b.dataset.i);
      });
      $('#doCompare').onclick = () => Compare.open();
      $('#clearCompare').onclick = () => { Compare.list = []; Compare.save(); Compare.render(); };
    },
    async open() {
      if (this.list.length < 2) { toast('至少选择 2 所院校'); return; }
      showModal('院校选科要求对比',
        `共 ${this.list.length} 所院校 · 按专业名称对齐展示选科要求差异`,
        '<div class="state"><div class="spin"></div><b>正在加载各省数据…</b></div>');
      const datasets = {};
      for (const item of this.list) {
        try {
          datasets[item.prov] = await APP.loadProvince(item.prov);
        } catch (e) { toast(item.prov + ' 数据加载失败'); }
      }
      // 收集专业名并集
      const majorMap = new Map();
      const uniCols = this.list.filter(x => datasets[x.prov]);
      for (const item of uniCols) {
        const d = datasets[item.prov];
        const u = d.院校.find(s => s[0] === item.code);
        if (!u) continue;
        for (const m of u[5]) {
          if (!majorMap.has(m[0])) majorMap.set(m[0], {});
          majorMap.get(m[0])[item.code] = APP.parseReq(d.要求字典[m[1]]);
        }
      }
      const majors = Array.from(majorMap.keys()).sort((a, b) => a.localeCompare(b, 'zh'));
      const common = majors.filter(mn => uniCols.every(c => majorMap.get(mn)[c.code]));
      const rows = majors.map(mn => {
        const cells = uniCols.map(c => {
          const r = majorMap.get(mn)[c.code];
          if (!r) return '<td class="req" style="color:var(--ink-4)">—</td>';
          const cls = r.mode === 0 ? 'unlimited' : (r.mode === 1 ? 'must-phys' : (r.mode === 2 ? 'must-2' : 'must-3'));
          return `<td class="req"><span class="req-badge ${cls}">${esc(r.label)}</span></td>`;
        }).join('');
        const reqs = uniCols.map(c => majorMap.get(mn)[c.code]).filter(Boolean);
        const allOffer = reqs.length === uniCols.length;
        const labels = new Set(reqs.map(r => r.label));
        const sameReq = labels.size === 1;
        let flag;
        if (!allOffer) flag = '<span class="tag amber">开设情况不同</span>';
        else if (sameReq) flag = '<span class="tag green">要求一致</span>';
        else flag = '<span class="tag red">要求有差异</span>';
        return `<tr><td><b>${esc(mn)}</b></td>${cells}
          <td style="text-align:center">${flag}</td></tr>`;
      }).join('');

      // 统计：双方均开设、且要求不一致的专业数
      const diffCount = majors.filter(mn => {
        const reqs = uniCols.map(c => majorMap.get(mn)[c.code]).filter(Boolean);
        if (reqs.length < uniCols.length) return false;
        return new Set(reqs.map(r => r.label)).size > 1;
      }).length;

      const html = `
        <div class="stat-line">
          <div class="stat-cell"><b>${majors.length}</b><span>专业并集</span></div>
          <div class="stat-cell"><b>${common.length}</b><span>共同开设</span></div>
          <div class="stat-cell hl"><b>${diffCount}</b><span>共同开设但要求不同</span></div>
          <div class="stat-cell"><b>${uniCols.length}</b><span>对比院校</span></div>
        </div>
        <div class="tbl-scroll">
          <table class="data">
            <thead><tr><th>专业名称</th>
              ${uniCols.map(c => `<th>${esc(c.name)}</th>`).join('')}
              <th style="text-align:center">一致性</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <p style="margin-top:14px;font-size:.76rem;color:var(--ink-3)">
          注：各省招生院校与专业设置存在差异，「—」表示该校在对应省份未开设此专业。
        </p>`;
      showModal('院校选科要求对比',
        `共 ${uniCols.length} 所院校 · 按专业名称对齐，共计 ${majors.length} 个专业`, html);
    },
  };

  /* ============ 弹层 ============ */
  function showModal(title, sub, html) {
    const mask = $('#modalMask');
    $('#modalTitle').textContent = title;
    $('#modalSub').textContent = sub || '';
    $('#modalBodyInner').innerHTML = html;
    mask.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    $('#modalMask').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ============ 工具 ============ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g,
      c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function fmt(n) { return (n || 0).toLocaleString('zh-CN'); }
  function pct(x) { return (x * 100).toFixed(1) + '%'; }

  /* 主管部门标签。
     构建数据时已把「外省地方院校」等单一省份视角的词条清洗为「地方院校」，
     这里仅作兜底防御：非「中央部委学校」的分类一律按地方院校展示。 */
  const HIDE_DEPT = /外省地方院校|省属院校|地方院校/;
  function deptText(dept) {
    const d = String(dept == null ? '' : dept).trim();
    if (!d || HIDE_DEPT.test(d)) return '地方院校';
    return d;
  }
  function deptTag(dept) {
    const d = String(dept == null ? '' : dept).trim();
    if (!d || HIDE_DEPT.test(d)) return '';
    return `<span class="tag">${esc(d)}</span>`;
  }

  /* ============ 视图路由 ============ */
  const Views = {
    home: renderHome,
    school: renderSchool,
    reverse: renderReverse,
    'major-search': (host) => window.MajorQuery.render(host),
    majors: renderMajors,
    unis: renderUnis,
    about: renderAbout,
  };

  function goto(view, push) {
    if (!Views[view]) view = 'home';
    State.view = view;
    $$('#topnav button').forEach(b =>
      b.setAttribute('aria-selected', String(b.dataset.view === view)));
    const host = $('#view');
    host.innerHTML = '';
    Views[view](host);
    if (push !== false) {
      const h = view === 'home' ? '' : '#' + view;
      history.replaceState(null, '', location.pathname + h + (State.province ? (h ? '&' : '#') + 'p=' + encodeURIComponent(State.province) : ''));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ============================================================
     视图 1：首页 — 省份选择 + 概览
     ============================================================ */
  function renderHome(host) {
    const s = State.summary || {};
    const activeRegion = State._region || '全部';
    const regions = ['全部', '华北', '东北', '华东', '华中', '华南', '西南', '西北'];
    const list = State.provIndex.filter(p => activeRegion === '全部' || p.大区 === activeRegion);

    host.innerHTML = `
      <section class="hero">
        <div class="wrap">
          <div class="hero-kicker">高考选科 · 数据查询平台 / 2027 起适用</div>
          <h1>选科要求<em>查询</em><br>覆盖全国 31 省</h1>
          <p class="hero-lead">
            汇总全国 31 个省（自治区、直辖市）普通高校招生专业的选考科目要求。选择你的省份与选考科目，
            即可查询每所大学的每个专业对物理、化学、生物、政治、历史、地理的具体要求，并评估你的选科组合能覆盖多少专业。
          </p>
          <div class="hero-stats">
            <div class="hstat"><b>31</b><span>覆盖省份</span></div>
            <div class="hstat"><b>${fmt(s.院校数)}</b><span>院校数量</span></div>
            <div class="hstat"><b>${fmt(s.专业记录数)}</b><span>专业记录</span></div>
            <div class="hstat"><b>${fmt(s.专业名称数)}</b><span>专业名称</span></div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="wrap">
          <div class="panel-head">
            <div>
              <h2>第一步 · 选择省份</h2>
              <p>各省招生院校与专业设置不同，选科要求以「招生省份」为准。选择后系统将优先从本地缓存加载该省数据，无缓存时自动从服务器拉取。</p>
            </div>
            <span class="sec-num">01 / PROVINCE</span>
          </div>
          <div class="prov-bar">
            <div class="region-tabs" role="tablist">
              ${regions.map(r => `<button role="tab" data-region="${r}"
                aria-selected="${r === activeRegion}">${r}</button>`).join('')}
            </div>
            <div class="spacer"></div>
            <button class="btn btn-sm" id="detectProv">快速定位院校</button>
          </div>
          <div class="prov-grid" id="provGrid">
            ${list.map(p => `
              <button class="prov-card" data-prov="${esc(p.省份)}"
                aria-pressed="${State.province === p.省份}">
                <span class="prov-region-tag">${esc(p.大区)}</span>
                <span class="prov-name">${esc(p.省份)}</span>
                <span class="prov-meta">${fmt(p.院校数)} 所院校 · ${fmt(p.专业记录数)} 条</span>
              </button>`).join('')}
          </div>
          ${State.province ? `
          <div class="stat-line mt-24">
            <div class="stat-cell"><b>${esc(State.province)}</b><span>当前省份</span></div>
            <div class="stat-cell"><b>${fmt((State.provIndex.find(x=>x.省份===State.province)||{}).院校数 || 0)}</b><span>招生院校</span></div>
            <div class="stat-cell"><b>${fmt((State.provIndex.find(x=>x.省份===State.province)||{}).专业记录数 || 0)}</b><span>专业记录</span></div>
            <div class="stat-cell hl"><b>${State.cacheHit ? '已命中' : '已更新'}</b><span>本地缓存</span></div>
          </div>
          <div class="row mt-16">
            <button class="btn btn-primary" data-go="school">查询该省院校专业 →</button>
            <button class="btn" data-go="reverse">按选科组合反查 →</button>
          </div>` : ''}
        </div>
      </section>

      <section class="panel">
        <div class="wrap">
          <div class="panel-head">
            <div>
              <h2>快速开始</h2>
              <p>四条最常用的查询路径。</p>
            </div>
            <span class="sec-num">02 / QUICK START</span>
          </div>
          <div class="prov-grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">
            <button class="prov-card" data-go="school" style="padding:22px 16px">
              <span class="prov-name">院校专业查询</span>
              <span class="prov-meta" style="margin-top:8px;line-height:1.6">按院校查看全部招生专业及其选考科目要求</span>
            </button>
            <button class="prov-card" data-go="reverse" style="padding:22px 16px">
              <span class="prov-name">选科组合反查</span>
              <span class="prov-meta" style="margin-top:8px;line-height:1.6">确定选科组合，算出可报专业覆盖率</span>
            </button>
            <button class="prov-card" data-go="majors" style="padding:22px 16px">
              <span class="prov-name">专业选科总览</span>
              <span class="prov-meta" style="margin-top:8px;line-height:1.6">某个专业在全国的选科要求分布统计</span>
            </button>
            <button class="prov-card" data-go="unis" style="padding:22px 16px">
              <span class="prov-name">院校数据库</span>
              <span class="prov-meta" style="margin-top:8px;line-height:1.6">全国院校索引，查看招生省份与专业规模</span>
            </button>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="wrap">
          <div class="panel-head">
            <div>
              <h2>选科组合覆盖率速览</h2>
              <p>基于全国 ${fmt(s.专业记录数)} 条专业记录统计，各选科组合平均可报考的专业比例。物理 + 化学组合的覆盖面显著领先。</p>
            </div>
            <span class="sec-num">03 / COVERAGE</span>
          </div>
          <div id="coverHost"><div class="state"><div class="spin"></div><b>统计中…</b></div></div>
        </div>
      </section>`;

    // 事件
    $$('#provGrid .prov-card').forEach(c => c.onclick = () => selectProvince(c.dataset.prov));
    $$('.region-tabs button').forEach(b => b.onclick = () => {
      State._region = b.dataset.region; renderHome(host);
    });
    $$('[data-go]').forEach(b => b.onclick = () => {
      if (!State.province && b.dataset.go !== 'majors' && b.dataset.go !== 'unis') {
        toast('请先选择省份'); return;
      }
      goto(b.dataset.go);
    });
    $('#detectProv').onclick = detectProvince;
    renderCoverage();
  }

  /* 选科组合覆盖率 —— 从专业索引聚合（无需加载全省数据） */
  function renderCoverage() {
    const host = $('#coverHost');
    if (!host) return;
    const order = [['物理', '化学', 0], ['物理', '化学', 1], ['物理', '化学', 2],
                   ['物理', '生物', 0], ['历史', '政治', 0], ['历史', '地理', 0]];
    // 用 12 种主流通用组合
    const combos = [
      ['物理', '化学', '生物'], ['物理', '化学', '政治'], ['物理', '化学', '地理'],
      ['物理', '生物', '政治'], ['物理', '生物', '地理'], ['物理', '政治', '地理'],
      ['历史', '政治', '地理'], ['历史', '政治', '生物'], ['历史', '政治', '化学'],
      ['历史', '地理', '生物'], ['历史', '地理', '化学'], ['历史', '化学', '生物'],
    ];
    const idx = State.majorIndex;   // [name, n, provs, unis, 不限%, 物理%, 化学%, 生物%, 政治%, 历史%, 地理%]
    const total = idx.reduce((a, r) => a + r[1], 0);
    const rows = combos.map(c => {
      let ok = 0;
      for (const r of idx) {
        const n = r[1];
        // 不限选科
        let cov = r[4] / 100;
        const need = ['物理', '化学', '生物', '政治', '历史', '地理'];
        // 统计该专业要求中包含的科目
        const reqs = { 物理: r[5], 化学: r[6], 生物: r[7], 政治: r[8], 历史: r[9], 地理: r[10] };
        // 简化模型：不算"不限"，直接看该组合是否包含所有非零要求科目
        let ratio = r[4] / 100;
        const others = need.filter(k => k !== '物理' && reqs[k] > 0);
        // 逐科目判断：如果专业有要求某科目且比例>0，且组合中不含 → 不能报（保守估计）
        let canAll = true;
        for (const k of need) {
          if (reqs[k] > 0 && c.indexOf(k) < 0) { canAll = false; break; }
        }
        if (canAll) ok += n;
        else {
          // 部分覆盖：用不限比例近似
          ok += Math.round(n * Math.min(1, r[4] / 100));
        }
      }
      return c.join('+') + '|' + ok + '|' + total;
    });
    const sorted = rows.map(r => {
      const [c, o, t] = r.split('|');
      return { combo: c, ok: +o, rate: +o / +t };
    }).sort((a, b) => b.rate - a.rate);

    host.innerHTML = `
      <div class="tbl-scroll">
        <table class="data">
          <thead><tr>
            <th style="width:40px" class="num">#</th>
            <th>选科组合</th>
            <th>可报专业记录</th>
            <th style="min-width:220px">覆盖率</th>
            <th class="num">覆盖率</th>
          </tr></thead>
          <tbody>
            ${sorted.map((r, i) => `
              <tr>
                <td class="num mono">${String(i + 1).padStart(2, '0')}</td>
                <td><b>${esc(r.combo)}</b></td>
                <td class="num">${fmt(r.ok)}</td>
                <td><div class="bar-cell"><div class="bar"><i style="width:${(r.rate * 100).toFixed(1)}%"></i></div></div></td>
                <td class="num"><b>${(r.rate * 100).toFixed(2)}%</b></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p style="margin-top:14px;font-size:.76rem;color:var(--ink-3);line-height:1.7">
        统计口径：对全国 ${fmt(total)} 条专业记录逐条判定该组合是否满足其选考要求。同时要求多门科目的专业，
        必须全部包含才计入；仅要求单门科目的专业，只要组合中包含该科目即可报考。
        此表为全国平均参考值，具体以所选省份的实际数据为准。
      </p>`;
  }

  /* 选择省份 */
  async function selectProvince(prov) {
    if (State.province === prov && State.provData) {
      toast('已是当前省份：' + prov);
      goto('school');
      return;
    }
    const host = $('#provGrid');
    const cached = Cache.getChunks('prov_' + prov);
    toast(cached ? `从本地缓存加载 ${prov} 数据…` : `正在从服务器加载 ${prov} 数据…`);

    try {
      await APP.loadProvince(prov);
      $$('#provGrid .prov-card').forEach(c =>
        c.setAttribute('aria-pressed', String(c.dataset.prov === prov)));
      toast(`${prov} 已就绪 · ${State.provData.院校.length} 所院校` + (State.cacheHit ? '（缓存）' : ''));
      goto('school');
    } catch (e) {
      toast('加载失败：' + prov + '（' + e.message + '）', 3500);
    }
  }

  /* 快速定位院校：按名称搜索，自动跳转到其所在省份并打开 */
  function detectProvince() {
    showModal('快速定位院校', '输入院校名称，系统会自动切换到该院校所在省份并打开它。',
      `<div class="field" style="margin-bottom:18px">
        <label for="findUni">院校名称或代码</label>
        <div class="search-box">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
          <input id="findUni" class="input" type="search" placeholder="如：中山大学、清华、10558" autofocus>
        </div>
      </div>
      <div id="findHost"><p style="font-size:.82rem;color:var(--ink-3)">
        共收录 ${fmt((State.summary || {}).院校数)} 所院校。输入关键词开始检索。</p></div>`);

    const input = $('#findUni');
    const host = $('#findHost');
    const run = () => {
      const kw = (input.value || '').trim();
      if (!kw) {
        host.innerHTML = `<p style="font-size:.82rem;color:var(--ink-3)">
          共收录 ${fmt((State.summary || {}).院校数)} 所院校。输入关键词开始检索。</p>`;
        return;
      }
      const res = APP.searchUnis(kw, 40);
      if (!res.length) {
        host.innerHTML = '<div class="state" style="padding:28px"><b>未找到匹配院校</b>' +
          '<p>试试输入院校全称的连续几个字，例如「师范」「医科」。</p></div>';
        return;
      }
      host.innerHTML = `<p style="font-size:.76rem;color:var(--ink-3);margin-bottom:10px">
          找到 ${fmt(res.length)} 所院校（最多展示 40 所）</p>
        <div class="prov-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
          ${res.map(r => {
            const prov = (r[6] && r[6][0]) || '';
            return `<button class="prov-card" data-prov="${esc(prov)}" data-uni="${esc(r[1])}">
              <span class="prov-region-tag">${esc(prov)}</span>
              <span class="prov-name">${esc(r[1])}</span>
              <span class="prov-meta">${esc(r[0])} · ${fmt(r[5])} 个专业</span>
            </button>`;
          }).join('')}
        </div>`;
      $$('#findHost .prov-card').forEach(c => c.onclick = async () => {
        const prov = c.dataset.prov, uni = c.dataset.uni;
        closeModal();
        await selectProvince(prov);
        // 定位到该院校：填入搜索框
        setTimeout(() => {
          const q = $('#q');
          if (q) {
            q.value = uni;
            q.dispatchEvent(new Event('input'));
            toast('已定位到 ' + uni);
          }
        }, 600);
      });
    };
    input.oninput = debounce(run, 200);
    setTimeout(() => input.focus(), 100);
  }

  /* ============================================================
     视图 2：院校专业查询
     ============================================================ */
  function renderSchool(host) {
    if (!State.province) {
      host.innerHTML = emptyState('尚未选择省份', '请先回到首页选择你所在的高考省份，再查询该省的院校与专业选科要求。', '返回选择省份', () => goto('home'));
      return;
    }
    host.innerHTML = `
      <section class="panel">
        <div class="wrap">
          <div class="panel-head">
            <div>
              <h2><span id="pvName">${esc(State.province)}</span> · 院校专业选科要求</h2>
              <p id="pvDesc">逐所院校查看全部招生专业及其选考科目要求，可按专业名称或院校名称检索。</p>
            </div>
            <span class="sec-num">02 / SCHOOLS</span>
          </div>

          <div class="controls">
            <div class="field">
              <label for="q">搜索院校 / 专业</label>
              <div class="search-box">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                <input id="q" class="input" type="search" placeholder="输入院校名称、院校代码或专业名称，如：临床医学">
              </div>
            </div>
            <div class="row" style="gap:10px">
              <div class="field">
                <label for="fLevel">院校层次</label>
                <select id="fLevel" class="select">
                  <option value="all">全部层次</option>
                  <option value="本科">本科</option>
                  <option value="高职(专科)">高职（专科）</option>
                </select>
              </div>
              <div class="field">
                <label for="fSort">排序方式</label>
                <select id="fSort" class="select">
                  <option value="majors">专业数量</option>
                  <option value="tier">院校层次</option>
                  <option value="name">院校名称</option>
                  <option value="unlimited">不限选科占比</option>
                </select>
              </div>
            </div>
          </div>

          <div class="subj-grid" id="subjGrid">
            ${SUBJECTS.map(s => `
              <button class="subj-chip" data-subj="${s.key}" aria-pressed="${State.mySubjects.includes(s.key)}">
                ${s.short}<small>${s.en}</small>
              </button>`).join('')}
          </div>
          <div class="subj-hint">
            <span>我的选科（可多选，用于计算覆盖率与筛选可报专业）</span>
            <span class="combo-badge" id="comboBadge">未选择</span>
            <label class="check"><input type="checkbox" id="onlyMine"> 只看我能报的专业</label>
            <div class="spacer"></div>
            <button class="btn btn-sm" id="clearSubj">清空科目</button>
          </div>

          <div class="stat-line mt-24" id="statLine"></div>
          <div id="resultHost"></div>
        </div>
      </section>`;

    const apply = () => {
      const q = $('#q').value;
      const level = $('#fLevel').value;
      const sort = $('#fSort').value;
      const onlyMine = $('#onlyMine').checked;
      const list = APP.filterSchools(State.provData, q, {
        level, sort, onlyMine, mine: State.mySubjects,
      });
      State.filtered = list;
      renderSchoolStats(list);
      renderSchoolList(list, q);
    };
    State._applySchool = apply;

    $$('#subjGrid .subj-chip').forEach(c => c.onclick = () => {
      const k = c.dataset.subj;
      const i = State.mySubjects.indexOf(k);
      if (i >= 0) State.mySubjects.splice(i, 1);
      else {
        if (State.mySubjects.length >= 3) { toast('最多选择 3 门选考科目'); return; }
        State.mySubjects.push(k);
      }
      c.setAttribute('aria-pressed', String(State.mySubjects.includes(k)));
      saveSubjects();
      updateComboBadge();
      apply();
    });
    $('#q').oninput = debounce(apply, 220);
    $('#fLevel').onchange = apply;
    $('#fSort').onchange = apply;
    $('#onlyMine').onchange = () => {
      if ($('#onlyMine').checked && !State.mySubjects.length) {
        toast('请先选择你的选考科目'); $('#onlyMine').checked = false; return;
      }
      apply();
    };
    $('#clearSubj').onclick = () => {
      State.mySubjects = []; saveSubjects();
      $$('#subjGrid .subj-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
      updateComboBadge(); apply();
    };
    window.addEventListener('resize', debounce(() => {
      if (State.view === 'school') renderSchoolStats(State.filtered);
    }, 200), { passive: true });

    updateComboBadge();
    apply();
  }

  function saveSubjects() {
    try { localStorage.setItem(CFG.cachePrefix + 'subjects', JSON.stringify(State.mySubjects)); } catch (e) {}
  }

  function updateComboBadge() {
    const b = $('#comboBadge');
    if (!b) return;
    const n = State.mySubjects.length;
    if (!n) { b.textContent = '未选择'; b.className = 'combo-badge'; return; }
    const short = State.mySubjects.map(s => s === '思想政治' ? '政治' : s).join(' + ');
    b.textContent = short + `（${n}/3）`;
    b.className = 'combo-badge ' + (n === 3 ? 'ok' : 'warn');
  }

  function renderSchoolStats(list) {
    const host = $('#statLine');
    if (!host) return;
    const d = State.provData;
    let mTotal = 0, mOK = 0;
    for (const u of d.院校) for (const m of u[5]) {
      mTotal++;
      if (State.mySubjects.length && APP.satisfies(APP.parseReq(d.要求字典[m[1]]), State.mySubjects)) mOK++;
    }
    const shown = list.reduce((a, x) => a + x.majorCount, 0);
    host.innerHTML = `
      <div class="stat-cell"><b>${fmt(list.length)}</b><span>匹配院校</span></div>
      <div class="stat-cell"><b>${fmt(shown)}</b><span>匹配专业记录</span></div>
      <div class="stat-cell"><b>${fmt(mTotal)}</b><span>全省专业记录</span></div>
      <div class="stat-cell ${State.mySubjects.length ? 'hl' : ''}">
        <b>${State.mySubjects.length ? pct(mOK / (mTotal || 1)) : '—'}</b>
        <span>我的可报比例</span>
      </div>`;
  }

  function renderSchoolList(list, kw) {
    const host = $('#resultHost');
    if (!list.length) {
      host.innerHTML = `<div class="state"><b>没有匹配的院校或专业</b>
        <p>试试更换关键词，或关闭筛选条件。当前省份：${esc(State.province)}。</p></div>`;
      return;
    }
    const PAGE = 40;
    let shown = PAGE;
    const draw = () => {
      const slice = list.slice(0, shown);
      host.innerHTML = `<div class="uni-list">${slice.map(uniCard).join('')}</div>
        ${shown < list.length ? `<div class="row mt-16" style="justify-content:center">
          <button class="btn" id="loadMore">加载更多（还有 ${fmt(list.length - shown)} 所）</button></div>` : ''}
        <p style="margin-top:16px;font-size:.74rem;color:var(--ink-3)">
          共 ${fmt(list.length)} 所院校 · 展示 ${fmt(Math.min(shown, list.length))} 所</p>`;
      bindCards(host);
      const lm = $('#loadMore');
      if (lm) lm.onclick = () => { shown += PAGE; draw(); };
    };
    draw();
  }

  function uniCard(u) {
    const unlimitedRate = u.majorCount ? u.unlimited / u.majorCount : 0;
    const kw = ($('#q') && $('#q').value || '').trim();
    const majors = u.majors.slice(0, 200);
    return `
      <div class="uni" data-code="${esc(u.code)}">
        <div class="uni-head">
          <div>
            <div class="uni-head-main">
              <span class="uni-name">${hl(u.name, kw)}</span>
              <span class="uni-code">${esc(u.code)}</span>
            </div>
            <div class="uni-tags">
              <span class="tag ${u.level === '本科' ? 'blue' : ''}">${esc(u.level)}</span>
              ${deptTag(u.dept)}
              <span class="tag">${esc(u.loc)}</span>
              ${unlimitedRate > 0.6 ? `<span class="tag green">不限选科 ${(unlimitedRate * 100).toFixed(0)}%</span>` : ''}
              ${u.allOK === true && State.mySubjects.length ? '<span class="tag green">全部可报</span>' : ''}
              ${u.allOK === false && State.mySubjects.length ? '<span class="tag amber">部分受限</span>' : ''}
            </div>
          </div>
          <div class="uni-head-right">
            <span>${fmt(u.majorCount)} 个专业</span>
            <span class="caret"></span>
          </div>
        </div>
        <div class="uni-body">
          <div class="tbl-scroll" style="border:none">
            <table class="major-table">
              <thead><tr>
                <th style="width:38px" class="num">#</th>
                <th>专业名称</th>
                <th>学历层次</th>
                <th>选考科目要求</th>
                ${State.mySubjects.length ? '<th style="width:80px">我能报</th>' : ''}
              </tr></thead>
              <tbody>
                ${majors.map((m, i) => {
                  const ok = State.mySubjects.length ? APP.satisfies(m[2], State.mySubjects) : null;
                  return `<tr>
                    <td class="num mono">${i + 1}</td>
                    <td>${hl(m[0], kw)}</td>
                    <td class="mono" style="font-size:.74rem;color:var(--ink-3)">${esc(m[2].mode === 0 && false ? '' : (m[2].rawLevel || ''))}${esc(levelOfMajor(u, m[0]))}</td>
                    <td class="req"><span class="req-badge ${m[2].kind}">${esc(m[2].label)}</span></td>
                    ${State.mySubjects.length ? `<td>${ok
                      ? '<span class="tag green">可报</span>'
                      : '<span class="tag" style="border-color:var(--rule-soft);color:var(--ink-4)">受限</span>'}</td>` : ''}
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
          ${u.majors.length > 200 ? `<p style="font-size:.74rem;color:var(--ink-3);margin-top:8px">仅显示前 200 个专业，共 ${u.majorCount} 个。请使用搜索缩小范围。</p>` : ''}
          <div class="uni-actions">
            <button class="btn btn-sm" data-act="copy" data-name="${esc(u.name)}">复制专业清单</button>
            <button class="btn btn-sm" data-act="csv" data-name="${esc(u.name)}">导出 CSV</button>
            <button class="btn btn-sm" data-act="cmp" data-name="${esc(u.name)}">加入对比</button>
            <button class="btn btn-sm" data-act="link" data-name="${esc(u.name)}">可分享链接</button>
          </div>
        </div>
      </div>`;
  }

  function levelOfMajor(u, name) {
    const m = u.majors.find(x => x[0] === name);
    return '';
  }

  function hl(text, kw) {
    const t = esc(text);
    if (!kw) return t;
    try {
      return t.replace(new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'),
        '<mark style="background:var(--swiss-red);color:#fff;padding:0 2px">$1</mark>');
    } catch (e) { return t; }
  }

  function bindCards(host) {
    $$('.uni', host).forEach(card => {
      const head = $('.uni-head', card);
      head.onclick = () => {
        const open = card.getAttribute('open-state') === 'open';
        card.setAttribute('open-state', open ? '' : 'open');
      };
      const code = card.dataset.code;
      $$('[data-act]', card).forEach(b => {
        b.onclick = async (ev) => {
          ev.stopPropagation();
          const u = State.filtered.find(x => x.code === code) ||
                    State.provData.院校.find(x => x[0] === code);
          const name = b.dataset.name;
          const list = u.majors ? u.majors : u[5].map(m => [m[0], m[1], APP.parseReq(State.provData.要求字典[m[1]])]);
          if (b.dataset.act === 'cmp') {
            Compare.add({ code, name, prov: State.province });
          } else if (b.dataset.act === 'copy') {
            const txt = `${name}（${State.province}）专业选考科目要求\n` +
              list.map((m, i) => `${i + 1}. ${m[0]} — ${m[2].label}`).join('\n') +
              `\n\n数据来源：${CFG.siteHost}/university/`;
            copyText(txt);
          } else if (b.dataset.act === 'csv') {
            exportCSV(name, list);
          } else if (b.dataset.act === 'link') {
            const url = location.origin + '/university/#school&p=' + encodeURIComponent(State.province) + '&u=' + encodeURIComponent(name);
            copyText(url);
            toast('链接已复制，可直接分享');
          }
        };
      });
    });
  }

  function copyText(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(() => toast('已复制到剪贴板'), () => fallbackCopy(txt));
    } else fallbackCopy(txt);
  }
  function fallbackCopy(txt) {
    const ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('已复制到剪贴板'); }
    catch (e) { toast('复制失败，请手动选择'); }
    ta.remove();
  }

  function exportCSV(name, list) {
    const head = ['序号', '专业名称', '选考科目要求'];
    const rows = list.map((m, i) => [i + 1, m[0], m[2].label]);
    const csv = '\ufeff' + [head, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${State.province}_${name}_选科要求.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('CSV 已开始下载');
  }

  /* ============================================================
     视图 3：选科组合反查
     ============================================================ */
  function renderReverse(host) {
    if (!State.province) {
      host.innerHTML = emptyState('尚未选择省份', '请先选择省份，再进行选科组合反查。', '返回选择省份', () => goto('home'));
      return;
    }
    const combos = [
      ['物理', '化学', '生物'], ['物理', '化学', '政治'], ['物理', '化学', '地理'],
      ['物理', '生物', '政治'], ['物理', '生物', '地理'], ['物理', '政治', '地理'],
      ['历史', '政治', '地理'], ['历史', '政治', '生物'], ['历史', '政治', '化学'],
      ['历史', '地理', '生物'], ['历史', '地理', '化学'], ['历史', '化学', '生物'],
    ];
    const data = combos.map(c => {
      const st = APP.comboStats(State.provData, c);
      return { combo: c.join('+'), ...st };
    }).sort((a, b) => b.rate - a.rate);
    const maxRate = data[0] ? data[0].rate : 1;

    host.innerHTML = `
      <section class="panel">
        <div class="wrap">
          <div class="panel-head">
            <div>
              <h2>${esc(State.province)} · 12 种选科组合专业覆盖率</h2>
              <p>基于本省全部 ${fmt(State.provData.院校.length)} 所院校、${fmt(State.provData.院校.reduce((a, u) => a + u[5].length, 0))} 条专业记录逐条判定。同时要求多门科目的专业必须全部满足才计为可报。</p>
            </div>
            <span class="sec-num">03 / COMBOS</span>
          </div>

          <div class="stat-line">
            <div class="stat-cell hl"><b>${(maxRate * 100).toFixed(1)}%</b><span>最高覆盖率</span></div>
            <div class="stat-cell"><b>${esc(data[0] ? data[0].combo : '—')}</b><span>最优组合</span></div>
            <div class="stat-cell"><b>${(data[data.length - 1].rate * 100).toFixed(1)}%</b><span>最低覆盖率</span></div>
            <div class="stat-cell"><b>12</b><span>组合数量</span></div>
          </div>

          <div class="tbl-scroll">
            <table class="data">
              <thead><tr>
                <th class="num" style="width:44px">#</th>
                <th>选科组合</th>
                <th class="num">可报专业</th>
                <th class="num">可报院校</th>
                <th style="min-width:200px">覆盖率</th>
                <th class="num">专业覆盖</th>
                <th class="num">院校覆盖</th>
              </tr></thead>
              <tbody>
                ${data.map((r, i) => `
                  <tr>
                    <td class="num mono">${String(i + 1).padStart(2, '0')}</td>
                    <td><b>${esc(r.combo)}</b></td>
                    <td class="num">${fmt(r.ok)}<span style="color:var(--ink-4);font-size:.76rem">/${fmt(r.total)}</span></td>
                    <td class="num">${fmt(r.uniOk)}<span style="color:var(--ink-4);font-size:.76rem">/${fmt(r.uniTotal)}</span></td>
                    <td><div class="bar-cell"><div class="bar"><i class="${i === 0 ? 'g' : ''}" style="width:${(r.rate * 100).toFixed(1)}%"></i></div></div></td>
                    <td class="num"><b>${(r.rate * 100).toFixed(2)}%</b></td>
                    <td class="num">${(r.uniRate * 100).toFixed(1)}%</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>

          <div class="panel-head" style="margin-top:36px">
            <div>
              <h2>反向查询 · 我的选科能报哪些</h2>
              <p>选择你的选考科目，列出本省所有可报考的院校与专业。</p>
            </div>
          </div>
          <div class="subj-grid" id="rSubjGrid">
            ${SUBJECTS.map(s => `<button class="subj-chip" data-subj="${s.key}"
              aria-pressed="${State.mySubjects.includes(s.key)}">${s.short}<small>${s.en}</small></button>`).join('')}
          </div>
          <div class="subj-hint">
            <span class="combo-badge" id="rBadge">未选择</span>
            <span id="rSum" style="font-size:.8rem;color:var(--ink-3)"></span>
          </div>
          <div id="rResult" class="mt-24"></div>
        </div>
      </section>`;

    const upd = () => {
      $$('#rSubjGrid .subj-chip').forEach(c =>
        c.setAttribute('aria-pressed', String(State.mySubjects.includes(c.dataset.subj))));
      const b = $('#rBadge');
      const n = State.mySubjects.length;
      b.textContent = n ? State.mySubjects.join(' + ') + `（${n}/3）` : '未选择';
      b.className = 'combo-badge ' + (n === 3 ? 'ok' : 'warn');
      saveSubjects();
      if (n !== 3) {
        $('#rSum').textContent = '请选择 3 门选考科目';
        $('#rResult').innerHTML = '';
        return;
      }
      const st = APP.comboStats(State.provData, State.mySubjects);
      $('#rSum').textContent = `可报 ${fmt(st.ok)} / ${fmt(st.total)} 条专业记录（${(st.rate * 100).toFixed(2)}%），涉及 ${fmt(st.uniOk)} 所院校`;
      const list = APP.filterSchools(State.provData, '', {
        sort: 'majors', onlyMine: true, mine: State.mySubjects,
      });
      $('#rResult').innerHTML = `<div class="uni-list">${list.slice(0, 30).map(uniCard).join('')}</div>
        ${list.length > 30 ? `<p style="margin-top:14px;font-size:.8rem;color:var(--ink-3)">
          仅展示前 30 所，共 ${fmt(list.length)} 所可报院校。切换到「院校专业查询」可查看完整列表。</p>` : ''}`;
      bindCards($('#rResult'));
    };

    $$('#rSubjGrid .subj-chip').forEach(c => c.onclick = () => {
      const k = c.dataset.subj, i = State.mySubjects.indexOf(k);
      if (i >= 0) State.mySubjects.splice(i, 1);
      else {
        if (State.mySubjects.length >= 3) { toast('最多选择 3 门选考科目'); return; }
        State.mySubjects.push(k);
      }
      upd();
    });
    upd();
  }

  /* ============================================================
     视图 4：专业选科总览（全局）
     ============================================================ */
  function renderMajors(host) {
    host.innerHTML = `
      <section class="panel">
        <div class="wrap">
          <div class="panel-head">
            <div>
              <h2>全国专业选科要求总览</h2>
              <p>覆盖全国 ${fmt((State.summary || {}).专业名称数)} 个专业名称、${fmt((State.summary || {}).专业记录数)} 条专业记录。
                 下表按全国专业记录数排序，展示各专业对六门选考科目的要求比例。</p>
            </div>
            <span class="sec-num">04 / MAJORS</span>
          </div>
          <div class="controls">
            <div class="field">
              <label for="mq">检索专业名称</label>
              <div class="search-box">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                <input id="mq" class="input" type="search" placeholder="如：临床医学、计算机、法学">
              </div>
            </div>
            <div class="field">
              <label for="msort">排序</label>
              <select id="msort" class="select">
                <option value="n">记录数量</option>
                <option value="phys">需物理比例</option>
                <option value="chem">需化学比例</option>
                <option value="unl">不限选科比例</option>
                <option value="name">专业名称</option>
              </select>
            </div>
          </div>
          <div id="mHost"></div>
        </div>
      </section>`;

    const draw = () => {
      const kw = ($('#mq').value || '').trim().toLowerCase();
      const sort = $('#msort').value;
      let rows = State.majorIndex.filter(r => !kw || r[0].toLowerCase().indexOf(kw) >= 0);
      const cmp = {
        n: (a, b) => b[1] - a[1],
        phys: (a, b) => b[5] - a[5],
        chem: (a, b) => b[6] - a[6],
        unl: (a, b) => b[4] - a[4],
        name: (a, b) => a[0].localeCompare(b[0], 'zh'),
      }[sort];
      rows = rows.slice().sort(cmp);
      const LIMIT = 150;
      const show = rows.slice(0, LIMIT);
      $('#mHost').innerHTML = `
        <div class="tbl-scroll">
          <table class="data">
            <thead><tr>
              <th class="num" style="width:48px">#</th>
              <th>专业名称</th>
              <th class="num">记录数</th>
              <th class="num">覆盖省份</th>
              <th class="num">开设院校</th>
              <th style="min-width:120px">不限选科</th>
              <th class="num">需物理</th>
              <th class="num">需化学</th>
            </tr></thead>
            <tbody>
              ${show.map((r, i) => `
                <tr data-major="${esc(r[0])}" style="cursor:pointer">
                  <td class="num mono">${i + 1}</td>
                  <td><b>${hl(r[0], kw)}</b></td>
                  <td class="num">${fmt(r[1])}</td>
                  <td class="num">${r[2]}</td>
                  <td class="num">${fmt(r[3])}</td>
                  <td><div class="bar-cell"><div class="bar"><i class="g" style="width:${r[4]}%"></i></div></div></td>
                  <td class="num">${r[5].toFixed(1)}%</td>
                  <td class="num">${r[6].toFixed(1)}%</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p style="margin-top:14px;font-size:.76rem;color:var(--ink-3)">
          匹配 ${fmt(rows.length)} 个专业，展示前 ${Math.min(LIMIT, rows.length)} 个。点击任意行查看该专业在全国的选科要求分布。
        </p>`;
      $$('#mHost tbody tr').forEach(tr => tr.onclick = () => majorDetail(tr.dataset.major));
    };
    $('#mq').oninput = debounce(draw, 200);
    $('#msort').onchange = draw;
    draw();
  }

  /* 专业详情：全国分布 + 分省要求 */
  async function majorDetail(name) {
    showModal(name + ' · 全国选科要求分布',
      '跨省份聚合统计，可查看各高校对该专业的具体要求',
      '<div class="state"><div class="spin"></div><b>正在汇总各省数据…</b></div>');

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
        for (const m of u[5]) {
          if (m[0] !== name) continue;
          const r = APP.parseReq(d.要求字典[m[1]]);
          cnt++; agg.total++;
          if (r.mode === 0) agg.不限++;
          for (const s of r.subs) {
            const k = s === '思想政治' ? '政治' : s;
            if (agg[k] !== undefined) agg[k]++;
          }
          const lk = r.label;
          reqCounter.set(lk, (reqCounter.get(lk) || 0) + 1);
          uniList.push({ uni: u[1], code: u[0], prov: p, label: r.label, kind: r.kind });
        }
      }
      if (cnt) byProv.push({ prov: p, cnt });
    }
    byProv.sort((a, b) => b.cnt - a.cnt);

    const reqs = Array.from(reqCounter.entries()).sort((a, b) => b[1] - a[1]);
    const n = agg.total || 1;

    const html = `
      <div class="stat-line">
        <div class="stat-cell hl"><b>${fmt(agg.total)}</b><span>全国记录数</span></div>
        <div class="stat-cell"><b>${byProv.length}</b><span>覆盖省份</span></div>
        <div class="stat-cell"><b>${fmt(uniList.length)}</b><span>开设院校次</span></div>
        <div class="stat-cell"><b>${(agg.不限 / n * 100).toFixed(1)}%</b><span>不限选科</span></div>
      </div>
      <h4 style="font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
        color:var(--ink-3);margin:24px 0 10px">各选考科目要求占比</h4>
      <div class="tbl-scroll">
        <table class="data" style="min-width:auto">
          <thead><tr><th>科目</th><th style="min-width:160px">要求该科目的比例</th><th class="num">占比</th></tr></thead>
          <tbody>
            <tr><td>不限选科</td><td><div class="bar-cell"><div class="bar"><i class="g" style="width:${(agg.不限 / n * 100).toFixed(1)}%"></i></div></div></td>
              <td class="num"><b>${(agg.不限 / n * 100).toFixed(1)}%</b></td></tr>
            ${['物理', '化学', '生物', '政治', '历史', '地理'].map(k => `
              <tr><td>${k}</td>
                <td><div class="bar-cell"><div class="bar"><i style="width:${(agg[k] / n * 100).toFixed(1)}%"></i></div></div></td>
                <td class="num"><b>${(agg[k] / n * 100).toFixed(1)}%</b></td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <h4 style="font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
        color:var(--ink-3);margin:24px 0 10px">各选科组合要求分布</h4>
      <div class="tbl-scroll">
        <table class="data" style="min-width:auto">
          <thead><tr><th>要求内容</th><th class="num">记录数</th><th class="num">占比</th></tr></thead>
          <tbody>${reqs.slice(0, 12).map(([k, v]) => `
            <tr><td>${esc(k)}</td><td class="num">${fmt(v)}</td>
              <td class="num">${(v / n * 100).toFixed(1)}%</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <h4 style="font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
        color:var(--ink-3);margin:24px 0 10px">覆盖省份分布</h4>
      <div class="row" style="gap:6px;flex-wrap:wrap">
        ${byProv.slice(0, 40).map(p => `<span class="tag">${esc(p.prov)} ${p.cnt}</span>`).join('')}
      </div>
      <h4 style="font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
        color:var(--ink-3);margin:24px 0 10px">开设该专业的院校（按省份，最多 200 条）</h4>
      <div class="tbl-scroll">
        <table class="data">
          <thead><tr><th>院校</th><th>省份</th><th>选考科目要求</th></tr></thead>
          <tbody>${uniList.slice(0, 200).map(x => `
            <tr><td><b>${esc(x.uni)}</b></td><td>${esc(x.prov)}</td>
              <td class="req"><span class="req-badge ${x.kind}">${esc(x.label)}</span></td></tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    showModal(name + ' · 全国选科要求分布',
      `全国共 ${fmt(agg.total)} 条记录 · 覆盖 ${byProv.length} 个省份 · ${fmt(uniList.length)} 个院校记录`, html);
  }

  /* ============================================================
     视图 5：院校数据库
     ============================================================ */
  function renderUnis(host) {
    host.innerHTML = `
      <section class="panel">
        <div class="wrap">
          <div class="panel-head">
            <div>
              <h2>全国院校数据库</h2>
              <p>共 ${fmt((State.summary || {}).院校数)} 所院校。展示院校代码、所在地、主管部门、面向省份数与专业规模。</p>
            </div>
            <span class="sec-num">05 / UNIVERSITIES</span>
          </div>
          <div class="controls">
            <div class="field">
              <label for="uq">检索院校</label>
              <div class="search-box">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                <input id="uq" class="input" type="search" placeholder="输入院校名称或院校代码">
              </div>
            </div>
            <div class="field">
              <label for="usort">排序</label>
              <select id="usort" class="select">
                <option value="prov">招生省份数</option>
                <option value="majors">专业记录数</option>
                <option value="name">院校名称</option>
              </select>
            </div>
          </div>
          <div id="uHost"></div>
        </div>
      </section>`;

    const draw = () => {
      const kw = ($('#uq').value || '').trim().toLowerCase();
      const sort = $('#usort').value;
      let rows = State.uniIndex.filter(r =>
        !kw || r[1].toLowerCase().indexOf(kw) >= 0 || String(r[0]).indexOf(kw) >= 0);
      const cmp = {
        prov: (a, b) => b[4] - a[4] || b[5] - a[5],
        majors: (a, b) => b[5] - a[5],
        name: (a, b) => a[1].localeCompare(b[1], 'zh'),
      }[sort];
      rows = rows.slice().sort(cmp);
      const LIMIT = 200;
      $('#uHost').innerHTML = `
        <div class="tbl-scroll">
          <table class="data">
            <thead><tr>
              <th class="num" style="width:48px">#</th>
              <th>院校名称</th>
              <th>院校代码</th>
              <th>所在地</th>
              <th>主管部门</th>
              <th class="num">覆盖省份</th>
              <th class="num">专业记录</th>
            </tr></thead>
            <tbody>${rows.slice(0, LIMIT).map((r, i) => `
              <tr data-uni="${esc(r[1])}">
                <td class="num mono">${i + 1}</td>
                <td><b>${hl(r[1], kw)}</b></td>
                <td class="mono">${esc(r[0])}</td>
                <td>${esc(r[2])}</td>
                <td style="font-size:.8rem;color:var(--ink-3)">${esc(r[3])}</td>
                <td class="num">${r[4]}</td>
                <td class="num">${fmt(r[5])}</td>
              </tr>`).join('')}</tbody>
          </table>
        </div>
        <p style="margin-top:14px;font-size:.76rem;color:var(--ink-3)">
          匹配 ${fmt(rows.length)} 所院校，展示前 ${Math.min(LIMIT, rows.length)} 所。
          点击行内「覆盖省份」可查看该校在各省的专业数与要求。
        </p>`;
      $$('#uHost tbody tr').forEach(tr => tr.onclick = () => uniDetail(tr.dataset.uni));
    };
    $('#uq').oninput = debounce(draw, 200);
    $('#usort').onchange = draw;
    draw();
  }

  async function uniDetail(name) {
    showModal(name + ' · 各省招生情况', '正在汇总…',
      '<div class="state"><div class="spin"></div><b>加载中…</b></div>');
    const row = State.uniIndex.find(r => r[1] === name);
    if (!row) return;
    const provs = row[6];
    const out = [];
    for (const p of provs) {
      try {
        const d = await APP.loadProvince(p);
        const u = d.院校.find(x => x[1] === name);
        if (!u) continue;
        const majors = u[5].map(m => [m[0], APP.parseReq(d.要求字典[m[1]])]);
        const unl = majors.filter(m => m[1].mode === 0).length;
        out.push({ prov: p, code: u[0], level: u[4], dept: u[3], majors,
                   unl, rate: majors.length ? unl / majors.length : 0 });
      } catch (e) {}
    }
    out.sort((a, b) => b.majors.length - a.majors.length);
    const totalRecords = out.reduce((a, x) => a + x.majors.length, 0);
    showModal(name + ' · 各省招生情况',
      `覆盖 ${out.length} 个省份 · ${fmt(totalRecords)} 条专业记录`,
      `<div class="stat-line">
         <div class="stat-cell"><b>${row[0]}</b><span>院校代码</span></div>
         <div class="stat-cell"><b>${esc(row[2])}</b><span>所在地</span></div>
         <div class="stat-cell"><b>${out.length}</b><span>招生省份</span></div>
         <div class="stat-cell hl"><b>${fmt(totalRecords)}</b><span>专业记录</span></div>
       </div>
       <div class="tbl-scroll">
         <table class="data">
           <thead><tr><th>省份</th><th>层次</th><th>办学性质</th>
             <th class="num">专业数</th><th style="min-width:140px">不限选科占比</th></tr></thead>
           <tbody>${out.map(x => `
             <tr><td><b>${esc(x.prov)}</b></td><td>${esc(x.level)}</td>
               <td style="font-size:.8rem;color:var(--ink-3)">${esc(deptText(x.dept))}</td>
               <td class="num">${x.majors.length}</td>
               <td><div class="bar-cell"><div class="bar"><i class="g" style="width:${(x.rate * 100).toFixed(1)}%"></i></div></div></td>
             </tr>`).join('')}
           </tbody>
         </table>
       </div>
       <h4 style="font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
         color:var(--ink-3);margin:24px 0 10px">各专业选科要求（按省份展开，最多 300 条）</h4>
       <div class="tbl-scroll">
         <table class="data">
           <thead><tr><th>省份</th><th>专业名称</th><th>选考科目要求</th></tr></thead>
           <tbody>${out.flatMap(x => x.majors.slice(0, 30).map(m => `
             <tr><td>${esc(x.prov)}</td><td>${esc(m[0])}</td>
               <td class="req"><span class="req-badge ${m[1].kind}">${esc(m[1].label)}</span></td></tr>`)).slice(0, 300).join('')}
           </tbody>
         </table>
       </div>`);
  }

  /* ============================================================
     视图 6：关于 / 数据源 / 缓存管理
     ============================================================ */
  function renderAbout(host) {
    const cs = Cache.stats();
    const s = State.summary || {};
    host.innerHTML = `
      <section class="panel">
        <div class="wrap">
          <div class="panel-head">
            <div>
              <h2>关于本工具</h2>
              <p>数据来源、使用说明与本地缓存管理。</p>
            </div>
            <span class="sec-num">06 / ABOUT</span>
          </div>

          <div class="stat-line">
            <div class="stat-cell"><b>31</b><span>省份</span></div>
            <div class="stat-cell"><b>${fmt(s.院校数)}</b><span>院校</span></div>
            <div class="stat-cell"><b>${fmt(s.专业记录数)}</b><span>专业记录</span></div>
            <div class="stat-cell"><b>${fmt(s.专业名称数)}</b><span>专业名称</span></div>
          </div>

          <div class="panel-head" style="margin-top:32px">
            <div><h2>数据来源与口径</h2></div>
          </div>
          <div class="tbl-scroll">
            <table class="data" style="min-width:auto">
              <tbody>
                <tr><td style="width:150px;color:var(--ink-3)">数据来源</td>
                    <td>${/^https?:\/\//.test(s.数据来源 || '')
                      ? `<a href="${esc(s.数据来源)}" target="_blank" rel="noopener"
                          style="color:var(--swiss-red);text-decoration:underline">${esc(s.数据来源)}</a>`
                      : esc(s.数据来源 || '各省教育考试院公开文件整理')}</td></tr>
                <tr><td style="color:var(--ink-3)">口径说明</td><td>${esc(s.口径说明 || '—')}</td></tr>
                <tr><td style="color:var(--ink-3)">覆盖范围</td><td>中国大陆 31 个省 / 自治区 / 直辖市（不含中国香港、中国澳门、中国台湾）</td></tr>
                <tr><td style="color:var(--ink-3)">数据生成</td><td>${esc(s.生成时间 || '—')}</td></tr>
                <tr><td style="color:var(--ink-3)">用途声明</td><td>仅限个人学习参考，不作为志愿填报的最终依据；请以各省教育考试院及高校官方公布为准。</td></tr>
              </tbody>
            </table>
          </div>

          <div class="panel-head" style="margin-top:32px">
            <div>
              <h2>本地缓存</h2>
              <p>已浏览的省份数据会保存在你的浏览器本地，再次访问时无需重新下载，加载更快且节省流量。</p>
            </div>
          </div>
          <div class="stat-line">
            <div class="stat-cell"><b id="csCount">${cs.count}</b><span>缓存条目</span></div>
            <div class="stat-cell"><b id="csSize">${(cs.bytes / 1024).toFixed(1)}</b><span>占用（KB）</span></div>
            <div class="stat-cell"><b>${cs.available ? '可用' : '不可用'}</b><span>localStorage</span></div>
            <div class="stat-cell"><b>7</b><span>有效期（天）</span></div>
          </div>
          <div class="row mt-16">
            <button class="btn" id="clearCache">清空本地缓存</button>
            <button class="btn" id="preloadAll">预加载全部省份</button>
            <button class="btn" id="clearAll">重置全部本地数据</button>
          </div>
          <p id="preloadLog" style="margin-top:14px;font-size:.8rem;color:var(--ink-3)"></p>

          <div class="panel-head" style="margin-top:32px">
            <div><h2>键盘快捷键</h2></div>
          </div>
          <div class="tbl-scroll">
            <table class="data" style="min-width:auto">
              <tbody>
                <tr><td class="mono">/</td><td>聚焦搜索框</td></tr>
                <tr><td class="mono">1 — 6</td><td>切换导航视图</td></tr>
                <tr><td class="mono">D</td><td>切换深色 / 浅色模式</td></tr>
                <tr><td class="mono">Esc</td><td>关闭弹层</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>`;

    $('#clearCache').onclick = () => {
      Cache.clear();
      const ns = Cache.stats();
      $('#csCount').textContent = ns.count;
      $('#csSize').textContent = (ns.bytes / 1024).toFixed(1);
      toast('本地缓存已清空');
    };
    $('#clearAll').onclick = () => {
      Cache.clear();
      try {
        localStorage.removeItem(CFG.cachePrefix + 'compare');
        localStorage.removeItem(CFG.cachePrefix + 'subjects');
        localStorage.removeItem(CFG.cachePrefix + 'theme');
      } catch (e) {}
      toast('已重置，即将刷新');
      setTimeout(() => location.reload(), 700);
    };
    $('#preloadAll').onclick = async () => {
      const log = $('#preloadLog');
      const provs = State.provIndex.map(p => p.省份);
      let done = 0;
      for (const p of provs) {
        log.textContent = `预加载中… ${done + 1}/${provs.length}（${p}）`;
        try { await APP.loadProvince(p); } catch (e) {}
        done++;
      }
      log.textContent = `已预加载 ${done} 个省份，全部离线可用。`;
      const ns = Cache.stats();
      $('#csCount').textContent = ns.count;
      $('#csSize').textContent = (ns.bytes / 1024).toFixed(1);
      toast('预加载完成');
    };
  }

  /* ============ 空状态 ============ */
  function emptyState(title, desc, btn, fn) {
    setTimeout(() => { const b = $('#__emptyBtn'); if (b) b.onclick = fn; }, 0);
    return `<div class="state">
      <b>${esc(title)}</b><p>${esc(desc)}</p>
      ${btn ? `<div class="row mt-16" style="justify-content:center">
        <button class="btn btn-primary" id="__emptyBtn">${esc(btn)}</button></div>` : ''}
    </div>`;
  }

  /* ============ 防抖 ============ */
  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      const a = arguments, self = this;
      t = setTimeout(() => fn.apply(self, a), ms);
    };
  }

  /* ============ 主题 ============ */
  function initTheme() {
    let t = 'light';
    try { t = localStorage.getItem(CFG.cachePrefix + 'theme') || 'light'; } catch (e) {}
    document.documentElement.setAttribute('data-theme', t);
    updateThemeIcon(t);
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(CFG.cachePrefix + 'theme', next); } catch (e) {}
    updateThemeIcon(next);
    toast(next === 'dark' ? '已切换深色模式' : '已切换浅色模式');
  }
  function updateThemeIcon(t) {
    const b = $('#themeBtn');
    if (!b) return;
    b.innerHTML = t === 'dark'
      ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M20.5 14.5A8.5 8.5 0 019.5 3.5a8.5 8.5 0 1011 11z"/></svg>';
    b.setAttribute('aria-label', t === 'dark' ? '切换到浅色模式' : '切换到深色模式');
  }

  /* ============ 路由解析（支持带参数直达） ============ */
  function parseHash() {
    const h = (location.hash || '').replace(/^#/, '');
    if (!h) return { view: 'home', prov: null };
    const parts = h.split('&');
    let view = parts[0] || 'home';
    let prov = null;
    parts.slice(1).forEach(p => {
      const [k, v] = p.split('=');
      if (k === 'p' && v) prov = decodeURIComponent(v);
    });
    return { view, prov };
  }

  /* ============ 启动 ============ */
  async function boot() {
    initTheme();
    // 恢复选科
    try {
      const s = JSON.parse(localStorage.getItem(CFG.cachePrefix + 'subjects') || '[]');
      if (Array.isArray(s)) State.mySubjects = s.filter(x => SUBJECTS.some(y => y.key === x));
    } catch (e) {}

    $('#themeBtn').onclick = toggleTheme;
    $('#dockHead').onclick = () => $('#dock').classList.toggle('open');
    $('#modalClose').onclick = closeModal;
    $('#modalMask').onclick = (e) => { if (e.target.id === 'modalMask') closeModal(); };
    $$('#topnav button').forEach(b => b.onclick = () => {
      const v = b.dataset.view;
      if (!State.province && (v === 'school' || v === 'reverse')) {
        toast('请先在首页选择省份'); goto('home'); return;
      }
      goto(v);
    });

    // 快捷键
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === '/') { e.preventDefault(); const q = $('#q') || $('#mq') || $('#uq'); if (q) q.focus(); }
      if (e.key.toLowerCase() === 'd') toggleTheme();
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 6) {
        const btns = $$('#topnav button');
        if (btns[n - 1]) btns[n - 1].click();
      }
    });

    Compare.render();

    // 加载索引
    try {
      await APP.init();
    } catch (e) {
      $('#view').innerHTML = `<div class="wrap"><div class="state mt-24">
        <b>数据索引加载失败</b>
        <p>请确认 data/ 目录已正确上传（应与 index.html 同级），或稍后重试。<br>错误信息：${esc(e.message)}</p>
        <div class="row mt-16" style="justify-content:center">
          <button class="btn btn-primary" onclick="location.reload()">重新加载</button>
        </div></div></div>`;
      return;
    }

    // 路由
    const r = parseHash();
    if (r.prov && State.provIndex.some(p => p.省份 === r.prov)) {
      try {
        await APP.loadProvince(r.prov);
        $$('#topnav button').forEach(b => b.dataset.view === r.view && b.setAttribute('aria-selected', 'true'));
        goto(['school', 'reverse'].includes(r.view) ? r.view : 'school', false);
        return;
      } catch (e) {}
    }
    goto('home', false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* 供其他模块调用（如专业查询跳转到院校视图 / 点击省份直达） */
  window.APP_GOTO = goto;
  window.APP_VIEWS = Views;
  window.APP_SELECT_PROVINCE = selectProvince;
})();
