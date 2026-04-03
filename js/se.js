/* ================================================
   SHUOWEB 设置面板 · 亮色主题适配版
   ✅ 完全兼容 common.js，逐一反覆盖 !important 全局样式
   ✅ 自动跟随蓝/粉主题切换
   ✅ 全 SVG 图标 · 丰富动画
   ✅ 触发：#setting / Ctrl+Shift+S / ESC 关闭
================================================ */
(function () {
  if (window.__SW_SETTING_LIGHT__) return;
  window.__SW_SETTING_LIGHT__ = true;

  /* =========================================================
     配置 & 状态
  ========================================================= */
  const PID   = 'sw-setting-panel';
  const MID   = 'sw-setting-mask';
  const STORE = 'sw_setting_light_v1';

  const DEFAULTS = {
    themeLock: 'auto', navAutoHide: false, globalAnimation: true,
    fontSizeScale: 16, autoRefresh: false, autoRefreshInterval: 30, linkBlank: false,
    glassEffect: true, gridBg: false, cardHoverEnhance: false,
    readMode: false, grayMode: false, imgLazyLoad: true, progressBar: true,
    miniConsole: false, performanceMonitor: false, elementInspect: false,
    apiInterceptor: false, preventSleep: false,
    pageWatermark: false, watermarkText: 'SHUOWEB.COM',
    clickRipple: false, rightMenuEnhance: false,
  };

  const ST = {
    cfg: { ...DEFAULTS }, open: false,
    lastHash: location.hash,
    refreshTimer: null, wakeLock: null, fpsTimer: null,
    originFetch: null, originXHR: null,
    rippleFn: null, rightMenuH: null, inspectH: null,
  };

  /* =========================================================
     SVG 图标库（全部 24px viewBox，stroke 风格）
  ========================================================= */
  const IC = {
    settings:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    close:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    reset:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
    save:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="20,6 9,17 4,12"/></svg>`,
    theme:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    nav:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="4" rx="1"/><path d="M3 11h18M3 16h12"/></svg>`,
    anim:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polygon points="5,3 19,12 5,21"/></svg>`,
    font:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>`,
    refresh:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3"/></svg>`,
    link:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    glass:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    grid:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    card:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20"/></svg>`,
    read:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    gray:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20" stroke-dasharray="3,3"/></svg>`,
    img:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>`,
    progress:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="2" y1="12" x2="22" y2="12"/><polyline points="15,5 22,12 15,19"/></svg>`,
    console:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="4,17 10,11 4,5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    perf:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 20h2M6 14h2M10 10h2M14 16h2M18 6h2"/><path d="M3 20v-1M7 14v-1M11 10v-1M15 16v-1M19 6v-1"/></svg>`,
    inspect:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    api:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>`,
    sleep:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    watermark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    ripple:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6" opacity=".5"/><circle cx="12" cy="12" r="10" opacity=".25"/></svg>`,
    menu:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    storage:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
    cookie:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/><circle cx="17.5" cy="9.5" r="1" fill="currentColor"/><circle cx="9" cy="15" r="1" fill="currentColor"/></svg>`,
    qrcode:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><path d="M14 14h2v2h-2zM18 14v2M18 18h2M14 18v2M20 18h.01"/></svg>`,
  };

  /* =========================================================
     样式注入
     ⚠️ common.js 有大量全局 !important 规则，需全部在面板
        作用域内用 !important 反覆盖
  ========================================================= */
  function injectStyle() {
    if (document.getElementById('sw-setting-style')) return;
    const el = document.createElement('style');
    el.id = 'sw-setting-style';
    el.textContent = `
      /* ====================================================
         遮罩层
      ==================================================== */
      #${MID} {
        position: fixed !important; inset: 0 !important;
        background: rgba(0,0,0,0) !important;
        backdrop-filter: blur(0px) !important;
        -webkit-backdrop-filter: blur(0px) !important;
        z-index: 99998 !important;
        opacity: 0 !important; visibility: hidden !important;
        transition: opacity .4s ease, backdrop-filter .4s ease, background .4s ease !important;
        pointer-events: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      #${MID}.sw-open {
        opacity: 1 !important; visibility: visible !important;
        background: rgba(30,41,59,0.35) !important;
        backdrop-filter: blur(6px) !important;
        -webkit-backdrop-filter: blur(6px) !important;
        pointer-events: auto !important;
      }

      /* ====================================================
         面板主体 - 亮色磨砂玻璃，跟随 common.js 主题
      ==================================================== */
      #${PID} {
        position: fixed !important; top: 0 !important; right: 0 !important;
        width: 390px !important; height: 100vh !important;
        background: rgba(248,250,252,0.92) !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        border-left: 1px solid rgba(255,255,255,0.6) !important;
        box-shadow: -16px 0 48px rgba(0,0,0,0.10), -1px 0 0 rgba(255,255,255,0.8) !important;
        z-index: 99999 !important;
        transform: translateX(105%) !important;
        transition: transform .52s cubic-bezier(.22,1,.36,1) !important;
        display: flex !important; flex-direction: column !important;
        overflow: hidden !important;
        border-radius: 0 !important;
        font-family: '666font', -apple-system, sans-serif !important;
      }
      #${PID}.sw-open  { transform: translateX(0) !important; }
      #${PID}.sw-bye   { transform: translateX(105%) !important; transition: transform .35s cubic-bezier(.55,0,1,.45) !important; }

      /* pink 主题自动切换 */
      body.pink #${PID} { background: rgba(255,245,247,0.92) !important; }

      /* ====================================================
         彻底隔离 common.js 全局样式污染
      ==================================================== */
      /* div 的奇怪 box-shadow */
      #${PID} div,
      #${PID} div:not(:empty) {
        box-shadow: none !important;
        border-radius: 0 !important;
        transition: none !important;
      }
      /* 文字对齐 */
      #${PID} h1,#${PID} h2,#${PID} h3,
      #${PID} h4,#${PID} h5,#${PID} h6 {
        text-align: left !important;
        font-weight: 600 !important;
        color: var(--text-main) !important;
        margin: 0 !important;
        user-select: none !important;
      }
      #${PID} p {
        text-align: left !important;
        color: var(--text-sub) !important;
        margin: 0 !important;
        transition: none !important;
      }
      #${PID} ul,#${PID} ol {
        list-style: none !important;
        padding: 0 !important;
        margin: 0 !important;
        text-align: left !important;
      }
      #${PID} ul li,#${PID} ol li {
        text-align: left !important;
        color: inherit !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      #${PID} ul li::before,#${PID} ol li::before {
        display: none !important;
      }
      /* 链接反覆盖 */
      #${PID} a {
        display: inline !important;
        margin: 0 !important;
        background-color: transparent !important;
        color: var(--primary) !important;
        border-radius: 0 !important;
        padding: 0 !important;
        text-decoration: none !important;
        font-weight: inherit !important;
        font-size: inherit !important;
        white-space: normal !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        transition: color .2s ease !important;
        user-select: none !important;
      }
      #${PID} a:hover {
        transform: none !important;
        box-shadow: none !important;
        opacity: 1 !important;
      }
      /* input 反覆盖 */
      #${PID} input {
        width: auto !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        background: rgba(255,255,255,0.7) !important;
        border: 1.5px solid rgba(255,255,255,0.5) !important;
        border-radius: 10px !important;
        color: var(--text-main) !important;
        font-size: 13px !important;
        font-family: inherit !important;
        outline: none !important;
        transition: border-color .2s, box-shadow .2s !important;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06) !important;
        -webkit-appearance: none !important;
      }
      #${PID} input:focus {
        background: #fff !important;
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px var(--primary-light) !important;
        transform: none !important;
      }
      /* button 全面反覆盖 */
      #${PID} button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        color: inherit !important;
        border: none !important;
        border-radius: 0 !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        font-family: inherit !important;
        cursor: pointer !important;
        position: relative !important;
        overflow: visible !important;
        transition: none !important;
        box-shadow: none !important;
        white-space: nowrap !important;
        outline: none !important;
        user-select: none !important;
      }
      #${PID} button:hover {
        transform: none !important;
        filter: none !important;
        box-shadow: none !important;
      }
      #${PID} button:active {
        transform: none !important;
        box-shadow: none !important;
        transition: none !important;
      }
      #${PID} button::before,
      #${PID} button::after {
        display: none !important;
      }
      /* select */
      #${PID} select {
        background: rgba(255,255,255,0.8) !important;
        border: 1.5px solid rgba(0,0,0,0.08) !important;
        border-radius: 10px !important;
        color: var(--text-main) !important;
        font-size: 12px !important;
        font-family: inherit !important;
        padding: 6px 28px 6px 10px !important;
        outline: none !important;
        cursor: pointer !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        transition: border-color .2s, box-shadow .2s !important;
      }
      #${PID} select:focus {
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px var(--primary-light) !important;
      }
      #${PID} select option { background: #fff; color: #1E293B; }
      /* svg */
      #${PID} svg {
        display: block !important;
        flex-shrink: 0 !important;
        fill: none !important;
        overflow: visible !important;
      }

      /* ====================================================
         Header
      ==================================================== */
      #sw-panel-header {
        padding: 22px 20px 16px !important;
        border-bottom: 1px solid rgba(0,0,0,0.06) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-shrink: 0 !important;
        background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%) !important;
        position: relative !important;
        z-index: 1 !important;
      }
      #sw-panel-header-left {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }
      .sw-logo-icon {
        width: 40px !important; height: 40px !important;
        border-radius: 12px !important;
        background: linear-gradient(135deg, var(--primary) 0%, #5856D6 100%) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: #fff !important;
        box-shadow: 0 6px 20px rgba(0,122,255,0.28), 0 2px 6px rgba(0,0,0,0.1) !important;
        animation: sw-logo-pulse 3s ease-in-out infinite !important;
        flex-shrink: 0 !important;
      }
      body.pink .sw-logo-icon {
        background: linear-gradient(135deg, #FF2D55 0%, #FF6B9D 100%) !important;
        box-shadow: 0 6px 20px rgba(255,45,85,0.28), 0 2px 6px rgba(0,0,0,0.1) !important;
      }
      .sw-logo-icon svg { width: 20px !important; height: 20px !important; }
      @keyframes sw-logo-pulse {
        0%,100% { box-shadow: 0 6px 20px rgba(0,122,255,0.28), 0 2px 6px rgba(0,0,0,0.1); }
        50%      { box-shadow: 0 6px 28px rgba(0,122,255,0.45), 0 2px 6px rgba(0,0,0,0.1); }
      }
      body.pink .sw-logo-icon { animation: sw-logo-pulse-pink 3s ease-in-out infinite !important; }
      @keyframes sw-logo-pulse-pink {
        0%,100% { box-shadow: 0 6px 20px rgba(255,45,85,0.28), 0 2px 6px rgba(0,0,0,0.1); }
        50%      { box-shadow: 0 6px 28px rgba(255,45,85,0.45), 0 2px 6px rgba(0,0,0,0.1); }
      }
      .sw-title-wrap {}
      .sw-panel-title {
        font-size: 16px !important; font-weight: 800 !important;
        background: linear-gradient(135deg, var(--primary), #5856D6) !important;
        -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
        letter-spacing: -0.3px !important;
        line-height: 1.2 !important;
      }
      body.pink .sw-panel-title {
        background: linear-gradient(135deg, #FF2D55, #FF6B9D) !important;
        -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
      }
      .sw-panel-sub {
        font-size: 10.5px !important; color: var(--text-sub) !important;
        letter-spacing: 0.8px !important; margin-top: 2px !important;
        text-transform: uppercase !important; line-height: 1 !important;
      }
      #sw-close-btn {
        width: 34px !important; height: 34px !important;
        border-radius: 10px !important;
        background: rgba(0,0,0,0.04) !important;
        border: 1px solid rgba(0,0,0,0.07) !important;
        color: var(--text-sub) !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all .28s cubic-bezier(.34,1.56,.64,1) !important;
        flex-shrink: 0 !important;
        box-shadow: none !important;
      }
      #sw-close-btn svg { width: 15px !important; height: 15px !important; transition: transform .28s cubic-bezier(.34,1.56,.64,1) !important; }
      #sw-close-btn:hover {
        background: rgba(255,59,48,0.1) !important;
        border-color: rgba(255,59,48,0.25) !important;
        color: #FF3B30 !important;
        transform: scale(1.08) !important;
        box-shadow: none !important;
      }
      #sw-close-btn:hover svg { transform: rotate(90deg) !important; }
      #sw-close-btn:active { transform: scale(0.93) !important; }

      /* ====================================================
         Tab 栏
      ==================================================== */
      #sw-tabs {
        display: flex !important;
        gap: 4px !important;
        padding: 10px 16px !important;
        border-bottom: 1px solid rgba(0,0,0,0.06) !important;
        flex-shrink: 0 !important;
        overflow-x: auto !important;
        scrollbar-width: none !important;
        position: relative !important;
        z-index: 1 !important;
      }
      #sw-tabs::-webkit-scrollbar { display: none !important; }
      .sw-tab {
        padding: 5px 14px !important;
        border-radius: 8px !important;
        font-size: 12.5px !important;
        font-weight: 500 !important;
        color: var(--text-sub) !important;
        cursor: pointer !important;
        white-space: nowrap !important;
        border: 1px solid transparent !important;
        background: transparent !important;
        transition: all .22s ease !important;
        outline: none !important;
        box-shadow: none !important;
        letter-spacing: 0 !important;
        line-height: 1.5 !important;
      }
      .sw-tab:hover {
        color: var(--text-main) !important;
        background: rgba(0,0,0,0.04) !important;
        transform: none !important;
        box-shadow: none !important;
      }
      .sw-tab.active {
        color: var(--primary) !important;
        background: var(--primary-light) !important;
        border-color: rgba(0,122,255,0.2) !important;
      }
      body.pink .sw-tab.active {
        color: #FF2D55 !important;
        background: rgba(255,45,85,0.08) !important;
        border-color: rgba(255,45,85,0.2) !important;
      }

      /* ====================================================
         内容滚动区
      ==================================================== */
      #sw-body {
        flex: 1 !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        padding: 6px 0 24px !important;
        position: relative !important;
        scrollbar-width: thin !important;
        scrollbar-color: rgba(0,0,0,0.12) transparent !important;
      }
      #sw-body::-webkit-scrollbar { width: 4px !important; }
      #sw-body::-webkit-scrollbar-track { background: transparent !important; }
      #sw-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12) !important; border-radius: 2px !important; }

      /* ====================================================
         分区标题
      ==================================================== */
      .sw-section { padding: 0 16px !important; }
      .sw-section-head {
        display: flex !important; align-items: center !important;
        gap: 8px !important; padding: 16px 8px 10px !important;
        position: sticky !important; top: 0 !important;
        background: linear-gradient(180deg, rgba(248,250,252,0.98) 70%, transparent) !important;
        z-index: 3 !important;
      }
      body.pink .sw-section-head {
        background: linear-gradient(180deg, rgba(255,245,247,0.98) 70%, transparent) !important;
      }
      .sw-section-gem {
        width: 8px !important; height: 8px !important;
        border-radius: 3px !important;
        background: linear-gradient(135deg, var(--primary), #5856D6) !important;
        flex-shrink: 0 !important;
        transform: rotate(45deg) !important;
        animation: sw-gem-spin 6s linear infinite !important;
      }
      body.pink .sw-section-gem {
        background: linear-gradient(135deg, #FF2D55, #FF6B9D) !important;
      }
      @keyframes sw-gem-spin {
        0%   { transform: rotate(45deg); }
        100% { transform: rotate(405deg); }
      }
      .sw-section-label {
        font-size: 11px !important; font-weight: 700 !important;
        color: var(--text-sub) !important;
        text-transform: uppercase !important;
        letter-spacing: 1.2px !important;
        line-height: 1 !important;
      }
      .sw-section-rule {
        flex: 1 !important; height: 1px !important;
        background: linear-gradient(90deg, rgba(0,0,0,0.08), transparent) !important;
      }

      /* ====================================================
         设置项卡片
      ==================================================== */
      .sw-item {
        display: flex !important; align-items: center !important;
        gap: 12px !important; padding: 10px 12px !important;
        border-radius: 14px !important; margin-bottom: 4px !important;
        cursor: default !important;
        transition: background .22s ease, transform .22s cubic-bezier(.34,1.56,.64,1) !important;
        position: relative !important;
        overflow: hidden !important;
      }
      .sw-item::after {
        content: '' !important;
        position: absolute !important; inset: 0 !important;
        border-radius: 14px !important;
        background: linear-gradient(135deg, rgba(0,122,255,0.06), transparent) !important;
        opacity: 0 !important;
        transition: opacity .22s ease !important;
        pointer-events: none !important;
      }
      body.pink .sw-item::after {
        background: linear-gradient(135deg, rgba(255,45,85,0.06), transparent) !important;
      }
      .sw-item:hover { transform: translateX(3px) !important; }
      .sw-item:hover::after { opacity: 1 !important; }
      .sw-item.has-toggle { cursor: pointer !important; }

      /* 图标盒子 */
      .sw-icon-box {
        width: 36px !important; height: 36px !important;
        border-radius: 10px !important;
        background: rgba(0,122,255,0.07) !important;
        border: 1px solid rgba(0,122,255,0.12) !important;
        display: flex !important; align-items: center !important;
        justify-content: center !important;
        color: var(--primary) !important;
        flex-shrink: 0 !important;
        transition: all .3s cubic-bezier(.34,1.56,.64,1) !important;
        box-shadow: none !important;
      }
      body.pink .sw-icon-box {
        background: rgba(255,45,85,0.07) !important;
        border-color: rgba(255,45,85,0.12) !important;
        color: #FF2D55 !important;
      }
      .sw-icon-box svg { width: 16px !important; height: 16px !important; }
      .sw-item:hover .sw-icon-box {
        background: var(--primary) !important;
        border-color: transparent !important;
        color: #fff !important;
        transform: scale(1.1) rotate(-6deg) !important;
        box-shadow: 0 4px 14px rgba(0,122,255,0.3) !important;
      }
      body.pink .sw-item:hover .sw-icon-box {
        background: #FF2D55 !important;
        box-shadow: 0 4px 14px rgba(255,45,85,0.3) !important;
      }
      /* 开关开启时图标高亮 */
      .sw-item.is-on .sw-icon-box {
        background: var(--primary) !important;
        border-color: transparent !important;
        color: #fff !important;
        box-shadow: 0 3px 10px rgba(0,122,255,0.25) !important;
      }
      body.pink .sw-item.is-on .sw-icon-box {
        background: #FF2D55 !important;
        box-shadow: 0 3px 10px rgba(255,45,85,0.25) !important;
      }

      .sw-item-info { flex: 1 !important; min-width: 0 !important; }
      .sw-item-name {
        font-size: 13.5px !important; font-weight: 600 !important;
        color: var(--text-main) !important; line-height: 1.3 !important;
      }
      .sw-item-desc {
        font-size: 11.5px !important; color: var(--text-sub) !important;
        line-height: 1.4 !important; margin-top: 2px !important;
      }

      /* ====================================================
         拨动开关
      ==================================================== */
      .sw-toggle {
        width: 44px !important; height: 26px !important;
        border-radius: 13px !important;
        background: rgba(0,0,0,0.12) !important;
        border: none !important;
        position: relative !important; cursor: pointer !important;
        flex-shrink: 0 !important;
        transition: background .3s ease, box-shadow .3s ease !important;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.1) !important;
      }
      .sw-toggle.on {
        background: linear-gradient(135deg, var(--primary), #5856D6) !important;
        box-shadow: 0 2px 10px rgba(0,122,255,0.3), inset 0 1px 2px rgba(255,255,255,0.2) !important;
      }
      body.pink .sw-toggle.on {
        background: linear-gradient(135deg, #FF2D55, #FF6B9D) !important;
        box-shadow: 0 2px 10px rgba(255,45,85,0.3), inset 0 1px 2px rgba(255,255,255,0.2) !important;
      }
      .sw-toggle-knob {
        position: absolute !important;
        top: 3px !important; left: 3px !important;
        width: 20px !important; height: 20px !important;
        border-radius: 50% !important;
        background: #fff !important;
        box-shadow: 0 1px 5px rgba(0,0,0,0.22) !important;
        transition: transform .38s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease !important;
      }
      .sw-toggle.on .sw-toggle-knob {
        transform: translateX(18px) !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
      }
      /* 点击时小弹跳 */
      .sw-toggle.sw-bounce {
        animation: sw-toggle-bounce .4s cubic-bezier(.34,1.56,.64,1) !important;
      }
      @keyframes sw-toggle-bounce {
        0%   { transform: scale(1); }
        40%  { transform: scale(.88); }
        70%  { transform: scale(1.08); }
        100% { transform: scale(1); }
      }

      /* ====================================================
         下拉选择
      ==================================================== */
      .sw-select-wrap {
        position: relative !important; flex-shrink: 0 !important;
      }
      .sw-select-wrap svg {
        position: absolute !important; right: 7px !important;
        top: 50% !important; transform: translateY(-50%) !important;
        width: 12px !important; height: 12px !important;
        color: var(--text-sub) !important; pointer-events: none !important;
      }

      /* ====================================================
         滑块区
      ==================================================== */
      .sw-slider-section {
        display: flex !important; align-items: center !important;
        gap: 10px !important; padding: 10px 12px !important;
        border-radius: 14px !important; margin-bottom: 4px !important;
      }
      .sw-slider-section:hover { background: rgba(0,0,0,0.025) !important; }
      .sw-slider {
        flex: 1 !important; -webkit-appearance: none !important;
        height: 5px !important; border-radius: 3px !important;
        background: rgba(0,0,0,0.1) !important;
        outline: none !important; cursor: pointer !important;
        border: none !important; padding: 0 !important; margin: 0 !important;
        box-shadow: none !important; width: auto !important;
      }
      .sw-slider::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        width: 18px !important; height: 18px !important;
        border-radius: 50% !important;
        background: linear-gradient(135deg, var(--primary), #5856D6) !important;
        cursor: pointer !important;
        box-shadow: 0 2px 8px rgba(0,122,255,0.35) !important;
        transition: transform .25s cubic-bezier(.34,1.56,.64,1) !important;
      }
      body.pink .sw-slider::-webkit-slider-thumb {
        background: linear-gradient(135deg, #FF2D55, #FF6B9D) !important;
        box-shadow: 0 2px 8px rgba(255,45,85,0.35) !important;
      }
      .sw-slider::-webkit-slider-thumb:hover { transform: scale(1.3) !important; }
      .sw-slider::-moz-range-thumb {
        width: 18px !important; height: 18px !important;
        border-radius: 50% !important; border: none !important;
        background: var(--primary) !important; cursor: pointer !important;
      }
      .sw-slider-val {
        font-size: 13px !important; font-weight: 700 !important;
        color: var(--primary) !important; min-width: 28px !important;
        text-align: right !important; line-height: 1 !important;
      }
      body.pink .sw-slider-val { color: #FF2D55 !important; }

      /* ====================================================
         输入框行
      ==================================================== */
      .sw-input-row {
        padding: 6px 12px 10px !important; display: flex !important;
        flex-direction: column !important; gap: 6px !important;
      }
      .sw-input-label {
        font-size: 11.5px !important; color: var(--text-sub) !important;
        font-weight: 500 !important; padding-left: 2px !important;
      }
      .sw-text-input {
        padding: 9px 12px !important; width: 100% !important;
        max-width: 100% !important;
        border-radius: 10px !important;
        box-sizing: border-box !important;
      }
      .sw-number-input {
        padding: 7px 10px !important; width: 80px !important;
        text-align: center !important; font-weight: 600 !important;
        border-radius: 10px !important;
      }

      /* ====================================================
         操作按钮（打开/生成等）
      ==================================================== */
      .sw-action-btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 7px 16px !important;
        border-radius: 10px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        color: var(--primary) !important;
        background: var(--primary-light) !important;
        border: 1px solid rgba(0,122,255,0.2) !important;
        cursor: pointer !important;
        transition: all .25s cubic-bezier(.34,1.56,.64,1) !important;
        flex-shrink: 0 !important;
        white-space: nowrap !important;
        box-shadow: none !important;
        outline: none !important;
        line-height: 1.4 !important;
        letter-spacing: 0 !important;
      }
      body.pink .sw-action-btn {
        color: #FF2D55 !important;
        background: rgba(255,45,85,0.07) !important;
        border-color: rgba(255,45,85,0.2) !important;
      }
      .sw-action-btn:hover {
        background: var(--primary) !important;
        color: #fff !important;
        border-color: transparent !important;
        transform: scale(1.05) !important;
        box-shadow: 0 4px 14px rgba(0,122,255,0.28) !important;
      }
      body.pink .sw-action-btn:hover {
        background: #FF2D55 !important;
        box-shadow: 0 4px 14px rgba(255,45,85,0.28) !important;
      }
      .sw-action-btn:active { transform: scale(0.96) !important; }

      /* ====================================================
         底部按钮栏
      ==================================================== */
      #sw-footer {
        padding: 14px 16px !important;
        border-top: 1px solid rgba(0,0,0,0.06) !important;
        display: flex !important; gap: 8px !important;
        flex-shrink: 0 !important;
        background: rgba(255,255,255,0.4) !important;
        position: relative !important; z-index: 1 !important;
      }
      .sw-foot-btn {
        flex: 1 !important; height: 44px !important;
        border-radius: 12px !important;
        font-size: 13.5px !important; font-weight: 700 !important;
        cursor: pointer !important;
        display: flex !important; align-items: center !important;
        justify-content: center !important; gap: 6px !important;
        transition: all .28s cubic-bezier(.34,1.56,.64,1) !important;
        white-space: nowrap !important; outline: none !important;
        letter-spacing: 0 !important; line-height: 1 !important;
      }
      .sw-foot-btn svg { width: 15px !important; height: 15px !important; }
      .sw-foot-btn:active { transform: scale(0.96) !important; }
      #sw-btn-reset {
        background: rgba(0,0,0,0.04) !important;
        color: var(--text-sub) !important;
        border: 1px solid rgba(0,0,0,0.08) !important;
        box-shadow: none !important;
      }
      #sw-btn-reset:hover {
        background: rgba(255,59,48,0.08) !important;
        color: #FF3B30 !important;
        border-color: rgba(255,59,48,0.2) !important;
        transform: scale(1.02) !important;
        box-shadow: none !important;
      }
      #sw-btn-close {
        background: linear-gradient(135deg, var(--primary), #5856D6) !important;
        color: #fff !important; border: none !important;
        box-shadow: 0 4px 16px rgba(0,122,255,0.3) !important;
      }
      body.pink #sw-btn-close {
        background: linear-gradient(135deg, #FF2D55, #FF6B9D) !important;
        box-shadow: 0 4px 16px rgba(255,45,85,0.3) !important;
      }
      #sw-btn-close:hover {
        transform: scale(1.03) translateY(-1px) !important;
        box-shadow: 0 8px 24px rgba(0,122,255,0.38) !important;
        filter: brightness(1.07) !important;
      }
      body.pink #sw-btn-close:hover {
        box-shadow: 0 8px 24px rgba(255,45,85,0.38) !important;
      }

      /* ====================================================
         进入动画
      ==================================================== */
      .sw-item, .sw-slider-section, .sw-input-row {
        opacity: 0;
        transform: translateX(20px);
      }
      .sw-item.sw-in, .sw-slider-section.sw-in, .sw-input-row.sw-in {
        opacity: 1 !important; transform: translateX(0) !important;
        transition: opacity .4s cubic-bezier(.22,1,.36,1), transform .4s cubic-bezier(.22,1,.36,1) !important;
      }
      .sw-section-head {
        opacity: 0; transform: translateY(-6px);
      }
      .sw-section-head.sw-in {
        opacity: 1 !important; transform: translateY(0) !important;
        transition: opacity .45s ease, transform .45s ease !important;
      }

      /* ====================================================
         全局功能辅助样式
      ==================================================== */
      #sw-progress-bar {
        position: fixed !important; top: 0 !important; left: 0 !important;
        height: 3px !important; width: 0 !important;
        background: linear-gradient(90deg, var(--primary), #5856D6) !important;
        z-index: 99997 !important;
        box-shadow: 0 0 8px rgba(0,122,255,0.4) !important;
        transition: width .2s ease !important;
        border-radius: 0 !important;
      }
      body.pink #sw-progress-bar {
        background: linear-gradient(90deg, #FF2D55, #FF6B9D) !important;
        box-shadow: 0 0 8px rgba(255,45,85,0.4) !important;
      }
      #sw-grid-bg {
        position: fixed !important; inset: 0 !important; z-index: -1 !important;
        pointer-events: none !important;
        background-image: linear-gradient(rgba(0,122,255,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,122,255,0.04) 1px, transparent 1px) !important;
        background-size: 40px 40px !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      #sw-watermark {
        position: fixed !important; inset: 0 !important;
        pointer-events: none !important; z-index: 9998 !important;
        opacity: .08 !important; background-repeat: repeat !important;
        border-radius: 0 !important; box-shadow: none !important;
      }
      .sw-inspect-hl { outline: 2px solid var(--primary) !important; background: var(--primary-light) !important; }
      .sw-ripple-dot {
        position: absolute !important; border-radius: 50% !important;
        background: radial-gradient(circle, rgba(0,122,255,0.3) 0%, transparent 70%) !important;
        transform: scale(0) !important;
        animation: sw-ripple-grow .65s ease-out forwards !important;
        pointer-events: none !important;
      }
      @keyframes sw-ripple-grow { to { transform: scale(4) !important; opacity: 0 !important; } }
      #sw-mini-console, #sw-perf-monitor {
        position: fixed !important;
        background: rgba(255,255,255,0.92) !important;
        backdrop-filter: blur(16px) !important;
        border: 1px solid rgba(0,0,0,0.08) !important;
        border-radius: 14px !important;
        padding: 14px 16px !important;
        font-size: 12px !important;
        color: var(--text-main) !important;
        font-family: 'SF Mono', 'Fira Code', monospace !important;
        box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
        z-index: 99990 !important;
      }
      #sw-perf-monitor { top: 70px !important; left: 20px !important; min-width: 200px !important; }
      #sw-mini-console {
        bottom: 20px !important; left: 20px !important;
        width: 340px !important; max-height: 220px !important;
        overflow-y: auto !important;
        scrollbar-width: thin !important;
        scrollbar-color: rgba(0,0,0,0.12) transparent !important;
      }
      #sw-right-menu {
        position: fixed !important; z-index: 99999 !important;
        background: rgba(255,255,255,0.95) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(0,0,0,0.09) !important;
        border-radius: 14px !important;
        box-shadow: 0 16px 48px rgba(0,0,0,0.14) !important;
        padding: 6px !important; min-width: 160px !important;
        display: none !important;
        animation: sw-ctx-in .2s cubic-bezier(.34,1.56,.64,1) !important;
      }
      @keyframes sw-ctx-in { from { opacity:0; transform: scale(.88); } to { opacity:1; transform: scale(1); } }
      .sw-ctx-item {
        padding: 8px 14px !important;
        font-size: 13px !important; font-weight: 500 !important;
        color: var(--text-main) !important; cursor: pointer !important;
        border-radius: 9px !important;
        display: flex !important; align-items: center !important; gap: 8px !important;
        transition: background .15s ease !important;
      }
      .sw-ctx-item:hover { background: var(--primary-light) !important; color: var(--primary) !important; }
      body.pink .sw-ctx-item:hover { background: rgba(255,45,85,0.07) !important; color: #FF2D55 !important; }
      .sw-ctx-item svg { width: 13px !important; height: 13px !important; }
      body.sw-no-anim * { transition: none !important; animation: none !important; }
      body.sw-read-mode :is(header, footer, aside, nav, .ad, .banner, [class*="sidebar"]) { display: none !important; }
      body.sw-gray-mode { filter: grayscale(1) !important; }
      body.sw-card-eh .card:hover { transform: translateY(-10px) !important; box-shadow: 0 24px 48px rgba(0,0,0,0.1) !important; }

      @media (max-width: 480px) {
        #${PID} { width: 100% !important; }
      }
    `;
    document.head.appendChild(el);
  }

  /* =========================================================
     面板 & 状态控制
  ========================================================= */
  function openPanel() {
    const mask  = document.getElementById(MID);
    const panel = document.getElementById(PID);
    if (!mask || !panel) return;
    mask.classList.add('sw-open');
    panel.classList.remove('sw-bye');
    panel.classList.add('sw-open');
    ST.open = true;
    document.body.style.overflow = 'hidden';
    syncForm();
    animateIn();
  }
  function closePanel() {
    const mask  = document.getElementById(MID);
    const panel = document.getElementById(PID);
    if (!mask || !panel) return;
    panel.classList.add('sw-bye');
    panel.classList.remove('sw-open');
    setTimeout(() => {
      mask.classList.remove('sw-open');
      ST.open = false;
      document.body.style.overflow = '';
    }, 380);
  }
  function animateIn() {
    const scope = '#' + PID + ' ';
    const heads = document.querySelectorAll(scope + '.sw-section-head');
    const items = document.querySelectorAll(scope + '.sw-item:not([style*="display: none"]), ' + scope + '.sw-slider-section, ' + scope + '.sw-input-row');

    heads.forEach((el, i) => {
      el.classList.remove('sw-in');
      setTimeout(() => el.classList.add('sw-in'), 20 + i * 70);
    });
    items.forEach((el, i) => {
      el.classList.remove('sw-in');
      setTimeout(() => el.classList.add('sw-in'), 40 + i * 28);
    });
  }
  function syncForm() {
    const cfg = ST.cfg;
    Object.keys(cfg).forEach(key => {
      const el = document.getElementById('sw-' + key);
      if (!el) return;
      if (el.classList.contains('sw-toggle')) {
        el.classList.toggle('on', !!cfg[key]);
        el.closest('.sw-item')?.classList.toggle('is-on', !!cfg[key]);
      } else if (el.tagName === 'SELECT') {
        el.value = cfg[key];
      } else if (el.type === 'range') {
        el.value = cfg[key];
        const d = document.getElementById('sw-font-val');
        if (d) d.textContent = cfg[key];
      } else if (el.tagName === 'INPUT') {
        el.value = cfg[key];
      }
    });
    const riWrap = document.getElementById('sw-ri-wrap');
    if (riWrap) riWrap.style.display = cfg.autoRefresh ? '' : 'none';
  }

  /* =========================================================
     配置管理
  ========================================================= */
  const Cfg = {
    load() {
      try {
        const s = localStorage.getItem(STORE);
        ST.cfg = s ? { ...DEFAULTS, ...JSON.parse(s) } : { ...DEFAULTS };
      } catch { ST.cfg = { ...DEFAULTS }; }
    },
    save() {
      try { localStorage.setItem(STORE, JSON.stringify(ST.cfg)); } catch {}
    },
    reset() {
      if (!confirm('确定要恢复所有默认设置吗？页面将刷新')) return;
      localStorage.removeItem(STORE); location.reload();
    },
    set(key, val) {
      ST.cfg[key] = val; this.save(); this.apply(key, val);
    },
    apply(key, val) {
      const m = {
        themeLock:        () => applyThemeLock(val),
        navAutoHide:      () => applyNavHide(val),
        globalAnimation:  () => applyAnim(val),
        fontSizeScale:    () => applyFont(val),
        autoRefresh:      () => applyAutoRefresh(val),
        linkBlank:        () => applyLinkBlank(val),
        glassEffect:      () => applyGlass(val),
        gridBg:           () => applyGridBg(val),
        cardHoverEnhance: () => applyCardEh(val),
        readMode:         () => applyReadMode(val),
        grayMode:         () => applyGray(val),
        imgLazyLoad:      () => applyLazy(val),
        progressBar:      () => applyProgress(val),
        miniConsole:      () => applyMiniConsole(val),
        performanceMonitor:() => applyPerfMon(val),
        elementInspect:   () => applyInspect(val),
        apiInterceptor:   () => applyApiIntercept(val),
        preventSleep:     () => applyPreventSleep(val),
        pageWatermark:    () => applyWatermark(val),
        watermarkText:    () => applyWatermark(ST.cfg.pageWatermark),
        clickRipple:      () => applyRipple(val),
        rightMenuEnhance: () => applyRightMenu(val),
      };
      if (m[key]) m[key]();
    },
    applyAll() { Object.keys(ST.cfg).forEach(k => this.apply(k, ST.cfg[k])); }
  };

  /* =========================================================
     DOM 生成辅助
  ========================================================= */
  function toggle(id) {
    return `<button class="sw-toggle" id="sw-${id}" type="button"><div class="sw-toggle-knob"></div></button>`;
  }
  function item(toggleId, iconKey, name, desc, right, extraClass='') {
    const hasTog = right.includes('sw-toggle') ? ' has-toggle' : '';
    return `
    <div class="sw-item${hasTog}${extraClass ? ' ' + extraClass : ''}" data-key="${toggleId}">
      <div class="sw-icon-box">${IC[iconKey] || ''}</div>
      <div class="sw-item-info">
        <div class="sw-item-name">${name}</div>
        ${desc ? `<div class="sw-item-desc">${desc}</div>` : ''}
      </div>
      ${right}
    </div>`;
  }
  function section(label, content) {
    return `
    <div class="sw-section">
      <div class="sw-section-head">
        <div class="sw-section-gem"></div>
        <div class="sw-section-label">${label}</div>
        <div class="sw-section-rule"></div>
      </div>
      ${content}
    </div>`;
  }

  /* =========================================================
     面板 DOM
  ========================================================= */
  function buildPanel() {
    if (document.getElementById(PID)) return;

    /* 遮罩 */
    const mask = document.createElement('div');
    mask.id = MID;
    document.body.appendChild(mask);

    /* 面板 */
    const panel = document.createElement('div');
    panel.id = PID;
    panel.innerHTML = `
      <!-- 头部 -->
      <div id="sw-panel-header">
        <div id="sw-panel-header-left">
          <div class="sw-logo-icon">${IC.settings}</div>
          <div class="sw-title-wrap">
            <div class="sw-panel-title">SHUOWEB 设置</div>
            <div class="sw-panel-sub">Professional Settings</div>
          </div>
        </div>
        <button id="sw-close-btn" type="button">${IC.close}</button>
      </div>

      <!-- Tab 栏 -->
      <div id="sw-tabs">
        <button class="sw-tab active" data-pane="basic" type="button">基础</button>
        <button class="sw-tab" data-pane="ui" type="button">界面</button>
        <button class="sw-tab" data-pane="dev" type="button">开发</button>
        <button class="sw-tab" data-pane="lab" type="button">实验</button>
      </div>

      <!-- 内容区 -->
      <div id="sw-body">

        <!-- 基础设置 -->
        <div class="sw-pane" data-pane="basic">
          ${section('基础设置', `
            ${item('themeLock', 'theme', '主题锁定', '覆盖系统主题偏好',
              `<div class="sw-select-wrap">
                <select id="sw-themeLock">
                  <option value="auto">跟随系统</option>
                  <option value="blue">克莱因蓝</option>
                  <option value="pink">浪漫粉</option>
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6,9 12,15 18,9"/></svg>
              </div>`
            )}
            ${item('navAutoHide', 'nav', '导航自动隐藏', '滚动时智能隐藏顶部导航', toggle('navAutoHide'))}
            ${item('globalAnimation', 'anim', '全局动画', '开启 / 关闭所有过渡动效', toggle('globalAnimation'))}
            ${item('linkBlank', 'link', '链接新标签', '所有链接在新标签页打开', toggle('linkBlank'))}
            ${item('autoRefresh', 'refresh', '定时刷新', '自动刷新当前页面', toggle('autoRefresh'))}
          `)}
          <div class="sw-input-row" id="sw-ri-wrap" style="display:none;">
            <div class="sw-input-label">刷新间隔（秒）</div>
            <input class="sw-number-input" type="number" id="sw-autoRefreshInterval" min="5" max="300" value="30">
          </div>
          <!-- 字号滑块 -->
          <div class="sw-slider-section">
            <div class="sw-icon-box">${IC.font}</div>
            <div class="sw-item-info">
              <div class="sw-item-name" style="font-size:13.5px;font-weight:600;color:var(--text-main);">全局字号</div>
            </div>
            <input class="sw-slider" type="range" id="sw-fontSizeScale" min="12" max="22" step="1" value="16">
            <div class="sw-slider-val" id="sw-font-val">16</div>
            <span style="font-size:11px;color:var(--text-sub);line-height:1;">px</span>
          </div>
        </div>

        <!-- 界面优化 -->
        <div class="sw-pane" data-pane="ui" style="display:none;">
          ${section('界面优化', `
            ${item('glassEffect', 'glass', '磨砂玻璃', '毛玻璃模糊背景效果', toggle('glassEffect'))}
            ${item('gridBg', 'grid', '网格背景', '页面添加精细参考网格', toggle('gridBg'))}
            ${item('cardHoverEnhance', 'card', '卡片悬浮增强', '悬浮时更强阴影与位移', toggle('cardHoverEnhance'))}
            ${item('readMode', 'read', '纯净阅读', '隐藏侧边栏广告等干扰元素', toggle('readMode'))}
            ${item('grayMode', 'gray', '黑白模式', '全站去色灰度化显示', toggle('grayMode'))}
            ${item('imgLazyLoad', 'img', '图片懒加载', '滚动到位置时再加载图片', toggle('imgLazyLoad'))}
            ${item('progressBar', 'progress', '顶部进度条', '页面加载时顶部进度显示', toggle('progressBar'))}
          `)}
        </div>

        <!-- 开发工具 -->
        <div class="sw-pane" data-pane="dev" style="display:none;">
          ${section('监控面板', `
            ${item('miniConsole', 'console', '迷你控制台', '页面内悬浮日志输出面板', toggle('miniConsole'))}
            ${item('performanceMonitor', 'perf', '性能监控', '实时 FPS / 内存 / 加载耗时', toggle('performanceMonitor'))}
            ${item('elementInspect', 'inspect', '元素审查', '点击元素查看标签与尺寸', toggle('elementInspect'))}
            ${item('apiInterceptor', 'api', 'API 拦截器', '监控所有 fetch / XHR 请求', toggle('apiInterceptor'))}
          `)}
          ${section('实用工具', `
            ${item('_storage', 'storage', '本地存储', '查看与清理 localStorage', `<button class="sw-action-btn" id="sw-btn-storage" type="button">打开</button>`)}
            ${item('_cookie', 'cookie', 'Cookie', '查看当前页面 Cookie', `<button class="sw-action-btn" id="sw-btn-cookie" type="button">打开</button>`)}
            ${item('_qr', 'qrcode', '页面二维码', '生成当前页面分享二维码', `<button class="sw-action-btn" id="sw-btn-qr" type="button">生成</button>`)}
          `)}
        </div>

        <!-- 实验功能 -->
        <div class="sw-pane" data-pane="lab" style="display:none;">
          ${section('实验功能', `
            ${item('preventSleep', 'sleep', '阻止休眠', '保持屏幕常亮（Wake Lock API）', toggle('preventSleep'))}
            ${item('clickRipple', 'ripple', '点击水波纹', '点击时产生扩散水波纹特效', toggle('clickRipple'))}
            ${item('rightMenuEnhance', 'menu', '右键增强', '右键菜单添加快捷操作入口', toggle('rightMenuEnhance'))}
            ${item('pageWatermark', 'watermark', '页面水印', '全页面浮层自定义水印', toggle('pageWatermark'))}
          `)}
          <div class="sw-input-row">
            <div class="sw-input-label">水印文字内容</div>
            <input class="sw-text-input" type="text" id="sw-watermarkText" placeholder="SHUOWEB.COM">
          </div>
        </div>

      </div>

      <!-- 底部 -->
      <div id="sw-footer">
        <button class="sw-foot-btn" id="sw-btn-reset" type="button">${IC.reset} 恢复默认</button>
        <button class="sw-foot-btn" id="sw-btn-close" type="button">${IC.save} 关闭面板</button>
      </div>
    `;
    document.body.appendChild(panel);
    bindEvents();
  }

  /* =========================================================
     事件绑定
  ========================================================= */
  function bindEvents() {
    /* 关闭按钮 */
    document.getElementById('sw-close-btn').addEventListener('click', closePanel);
    document.getElementById('sw-btn-close').addEventListener('click', closePanel);
    document.getElementById(MID).addEventListener('click', closePanel);
    document.getElementById('sw-btn-reset').addEventListener('click', () => Cfg.reset());
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && ST.open) closePanel(); });

    /* Tab 切换 */
    document.querySelectorAll('#sw-tabs .sw-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#sw-tabs .sw-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const pane = tab.dataset.pane;
        document.querySelectorAll('#' + PID + ' .sw-pane').forEach(p => {
          p.style.display = p.dataset.pane === pane ? '' : 'none';
        });
        setTimeout(animateIn, 10);
      });
    });

    /* 整行点击触发开关 */
    document.querySelectorAll('#' + PID + ' .sw-item.has-toggle').forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.closest('button, select, input, a')) return;
        const tog = row.querySelector('.sw-toggle');
        if (tog) fireToggle(tog);
      });
    });

    /* 开关直接点击 */
    document.querySelectorAll('#' + PID + ' .sw-toggle').forEach(tog => {
      tog.addEventListener('click', e => { e.stopPropagation(); fireToggle(tog); });
    });

    function fireToggle(tog) {
      const isOn = tog.classList.toggle('on');
      tog.classList.add('sw-bounce');
      tog.addEventListener('animationend', () => tog.classList.remove('sw-bounce'), { once: true });
      const key = tog.id.replace('sw-', '');
      tog.closest('.sw-item')?.classList.toggle('is-on', isOn);
      Cfg.set(key, isOn);
      if (key === 'autoRefresh') {
        const w = document.getElementById('sw-ri-wrap');
        if (w) w.style.display = isOn ? '' : 'none';
      }
    }

    /* 下拉框 */
    document.querySelectorAll('#' + PID + ' select').forEach(sel => {
      const key = sel.id.replace('sw-', '');
      sel.addEventListener('change', () => Cfg.set(key, sel.value));
      sel.addEventListener('click', e => e.stopPropagation());
    });

    /* 滑块 */
    const slider  = document.getElementById('sw-fontSizeScale');
    const fontVal = document.getElementById('sw-font-val');
    slider.addEventListener('input', () => {
      fontVal.textContent = slider.value;
      Cfg.set('fontSizeScale', Number(slider.value));
    });

    /* 输入框 */
    document.querySelectorAll('#' + PID + ' input[type="text"], #' + PID + ' input[type="number"]').forEach(inp => {
      const key = inp.id.replace('sw-', '');
      inp.addEventListener('input', () => Cfg.set(key, inp.type === 'number' ? Number(inp.value) : inp.value));
      inp.addEventListener('click', e => e.stopPropagation());
    });

    /* 工具按钮 */
    document.getElementById('sw-btn-storage').addEventListener('click', e => { e.stopPropagation(); openStorage(); });
    document.getElementById('sw-btn-cookie').addEventListener('click',  e => { e.stopPropagation(); openCookie(); });
    document.getElementById('sw-btn-qr').addEventListener('click',       e => { e.stopPropagation(); openQR(); });
  }

  /* =========================================================
     触发机制
  ========================================================= */
  function initTrigger() {
    window.addEventListener('hashchange', () => {
      if (location.hash === '#setting') {
        history.replaceState(null, '', location.pathname);
        ST.lastHash = ''; openPanel();
      }
    });
    setInterval(() => {
      const h = location.hash;
      if (h !== ST.lastHash) {
        ST.lastHash = h;
        if (h === '#setting') { history.replaceState(null, '', location.pathname); ST.lastHash = ''; openPanel(); }
      }
    }, 200);
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') { e.preventDefault(); openPanel(); }
    });
    if (location.hash === '#setting') {
      history.replaceState(null, '', location.pathname); ST.lastHash = '';
      setTimeout(openPanel, 100);
    }
  }

  /* =========================================================
     功能实现
  ========================================================= */
  function applyThemeLock(mode) {
    document.body.classList.remove('pink');
    if (mode === 'pink') document.body.classList.add('pink');
    else if (mode === 'blue') document.body.classList.remove('pink');
    // 通知 common.js 更新按钮文字
    const btn = document.getElementById('themeText');
    if (btn) btn.innerText = mode === 'pink' ? '克莱因蓝' : '浪漫极客粉';
    const isPink = document.body.classList.contains('pink');
    localStorage.setItem('theme', isPink ? 'pink' : 'blue');
  }
  function applyNavHide(on) {
    const h = document.querySelector('header');
    if (!h) return;
    let last = 0;
    const fn = () => { const c = scrollY; h.style.transform = (c > last && c > 200) ? 'translateY(-120%)' : ''; last = c; };
    window[on ? 'addEventListener' : 'removeEventListener']('scroll', fn, { passive: true });
    if (!on) h.style.transform = '';
  }
  function applyAnim(on) { document.body.classList.toggle('sw-no-anim', !on); }
  function applyFont(size) { document.documentElement.style.fontSize = size + 'px'; }
  function applyAutoRefresh(on) {
    clearInterval(ST.refreshTimer);
    if (on) ST.refreshTimer = setInterval(() => location.reload(), ST.cfg.autoRefreshInterval * 1000);
  }
  function applyLinkBlank(on) {
    document.querySelectorAll('a').forEach(a => {
      on ? a.setAttribute('target', '_blank') : a.removeAttribute('target');
      a.setAttribute('rel', 'noopener noreferrer');
    });
  }
  function applyGlass(on) {
    document.documentElement.style.setProperty('--backdrop-filter', on ? 'blur(12px)' : 'none');
  }
  function applyGridBg(on) {
    let el = document.getElementById('sw-grid-bg');
    if (on && !el) { el = document.createElement('div'); el.id = 'sw-grid-bg'; document.body.appendChild(el); }
    else if (!on) el?.remove();
  }
  function applyCardEh(on) { document.body.classList.toggle('sw-card-eh', on); }
  function applyReadMode(on) { document.body.classList.toggle('sw-read-mode', on); }
  function applyGray(on) { document.body.classList.toggle('sw-gray-mode', on); }
  function applyLazy(on) {
    document.querySelectorAll('img').forEach(img => on ? img.setAttribute('loading','lazy') : img.removeAttribute('loading'));
  }
  function applyProgress(on) {
    let el = document.getElementById('sw-progress-bar');
    if (on) {
      if (!el) { el = document.createElement('div'); el.id = 'sw-progress-bar'; document.body.appendChild(el); }
      let p = 0;
      const t = setInterval(() => {
        p = Math.min(p + Math.random() * 8, 90);
        el.style.width = p + '%';
        if (document.readyState === 'complete') {
          el.style.width = '100%'; clearInterval(t);
          setTimeout(() => { el.style.opacity = '0'; setTimeout(() => { el.style.width = '0'; el.style.opacity = '1'; }, 300); }, 200);
        }
      }, 200);
    } else el?.remove();
  }
  function applyMiniConsole(on) {
    let el = document.getElementById('sw-mini-console');
    const orig = { log: console.log.bind(console), warn: console.warn.bind(console), error: console.error.bind(console), info: console.info.bind(console) };
    if (on) {
      if (!el) {
        el = document.createElement('div'); el.id = 'sw-mini-console';
        el.innerHTML = `<div style="font-weight:700;margin-bottom:8px;font-size:11px;letter-spacing:1px;color:var(--primary)">CONSOLE</div>`;
        document.body.appendChild(el);
      }
      ['log','warn','error','info'].forEach(t => {
        const c = { warn:'#f59e0b', error:'#ef4444', info:'#3b82f6', log:'#6b7280' };
        window.console[t] = (...args) => {
          orig[t](...args);
          const d = document.createElement('div');
          d.style.cssText = `margin:3px 0;word-break:break-all;padding:3px 0;border-bottom:1px solid rgba(0,0,0,0.05);color:${c[t]};font-size:11.5px;`;
          d.textContent = `[${t}] ${args.map(a => typeof a==='object'?JSON.stringify(a):String(a)).join(' ')}`;
          el.appendChild(d); el.scrollTop = el.scrollHeight;
        };
      });
    } else { Object.assign(window.console, orig); el?.remove(); }
  }
  function applyPerfMon(on) {
    let el = document.getElementById('sw-perf-monitor');
    if (on) {
      if (!el) { el = document.createElement('div'); el.id = 'sw-perf-monitor'; document.body.appendChild(el); }
      let last = performance.now(), frames = 0;
      const upd = () => {
        frames++;
        const now = performance.now();
        if (now >= last + 1000) {
          const fps = Math.round(frames * 1000 / (now - last));
          const mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize/1024/1024) : '-';
          const lt  = performance.timing ? Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart) : '-';
          el.innerHTML = `
            <div style="font-weight:800;margin-bottom:10px;font-size:11px;letter-spacing:1px;color:var(--primary)">PERFORMANCE</div>
            <div style="display:flex;justify-content:space-between;margin:5px 0;font-size:12px"><span style="color:var(--text-sub)">FPS</span><strong style="color:#10b981">${fps}</strong></div>
            <div style="display:flex;justify-content:space-between;margin:5px 0;font-size:12px"><span style="color:var(--text-sub)">Memory</span><strong style="color:var(--primary)">${mem} MB</strong></div>
            <div style="display:flex;justify-content:space-between;margin:5px 0;font-size:12px"><span style="color:var(--text-sub)">Load</span><strong style="color:#8b5cf6">${lt} ms</strong></div>`;
          frames = 0; last = now;
        }
        ST.fpsTimer = requestAnimationFrame(upd);
      };
      upd();
    } else { cancelAnimationFrame(ST.fpsTimer); el?.remove(); }
  }
  function applyInspect(on) {
    const over  = e => { document.querySelectorAll('.sw-inspect-hl').forEach(el => el.classList.remove('sw-inspect-hl')); e.target.classList.add('sw-inspect-hl'); };
    const click = e => {
      e.preventDefault(); e.stopPropagation();
      const r = e.target.getBoundingClientRect();
      alert(`标签: ${e.target.tagName}\n类名: ${e.target.className||'-'}\nID: ${e.target.id||'-'}\n尺寸: ${Math.round(r.width)} × ${Math.round(r.height)} px`);
      Cfg.set('elementInspect', false);
      syncForm();
    };
    if (on) {
      document.addEventListener('mouseover', over);
      document.addEventListener('click', click, true);
      ST.inspectH = { over, click };
    } else {
      if (ST.inspectH) {
        document.removeEventListener('mouseover', ST.inspectH.over);
        document.removeEventListener('click', ST.inspectH.click, true);
        ST.inspectH = null;
      }
      document.querySelectorAll('.sw-inspect-hl').forEach(el => el.classList.remove('sw-inspect-hl'));
    }
  }
  function applyApiIntercept(on) {
    if (on) {
      ST.originFetch = window.fetch; ST.originXHR = window.XMLHttpRequest;
      window.fetch = async (...a) => {
        const url = a[0], t = performance.now(); console.log(`[API→] ${url}`);
        try { const r = await ST.originFetch(...a); console.log(`[API←] ${url} ${r.status} ${Math.round(performance.now()-t)}ms`); return r; }
        catch(e) { console.error(`[API✗] ${url} ${e.message}`); throw e; }
      };
      window.XMLHttpRequest = class extends ST.originXHR {
        open(m,u,...a){ this._u=u; this._t=performance.now(); console.log(`[XHR→] ${m} ${u}`); super.open(m,u,...a); }
        send(...a){ this.addEventListener('load',()=>console.log(`[XHR←] ${this._u} ${this.status} ${Math.round(performance.now()-this._t)}ms`)); this.addEventListener('error',()=>console.error(`[XHR✗] ${this._u}`)); super.send(...a); }
      };
    } else {
      if (ST.originFetch) window.fetch = ST.originFetch;
      if (ST.originXHR) window.XMLHttpRequest = ST.originXHR;
    }
  }
  async function applyPreventSleep(on) {
    if (on) {
      if ('wakeLock' in navigator) {
        try { ST.wakeLock = await navigator.wakeLock.request('screen'); }
        catch { alert('浏览器不支持阻止休眠'); Cfg.set('preventSleep', false); syncForm(); }
      } else { alert('不支持 Wake Lock API'); Cfg.set('preventSleep', false); syncForm(); }
    } else { if (ST.wakeLock) { await ST.wakeLock.release(); ST.wakeLock = null; } }
  }
  function applyWatermark(on) {
    let el = document.getElementById('sw-watermark');
    if (on) {
      if (el) el.remove();
      el = document.createElement('div'); el.id = 'sw-watermark';
      const c = document.createElement('canvas'); c.width = 220; c.height = 110;
      const ctx = c.getContext('2d');
      ctx.font = '14px 666font, sans-serif'; ctx.fillStyle = '#333'; ctx.globalAlpha = 0.35;
      ctx.translate(110, 55); ctx.rotate(-22 * Math.PI / 180); ctx.textAlign = 'center';
      ctx.fillText(ST.cfg.watermarkText || 'SHUOWEB.COM', 0, 0);
      el.style.backgroundImage = `url(${c.toDataURL()})`;
      document.body.appendChild(el);
    } else el?.remove();
  }
  function applyRipple(on) {
    const fn = e => {
      const r = document.createElement('div'); r.className = 'sw-ripple-dot';
      const rect = e.target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      Object.assign(r.style, { width: size + 'px', height: size + 'px', left: (e.clientX - rect.left - size/2) + 'px', top: (e.clientY - rect.top - size/2) + 'px' });
      e.target.style.position = 'relative'; e.target.style.overflow = 'hidden';
      e.target.appendChild(r); setTimeout(() => r.remove(), 700);
    };
    if (on) { ST.rippleFn = fn; document.addEventListener('click', fn); }
    else if (ST.rippleFn) { document.removeEventListener('click', ST.rippleFn); ST.rippleFn = null; }
  }
  function applyRightMenu(on) {
    let el = document.getElementById('sw-right-menu');
    if (on) {
      if (!el) {
        el = document.createElement('div'); el.id = 'sw-right-menu';
        const menuItems = [
          { icon: IC.settings, label: '打开设置', fn: openPanel },
          { icon: IC.refresh,  label: '刷新页面', fn: () => location.reload() },
          { icon: IC.progress, label: '回到顶部', fn: () => scrollTo({ top: 0, behavior: 'smooth' }) },
          { icon: IC.qrcode,   label: '生成二维码', fn: openQR },
        ];
        el.innerHTML = menuItems.map(m => `<div class="sw-ctx-item">${m.icon}<span>${m.label}</span></div>`).join('');
        document.body.appendChild(el);
        el.querySelectorAll('.sw-ctx-item').forEach((row, i) => {
          row.addEventListener('click', () => { menuItems[i].fn(); el.style.display = 'none'; });
        });
      }
      const ctx = e => {
        e.preventDefault(); el.style.display = 'block';
        el.style.left = e.clientX + 'px'; el.style.top = e.clientY + 'px';
        const r = el.getBoundingClientRect();
        if (r.right > innerWidth) el.style.left = (innerWidth - r.width) + 'px';
        if (r.bottom > innerHeight) el.style.top = (innerHeight - r.height) + 'px';
      };
      const clk = () => el.style.display = 'none';
      document.addEventListener('contextmenu', ctx);
      document.addEventListener('click', clk);
      ST.rightMenuH = { ctx, clk };
    } else {
      el?.remove();
      if (ST.rightMenuH) {
        document.removeEventListener('contextmenu', ST.rightMenuH.ctx);
        document.removeEventListener('click', ST.rightMenuH.clk);
        ST.rightMenuH = null;
      }
    }
  }

  /* =========================================================
     工具弹窗（风格与 common.js 主题匹配）
  ========================================================= */
  function toolWin(title, bodyHtml) {
    const w = window.open('', title, 'width=620,height=560');
    w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
      <style>
        @import url('https://shuoweb.com/css/font.ttf');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'666font',-apple-system,sans-serif;background:#F8FAFC;color:#1E293B;padding:24px;}
        h2{font-size:18px;font-weight:800;color:#007AFF;margin-bottom:18px;letter-spacing:-0.3px;}
        table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);}
        th{padding:12px 14px;background:#F1F5F9;color:#64748B;font-size:11px;letter-spacing:1px;text-align:left;}
        td{padding:11px 14px;border-bottom:1px solid #F1F5F9;font-size:13px;word-break:break-all;}
        .del{padding:4px 10px;border-radius:7px;border:none;background:#FEE2E2;color:#EF4444;font-size:11px;cursor:pointer;font-weight:600;}
        .del:hover{background:#EF4444;color:#fff;}
        .empty{padding:40px;text-align:center;color:#94A3B8;}
      </style>
      </head><body>${bodyHtml}</body></html>`);
  }
  function openStorage() {
    const data = { ...localStorage };
    const rows = Object.entries(data).map(([k, v]) =>
      `<tr><td style="color:#64748B;max-width:120px;">${k}</td><td style="max-width:220px;color:#94A3B8;font-size:11.5px;">${String(v).slice(0, 100)}${v.length > 100 ? '…' : ''}</td>
      <td><button class="del" onclick="localStorage.removeItem('${k}');this.closest('tr').remove()">删除</button></td></tr>`
    ).join('');
    toolWin('本地存储管理器', `<h2>LOCAL STORAGE</h2><table><thead><tr><th>KEY</th><th>VALUE</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="3" class="empty">暂无数据</td></tr>'}</tbody></table>`);
  }
  function openCookie() {
    const rows = document.cookie.split(';').map(c => c.trim()).filter(Boolean).map(c => {
      const [k, ...v] = c.split('=');
      return `<tr><td style="color:#64748B;">${k.trim()}</td><td style="color:#94A3B8;font-size:11.5px;">${v.join('=')}</td></tr>`;
    }).join('');
    toolWin('Cookie 管理器', `<h2>COOKIES</h2><table><thead><tr><th>NAME</th><th>VALUE</th></tr></thead><tbody>${rows || '<tr><td colspan="2" class="empty">暂无 Cookie</td></tr>'}</tbody></table>`);
  }
  function openQR() {
    const url = location.href;
    const w = window.open('', '页面二维码', 'width=360,height=440');
    w.document.write(`<!DOCTYPE html><html><head><title>页面二维码</title>
      <style>*{box-sizing:border-box;margin:0;}body{font-family:-apple-system,sans-serif;background:#F8FAFC;display:flex;flex-direction:column;align-items:center;padding:32px 20px;}h2{font-size:16px;font-weight:800;color:#007AFF;margin-bottom:20px;letter-spacing:1px;}#qr{border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.1);}p{margin-top:14px;font-size:11px;color:#94A3B8;text-align:center;word-break:break-all;max-width:280px;}</style>
      <script src="https://cdn.staticfile.org/qrcodejs/1.0.0/qrcode.min.js"><\/script>
      </head><body><h2>PAGE QR CODE</h2><div id="qr"></div><p>${url}</p>
      <script>new QRCode(document.getElementById('qr'),{text:"${url}",width:200,height:200,colorDark:'#007AFF',colorLight:'#F8FAFC'});<\/script></body></html>`);
  }

  /* =========================================================
     初始化
  ========================================================= */
  function init() {
    injectStyle();
    Cfg.load();
    buildPanel();
    Cfg.applyAll();
    initTrigger();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
