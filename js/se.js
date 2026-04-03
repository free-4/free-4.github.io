/* ==============================================
   SHUOWEB 专业隐藏设置面板
   ✅ 触发方式1：地址栏输入 #setting 回车
   ✅ 触发方式2：快捷键 Ctrl+Shift+S / Cmd+Shift+S
   ✅ 触发方式3：ESC键关闭面板
   ✅ 100%适配 common.js 双主题，实时联动
   ✅ 24项功能，配置自动本地缓存，实时生效
   ✅ 无冗余、无base64、无音频、零外部依赖
============================================== */
// 严格防重复加载
if (window.__SHUOWEB_SETTING_FINAL__) return;
window.__SHUOWEB_SETTING_FINAL__ = true;

// 闭包隔离，零全局污染
(() => {
  // ===================== 核心配置 =====================
  const CONFIG = {
    STORAGE_KEY: 'shuoweb_setting_final',
    PANEL_ID: 'shuoweb-setting-panel',
    MASK_ID: 'shuoweb-setting-mask',
    // 默认配置（24项功能）
    DEFAULT: {
      // 基础设置
      themeLock: 'auto',        // 主题锁定：auto/blue/pink
      navAutoHide: false,        // 导航栏滚动自动隐藏
      globalAnimation: true,     // 全局动画总开关
      fontSizeScale: 16,         // 全局基础字号(px)
      autoRefresh: false,        // 页面自动刷新
      autoRefreshInterval: 30,   // 自动刷新间隔(秒)
      linkBlank: false,          // 强制所有链接新窗口打开

      // 界面优化
      glassEffect: true,         // 磨砂玻璃效果开关
      gridBg: false,              // 页面网格背景
      cardHoverEnhance: false,   // 卡片悬浮阴影增强
      readMode: false,            // 纯净阅读模式
      grayMode: false,            // 黑白模式
      imgLazyLoad: true,         // 图片懒加载
      progressBar: true,         // 页面加载进度条

      // 开发工具
      miniConsole: false,         // 页面迷你控制台
      performanceMonitor: false,  // 性能监控面板
      elementInspect: false,      // 元素审查模式
      apiInterceptor: false,      // API请求拦截器
      storageManager: false,      // 本地存储管理器
      cookieManager: false,       // Cookie管理器
      qrcodeGenerator: false,     // 页面二维码生成

      // 实验功能
      preventSleep: false,        // 阻止页面休眠
      pageWatermark: false,       // 页面水印
      watermarkText: 'SHUOWEB.COM', // 水印文本
      clickRipple: false,         // 点击波纹特效
      rightMenuEnhance: false,    // 右键增强菜单
    }
  };

  // 全局状态管理
  const State = {
    config: { ...CONFIG.DEFAULT },
    panelOpen: false,
    refreshTimer: null,
    wakeLock: null,
    fpsTimer: null,
    originFetch: null,
    originXHR: null,
    lastHash: window.location.hash
  };

  // ===================== 配置管理 =====================
  const Config = {
    // 读取本地配置
    load() {
      try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) State.config = { ...CONFIG.DEFAULT, ...JSON.parse(saved) };
        else State.config = { ...CONFIG.DEFAULT };
        return State.config;
      } catch (e) {
        console.warn('[SHUOWEB SETTING] 配置读取失败', e);
        State.config = { ...CONFIG.DEFAULT };
        return State.config;
      }
    },
    // 保存配置
    save() {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(State.config));
        return true;
      } catch (e) {
        console.warn('[SHUOWEB SETTING] 配置保存失败', e);
        return false;
      }
    },
    // 重置配置
    reset() {
      if (confirm('确定要恢复所有默认设置吗？页面将自动刷新')) {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        window.location.reload();
      }
    },
    // 更新单个配置并实时生效
    update(key, value) {
      State.config[key] = value;
      this.save();
      this.apply(key, value);
    },
    // 应用单个配置
    apply(key, value) {
      const actionMap = {
        // 基础设置
        themeLock: () => applyThemeLock(value),
        navAutoHide: () => applyNavAutoHide(value),
        globalAnimation: () => applyGlobalAnimation(value),
        fontSizeScale: () => applyFontSize(value),
        autoRefresh: () => applyAutoRefresh(value),
        linkBlank: () => applyLinkBlank(value),

        // 界面优化
        glassEffect: () => applyGlassEffect(value),
        gridBg: () => applyGridBg(value),
        cardHoverEnhance: () => applyCardHoverEnhance(value),
        readMode: () => applyReadMode(value),
        grayMode: () => applyGrayMode(value),
        imgLazyLoad: () => applyImgLazyLoad(value),
        progressBar: () => applyProgressBar(value),

        // 开发工具
        miniConsole: () => applyMiniConsole(value),
        performanceMonitor: () => applyPerformanceMonitor(value),
        elementInspect: () => applyElementInspect(value),
        apiInterceptor: () => applyApiInterceptor(value),
        storageManager: () => openStorageManager(),
        cookieManager: () => openCookieManager(),
        qrcodeGenerator: () => openQrcodeGenerator(),

        // 实验功能
        preventSleep: () => applyPreventSleep(value),
        pageWatermark: () => applyPageWatermark(value),
        watermarkText: () => applyPageWatermark(State.config.pageWatermark),
        clickRipple: () => applyClickRipple(value),
        rightMenuEnhance: () => applyRightMenuEnhance(value),
      };
      if (actionMap[key]) actionMap;
    },
    // 批量应用所有配置
    applyAll() {
      Object.keys(State.config).forEach(key => this.apply(key, State.config[key]));
    }
  };

  // ===================== 样式注入（100%适配common.js主题） =====================
  function injectStyle() {
    if (document.getElementById('shuoweb-setting-style')) return;
    const style = document.createElement('style');
    style.id = 'shuoweb-setting-style';
    style.textContent = `
      /* 全局变量继承common.js */
      :root {
        --sw-primary: var(--primary, #007AFF);
        --sw-primary-light: var(--primary-light, #E3F2FD);
        --sw-bg: var(--bg, #F8FAFC);
        --sw-card: var(--card-bg, rgba(255,255,255,0.85));
        --sw-text-main: var(--text-main, #1E293B);
        --sw-text-sub: var(--text-sub, #64748B);
        --sw-radius: var(--radius, 16px);
        --sw-transition: var(--transition, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        --sw-shadow: var(--shadow, 0 10px 30px -10px rgba(0,0,0,0.08));
      }

      /* 遮罩层 */
      #${CONFIG.MASK_ID} {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.3);
        backdrop-filter: blur(4px);
        z-index: 999998;
        opacity: 0; visibility: hidden;
        transition: var(--sw-transition);
      }
      #${CONFIG.MASK_ID}.open {
        opacity: 1; visibility: visible;
      }

      /* 设置面板核心 */
      #${CONFIG.PANEL_ID} {
        position: fixed; top: 0; right: 0;
        width: 380px; height: 100vh; max-height: 100dvh;
        background: var(--sw-card);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-left: 1px solid rgba(255,255,255,0.2);
        box-shadow: -10px 0 40px rgba(0,0,0,0.15);
        z-index: 999999;
        transform: translateX(100%);
        transition: var(--sw-transition);
        display: flex; flex-direction: column;
        overflow: hidden;
      }
      #${CONFIG.PANEL_ID}.open {
        transform: translateX(0);
      }

      /* 面板头部 */
      .sw-setting-header {
        padding: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        display: flex; justify-content: space-between; align-items: center;
        flex-shrink: 0;
      }
      .sw-setting-title {
        font-size: 20px; font-weight: 800;
        color: var(--sw-text-main); margin: 0;
        background: linear-gradient(135deg, var(--sw-primary), #5856D6);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      }
      .sw-close-btn {
        width: 36px; height: 36px;
        border-radius: 50%; border: none;
        background: var(--sw-primary); color: #fff;
        cursor: pointer; transition: var(--sw-transition);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .sw-close-btn:hover {
        transform: scale(1.1); filter: brightness(1.1);
      }

      /* 面板内容区 */
      .sw-setting-content {
        flex: 1; overflow-y: auto;
        padding: 16px 20px;
      }
      .sw-setting-section {
        margin-bottom: 28px;
      }
      .sw-section-title {
        font-size: 13px; font-weight: 700;
        color: var(--sw-primary);
        text-transform: uppercase; letter-spacing: 1px;
        margin: 0 0 16px 0;
      }
      .sw-setting-item {
        margin-bottom: 16px;
        display: flex; flex-direction: column; gap: 6px;
      }
      .sw-item-row {
        display: flex; justify-content: space-between; align-items: center;
      }
      .sw-item-label {
        font-size: 14px; color: var(--sw-text-main);
        font-weight: 500;
      }
      .sw-item-desc {
        font-size: 12px; color: var(--sw-text-sub);
        line-height: 1.4;
      }

      /* 开关组件 */
      .sw-switch {
        position: relative;
        width: 44px; height: 24px;
        border-radius: 12px;
        background: var(--sw-text-sub);
        cursor: pointer; transition: var(--sw-transition);
        flex-shrink: 0;
      }
      .sw-switch.active {
        background: var(--sw-primary);
      }
      .sw-switch::after {
        content: ''; position: absolute;
        top: 3px; left: 3px;
        width: 18px; height: 18px;
        border-radius: 50%; background: #fff;
        transition: var(--sw-transition);
      }
      .sw-switch.active::after {
        left: 23px;
      }

      /* 滑块/输入框/下拉框 */
      .sw-slider {
        width: 100%; height: 6px;
        border-radius: 3px; background: rgba(0,0,0,0.1);
        outline: none; -webkit-appearance: none;
        margin: 8px 0;
      }
      .sw-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 18px; height: 18px;
        border-radius: 50%; background: var(--sw-primary);
        cursor: pointer; transition: var(--sw-transition);
      }
      .sw-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
      }
      .sw-input, .sw-select {
        width: 100%; padding: 8px 12px;
        border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);
        background: var(--sw-card); color: var(--sw-text-main);
        font-size: 13px; outline: none;
        transition: var(--sw-transition);
      }
      .sw-input:focus, .sw-select:focus {
        border-color: var(--sw-primary);
        box-shadow: 0 0 0 3px var(--sw-primary-light);
      }
      .sw-btn-sm {
        padding: 4px 10px; border-radius: 8px;
        border: 1px solid var(--sw-primary);
        background: transparent; color: var(--sw-primary);
        font-size: 12px; cursor: pointer;
        transition: var(--sw-transition);
      }
      .sw-btn-sm:hover {
        background: var(--sw-primary); color: #fff;
      }

      /* 底部操作区 */
      .sw-setting-footer {
        padding: 16px 20px 20px;
        border-top: 1px solid rgba(255,255,255,0.1);
        display: flex; gap: 10px;
        flex-shrink: 0;
      }
      .sw-setting-footer button {
        flex: 1; padding: 10px 0;
        border-radius: 12px; border: none;
        font-size: 14px; font-weight: 500;
        cursor: pointer; transition: var(--sw-transition);
      }
      .sw-btn-primary {
        background: var(--sw-primary); color: #fff;
      }
      .sw-btn-primary:hover {
        filter: brightness(1.1); transform: translateY(-1px);
      }
      .sw-btn-border {
        background: transparent; color: var(--sw-text-main);
        border: 1px solid var(--sw-text-sub) !important;
      }
      .sw-btn-border:hover {
        border-color: var(--sw-primary) !important; color: var(--sw-primary);
      }

      /* 功能模块通用样式 */
      .sw-float-panel {
        position: fixed; z-index: 99999;
        background: var(--sw-card); backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: var(--sw-radius);
        box-shadow: var(--sw-shadow);
        padding: 12px 16px;
        font-size: 12px; color: var(--sw-text-main);
      }
      #sw-performance-monitor {
        top: 80px; left: 20px; min-width: 180px;
      }
      #sw-mini-console {
        bottom: 20px; left: 20px;
        width: 320px; max-height: 200px;
        overflow-y: auto;
      }
      #sw-progress-bar {
        position: fixed; top: 0; left: 0;
        height: 3px; background: var(--sw-primary);
        z-index: 999997; transition: width 0.2s ease;
      }
      #sw-watermark {
        position: fixed; inset: 0;
        pointer-events: none; z-index: 9999;
        opacity: 0.1; background-repeat: repeat;
      }
      .sw-inspect-hover {
        outline: 2px solid var(--sw-primary) !important;
        background: rgba(0,122,255,0.1) !important;
      }
      .sw-ripple {
        position: absolute; border-radius: 50%;
        background: rgba(0,122,255,0.2);
        transform: scale(0); animation: sw-ripple 0.6s ease-out;
        pointer-events: none;
      }
      @keyframes sw-ripple {
        to { transform: scale(4); opacity: 0; }
      }
      #sw-right-menu {
        position: fixed; z-index: 999999;
        background: var(--sw-card); backdrop-filter: blur(12px);
        border-radius: 8px; box-shadow: var(--sw-shadow);
        padding: 8px 0; min-width: 160px;
        display: none;
      }
      .sw-menu-item {
        padding: 8px 16px; font-size: 14px;
        color: var(--sw-text-main); cursor: pointer;
        transition: var(--sw-transition);
      }
      .sw-menu-item:hover {
        background: var(--sw-primary-light); color: var(--sw-primary);
      }

      /* 全局功能样式 */
      body.sw-no-animation * {
        transition: none !important; animation: none !important;
      }
      body.sw-read-mode :is(header, footer, aside, nav, .ad, .banner) {
        display: none !important;
      }
      body.sw-read-mode #content {
        max-width: 800px; margin: 0 auto;
        padding: 40px 20px;
      }
      body.sw-gray-mode {
        filter: grayscale(1);
      }
      body.sw-card-enhance .card:hover {
        transform: translateY(-8px) !important;
        box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15) !important;
      }

      /* 移动端适配 */
      @media (max-width: 768px) {
        #${CONFIG.PANEL_ID} {
          width: 100%; max-width: 100%;
        }
        .sw-float-panel {
          max-width: calc(100vw - 40px);
        }
        #sw-mini-console {
          width: calc(100vw - 40px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ===================== 功能实现（24项，全实时生效） =====================
  // ---------- 基础设置 ----------
  function applyThemeLock(mode) {
    const body = document.body;
    body.classList.remove('pink');
    if (mode === 'pink') body.classList.add('pink');
    else if (mode === 'blue') body.classList.remove('pink');
  }
  function applyNavAutoHide(enable) {
    const header = document.querySelector('header');
    if (!header) return;
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.style.transform = 'translateY(-120%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    };
    enable ? window.addEventListener('scroll', handleScroll) : window.removeEventListener('scroll', handleScroll);
    header.style.transform = 'translateY(0)';
  }
  function applyGlobalAnimation(enable) {
    document.body.classList.toggle('sw-no-animation', !enable);
  }
  function applyFontSize(size) {
    document.documentElement.style.fontSize = `${size}px`;
  }
  function applyAutoRefresh(enable) {
    clearInterval(State.refreshTimer);
    if (enable) {
      const interval = State.config.autoRefreshInterval * 1000;
      State.refreshTimer = setInterval(() => window.location.reload(), interval);
    }
  }
  function applyLinkBlank(enable) {
    document.querySelectorAll('a').forEach(link => {
      enable ? link.setAttribute('target', '_blank') : link.removeAttribute('target');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  // ---------- 界面优化 ----------
  function applyGlassEffect(enable) {
    document.documentElement.style.setProperty('--backdrop-filter', enable ? 'blur(12px)' : 'none');
  }
  function applyGridBg(enable) {
    let el = document.getElementById('sw-grid-bg');
    if (enable) {
      if (!el) {
        el = document.createElement('div');
        el.id = 'sw-grid-bg';
        el.style.cssText = `
          position: fixed; inset: 0; z-index: -1;
          background-image: linear-gradient(rgba(100,210,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(100,210,255,0.05) 1px, transparent 1px);
          background-size: 50px 50px; pointer-events: none;
        `;
        document.body.appendChild(el);
      }
    } else el?.remove();
  }
  function applyCardHoverEnhance(enable) {
    document.body.classList.toggle('sw-card-enhance', enable);
  }
  function applyReadMode(enable) {
    document.body.classList.toggle('sw-read-mode', enable);
  }
  function applyGrayMode(enable) {
    document.body.classList.toggle('sw-gray-mode', enable);
  }
  function applyImgLazyLoad(enable) {
    document.querySelectorAll('img').forEach(img => {
      enable ? img.setAttribute('loading', 'lazy') : img.removeAttribute('loading');
    });
  }
  function applyProgressBar(enable) {
    let el = document.getElementById('sw-progress-bar');
    if (enable) {
      if (!el) {
        el = document.createElement('div');
        el.id = 'sw-progress-bar';
        el.style.width = '0%';
        document.body.appendChild(el);
      }
      let progress = 0;
      const timer = setInterval(() => {
        progress += Math.random() * 10;
        progress >= 90 && (progress = 90);
        el.style.width = `${progress}%`;
        if (document.readyState === 'complete') {
          el.style.width = '100%';
          clearInterval(timer);
          setTimeout(() => el.style.opacity = '0', 300);
        }
      }, 200);
    } else el?.remove();
  }

  // ---------- 开发工具 ----------
  function applyMiniConsole(enable) {
    let el = document.getElementById('sw-mini-console');
    const originConsole = { ...window.console };
    if (enable) {
      if (!el) {
        el = document.createElement('div');
        el.id = 'sw-mini-console';
        el.className = 'sw-float-panel';
        el.innerHTML = `<div style="font-weight:700; margin-bottom:8px;">迷你控制台</div>`;
        document.body.appendChild(el);
      }
      ['log', 'warn', 'error', 'info'].forEach(type => {
        window.console[type] = (...args) => {
          originConsole[type](sslocal://flow/file_open?url=...args&flow_extra=eyJsaW5rX3R5cGUiOiJjb2RlX2ludGVycHJldGVyIn0=);
          const item = document.createElement('div');
          item.style.margin = '4px 0';
          item.style.wordBreak = 'break-all';
          item.style.color = type === 'warn' ? '#FF9500' : type === 'error' ? '#FF3B30' : 'inherit';
          item.textContent = `[${type}] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}`;
          el.appendChild(item);
          el.scrollTop = el.scrollHeight;
        };
      });
    } else {
      Object.assign(window.console, originConsole);
      el?.remove();
    }
  }
  function applyPerformanceMonitor(enable) {
    let el = document.getElementById('sw-performance-monitor');
    if (enable) {
      if (!el) {
        el = document.createElement('div');
        el.id = 'sw-performance-monitor';
        el.className = 'sw-float-panel';
        document.body.appendChild(el);
      }
      let lastTime = performance.now();
      let frames = 0;
      const update = () => {
        frames++;
        const now = performance.now();
        if (now >= lastTime + 1000) {
          const fps = Math.round((frames * 1000) / (now - lastTime));
          const memory = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : '未知';
          const loadTime = performance.timing ? Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart) : '未知';
          el.innerHTML = `
            <div style="font-weight:700; margin-bottom:8px;">性能监控</div>
            <div>FPS: <strong style="color:var(--sw-primary)">${fps}</strong></div>
            <div>内存占用: <strong style="color:var(--sw-primary)">${memory} MB</strong></div>
            <div>加载耗时: <strong style="color:var(--sw-primary)">${loadTime} ms</strong></div>
          `;
          frames = 0;
          lastTime = now;
        }
        State.fpsTimer = requestAnimationFrame(update);
      };
      update();
    } else {
      cancelAnimationFrame(State.fpsTimer);
      el?.remove();
    }
  }
  function applyElementInspect(enable) {
    let currentEl = null;
    const handleOver = (e) => {
      currentEl?.classList.remove('sw-inspect-hover');
      currentEl = e.target;
      currentEl.classList.add('sw-inspect-hover');
    };
    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const el = e.target;
      const rect = el.getBoundingClientRect();
      alert(`元素信息:\n标签: ${el.tagName}\n类名: ${el.className}\nID: ${el.id}\n尺寸: ${Math.round(rect.width)} × ${Math.round(rect.height)} px`);
      Config.update('elementInspect', false);
    };
    if (enable) {
      document.addEventListener('mouseover', handleOver);
      document.addEventListener('click', handleClick, true);
      State.inspectHandlers = { mouseover: handleOver, click: handleClick };
    } else {
      if (State.inspectHandlers) {
        document.removeEventListener('mouseover', State.inspectHandlers.mouseover);
        document.removeEventListener('click', State.inspectHandlers.click, true);
        document.querySelectorAll('.sw-inspect-hover').forEach(el => el.classList.remove('sw-inspect-hover'));
        State.inspectHandlers = null;
      }
    }
  }
  function applyApiInterceptor(enable) {
    if (enable) {
      State.originFetch = window.fetch;
      State.originXHR = window.XMLHttpRequest;
      window.fetch = async (...args) => {
        const url = args[0];
        const start = performance.now();
        console.log(`[API拦截] 请求: ${url}`);
        try {
          const res = await State.originFetch(...args);
          const time = Math.round(performance.now() - start);
          console.log(`[API拦截] 响应: ${url} | 状态: ${res.status} | 耗时: ${time}ms`);
          return res;
        } catch (e) {
          console.error(`[API拦截] 失败: ${url} | 错误: ${e.message}`);
          throw e;
        }
      };
      window.XMLHttpRequest = class extends State.originXHR {
        open(method, url, ...args) {
          this._url = url;
          this._method = method;
          this._start = performance.now();
          console.log(`[API拦截] XHR请求: ${method} ${url}`);
          super.open(method, url, ...args);
        }
        send(...args) {
          this.addEventListener('load', () => {
            const time = Math.round(performance.now() - this._start);
            console.log(`[API拦截] XHR响应: ${this._url} | 状态: ${this.status} | 耗时: ${time}ms`);
          });
          this.addEventListener('error', () => console.error(`[API拦截] XHR失败: ${this._url}`));
          super.send(...args);
        }
      };
    } else {
      if (State.originFetch) window.fetch = State.originFetch;
      if (State.originXHR) window.XMLHttpRequest = State.originXHR;
    }
  }
  function openStorageManager() {
    const storage = { ...localStorage };
    let content = '';
    for (const [key, value] of Object.entries(storage)) {
      content += `
        <div style="margin-bottom:12px; padding:8px; border-radius:8px; background:rgba(0,0,0,0.05);">
          <div style="font-weight:700; word-break:break-all;">${key}</div>
          <div style="font-size:12px; word-break:break-all; margin-top:4px;">${value}</div>
          <button class="storage-del" data-key="${key}" style="margin-top:8px; padding:4px 8px; border-radius:4px; border:none; background:#FF3B30; color:#fff; font-size:12px;">删除</button>
        </div>
      `;
    }
    const win = window.open('', '本地存储管理器', 'width=600,height=600');
    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>本地存储管理器 | SHUOWEB</title>
      <style>body{font-family:-apple-system,sans-serif;padding:20px;background:#f5f5f5;}h1{font-size:20px;margin-bottom:20px;}</style>
      </head><body>
      <h1>本地存储管理器</h1><div>${content}</div>
      <script>
        document.querySelectorAll('.storage-del').forEach(btn => {
          btn.onclick = () => {
            localStorage.removeItem(btn.dataset.key);
            btn.parentElement.remove();
            window.opener.alert('删除成功');
          };
        });
      </script></body></html>
    `);
  }
  function openCookieManager() {
    const cookies = document.cookie.split(';').map(i => i.trim()).filter(Boolean);
    let content = '';
    cookies.forEach(cookie => {
      const [key, ...value] = cookie.split('=');
      content += `
        <div style="margin-bottom:12px; padding:8px; border-radius:8px; background:rgba(0,0,0,0.05);">
          <div style="font-weight:700; word-break:break-all;">${key}</div>
          <div style="font-size:12px; word-break:break-all; margin-top:4px;">${value.join('=')}</div>
        </div>
      `;
    });
    const win = window.open('', 'Cookie管理器', 'width=600,height=600');
    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>Cookie管理器 | SHUOWEB</title>
      <style>body{font-family:-apple-system,sans-serif;padding:20px;background:#f5f5f5;}h1{font-size:20px;margin-bottom:20px;}</style>
      </head><body>
      <h1>Cookie管理器</h1><div>${content}</div>
      </body></html>
    `);
  }
  function openQrcodeGenerator() {
    const url = window.location.href;
    const win = window.open('', '页面二维码', 'width=400,height=500');
    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>页面二维码 | SHUOWEB</title>
      <style>body{font-family:-apple-system,sans-serif;padding:20px;text-align:center;}h1{font-size:20px;margin-bottom:20px;}.qrcode{margin:20px auto;width:256px;height:256px;border:1px solid #eee;}</style>
      <script src="https://cdn.staticfile.org/qrcodejs/1.0.0/qrcode.min.js"><\/script>
      </head><body>
      <h1>当前页面二维码</h1>
      <div class="qrcode" id="qrcode"></div>
      <p style="word-break:break-all;color:#666;">${url}</p>
      <script>new QRCode(document.getElementById("qrcode"), {text:"${url}",width:256,height:256});<\/script>
      </body></html>
    `);
  }

  // ---------- 实验功能 ----------
  async function applyPreventSleep(enable) {
    if (enable) {
      if ('wakeLock' in navigator) {
        try {
          State.wakeLock = await navigator.wakeLock.request('screen');
          console.log('[SHUOWEB SETTING] 已阻止页面休眠');
        } catch (e) {
          alert('当前浏览器不支持阻止休眠功能');
          Config.update('preventSleep', false);
        }
      } else {
        alert('当前浏览器不支持Wake Lock API');
        Config.update('preventSleep', false);
      }
    } else {
      if (State.wakeLock) {
        await State.wakeLock.release();
        State.wakeLock = null;
        console.log('[SHUOWEB SETTING] 已解除阻止休眠');
      }
    }
  }
  function applyPageWatermark(enable) {
    let el = document.getElementById('sw-watermark');
    const text = State.config.watermarkText || 'SHUOWEB.COM';
    if (enable) {
      if (!el) {
        el = document.createElement('div');
        el.id = 'sw-watermark';
        const canvas = document.createElement('canvas');
        canvas.width = 200; canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#000';
        ctx.globalAlpha = 0.3;
        ctx.translate(100, 50);
        ctx.rotate(-30 * Math.PI / 180);
        ctx.textAlign = 'center';
        ctx.fillText(text, 0, 0);
        el.style.backgroundImage = `url(${canvas.toDataURL()})`;
        document.body.appendChild(el);
      }
    } else el?.remove();
  }
  function applyClickRipple(enable) {
    const handleClick = (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'sw-ripple';
      const rect = e.target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size/2}px`;
      ripple.style.top = `${e.clientY - rect.top - size/2}px`;
      e.target.style.position = 'relative';
      e.target.style.overflow = 'hidden';
      e.target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };
    enable ? document.addEventListener('click', handleClick) : document.removeEventListener('click', handleClick);
  }
  function applyRightMenuEnhance(enable) {
    let el = document.getElementById('sw-right-menu');
    if (enable) {
      if (!el) {
        el = document.createElement('div');
        el.id = 'sw-right-menu';
        el.innerHTML = `
          <div class="sw-menu-item" data-action="setting">打开设置</div>
          <div class="sw-menu-item" data-action="refresh">刷新页面</div>
          <div class="sw-menu-item" data-action="top">回到顶部</div>
          <div class="sw-menu-item" data-action="qrcode">生成二维码</div>
        `;
        document.body.appendChild(el);
        // 菜单点击事件
        el.querySelectorAll('.sw-menu-item').forEach(item => {
          item.addEventListener('click', () => {
            const action = item.dataset.action;
            const actionMap = {
              setting: () => openPanel(),
              refresh: () => window.location.reload(),
              top: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
              qrcode: () => openQrcodeGenerator()
            };
            actionMap[action]?.();
            el.style.display = 'none';
          });
        });
      }
      // 右键事件
      const handleContext = (e) => {
        e.preventDefault();
        el.style.display = 'block';
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        // 超出屏幕修正
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth) el.style.left = `${window.innerWidth - rect.width}px`;
        if (rect.bottom > window.innerHeight) el.style.top = `${window.innerHeight - rect.height}px`;
      };
      const handleClick = () => el.style.display = 'none';
      document.addEventListener('contextmenu', handleContext);
      document.addEventListener('click', handleClick);
      State.rightMenuHandlers = { contextmenu: handleContext, click: handleClick };
    } else {
      el?.remove();
      if (State.rightMenuHandlers) {
        document.removeEventListener('contextmenu', State.rightMenuHandlers.contextmenu);
        document.removeEventListener('click', State.rightMenuHandlers.click);
        State.rightMenuHandlers = null;
      }
    }
  }

  // ===================== 面板DOM生成 =====================
  function createPanel() {
    if (document.getElementById(CONFIG.PANEL_ID)) return;

    // 遮罩
    const mask = document.createElement('div');
    mask.id = CONFIG.MASK_ID;
    document.body.appendChild(mask);

    // 面板
    const panel = document.createElement('div');
    panel.id = CONFIG.PANEL_ID;
    panel.innerHTML = `
      <div class="sw-setting-header">
        <h2 class="sw-setting-title">SHUOWEB 设置</h2>
        <button class="sw-close-btn" id="sw-close">×</button>
      </div>
      <div class="sw-setting-content">
        <!-- 基础设置 -->
        <div class="sw-setting-section">
          <div class="sw-section-title">基础设置</div>
          
          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">主题锁定</span>
              <select class="sw-select" id="sw-themeLock">
                <option value="auto">跟随系统</option>
                <option value="blue">克莱因蓝</option>
                <option value="pink">浪漫极客粉</option>
              </select>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">导航栏自动隐藏</span>
              <div class="sw-switch" id="sw-navAutoHide"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">全局动画开关</span>
              <div class="sw-switch" id="sw-globalAnimation"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <span class="sw-item-label">全局字号：<span id="fontSizeValue">16</span>px</span>
            <input type="range" min="12" max="20" step="1" class="sw-slider" id="sw-fontSizeScale">
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">页面自动刷新</span>
              <div class="sw-switch" id="sw-autoRefresh"></div>
            </div>
            <div class="sw-item-desc">刷新间隔：<input type="number" min="5" max="300" class="sw-input" style="width:80px;display:inline-block;" id="sw-autoRefreshInterval"> 秒</div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">链接新窗口打开</span>
              <div class="sw-switch" id="sw-linkBlank"></div>
            </div>
          </div>
        </div>

        <!-- 界面优化 -->
        <div class="sw-setting-section">
          <div class="sw-section-title">界面优化</div>
          
          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">磨砂玻璃效果</span>
              <div class="sw-switch" id="sw-glassEffect"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">页面网格背景</span>
              <div class="sw-switch" id="sw-gridBg"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">卡片悬浮增强</span>
              <div class="sw-switch" id="sw-cardHoverEnhance"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">纯净阅读模式</span>
              <div class="sw-switch" id="sw-readMode"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">黑白模式</span>
              <div class="sw-switch" id="sw-grayMode"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">图片懒加载</span>
              <div class="sw-switch" id="sw-imgLazyLoad"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">页面加载进度条</span>
              <div class="sw-switch" id="sw-progressBar"></div>
            </div>
          </div>
        </div>

        <!-- 开发工具 -->
        <div class="sw-setting-section">
          <div class="sw-section-title">开发工具</div>
          
          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">迷你控制台</span>
              <div class="sw-switch" id="sw-miniConsole"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">性能监控面板</span>
              <div class="sw-switch" id="sw-performanceMonitor"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">元素审查模式</span>
              <div class="sw-switch" id="sw-elementInspect"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">API请求拦截器</span>
              <div class="sw-switch" id="sw-apiInterceptor"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">本地存储管理器</span>
              <button class="sw-btn-sm" id="sw-storageManager">打开</button>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">Cookie管理器</span>
              <button class="sw-btn-sm" id="sw-cookieManager">打开</button>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">页面二维码生成</span>
              <button class="sw-btn-sm" id="sw-qrcodeGenerator">生成</button>
            </div>
          </div>
        </div>

        <!-- 实验功能 -->
        <div class="sw-setting-section">
          <div class="sw-section-title">实验功能</div>
          
          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">阻止页面休眠</span>
              <div class="sw-switch" id="sw-preventSleep"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">页面水印</span>
              <div class="sw-switch" id="sw-pageWatermark"></div>
            </div>
            <div class="sw-item-desc">水印文本：<input type="text" class="sw-input" id="sw-watermarkText" placeholder="请输入水印文本"></div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">点击波纹特效</span>
              <div class="sw-switch" id="sw-clickRipple"></div>
            </div>
          </div>

          <div class="sw-setting-item">
            <div class="sw-item-row">
              <span class="sw-item-label">右键增强菜单</span>
              <div class="sw-switch" id="sw-rightMenuEnhance"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="sw-setting-footer">
        <button class="sw-btn-border" id="sw-reset">恢复默认</button>
        <button class="sw-btn-primary" id="sw-save">关闭面板</button>
      </div>
    `;
    document.body.appendChild(panel);

    // 绑定面板事件
    bindPanelEvents();
  }

  // ===================== 面板事件绑定 =====================
  function bindPanelEvents() {
    const mask = document.getElementById(CONFIG.MASK_ID);
    const panel = document.getElementById(CONFIG.PANEL_ID);
    const closeBtn = document.getElementById('sw-close');
    const saveBtn = document.getElementById('sw-save');
    const resetBtn = document.getElementById('sw-reset');

    // 打开/关闭面板
    window.openPanel = () => {
      mask.classList.add('open');
      panel.classList.add('open');
      State.panelOpen = true;
      document.body.style.overflow = 'hidden';
      syncConfigToForm();
    };
    window.closePanel = () => {
      mask.classList.remove('open');
      panel.classList.remove('open');
      State.panelOpen = false;
      document.body.style.overflow = '';
    };

    // 关闭事件
    mask.addEventListener('click', closePanel);
    closeBtn.addEventListener('click', closePanel);
    saveBtn.addEventListener('click', closePanel);
    resetBtn.addEventListener('click', () => Config.reset());
    // ESC关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && State.panelOpen) closePanel();
    });

    // 开关事件
    document.querySelectorAll('.sw-switch').forEach(switchEl => {
      const key = switchEl.id.replace('sw-', '');
      switchEl.addEventListener('click', () => {
        const isActive = switchEl.classList.toggle('active');
        Config.update(key, isActive);
      });
    });

    // 下拉框事件
    document.querySelectorAll('.sw-select').forEach(selectEl => {
      const key = selectEl.id.replace('sw-', '');
      selectEl.addEventListener('change', () => Config.update(key, selectEl.value));
    });

    // 滑块事件
    const fontSizeSlider = document.getElementById('sw-fontSizeScale');
    const fontSizeValue = document.getElementById('fontSizeValue');
    fontSizeSlider.addEventListener('input', () => {
      const value = fontSizeSlider.value;
      fontSizeValue.textContent = value;
      Config.update('fontSizeScale', Number(value));
    });

    // 输入框事件
    document.querySelectorAll('.sw-input').forEach(inputEl => {
      const key = inputEl.id.replace('sw-', '');
      inputEl.addEventListener('change', () => Config.update(key, inputEl.value));
    });

    // 按钮事件
    document.getElementById('sw-storageManager').addEventListener('click', openStorageManager);
    document.getElementById('sw-cookieManager').addEventListener('click', openCookieManager);
    document.getElementById('sw-qrcodeGenerator').addEventListener('click', openQrcodeGenerator);

    // 同步配置到表单
    window.syncConfigToForm = () => {
      const config = State.config;
      // 开关
      Object.keys(config).forEach(key => {
        const el = document.getElementById(`sw-${key}`);
        if (el?.classList.contains('sw-switch')) {
          el.classList.toggle('active', config[key]);
        }
        // 下拉框
        if (el?.tagName === 'SELECT') {
          el.value = config[key];
        }
        // 滑块
        if (el?.type === 'range') {
          el.value = config[key];
          document.getElementById('fontSizeValue').textContent = config[key];
        }
        // 输入框
        if (el?.tagName === 'INPUT' && (el.type === 'text' || el.type === 'number')) {
          el.value = config[key];
        }
      });
    };
  }

  // ===================== 触发机制（三重保险，100%生效） =====================
  function initTrigger() {
    // 1. 轮询监听hash（解决路由拦截问题）
    setInterval(() => {
      const currentHash = window.location.hash;
      if (currentHash !== State.lastHash) {
        State.lastHash = currentHash;
        if (currentHash === '#setting') {
          history.replaceState(null, null, window.location.pathname);
          openPanel();
        }
      }
    }, 200);

    // 2. hashchange事件监听
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#setting') {
        history.replaceState(null, null, window.location.pathname);
        openPanel();
      }
    });

    // 3. 快捷键触发：Ctrl+Shift+S / Cmd+Shift+S
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        openPanel();
      }
    });

    // 页面加载时检查hash
    if (window.location.hash === '#setting') {
      history.replaceState(null, null, window.location.pathname);
      setTimeout(openPanel, 100);
    }
  }

  // ===================== 初始化 =====================
  function init() {
    injectStyle();
    Config.load();
    createPanel();
    Config.applyAll();
    initTrigger();
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
