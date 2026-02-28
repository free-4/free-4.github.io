/* ========================= 字体引入 ========================= */
(function () {
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'ShuoWeb';
      src: url('https://shuoweb.com/css/font.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    body, .card-title, .section-title, .ach-toast-name, .ach-item-name {
      font-family: 'ShuoWeb', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
    }
  `;
  document.head.appendChild(style);
})();

/* ========================= 渲染页面逻辑 ========================= */
function render() {
  const root = document.getElementById("content");
  root.innerHTML = "";
  SITE_DATA.forEach((section, sIndex) => {
    const block = document.createElement("div");
    block.className = "section";
    block.style.animationDelay = `${sIndex * 0.1}s`;
    block.innerHTML = `
      <div class="section-title">
        ${ICONS[section.icon] || ICONS.box}
        ${section.name}
      </div>
      <div class="grid"></div>
    `;
    const grid = block.querySelector(".grid");
    section.items.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.onclick = () => {
        if (item.url !== "#") window.location.href = item.url;
        else alert('此处为演示链接');
      };
      card.innerHTML = `
        <div class="icon-box">
          ${ICONS[item.icon] || ICONS.code}
        </div>
        <div class="card-title">${item.title}</div>
      `;
      grid.appendChild(card);
    });
    root.appendChild(block);
  });
}
render();

/* ========================= 成就系统 ========================= */
(function () {

  /* ---------- SVG 图标库（替代 emoji）---------- */
  const ACH_SVG = {
    star:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    matrix:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    glitch:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`,
    skull:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a2 2 0 002 2h4a2 2 0 002-2v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z"/><line x1="9" y1="17" x2="9" y2="20"/><line x1="15" y1="17" x2="15" y2="20"/><line x1="9" y1="12" x2="9" y2="12.01"/><line x1="15" y1="12" x2="15" y2="12.01"/></svg>`,
    flame:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2c0 0-5 5-5 10a5 5 0 0010 0c0-3-2-5-2-5s-1 2-3 2c0-3 0-7 0-7z"/></svg>`,
    keyboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="10"/><line x1="10" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="14" y2="10"/><line x1="18" y1="10" x2="18" y2="10"/><line x1="6" y1="14" x2="18" y2="14"/></svg>`,
    heart:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    click:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>`,
    moon:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
    search:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    folder:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`,
    crown:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 20h20M4 20l2-12 6 6 4-9 4 9 2-3 2 9"/></svg>`,
    gamepad:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M6 14h4m-2-2v4"/><circle cx="15" cy="13" r="1" fill="currentColor"/><circle cx="18" cy="11" r="1" fill="currentColor"/></svg>`,
    lock:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
    zap:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    eye:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    copy:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
    mouse:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="2" width="12" height="20" rx="6"/><line x1="12" y1="2" x2="12" y2="8"/></svg>`,
    anchor:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0020 0h-3"/></svg>`,
    trophy:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>`,
    question: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12" y2="17.01"/></svg>`,
    sunset:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 18a5 5 0 00-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/></svg>`,
    scroll:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`,
    clock:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  };

  /* ---------- 成就定义 ---------- */
  const ACHIEVEMENTS = [
    // ── 公开成就 ──
    { id: "first_visit",    icon: "star",     name: "初探者",     desc: "欢迎来到 shuoweb.com！",                   secret: false },
    { id: "open_panel",     icon: "folder",   name: "成就猎人",   desc: "打开了成就面板，好奇心驱使你前行",           secret: false },
    // ── 隐藏成就 ──
    { id: "sudo_mode",      icon: "terminal", name: "超级管理员", desc: "通过 #sudo 解锁了隐藏通道",                 secret: true  },
    { id: "matrix_mode",    icon: "matrix",   name: "黑客帝国",   desc: "看见了数字雨，真相只在一念间",               secret: true  },
    { id: "hack_mode",      icon: "glitch",   name: "故障美学",   desc: "感受了像素与噪声的碰撞",                   secret: true  },
    { id: "token_114514",   icon: "skull",    name: "臭名昭著",   desc: "输入了传说中的 114514",                    secret: true  },
    { id: "token_666666",   icon: "flame",    name: "暗黑使徒",   desc: "召唤了 666666 的黑暗之力",                 secret: true  },
    { id: "token_1024",     icon: "keyboard", name: "程序员节",   desc: "以 1024 致敬每一位码农",                   secret: true  },
    { id: "konami_code",    icon: "gamepad",  name: "上上下下",   desc: "Konami Code 永远的神",                    secret: true  },
    { id: "secret_word",    icon: "heart",    name: "情书",       desc: '在页面上拼出了 "shuo"',                   secret: true  },
    { id: "click_maniac",   icon: "click",    name: "疯狂点击",   desc: "连续点击标题 7 次",                       secret: true  },
    { id: "idle_watcher",   icon: "moon",     name: "在线摸鱼",   desc: "静止不动 60 秒被发现了",                   secret: true  },
    { id: "devtools_open",  icon: "search",   name: "开发者视角", desc: "用 DevTools 探索了网页的秘密",             secret: true  },
    // ── 新增成就 ──
    { id: "night_owl",      icon: "moon",     name: "深夜访客",   desc: "在深夜（0:00–5:00）访问了这个页面",         secret: true  },
    { id: "speed_scroller", icon: "zap",      name: "极速浏览",   desc: "以惊人的速度滚动了页面",                   secret: true  },
    { id: "right_clicker",  icon: "mouse",    name: "另类探索者", desc: "右键检查了页面，细节控玩家",                 secret: true  },
    { id: "triple_visit",   icon: "anchor",   name: "回头客",     desc: "第 3 次以上访问 shuoweb.com",              secret: true  },
    { id: "scroll_bottom",  icon: "scroll",   name: "到达彼岸",   desc: "滚动到了页面最底部",                       secret: true  },
    { id: "copy_content",   icon: "copy",     name: "信息收集者", desc: "复制了页面上的内容",                       secret: true  },
    { id: "double_click",   icon: "eye",      name: "双击大师",   desc: "双击了某个卡片",                          secret: true  },
    { id: "long_stay",      icon: "clock",    name: "深度探索者", desc: "在页面上停留超过 3 分钟",                  secret: true  },
    { id: "sunset_visit",   icon: "sunset",   name: "黄昏访客",   desc: "在傍晚时分（17:00–19:00）到访",            secret: true  },
    // ── 终极成就 ──
    { id: "all_unlocked",   icon: "crown",    name: "全图鉴",     desc: "解锁了所有彩蛋成就，你是真正的探索者",       secret: true  },
  ];

  /* ---------- 读取 & 保存（带版本去重） ---------- */
  const STORAGE_KEY = "shuoweb_achievements_v2";

  function getUnlocked() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
  }
  function saveUnlocked(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  /* ---------- 解锁成就（防重复） ---------- */
  window.unlockAchievement = function (id) {
    const unlocked = getUnlocked();
    if (unlocked.includes(id)) return;          // 已解锁 → 直接退出
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;
    unlocked.push(id);
    saveUnlocked(unlocked);
    showAchievementToast(ach);
    // 检查全图鉴（排除 all_unlocked 自身）
    const eggIds = ACHIEVEMENTS.filter(a => a.id !== "all_unlocked").map(a => a.id);
    if (eggIds.every(eid => unlocked.includes(eid))) {
      setTimeout(() => window.unlockAchievement("all_unlocked"), 900);
    }
  };

  /* ---------- Toast 通知 ---------- */
  function showAchievementToast(ach) {
    injectStyles();
    const existing = document.querySelectorAll(".ach-toast");
    const offset = existing.length * 90;          // 多条堆叠偏移

    const toast = document.createElement("div");
    toast.className = "ach-toast";
    toast.style.bottom = `${24 + offset}px`;
    toast.innerHTML = `
      <div class="ach-toast-icon-wrap">
        ${ACH_SVG[ach.icon] || ACH_SVG.star}
      </div>
      <div class="ach-toast-body">
        <div class="ach-toast-label">
          ${ACH_SVG.trophy}
          <span>成就解锁</span>
        </div>
        <div class="ach-toast-name">${ach.name}</div>
        <div class="ach-toast-desc">${ach.desc}</div>
      </div>
      <div class="ach-toast-progress"></div>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add("ach-toast--show"));
    });
    setTimeout(() => {
      toast.classList.remove("ach-toast--show");
      toast.classList.add("ach-toast--hide");
      setTimeout(() => toast.remove(), 500);
    }, 3800);
  }

  /* ---------- 成就面板 ---------- */
  function buildPanel() {
    injectStyles();
    const unlocked = getUnlocked();
    const existing = document.getElementById("ach-panel");
    if (existing) {
      existing.classList.remove("ach-panel--show");
      setTimeout(() => existing.remove(), 280);
      return;
    }
    window.unlockAchievement("open_panel");

    const panel = document.createElement("div");
    panel.id = "ach-panel";

    const count = unlocked.length;
    const total = ACHIEVEMENTS.length;
    const pct   = ((count / total) * 100).toFixed(1);

    const items = ACHIEVEMENTS.map(a => {
      const done   = unlocked.includes(a.id);
      const hidden = a.secret && !done;
      const iconSvg = ACH_SVG[a.icon] || ACH_SVG.star;
      return `
        <div class="ach-item ${done ? "ach-item--done" : "ach-item--locked"}">
          <div class="ach-item-icon">
            ${hidden ? ACH_SVG.lock : iconSvg}
          </div>
          <div class="ach-item-text">
            <div class="ach-item-name">${hidden ? "???" : a.name}</div>
            <div class="ach-item-desc">${hidden ? "这是一个隐藏成就" : a.desc}</div>
          </div>
          ${done ? '<div class="ach-item-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>' : ""}
        </div>
      `;
    }).join("");

    panel.innerHTML = `
      <div class="ach-panel-header">
        <div class="ach-panel-title">
          <div class="ach-panel-title-icon">${ACH_SVG.trophy}</div>
          <span>成就</span>
          <span class="ach-panel-count">${count} / ${total}</span>
        </div>
        <button class="ach-panel-close" id="ach-panel-close-btn" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="ach-progress-wrap">
        <div class="ach-progress-bar">
          <div class="ach-progress-fill" style="width:${pct}%"></div>
        </div>
        <span class="ach-progress-label">${pct}%</span>
      </div>
      <div class="ach-list">${items}</div>
      <div class="ach-panel-hint">
        桌面按 <kbd>?</kbd> &nbsp;·&nbsp; 移动端长按分区标题
      </div>
    `;
    document.body.appendChild(panel);

    // 关闭按钮
    document.getElementById("ach-panel-close-btn").addEventListener("click", () => {
      panel.classList.remove("ach-panel--show");
      setTimeout(() => panel.remove(), 280);
    });

    // 点击面板外关闭
    setTimeout(() => {
      document.addEventListener("click", function outsideClick(e) {
        if (!panel.contains(e.target)) {
          panel.classList.remove("ach-panel--show");
          setTimeout(() => panel.remove(), 280);
          document.removeEventListener("click", outsideClick);
        }
      });
    }, 100);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => panel.classList.add("ach-panel--show"));
    });
  }

  /* ---------- 触发器：键盘 ? ---------- */
  document.addEventListener("keydown", e => {
    if (e.key === "?" || (e.shiftKey && e.key === "/")) buildPanel();
  });

  /* ---------- 触发器：长按 section-title（移动端）---------- */
  (function () {
    let longPressTimer = null;
    function onTouchStart() {
      longPressTimer = setTimeout(() => {
        longPressTimer = null;
        if (navigator.vibrate) navigator.vibrate(40);
        buildPanel();
      }, 600);
    }
    function cancelLongPress() { clearTimeout(longPressTimer); longPressTimer = null; }
    function bindLongPress() {
      document.querySelectorAll(".section-title").forEach(t => {
        t.addEventListener("touchstart", onTouchStart, { passive: true });
        t.addEventListener("touchend",   cancelLongPress, { passive: true });
        t.addEventListener("touchmove",  cancelLongPress, { passive: true });
      });
    }
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", bindLongPress)
      : bindLongPress();
  })();

  /* ---------- 首次访问 ---------- */
  window.unlockAchievement("first_visit");

  /* ---------- 新增触发器：深夜访客 ---------- */
  (function () {
    const h = new Date().getHours();
    if (h >= 0 && h < 5) window.unlockAchievement("night_owl");
  })();

  /* ---------- 新增触发器：黄昏访客 ---------- */
  (function () {
    const h = new Date().getHours();
    if (h >= 17 && h < 19) window.unlockAchievement("sunset_visit");
  })();

  /* ---------- 新增触发器：回头客（访问计数）---------- */
  (function () {
    const key = "shuoweb_visit_count";
    let cnt = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, cnt);
    if (cnt >= 3) window.unlockAchievement("triple_visit");
  })();

  /* ---------- 新增触发器：极速滚动 ---------- */
  (function () {
    let lastY = 0, lastT = Date.now();
    let triggered = false;
    window.addEventListener("scroll", () => {
      if (triggered) return;
      const now = Date.now();
      const dy  = Math.abs(window.scrollY - lastY);
      const dt  = now - lastT || 1;
      if (dt < 200 && dy / dt > 3) {        // 速度阈值 px/ms
        triggered = true;
        window.unlockAchievement("speed_scroller");
      }
      lastY = window.scrollY;
      lastT = now;
    }, { passive: true });
  })();

  /* ---------- 新增触发器：右键菜单 ---------- */
  (function () {
    let triggered = false;
    document.addEventListener("contextmenu", () => {
      if (triggered) return;
      triggered = true;
      window.unlockAchievement("right_clicker");
    });
  })();

  /* ---------- 新增触发器：滚动到底部 ---------- */
  (function () {
    let triggered = false;
    function checkBottom() {
      if (triggered) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total    = document.documentElement.scrollHeight;
      if (scrolled >= total - 20) {
        triggered = true;
        window.unlockAchievement("scroll_bottom");
      }
    }
    window.addEventListener("scroll", checkBottom, { passive: true });
  })();

  /* ---------- 新增触发器：复制内容 ---------- */
  (function () {
    let triggered = false;
    document.addEventListener("copy", () => {
      if (triggered) return;
      triggered = true;
      window.unlockAchievement("copy_content");
    });
  })();

  /* ---------- 新增触发器：双击卡片 ---------- */
  (function () {
    let triggered = false;
    function bindDoubleClick() {
      document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("dblclick", () => {
          if (triggered) return;
          triggered = true;
          window.unlockAchievement("double_click");
        });
      });
    }
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", bindDoubleClick)
      : bindDoubleClick();
  })();

  /* ---------- 新增触发器：停留 3 分钟 ---------- */
  (function () {
    setTimeout(() => window.unlockAchievement("long_stay"), 3 * 60 * 1000);
  })();

  /* ========================= 样式注入 ========================= */
  let stylesInjected = false;
  function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;

    const s = document.createElement("style");
    s.textContent = `
      /* ─── CSS 变量 ─── */
      :root {
        --ach-bg:        rgba(10, 10, 18, 0.96);
        --ach-border:    rgba(255,255,255,0.10);
        --ach-accent:    #7c6af7;
        --ach-accent2:   #f5a623;
        --ach-text:      #e8e8f0;
        --ach-muted:     rgba(255,255,255,0.38);
        --ach-done-bg:   rgba(124,106,247,0.12);
        --ach-done-ring: rgba(124,106,247,0.35);
        --ach-radius:    18px;
        --ach-font:      'ShuoWeb', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
        --ach-shadow:    0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06);
      }

      /* ─── 成就面板 ─── */
      #ach-panel {
        position: fixed;
        bottom: 28px;
        right: 22px;
        width: 340px;
        max-height: 560px;
        background: var(--ach-bg);
        border: 1px solid var(--ach-border);
        border-radius: var(--ach-radius);
        backdrop-filter: blur(28px) saturate(160%);
        -webkit-backdrop-filter: blur(28px) saturate(160%);
        z-index: 9001;
        display: flex;
        flex-direction: column;
        box-shadow: var(--ach-shadow);
        transform: translateY(18px) scale(0.96);
        opacity: 0;
        transition: transform 0.32s cubic-bezier(.34,1.42,.64,1), opacity 0.28s ease;
        overflow: hidden;
        font-family: var(--ach-font);
      }
      #ach-panel.ach-panel--show {
        transform: translateY(0) scale(1);
        opacity: 1;
      }

      /* ─── 面板顶部 ─── */
      .ach-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 16px 12px;
        border-bottom: 1px solid var(--ach-border);
        flex-shrink: 0;
      }
      .ach-panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 700;
        color: var(--ach-text);
        letter-spacing: 0.02em;
      }
      .ach-panel-title-icon {
        width: 20px;
        height: 20px;
        color: var(--ach-accent2);
        flex-shrink: 0;
      }
      .ach-panel-title-icon svg { width: 100%; height: 100%; }
      .ach-panel-count {
        font-size: 12px;
        font-weight: 500;
        color: var(--ach-muted);
        background: rgba(255,255,255,0.07);
        padding: 2px 8px;
        border-radius: 20px;
      }
      .ach-panel-close {
        width: 28px; height: 28px;
        display: flex; align-items: center; justify-content: center;
        background: none;
        border: none;
        color: var(--ach-muted);
        cursor: pointer;
        border-radius: 8px;
        transition: background 0.15s, color 0.15s;
        padding: 0;
      }
      .ach-panel-close svg { width: 16px; height: 16px; }
      .ach-panel-close:hover { background: rgba(255,255,255,0.09); color: var(--ach-text); }

      /* ─── 进度条 ─── */
      .ach-progress-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px 8px;
        flex-shrink: 0;
      }
      .ach-progress-bar {
        flex: 1;
        height: 4px;
        background: rgba(255,255,255,0.08);
        border-radius: 4px;
        overflow: hidden;
      }
      .ach-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--ach-accent), var(--ach-accent2));
        border-radius: 4px;
        transition: width 0.8s cubic-bezier(.4,0,.2,1);
        box-shadow: 0 0 8px rgba(124,106,247,0.5);
      }
      .ach-progress-label {
        font-size: 11px;
        color: var(--ach-muted);
        white-space: nowrap;
        min-width: 36px;
        text-align: right;
      }

      /* ─── 成就列表 ─── */
      .ach-list {
        overflow-y: auto;
        padding: 6px 10px;
        flex: 1;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.12) transparent;
      }
      .ach-list::-webkit-scrollbar { width: 4px; }
      .ach-list::-webkit-scrollbar-track { background: transparent; }
      .ach-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }

      /* ─── 成就条目 ─── */
      .ach-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 10px;
        border-radius: 12px;
        margin-bottom: 3px;
        transition: background 0.15s;
      }
      .ach-item:hover { background: rgba(255,255,255,0.04); }
      .ach-item--done {
        background: var(--ach-done-bg);
        box-shadow: inset 0 0 0 1px var(--ach-done-ring);
      }
      .ach-item--done:hover { background: rgba(124,106,247,0.18); }
      .ach-item--locked { opacity: 0.5; }

      .ach-item-icon {
        width: 36px; height: 36px;
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.07);
        flex-shrink: 0;
        color: var(--ach-accent);
      }
      .ach-item--done .ach-item-icon { color: var(--ach-accent2); background: rgba(245,166,35,0.12); }
      .ach-item-icon svg { width: 18px; height: 18px; }

      .ach-item-text { flex: 1; min-width: 0; }
      .ach-item-name {
        font-size: 13px; font-weight: 600;
        color: var(--ach-text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ach-item-desc {
        font-size: 11px;
        color: var(--ach-muted);
        margin-top: 2px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }

      .ach-item-check {
        width: 20px; height: 20px;
        color: var(--ach-accent);
        flex-shrink: 0;
      }
      .ach-item-check svg { width: 100%; height: 100%; }

      /* ─── 底部提示 ─── */
      .ach-panel-hint {
        padding: 10px 16px 14px;
        font-size: 11px;
        color: rgba(255,255,255,0.22);
        text-align: center;
        border-top: 1px solid var(--ach-border);
        flex-shrink: 0;
        letter-spacing: 0.02em;
      }
      .ach-panel-hint kbd {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.18);
        border-radius: 4px;
        padding: 0px 5px;
        font-size: 11px;
        font-family: inherit;
      }

      /* ─── Toast 通知 ─── */
      .ach-toast {
        position: fixed;
        right: 22px;
        width: 320px;
        background: var(--ach-bg);
        border: 1px solid var(--ach-border);
        border-radius: 14px;
        backdrop-filter: blur(24px) saturate(160%);
        -webkit-backdrop-filter: blur(24px) saturate(160%);
        z-index: 9002;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        box-shadow: var(--ach-shadow);
        transform: translateX(110%);
        opacity: 0;
        transition: transform 0.4s cubic-bezier(.34,1.42,.64,1), opacity 0.3s ease;
        font-family: var(--ach-font);
        overflow: hidden;
      }
      .ach-toast--show {
        transform: translateX(0);
        opacity: 1;
      }
      .ach-toast--hide {
        transform: translateX(110%);
        opacity: 0;
        transition: transform 0.38s ease-in, opacity 0.3s ease;
      }

      .ach-toast-icon-wrap {
        width: 42px; height: 42px;
        border-radius: 12px;
        background: rgba(124,106,247,0.15);
        border: 1px solid rgba(124,106,247,0.3);
        display: flex; align-items: center; justify-content: center;
        color: var(--ach-accent);
        flex-shrink: 0;
      }
      .ach-toast-icon-wrap svg { width: 22px; height: 22px; }

      .ach-toast-body { flex: 1; min-width: 0; }
      .ach-toast-label {
        display: flex; align-items: center; gap: 5px;
        font-size: 10px; font-weight: 600;
        color: var(--ach-accent2);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 3px;
      }
      .ach-toast-label svg { width: 11px; height: 11px; }
      .ach-toast-name {
        font-size: 14px; font-weight: 700;
        color: var(--ach-text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ach-toast-desc {
        font-size: 11px;
        color: var(--ach-muted);
        margin-top: 2px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }

      /* 底部进度条动画 */
      .ach-toast-progress {
        position: absolute;
        bottom: 0; left: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--ach-accent), var(--ach-accent2));
        width: 100%;
        transform-origin: left;
        animation: toastProgress 3.8s linear forwards;
      }
      @keyframes toastProgress {
        from { transform: scaleX(1); }
        to   { transform: scaleX(0); }
      }

      /* ─── 移动端适配 ─── */
      @media (max-width: 480px) {
        #ach-panel {
          bottom: 0; right: 0; left: 0;
          width: 100%; max-height: 70vh;
          border-radius: 20px 20px 0 0;
          transform: translateY(100%);
        }
        #ach-panel.ach-panel--show { transform: translateY(0); }
        .ach-toast { right: 12px; left: 12px; width: auto; }
      }
    `;
    document.head.appendChild(s);
  }

})(); // ← 成就系统结束


/* ========================= 彩蛋 1: #sudo ========================= */
(function () {
  window.addEventListener("hashchange", check);
  check();
  function check() {
    if (window.location.hash === "#sudo") window.unlockAchievement("sudo_mode");
  }
})();


/* ========================= 彩蛋 2: 数字雨 (Matrix) ========================= */
(function () {
  const CODES = { ArrowUp: 1, ArrowDown: 1 };
  let seq = [];
  document.addEventListener("keydown", e => {
    if (!CODES[e.key]) { seq = []; return; }
    seq.push(e.key);
    if (seq.length > 4) seq.shift();
    if (seq.join(",") === "ArrowUp,ArrowDown,ArrowUp,ArrowDown") {
      seq = [];
      window.unlockAchievement("matrix_mode");
      triggerMatrix();
    }
  });

  function triggerMatrix() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
      position:fixed;inset:0;z-index:99995;pointer-events:none;
      opacity:0;transition:opacity 0.5s;
    `;
    document.body.appendChild(canvas);
    const ctx   = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols   = Math.floor(canvas.width / 16);
    const drops  = Array(cols).fill(1);
    const chars  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>/\\|";
    requestAnimationFrame(() => canvas.style.opacity = "1");

    const iv = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f0";
      ctx.font = "14px monospace";
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 50);

    setTimeout(() => {
      clearInterval(iv);
      canvas.style.opacity = "0";
      setTimeout(() => canvas.remove(), 600);
    }, 4000);
  }
})();


/* ========================= 彩蛋 3: 故障美学 (Glitch) ========================= */
(function () {
  let buf = "";
  document.addEventListener("keypress", e => {
    buf += e.key;
    if (buf.length > 8) buf = buf.slice(-8);
    if (buf.endsWith("glitch")) {
      buf = "";
      window.unlockAchievement("hack_mode");
      triggerGlitch();
    }
  });

  function triggerGlitch() {
    const root = document.documentElement;
    const animId = setInterval(() => {
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 4;
      root.style.filter = `hue-rotate(${Math.random()*360}deg) contrast(${1.2+Math.random()*0.5})`;
      root.style.transform = `translate(${x}px,${y}px)`;
    }, 50);
    setTimeout(() => {
      clearInterval(animId);
      root.style.filter = "";
      root.style.transform = "";
    }, 1500);
  }
})();


/* ========================= 彩蛋 4–6: 数字 token ========================= */
(function () {
  let buf = "";
  const tokens = {
    "114514": "token_114514",
    "666666": "token_666666",
    "1024":   "token_1024",
  };
  document.addEventListener("keypress", e => {
    if (!/\d/.test(e.key)) { buf = ""; return; }
    buf += e.key;
    if (buf.length > 6) buf = buf.slice(-6);
    for (const [token, id] of Object.entries(tokens)) {
      if (buf.endsWith(token)) {
        buf = "";
        window.unlockAchievement(id);
      }
    }
  });
})();


/* ========================= 彩蛋 7: Konami Code ========================= */
(function () {
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let seq = [];
  document.addEventListener("keydown", e => {
    seq.push(e.key);
    if (seq.length > KONAMI.length) seq.shift();
    if (seq.join(",") === KONAMI.join(",")) {
      seq = [];
      window.unlockAchievement("konami_code");
      triggerKonami();
    }
  });

  function triggerKonami() {
    launchConfetti();
    const banner = document.createElement("div");
    banner.style.cssText = `
      position:fixed;top:50%;left:50%;
      transform:translate(-50%,-50%) scale(0);
      z-index:99998;
      background:linear-gradient(135deg,#667eea,#764ba2,#f093fb);
      color:#fff;padding:32px 52px;border-radius:20px;text-align:center;
      font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;
      box-shadow:0 24px 80px rgba(0,0,0,0.5);
      transition:transform 0.4s cubic-bezier(.34,1.56,.64,1);
    `;
    banner.innerHTML = `
      <div style="width:52px;height:52px;margin:0 auto 12px;color:#fff;opacity:0.9">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="2" y="6" width="20" height="14" rx="2"/>
          <path d="M6 14h4m-2-2v4"/><circle cx="15" cy="13" r="1" fill="currentColor"/>
          <circle cx="18" cy="11" r="1" fill="currentColor"/>
        </svg>
      </div>
      <h2 style="margin:0 0 6px;font-size:20px;font-weight:800">Konami Code Activated!</h2>
      <p style="opacity:.75;font-size:13px;margin:0">↑↑↓↓←→←→BA · 传说中的秘籍</p>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => banner.style.transform = "translate(-50%,-50%) scale(1)");
    });
    setTimeout(() => {
      banner.style.transform = "translate(-50%,-50%) scale(0)";
      setTimeout(() => banner.remove(), 400);
    }, 3000);
  }

  function launchConfetti() {
    const colors = ["#f9ca24","#f0932b","#6ab04c","#e55039","#5470ff","#9b59b6","#1abc9c"];
    for (let i = 0; i < 100; i++) {
      const dot = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size  = 6 + Math.random() * 8;
      dot.style.cssText = `
        position:fixed;z-index:99997;border-radius:2px;pointer-events:none;
        width:${size}px;height:${size}px;background:${color};
        left:${Math.random()*100}vw;top:-20px;
        animation:confettiFall ${1.5+Math.random()*2}s ease-in forwards;
        transform:rotate(${Math.random()*360}deg);
      `;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 3500);
    }
    if (!document.getElementById("confetti-style")) {
      const s = document.createElement("style");
      s.id = "confetti-style";
      s.textContent = `@keyframes confettiFall{to{transform:translateY(105vh) rotate(720deg);opacity:0}}`;
      document.head.appendChild(s);
    }
  }
})();


/* ========================= 彩蛋 8: 输入 "shuo" ========================= */
(function () {
  let buf = "";
  const TARGET = "shuo";
  document.addEventListener("keypress", e => {
    buf += e.key.toLowerCase();
    if (buf.length > TARGET.length) buf = buf.slice(-TARGET.length);
    if (buf === TARGET) {
      buf = "";
      window.unlockAchievement("secret_word");
      triggerLoveLetter();
    }
  });

  function triggerLoveLetter() {
    if (document.getElementById("love-letter-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "love-letter-overlay";
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:99999;
      display:flex;flex-direction:column;justify-content:center;align-items:center;
      text-align:center;cursor:pointer;
      font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;
      background:radial-gradient(ellipse at center,#1a1a2e,#16213e,#0f3460);
      opacity:0;transition:opacity 0.4s;
    `;
    overlay.innerHTML = `
      <div style="width:60px;height:60px;color:#ff6b9d;animation:heartBeat 1s infinite alternate;margin-bottom:16px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="#ff6b9d"/>
        </svg>
      </div>
      <h2 style="color:#ff6b9d;font-size:22px;margin:0 0 10px;font-weight:800">你找到了情书</h2>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;max-width:280px;line-height:1.9;margin:0">
        感谢每一位探索 shuoweb.com 的你<br>好奇心是最美好的品质
      </p>
      <small style="color:rgba(255,255,255,0.2);font-size:11px;margin-top:28px">点击关闭</small>
      <style>@keyframes heartBeat{from{transform:scale(1)}to{transform:scale(1.18)}}</style>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.style.opacity = "1");
    });
    overlay.onclick = () => {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 400);
    };
  }
})();


/* ========================= 彩蛋 9: 连击标题 7 次 ========================= */
(function () {
  let clickCount = 0, timer = null;

  function bindTitleClicks() {
    document.querySelectorAll(".section-title").forEach(title => {
      title.style.setProperty("pointer-events", "auto", "important");
      title.style.cursor = "pointer";
      title.querySelectorAll("*").forEach(child => {
        child.style.setProperty("pointer-events", "none", "important");
      });

      const handler = () => {
        clickCount++;
        clearTimeout(timer);
        timer = setTimeout(() => { clickCount = 0; }, 2000);
        if (clickCount >= 7) {
          clickCount = 0;
          clearTimeout(timer);
          window.unlockAchievement("click_maniac");
          triggerClickEgg(title);
        }
      };
      title.addEventListener("click",      handler, true);
      title.addEventListener("touchstart", handler, { capture: true, passive: true });
    });
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", bindTitleClicks)
    : bindTitleClicks();

  function triggerClickEgg(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ["#FFD700","#FF6347","#00CED1","#DA70D6","#7FFF00"];

    for (let i = 0; i < 30; i++) {
      const p     = document.createElement("div");
      const angle = (i / 30) * Math.PI * 2;
      const dist  = 60 + Math.random() * 80;
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = `
        position:fixed;left:${cx}px;top:${cy}px;
        width:8px;height:8px;border-radius:50%;background:${color};
        z-index:99996;pointer-events:none;
        transition:all 0.6s ease-out;transform:translate(-50%,-50%);
      `;
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 700);
    }

    const rainbowColors = ["#ff6b9d","#ffcc00","#00e5ff","#69ff47","#ff6b9d"];
    el.style.transition = "color 0.2s";
    rainbowColors.forEach((c, i) => setTimeout(() => el.style.color = c, i * 100));
    setTimeout(() => el.style.color = "", 600);
  }
})();


/* ========================= 彩蛋 10: 摸鱼 60 秒 ========================= */
(function () {
  let idleTimer = null, triggered = false;

  function resetTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(triggerIdle, 60000);
  }

  function triggerIdle() {
    if (triggered) return;
    triggered = true;
    window.unlockAchievement("idle_watcher");

    const banner = document.createElement("div");
    banner.style.cssText = `
      position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-20px);
      z-index:99996;background:rgba(8,8,16,0.9);color:#e8e8f0;
      padding:12px 22px;border-radius:30px;font-size:13px;
      font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;
      border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(12px);
      opacity:0;transition:transform 0.4s ease,opacity 0.4s ease;
      display:flex;align-items:center;gap:8px;
    `;
    banner.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" stroke-width="2">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
      </svg>
      你已经 60 秒没有动了，在摸鱼吗？
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banner.style.transform = "translateX(-50%) translateY(0)";
        banner.style.opacity = "1";
      });
    });
    setTimeout(() => {
      banner.style.transform = "translateX(-50%) translateY(-20px)";
      banner.style.opacity = "0";
      setTimeout(() => banner.remove(), 400);
    }, 4000);

    setTimeout(() => { triggered = false; }, 65000);
  }

  ["mousemove","keydown","scroll","click","touchstart"].forEach(evt => {
    document.addEventListener(evt, resetTimer, { passive: true });
  });
  resetTimer();
})();


/* ========================= 彩蛋 11: DevTools 检测 ========================= */
(function () {
  let alerted = false;
  const threshold = 160;

  setInterval(() => {
    if (alerted) return;
    const widthDiff  = window.outerWidth  - window.innerWidth  > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    if (widthDiff || heightDiff) {
      alerted = true;
      window.unlockAchievement("devtools_open");
      console.log(
        "%c 欢迎，开发者！\n%c你正在检查 shuoweb.com 的源码，很好奇嘛？",
        "font-size:18px;color:#7c6af7;font-weight:bold;",
        "font-size:13px;color:#8b949e;"
      );
    }
  }, 1000);
})();
