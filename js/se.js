/* ==============================================
   SHUOWEB 隐藏设置面板 | 触发方式：地址栏输入 #setting
   纯净无冗余版 | 适配 shuoweb.com 通用UI体系
   内置22项功能，配置自动本地缓存，无任何多余依赖
============================================== */
// 防重复加载
if (window.__SHUOWEB_SETTING_LOADED__) return;
window.__SHUOWEB_SETTING_LOADED__ = true;

// 核心配置常量
const SETTING_CONFIG = {
  STORAGE_KEY: 'shuoweb_setting_config',
  PANEL_ID: 'shuoweb-setting-panel',
  MASK_ID: 'shuoweb-setting-mask',
  // 默认配置
  DEFAULT: {
    // ========== 基础界面设置 ==========
    themeLock: 'auto',        // 主题锁定：auto/blue/pink
    navAutoHide: false,        // 导航栏自动隐藏
    globalAnimation: true,     // 全局动画开关
    fontSizeScale: 16,         // 全局基础字号(px)
    glassEffect: true,         // 磨砂玻璃效果开关
    gridBg: false,              // 页面网格背景开关
    particleEffect: false,      // 背景浮动粒子效果

    // ========== 功能增强设置 ==========
    autoRefresh: false,         // 页面自动刷新
    autoRefreshInterval: 30,    // 自动刷新间隔(秒)
    miniConsole: false,         // 页面迷你控制台
    codeHighlight: true,        // 代码块自动高亮
    linkBlank: false,           // 强制所有链接新窗口打开
    readMode: false,            // 页面阅读模式
    imgLazyLoad: true,          // 图片懒加载
    progressBar: true,          // 页面加载进度条

    // ========== 开发&实验性功能 ==========
    performanceMonitor: false,  // 页面性能监控面板
    elementInspect: false,      // 元素审查模式
    apiInterceptor: false,      // API请求拦截器
    storageManager: false,      // 本地存储管理器
    cookieManager: false,       // Cookie管理器
    pageWatermark: false,       // 页面水印
    watermarkText: 'SHUOWEB.COM', // 水印文本
    preventSleep: false,        // 阻止页面休眠
    qrcodeGenerator: false,     // 页面二维码生成器
  }
};

// 全局状态管理
const SettingState = {
  config: { ...SETTING_CONFIG.DEFAULT },
  panelVisible: false,
  refreshTimer: null,
  wakeLock: null,
  fpsMonitor: null,
  originFetch: null,
  originXHR: null,
};

// ==============================================
// 1. 样式注入：100%适配common.js主题体系，无冗余
// ==============================================
function injectSettingStyle() {
  if (document.getElementById('shuoweb-setting-style')) return;
  const style = document.createElement('style');
  style.id = 'shuoweb-setting-style';
  style.textContent = `
    /* 全局变量适配 */
    :root {
      --setting-primary: var(--primary, #007AFF);
      --setting-primary-light: var(--primary-light, #E3F2FD);
      --setting-bg: var(--bg, #F8FAFC);
      --setting-card-bg: var(--card-bg, rgba(255,255,255,0.8));
      --setting-text-main: var(--text-main, #1E293B);
      --setting-text-sub: var(--text-sub, #64748B);
      --setting-radius: var(--radius, 16px);
      --setting-transition: var(--transition, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
      --setting-shadow: var(--shadow, 0 10px 30px -10px rgba(0,0,0,0.05));
    }

    /* 遮罩层 */
    #shuoweb-setting-mask {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.3);
      backdrop-filter: blur(4px);
      z-index: 999998;
      opacity: 0;
      visibility: hidden;
      transition: var(--setting-transition);
    }
    #shuoweb-setting-mask.show {
      opacity: 1;
      visibility: visible;
    }

    /* 设置面板核心：右侧滑入侧边栏 */
    #shuoweb-setting-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 380px;
      height: 100vh;
      max-height: 100dvh;
      background: var(--setting-card-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-left: 1px solid rgba(255,255,255,0.2);
      box-shadow: -10px 0 40px rgba(0,0,0,0.15);
      z-index: 999999;
      transform: translateX(100%);
      transition: var(--setting-transition);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #shuoweb-setting-panel.show {
      transform: translateX(0);
    }

    /* 面板头部 */
    .setting-header {
      padding: 20px 20px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    .setting-title {
      font-size: 20px;
      font-weight: 800;
      color: var(--setting-text-main);
      margin: 0;
      font-family: 'Inter', -apple-system, sans-serif;
    }
    .setting-close-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: var(--setting-primary);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--setting-transition);
      flex-shrink: 0;
    }
    .setting-close-btn:hover {
      transform: scale(1.1);
      filter: brightness(1.1);
    }

    /* 面板内容区 */
    .setting-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    }
    .setting-section {
      margin-bottom: 28px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--setting-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 16px 0;
    }
    .setting-item {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .item-label {
      font-size: 14px;
      color: var(--setting-text-main);
      font-weight: 500;
    }
    .item-label .tag {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--setting-primary-light);
      color: var(--setting-primary);
      font-size: 10px;
      font-weight: 700;
      margin-left: 6px;
    }
    .item-desc {
      font-size: 12px;
      color: var(--setting-text-sub);
      line-height: 1.4;
    }

    /* 开关组件 */
    .setting-switch {
      position: relative;
      width: 44px;
      height: 24px;
      border-radius: 12px;
      background: var(--setting-text-sub);
      cursor: pointer;
      transition: var(--setting-transition);
      flex-shrink: 0;
    }
    .setting-switch.active {
      background: var(--setting-primary);
    }
    .setting-switch::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      transition: var(--setting-transition);
    }
    .setting-switch.active::after {
      left: 23px;
    }

    /* 滑块组件 */
    .setting-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: rgba(0,0,0,0.1);
      outline: none;
      -webkit-appearance: none;
      margin: 8px 0;
    }
    .setting-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--setting-primary);
      cursor: pointer;
      transition: var(--setting-transition);
    }
    .setting-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }

    /* 输入框/选择框 */
    .setting-input, .setting-select {
      width: 100%;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2);
      background: var(--setting-card-bg);
      color: var(--setting-text-main);
      font-size: 14px;
      outline: none;
      transition: var(--setting-transition);
    }
    .setting-input:focus, .setting-select:focus {
      border-color: var(--setting-primary);
      box-shadow: 0 0 0 3px var(--setting-primary-light);
    }

    /* 底部操作区 */
    .setting-footer {
      padding: 16px 20px 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }
    .setting-footer button {
      flex: 1;
      padding: 10px 0;
      border-radius: 12px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: var(--setting-transition);
    }
    .btn-primary {
      background: var(--setting-primary);
      color: #fff;
    }
    .btn-primary:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    .btn-border {
      background: transparent;
      color: var(--setting-text-main);
      border: 1px solid var(--setting-text-sub) !important;
    }
    .btn-border:hover {
      border-color: var(--setting-primary) !important;
      color: var(--setting-primary);
    }

    /* 功能模块样式 */
    .setting-float-panel {
      position: fixed;
      z-index: 99999;
      background: var(--setting-card-bg);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: var(--setting-radius);
      box-shadow: var(--setting-shadow);
      padding: 12px 16px;
      font-size: 12px;
      color: var(--setting-text-main);
    }
    #performance-monitor {
      top: 80px;
      left: 20px;
      min-width: 180px;
    }
    #mini-console {
      bottom: 20px;
      left: 20px;
      width: 320px;
      max-height: 200px;
      overflow-y: auto;
    }
    #page-watermark {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.1;
      background-repeat: repeat;
    }
    #progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: var(--setting-primary);
      z-index: 999997;
      transition: width 0.2s ease;
    }
    .inspect-hover {
      outline: 2px solid var(--setting-primary) !important;
      background: rgba(0,122,255,0.1) !important;
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
      #shuoweb-setting-panel {
        width: 100%;
        max-width: 100%;
      }
      .setting-float-panel {
        max-width: calc(100vw - 40px);
      }
      #mini-console {
        width: calc(100vw - 40px);
      }
    }

    /* 全局功能样式 */
    body.setting-no-animation * {
      transition: none !important;
      animation: none !important;
    }
    body.setting-read-mode :is(header, footer, aside, nav, .ad, .banner) {
      display: none !important;
    }
    body.setting-read-mode #content {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
  `;
  document.head.appendChild(style);
}

// ==============================================
// 2. 配置管理：本地存储读写
// ==============================================
const ConfigManager = {
  // 读取配置
  load() {
    try {
      const saved = localStorage.getItem(SETTING_CONFIG.STORAGE_KEY);
      if (saved) {
        SettingState.config = { ...SETTING_CONFIG.DEFAULT, ...JSON.parse(saved) };
      } else {
        SettingState.config = { ...SETTING_CONFIG.DEFAULT };
      }
      return SettingState.config;
    } catch (e) {
      console.warn('[SHUOWEB SETTING] 配置读取失败', e);
      SettingState.config = { ...SETTING_CONFIG.DEFAULT };
      return SettingState.config;
    }
  },

  // 保存配置
  save() {
    try {
      localStorage.setItem(SETTING_CONFIG.STORAGE_KEY, JSON.stringify(SettingState.config));
      return true;
    } catch (e) {
      console.warn('[SHUOWEB SETTING] 配置保存失败', e);
      return false;
    }
  },

  // 重置配置
  reset() {
    SettingState.config = { ...SETTING_CONFIG.DEFAULT };
    this.save();
    window.location.reload();
  },

  // 更新单个配置
  update(key, value) {
    SettingState.config[key] = value;
    this.save();
    this.applyConfig(key, value);
  },

  // 应用配置到页面
  applyConfig(key, value) {
    const applyMap = {
      // 基础界面
      themeLock: () => applyThemeLock(value),
      navAutoHide: () => applyNavAutoHide(value),
      globalAnimation: () => applyGlobalAnimation(value),
      fontSizeScale: () => applyFontSize(value),
      glassEffect: () => applyGlassEffect(value),
      gridBg: () => applyGridBg(value),
      particleEffect: () => applyParticleEffect(value),

      // 功能增强
      autoRefresh: () => applyAutoRefresh(value),
      miniConsole: () => applyMiniConsole(value),
      codeHighlight: () => applyCodeHighlight(value),
      linkBlank: () => applyLinkBlank(value),
      readMode: () => applyReadMode(value),
      imgLazyLoad: () => applyImgLazyLoad(value),
      progressBar: () => applyProgressBar(value),

      // 实验性功能
      performanceMonitor: () => applyPerformanceMonitor(value),
      elementInspect: () => applyElementInspect(value),
      apiInterceptor: () => applyApiInterceptor(value),
      storageManager: () => openStorageManager(),
      cookieManager: () => openCookieManager(),
      pageWatermark: () => applyPageWatermark(value),
      watermarkText: () => applyPageWatermark(SettingState.config.pageWatermark),
      preventSleep: () => applyPreventSleep(value),
      qrcodeGenerator: () => openQrcodeGenerator(),
    };

    if (applyMap[key]) applyMap;
  },

  // 批量应用所有配置
  applyAll() {
    Object.keys(SettingState.config).forEach(key => {
      this.applyConfig(key, SettingState.config[key]);
    });
  }
};

// ==============================================
// 3. 功能实现：22项核心功能，无任何冗余内容
// ==============================================
// ---------- 基础界面功能 ----------
// 主题锁定
function applyThemeLock(mode) {
  const body = document.body;
  body.classList.remove('pink');
  if (mode === 'pink') {
    body.classList.add('pink');
  } else if (mode === 'blue') {
    body.classList.remove('pink');
  }
}

// 导航栏自动隐藏
function applyNavAutoHide(enable) {
  const header = document.querySelector('header');
  if (!header) return;
  let lastScroll = 0;

  if (enable) {
    window.addEventListener('scroll', handleNavHide);
  } else {
    window.removeEventListener('scroll', handleNavHide);
    header.style.transform = 'translateY(0)';
  }

  function handleNavHide() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 200) {
      header.style.transform = 'translateY(-120%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  }
}

// 全局动画开关
function applyGlobalAnimation(enable) {
  document.body.classList.toggle('setting-no-animation', !enable);
}

// 全局字号缩放
function applyFontSize(size) {
  document.documentElement.style.fontSize = `${size}px`;
}

// 磨砂玻璃效果开关
function applyGlassEffect(enable) {
  if (enable) {
    document.documentElement.style.removeProperty('--backdrop-filter');
  } else {
    document.documentElement.style.setProperty('--backdrop-filter', 'none');
  }
}

// 网格背景开关
function applyGridBg(enable) {
  let gridEl = document.getElementById('setting-grid-bg');
  if (enable) {
    if (!gridEl) {
      gridEl = document.createElement('div');
      gridEl.id = 'setting-grid-bg';
      gridEl.style.cssText = `
        position: fixed; inset: 0; z-index: -1;
        background-image: linear-gradient(rgba(100,210,255,0.05) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(100,210,255,0.05) 1px, transparent 1px);
        background-size: 50px 50px;
        pointer-events: none;
      `;
      document.body.appendChild(gridEl);
    }
  } else {
    gridEl?.remove();
  }
}

// 浮动粒子效果
function applyParticleEffect(enable) {
  let particleBox = document.getElementById('setting-particle-box');
  if (enable) {
    if (!particleBox) {
      particleBox = document.createElement('div');
      particleBox.id = 'setting-particle-box';
      particleBox.style.cssText = `
        position: fixed; inset: 0; z-index: -1; pointer-events: none;
      `;
      // 生成10个浮动粒子
      for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 200 + 100;
        particle.style.cssText = `
          position: absolute;
          width: ${size}px; height: ${size}px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(100,210,255,0.1), transparent 70%);
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
          animation: setting-float ${Math.random() * 10 + 10}s ease-in-out infinite;
          animation-delay: ${Math.random() * 5}s;
        `;
        particleBox.appendChild(particle);
      }
      // 动画注入
      const style = document.createElement('style');
      style.textContent = `
        @keyframes setting-float {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(particleBox);
    }
  } else {
    particleBox?.remove();
  }
}

// ---------- 功能增强 ----------
// 页面自动刷新
function applyAutoRefresh(enable) {
  if (enable) {
    const interval = SettingState.config.autoRefreshInterval * 1000;
    SettingState.refreshTimer = setInterval(() => {
      window.location.reload();
    }, interval);
  } else {
    clearInterval(SettingState.refreshTimer);
  }
}

// 迷你控制台
function applyMiniConsole(enable) {
  let consoleEl = document.getElementById('mini-console');
  const originConsole = { ...window.console };

  if (enable) {
    if (!consoleEl) {
      consoleEl = document.createElement('div');
      consoleEl.id = 'mini-console';
      consoleEl.className = 'setting-float-panel';
      consoleEl.innerHTML = `<div style="font-weight:700; margin-bottom:8px;">迷你控制台</div>`;
      document.body.appendChild(consoleEl);
    }

    // 重写console方法
    ['log', 'warn', 'error', 'info'].forEach(type => {
      window.console[type] = (...args) => {
        originConsole[type](sslocal://flow/file_open?url=...args&flow_extra=eyJsaW5rX3R5cGUiOiJjb2RlX2ludGVycHJldGVyIn0=);
        const logItem = document.createElement('div');
        logItem.style.margin = '4px 0';
        logItem.style.wordBreak = 'break-all';
        logItem.style.color = type === 'warn' ? '#FF9500' : type === 'error' ? '#FF3B30' : 'inherit';
        logItem.textContent = `[${type}] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}`;
        consoleEl.appendChild(logItem);
        consoleEl.scrollTop = consoleEl.scrollHeight;
      };
    });
  } else {
    // 恢复原生console
    Object.assign(window.console, originConsole);
    consoleEl?.remove();
  }
}

// 代码块高亮
function applyCodeHighlight(enable) {
  if (enable) {
    const codeBlocks = document.querySelectorAll('pre code, textarea');
    codeBlocks.forEach(block => {
      block.style.fontFamily = 'Consolas, Monaco, monospace';
      block.style.tabSize = 2;
    });
  }
}

// 强制链接新窗口打开
function applyLinkBlank(enable) {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (enable) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    } else {
      if (link.getAttribute('data-origin-target')) {
        link.setAttribute('target', link.getAttribute('data-origin-target'));
      } else {
        link.removeAttribute('target');
      }
    }
  });
}

// 阅读模式
function applyReadMode(enable) {
  document.body.classList.toggle('setting-read-mode', enable);
}

// 图片懒加载
function applyImgLazyLoad(enable) {
  const imgs = document.querySelectorAll('img');
  imgs.forEach(img => {
    if (enable) {
      img.setAttribute('loading', 'lazy');
    } else {
      img.removeAttribute('loading');
    }
  });
}

// 页面加载进度条
function applyProgressBar(enable) {
  let progressEl = document.getElementById('progress-bar');
  if (enable) {
    if (!progressEl) {
      progressEl = document.createElement('div');
      progressEl.id = 'progress-bar';
      progressEl.style.width = '0%';
      document.body.appendChild(progressEl);
    }

    // 监听页面加载
    window.addEventListener('load', () => {
      progressEl.style.width = '100%';
      setTimeout(() => {
        progressEl.style.opacity = '0';
      }, 300);
    });

    // 监听资源加载
    let progress = 0;
    const timer = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 90) progress = 90;
      progressEl.style.width = `${progress}%`;
      if (document.readyState === 'complete') {
        progressEl.style.width = '100%';
        clearInterval(timer);
        setTimeout(() => {
          progressEl.style.opacity = '0';
        }, 300);
      }
    }, 200);
  } else {
    progressEl?.remove();
  }
}

// ---------- 实验性功能 ----------
// 性能监控面板
function applyPerformanceMonitor(enable) {
  let monitorEl = document.getElementById('performance-monitor');
  if (enable) {
    if (!monitorEl) {
      monitorEl = document.createElement('div');
      monitorEl.id = 'performance-monitor';
      monitorEl.className = 'setting-float-panel';
      document.body.appendChild(monitorEl);
    }

    let lastTime = performance.now();
    let frames = 0;

    function updateMonitor() {
      frames++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        const memory = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : '未知';
        const loadTime = performance.timing ? Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart) : '未知';
        
        monitorEl.innerHTML = `
          <div style="font-weight:700; margin-bottom:8px;">性能监控</div>
          <div>FPS: <strong style="color:var(--setting-primary)">${fps}</strong></div>
          <div>内存占用: <strong style="color:var(--setting-primary)">${memory} MB</strong></div>
          <div>页面加载耗时: <strong style="color:var(--setting-primary)">${loadTime} ms</strong></div>
        `;

        frames = 0;
        lastTime = now;
      }
      SettingState.fpsMonitor = requestAnimationFrame(updateMonitor);
    }
    updateMonitor();
  } else {
    cancelAnimationFrame(SettingState.fpsMonitor);
    monitorEl?.remove();
  }
}

// 元素审查模式
function applyElementInspect(enable) {
  if (enable) {
    let currentEl = null;

    function handleMouseOver(e) {
      if (currentEl) currentEl.classList.remove('inspect-hover');
      currentEl = e.target;
      currentEl.classList.add('inspect-hover');
    }

    function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      const el = e.target;
      const rect = el.getBoundingClientRect();
      alert(`
元素信息:
标签: ${el.tagName}
类名: ${el.className}
ID: ${el.id}
尺寸: ${Math.round(rect.width)} × ${Math.round(rect.height)} px
      `);
      // 关闭审查模式
      ConfigManager.update('elementInspect', false);
    }

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick, true);
    SettingState.inspectHandlers = { mouseover: handleMouseOver, click: handleClick };
  } else {
    if (SettingState.inspectHandlers) {
      document.removeEventListener('mouseover', SettingState.inspectHandlers.mouseover);
      document.removeEventListener('click', SettingState.inspectHandlers.click, true);
      document.querySelectorAll('.inspect-hover').forEach(el => el.classList.remove('inspect-hover'));
      SettingState.inspectHandlers = null;
    }
  }
}

// API请求拦截器
function applyApiInterceptor(enable) {
  if (enable) {
    // 备份原生方法
    SettingState.originFetch = window.fetch;
    SettingState.originXHR = window.XMLHttpRequest;

    // 拦截fetch
    window.fetch = async (...args) => {
      const url = args[0];
      const start = performance.now();
      console.log(`[API拦截] 请求: ${url}`);
      
      try {
        const response = await SettingState.originFetch(...args);
        const time = Math.round(performance.now() - start);
        console.log(`[API拦截] 响应: ${url} | 状态: ${response.status} | 耗时: ${time}ms`);
        return response;
      } catch (e) {
        console.error(`[API拦截] 失败: ${url} | 错误: ${e.message}`);
        throw e;
      }
    };

    // 拦截XMLHttpRequest
    window.XMLHttpRequest = class extends SettingState.originXHR {
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
        this.addEventListener('error', () => {
          console.error(`[API拦截] XHR失败: ${this._url}`);
        });
        super.send(...args);
      }
    };
  } else {
    // 恢复原生方法
    if (SettingState.originFetch) window.fetch = SettingState.originFetch;
    if (SettingState.originXHR) window.XMLHttpRequest = SettingState.originXHR;
  }
}

// 本地存储管理器
function openStorageManager() {
  const storage = { ...localStorage };
  let content = '';
  for (const [key, value] of Object.entries(storage)) {
    content += `
      <div style="margin-bottom:12px; padding:8px; border-radius:8px; background:rgba(0,0,0,0.05);">
        <div style="font-weight:700; word-break:break-all;">${key}</div>
        <div style="font-size:12px; word-break:break-all; margin-top:4px;">${value}</div>
        <button class="storage-delete-btn" data-key="${key}" style="margin-top:8px; padding:4px 8px; border-radius:4px; border:none; background:#FF3B30; color:#fff; font-size:12px; cursor:pointer;">删除</button>
      </div>
    `;
  }

  const panel = window.open('', '存储管理器', 'width=600,height=600');
  panel.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>本地存储管理器 | SHUOWEB</title>
      <style>
        body { font-family: -apple-system, sans-serif; padding:20px; background:#f5f5f5; }
        h1 { font-size:20px; margin-bottom:20px; }
      </style>
    </head>
    <body>
      <h1>本地存储管理器</h1>
      <div>${content}</div>
      <script>
        document.querySelectorAll('.storage-delete-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            localStorage.removeItem(key);
            btn.parentElement.remove();
            window.opener.alert('删除成功');
          });
        });
      </script>
    </body>
    </html>
  `);
}

// Cookie管理器
function openCookieManager() {
  const cookies = document.cookie.split(';').map(item => item.trim()).filter(Boolean);
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

  const panel = window.open('', 'Cookie管理器', 'width=600,height=600');
  panel.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cookie管理器 | SHUOWEB</title>
      <style>
        body { font-family: -apple-system, sans-serif; padding:20px; background:#f5f5f5; }
        h1 { font-size:20px; margin-bottom:20px; }
      </style>
    </head>
    <body>
      <h1>Cookie管理器</h1>
      <div>${content}</div>
    </body>
    </html>
  `);
}

// 页面水印
function applyPageWatermark(enable) {
  let watermarkEl = document.getElementById('page-watermark');
  const text = SettingState.config.watermarkText || 'SHUOWEB.COM';

  if (enable) {
    if (!watermarkEl) {
      watermarkEl = document.createElement('div');
      watermarkEl.id = 'page-watermark';
      // 生成水印canvas
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#000';
      ctx.globalAlpha = 0.3;
      ctx.translate(100, 50);
      ctx.rotate(-30 * Math.PI / 180);
      ctx.textAlign = 'center';
      ctx.fillText(text, 0, 0);
      watermarkEl.style.backgroundImage = `url(${canvas.toDataURL()})`;
      document.body.appendChild(watermarkEl);
    }
  } else {
    watermarkEl?.remove();
  }
}

// 阻止页面休眠（纯标准API实现，无音频依赖）
async function applyPreventSleep(enable) {
  if (enable) {
    if ('wakeLock' in navigator) {
      try {
        SettingState.wakeLock = await navigator.wakeLock.request('screen');
        console.log('[SHUOWEB SETTING] 已阻止页面休眠');
      } catch (e) {
        console.warn('[SHUOWEB SETTING] 阻止休眠失败', e);
        alert('当前浏览器不支持阻止休眠功能');
        ConfigManager.update('preventSleep', false);
      }
    } else {
      alert('当前浏览器不支持Wake Lock API，无法阻止休眠');
      ConfigManager.update('preventSleep', false);
    }
  } else {
    if (SettingState.wakeLock) {
      await SettingState.wakeLock.release();
      SettingState.wakeLock = null;
      console.log('[SHUOWEB SETTING] 已解除阻止休眠');
    }
  }
}

// 页面二维码生成器
function openQrcodeGenerator() {
  const currentUrl = window.location.href;
  const panel = window.open('', '页面二维码', 'width=400,height=500');
  panel.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>页面二维码 | SHUOWEB</title>
      <style>
        body { font-family: -apple-system, sans-serif; padding:20px; text-align:center; }
        h1 { font-size:20px; margin-bottom:20px; }
        .qrcode-box { margin:20px auto; width:256px; height:256px; border:1px solid #eee; }
      </style>
      <script src="https://cdn.staticfile.org/qrcodejs/1.0.0/qrcode.min.js"><\/script>
    </head>
    <body>
      <h1>当前页面二维码</h1>
      <div class="qrcode-box" id="qrcode"></div>
      <p style="word-break:break-all; color:#666;">${currentUrl}</p>
      <script>
        new QRCode(document.getElementById("qrcode"), {
          text: "${currentUrl}",
          width: 256,
          height: 256
        });
      <\/script>
    </body>
    </html>
  `);
}

// ==============================================
// 4. 面板DOM生成
// ==============================================
function createSettingPanel() {
  if (document.getElementById(SETTING_CONFIG.PANEL_ID)) return;

  // 生成遮罩
  const mask = document.createElement('div');
  mask.id = SETTING_CONFIG.MASK_ID;
  document.body.appendChild(mask);

  // 生成面板
  const panel = document.createElement('div');
  panel.id = SETTING_CONFIG.PANEL_ID;
  panel.innerHTML = `
    <div class="setting-header">
      <h2 class="setting-title">SHUOWEB 设置</h2>
      <button class="setting-close-btn" id="setting-close">×</button>
    </div>
    <div class="setting-content">
      <!-- 基础界面设置 -->
      <div class="setting-section">
        <div class="section-title">基础界面设置</div>
        
        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">主题锁定</span>
            <select class="setting-select" id="setting-themeLock">
              <option value="auto">跟随系统</option>
              <option value="blue">克莱因蓝</option>
              <option value="pink">浪漫极客粉</option>
            </select>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">导航栏自动隐藏</span>
            <div class="setting-switch" id="setting-navAutoHide"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">全局动画开关</span>
            <div class="setting-switch" id="setting-globalAnimation"></div>
          </div>
        </div>

        <div class="setting-item">
          <span class="item-label">全局基础字号：<span id="fontSizeValue">16</span>px</span>
          <input type="range" min="12" max="20" step="1" class="setting-slider" id="setting-fontSizeScale">
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">磨砂玻璃效果</span>
            <div class="setting-switch" id="setting-glassEffect"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">页面网格背景</span>
            <div class="setting-switch" id="setting-gridBg"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">背景浮动粒子</span>
            <div class="setting-switch" id="setting-particleEffect"></div>
          </div>
        </div>
      </div>

      <!-- 功能增强设置 -->
      <div class="setting-section">
        <div class="section-title">功能增强设置</div>
        
        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">页面自动刷新</span>
            <div class="setting-switch" id="setting-autoRefresh"></div>
          </div>
          <div class="item-desc">刷新间隔：<input type="number" min="5" max="300" class="setting-input" style="width:80px; display:inline-block;" id="setting-autoRefreshInterval"> 秒</div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">页面迷你控制台</span>
            <div class="setting-switch" id="setting-miniConsole"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">代码块自动高亮</span>
            <div class="setting-switch" id="setting-codeHighlight"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">强制链接新窗口打开</span>
            <div class="setting-switch" id="setting-linkBlank"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">页面阅读模式</span>
            <div class="setting-switch" id="setting-readMode"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">图片懒加载</span>
            <div class="setting-switch" id="setting-imgLazyLoad"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">页面加载进度条</span>
            <div class="setting-switch" id="setting-progressBar"></div>
          </div>
        </div>
      </div>

      <!-- 开发&实验性功能 -->
      <div class="setting-section">
        <div class="section-title">开发&实验性功能</div>
        
        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">性能监控面板</span>
            <div class="setting-switch" id="setting-performanceMonitor"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">元素审查模式</span>
            <div class="setting-switch" id="setting-elementInspect"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">API请求拦截器</span>
            <div class="setting-switch" id="setting-apiInterceptor"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">本地存储管理器</span>
            <button class="btn-border" style="padding:4px 10px; font-size:12px;" id="setting-storageManager">打开</button>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">Cookie管理器</span>
            <button class="btn-border" style="padding:4px 10px; font-size:12px;" id="setting-cookieManager">打开</button>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">页面水印</span>
            <div class="setting-switch" id="setting-pageWatermark"></div>
          </div>
          <div class="item-desc">水印文本：<input type="text" class="setting-input" id="setting-watermarkText" placeholder="请输入水印文本"></div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">阻止页面休眠</span>
            <div class="setting-switch" id="setting-preventSleep"></div>
          </div>
        </div>

        <div class="setting-item">
          <div class="item-row">
            <span class="item-label">页面二维码生成</span>
            <button class="btn-border" style="padding:4px 10px; font-size:12px;" id="setting-qrcodeGenerator">生成</button>
          </div>
        </div>
      </div>
    </div>
    <div class="setting-footer">
      <button class="btn-border" id="setting-reset">恢复默认</button>
      <button class="btn-primary" id="setting-save">保存设置</button>
    </div>
  `;
  document.body.appendChild(panel);

  // 绑定面板事件
  bindPanelEvents();
}

// ==============================================
// 5. 面板事件绑定
// ==============================================
function bindPanelEvents() {
  const mask = document.getElementById(SETTING_CONFIG.MASK_ID);
  const panel = document.getElementById(SETTING_CONFIG.PANEL_ID);
  const closeBtn = document.getElementById('setting-close');
  const saveBtn = document.getElementById('setting-save');
  const resetBtn = document.getElementById('setting-reset');

  // 关闭面板
  function closePanel() {
    mask.classList.remove('show');
    panel.classList.remove('show');
    SettingState.panelVisible = false;
  }

  // 打开面板
  function openPanel() {
    mask.classList.add('show');
    panel.classList.add('show');
    SettingState.panelVisible = true;
    // 同步配置到表单
    syncConfigToForm();
  }

  // 点击遮罩关闭
  mask.addEventListener('click', closePanel);
  closeBtn.addEventListener('click', closePanel);

  // 重置按钮
  resetBtn.addEventListener('click', () => {
    if (confirm('确定要恢复所有默认设置吗？')) {
      ConfigManager.reset();
    }
  });

  // 保存按钮
  saveBtn.addEventListener('click', () => {
    closePanel();
    alert('设置已保存');
  });

  // 开关事件绑定
  const switchList = document.querySelectorAll('.setting-switch');
  switchList.forEach(switchEl => {
    const key = switchEl.id.replace('setting-', '');
    // 点击切换
    switchEl.addEventListener('click', () => {
      const isActive = switchEl.classList.toggle('active');
      ConfigManager.update(key, isActive);
    });
  });

  // 下拉框事件绑定
  const selectList = document.querySelectorAll('.setting-select');
  selectList.forEach(selectEl => {
    const key = selectEl.id.replace('setting-', '');
    selectEl.addEventListener('change', () => {
      ConfigManager.update(key, selectEl.value);
    });
  });

  // 滑块事件绑定
  const sliderList = document.querySelectorAll('.setting-slider');
  sliderList.forEach(sliderEl => {
    const key = sliderEl.id.replace('setting-', '');
    const valueEl = document.getElementById('fontSizeValue');
    sliderEl.addEventListener('input', () => {
      const value = sliderEl.value;
      valueEl.textContent = value;
      ConfigManager.update(key, Number(value));
    });
  });

  // 输入框事件绑定
  const inputList = document.querySelectorAll('.setting-input');
  inputList.forEach(inputEl => {
    const key = inputEl.id.replace('setting-', '');
    inputEl.addEventListener('change', () => {
      ConfigManager.update(key, inputEl.value);
    });
  });

  // 按钮功能绑定
  document.getElementById('setting-storageManager').addEventListener('click', openStorageManager);
  document.getElementById('setting-cookieManager').addEventListener('click', openCookieManager);
  document.getElementById('setting-qrcodeGenerator').addEventListener('click', openQrcodeGenerator);

  // 地址栏hash监听
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#setting') {
      openPanel();
      // 清除hash，避免刷新重复触发
      history.replaceState(null, null, window.location.pathname);
    }
  });

  // 页面加载时检查hash
  if (window.location.hash === '#setting') {
    openPanel();
    history.replaceState(null, null, window.location.pathname);
  }

  // 同步配置到表单
  window.syncConfigToForm = function() {
    const config = SettingState.config;
    // 开关同步
    Object.keys(config).forEach(key => {
      const switchEl = document.getElementById(`setting-${key}`);
      if (switchEl && switchEl.classList.contains('setting-switch')) {
        switchEl.classList.toggle('active', config[key]);
      }
      // 下拉框同步
      const selectEl = document.getElementById(`setting-${key}`);
      if (selectEl && selectEl.tagName === 'SELECT') {
        selectEl.value = config[key];
      }
      // 滑块同步
      const sliderEl = document.getElementById(`setting-${key}`);
      if (sliderEl && sliderEl.tagName === 'INPUT' && sliderEl.type === 'range') {
        sliderEl.value = config[key];
        document.getElementById('fontSizeValue').textContent = config[key];
      }
      // 输入框同步
      const inputEl = document.getElementById(`setting-${key}`);
      if (inputEl && inputEl.tagName === 'INPUT' && (inputEl.type === 'text' || inputEl.type === 'number')) {
        inputEl.value = config[key];
      }
    });
  };
}

// ==============================================
// 6. 初始化
// ==============================================
function initSetting() {
  // 注入样式
  injectSettingStyle();
  // 加载配置
  ConfigManager.load();
  // 生成面板
  createSettingPanel();
  // 应用所有配置
  ConfigManager.applyAll();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSetting);
} else {
  initSetting();
}
