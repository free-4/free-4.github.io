(function () {
    /* ========= 防重复加载 ========= */
    if (window.__SHUOWEB_SETTINGS_PRO__) return;
    window.__SHUOWEB_SETTINGS_PRO__ = true;

    function ready(fn) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
        else fn();
    }
    ready(initSettings);

    /* ================= 分类定义 ================= */
    const CATEGORIES = [
        { id: 'all',        label: '全部' },
        { id: 'appearance', label: '外观' },
        { id: 'experience', label: '体验' },
        { id: 'debug',      label: '调试' },
    ];

    /* ================= 核心配置数据 ================= */
    const settingsOptions = [

        /* ── 体验 ── */
        {
            id: 'opt-immersive', category: 'experience',
            name: '沉浸浏览模式', desc: '隐藏导航与页脚，专注内容阅读',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>`
        },
        {
            id: 'opt-progress', category: 'experience',
            name: '阅读进度指示器', desc: '在页面顶部显示实时滚动阅读进度条',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0
                012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0
                012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`
        },
        {
            id: 'opt-totop', category: 'experience',
            name: '快速回顶按钮', desc: '页面右下角显示悬浮回到顶部的快捷按钮',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 15l7-7 7 7"/>`
        },
        {
            id: 'opt-extlink', category: 'experience',
            name: '外链新标签拦截', desc: '自动将页面所有外部链接在新标签中安全打开',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>`
        },
        {
            id: 'opt-termux', category: 'experience',
            name: 'Termux 终端环境', desc: '全局等宽字体，适配移动端代码阅读与编译',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`
        },
        {
            id: 'opt-noscroll', category: 'experience',
            name: '平滑滚动增强', desc: '为页面注入原生级丝滑平滑滚动动效',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>`
        },

        /* ── 外观 ── */
        {
            id: 'opt-darkmode', category: 'appearance',
            name: '暗色夜间模式', desc: '切换至暗黑主题，减少蓝光保护双眼',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>`
        },
        {
            id: 'opt-m3', category: 'appearance',
            name: 'Material Design 3 引擎', desc: '切换至 Google M3 圆角与扁平化投影逻辑',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14
                0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>`
        },
        {
            id: 'opt-grayscale', category: 'appearance',
            name: '页面灰度模式', desc: '将整个页面渲染为灰阶，适合纪念日或专注场景',
            type: 'switch',
            icon: `<circle cx="12" cy="12" r="9" stroke-width="2"/>
                <path stroke-linecap="round" stroke-width="2" d="M12 3v18"/>`
        },
        {
            id: 'opt-highlight', category: 'appearance',
            name: '鼠标光晕跟随', desc: '为鼠标指针添加柔光光晕，增强视觉沉浸感',
            type: 'switch',
            icon: `<circle cx="12" cy="12" r="3" stroke-width="2"/>
                <path stroke-linecap="round" stroke-width="2"
                d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3
                M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>`
        },
        {
            id: 'opt-fontsize', category: 'appearance',
            name: '全局字体缩放', desc: '当前: 100%（标准阅读）',
            type: 'range', min: '80', max: '140', step: '10', value: '100',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 7V4h16v3M9 20h6M12 4v16"/>`
        },

        /* ── 调试 ── */
        {
            id: 'opt-fps', category: 'debug',
            name: '实时性能监控', desc: '在屏幕右上角显示 FPS / DOM 数量 / 内存占用',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"/>`
        },
        {
            id: 'opt-debug', category: 'debug',
            name: '前端布局调试网格', desc: '显示所有 DOM 元素的边界，辅助页面开发',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0
                012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0
                012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2
                0 01-2 2h-2a2 2 0 01-2-2v-2z"/>`
        },
        {
            id: 'opt-noemoji', category: 'debug',
            name: '严格极简 (Emoji 净化)', desc: '全局拦截并移除系统自带 Emoji，仅保留纯净 SVG',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728
                12.728L5.636 5.636"/>`
        },
        {
            id: 'opt-speed', category: 'debug',
            name: 'UI 物理回弹速率', desc: '当前: 1.0x（阻尼优化）',
            type: 'range', min: '0', max: '2', step: '0.5', value: '1',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0
                4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>`
        },
    ];

    function initSettings() {
        injectStyle();
        createDOM();
        bindEvents();
        loadData();
    }

    /* ================= 1. 注入样式 ================= */
    function injectStyle() {
        if (document.getElementById("shuoweb-settings-style-pro")) return;
        const style = document.createElement("style");
        style.id = "shuoweb-settings-style-pro";
        style.textContent = `
            /* ── 遮罩与面板 ── */
            .shuo-settings-mask {
                position: fixed; inset: 0; z-index: 99999;
                background: rgba(15, 23, 42, 0.4);
                backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                display: flex; justify-content: center; align-items: center;
                opacity: 0; pointer-events: none;
                transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .shuo-settings-mask.active { opacity: 1; pointer-events: auto; }

            .shuo-settings-panel {
                width: 92%; max-width: 520px; max-height: 88vh;
                background: var(--bg, #ffffff);
                border-radius: 28px; padding: 24px 24px 20px;
                box-shadow: 0 40px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.6);
                transform: translateY(50px) scale(0.92);
                transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                display: flex; flex-direction: column; overflow: hidden;
            }
            .shuo-settings-mask.active .shuo-settings-panel { transform: translateY(0) scale(1); }

            /* ── 头部 ── */
            .shuo-settings-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 16px; padding: 0 6px 16px;
                border-bottom: 1px solid rgba(0,0,0,0.06);
            }
            .shuo-settings-title {
                font-size: 21px; font-weight: 800; color: var(--text-main, #1c1c1e);
                margin: 0; display: flex; align-items: center; gap: 10px; letter-spacing: -0.5px;
            }
            .shuo-settings-title svg { width: 24px; height: 24px; color: var(--primary, #007AFF); }
            .shuo-close-btn {
                width: 36px; height: 36px; border-radius: 50%;
                background: var(--primary-light, #EBF4FF); color: var(--primary, #007AFF);
                display: flex; justify-content: center; align-items: center;
                cursor: pointer; transition: all 0.3s ease;
            }
            .shuo-close-btn:hover { transform: rotate(90deg); background: var(--primary, #007AFF); color: #fff; }

            /* ── Tab 导航 ── */
            .shuo-tab-nav {
                display: flex; gap: 8px; margin-bottom: 14px; overflow-x: auto;
                scrollbar-width: none; padding: 0 2px 4px;
            }
            .shuo-tab-nav::-webkit-scrollbar { display: none; }
            .shuo-tab-btn {
                padding: 6px 18px; border-radius: 20px; white-space: nowrap;
                border: 1.5px solid rgba(0,0,0,0.07); font-size: 13px; font-weight: 600;
                background: var(--card-bg, #f2f2f7); color: var(--text-sub, #8e8e93);
                cursor: pointer; transition: all 0.25s ease; line-height: 1.6;
            }
            .shuo-tab-btn.active {
                background: var(--primary, #007AFF); color: #fff;
                border-color: var(--primary, #007AFF);
                box-shadow: 0 4px 14px rgba(0,122,255,0.28);
            }
            .shuo-tab-btn:not(.active):hover {
                border-color: var(--primary, #007AFF); color: var(--primary, #007AFF);
            }

            /* ── 搜索框 ── */
            .shuo-search-wrap {
                position: relative; margin-bottom: 14px; padding: 0 2px;
            }
            .shuo-search-icon {
                position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
                width: 16px; height: 16px; color: var(--text-sub, #8e8e93); pointer-events: none;
            }
            .shuo-search-input {
                width: 100%; box-sizing: border-box; padding: 10px 14px 10px 36px;
                border-radius: 14px; border: 1.5px solid rgba(0,0,0,0.07);
                background: var(--card-bg, #f2f2f7); color: var(--text-main, #1c1c1e);
                font-size: 13px; outline: none; transition: all 0.25s ease;
            }
            .shuo-search-input:focus {
                border-color: var(--primary, #007AFF);
                box-shadow: 0 0 0 3px rgba(0,122,255,0.1);
            }

            /* ── 滚动区 ── */
            .shuo-settings-body {
                overflow-y: auto; overflow-x: hidden;
                padding: 2px 2px 16px; display: flex; flex-direction: column; gap: 10px;
                scrollbar-width: none; -webkit-overflow-scrolling: touch;
            }
            .shuo-settings-body::-webkit-scrollbar { display: none; }

            /* ── 分组标签 ── */
            .shuo-cat-label {
                font-size: 11px; font-weight: 800; color: var(--text-sub, #8e8e93);
                text-transform: uppercase; letter-spacing: 1.4px;
                padding: 6px 4px 2px; opacity: 0.5;
                display: flex; align-items: center; gap: 8px;
            }
            .shuo-cat-label::after {
                content: ''; flex: 1; height: 1px; background: currentColor; opacity: 0.3;
            }

            /* ── 设置卡片 ── */
            .shuo-setting-item {
                display: flex; align-items: center; gap: 14px;
                padding: 15px; background: var(--card-bg, #f2f2f7);
                border-radius: 20px; border: 1px solid rgba(255,255,255,0.5);
                box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .shuo-setting-item:hover {
                transform: translateX(4px); border-color: var(--primary-light, #EBF4FF);
                box-shadow: 0 6px 20px rgba(0,0,0,0.06);
            }
            .shuo-setting-item.shuo-hidden { display: none !important; }

            .shuo-setting-icon {
                width: 42px; height: 42px; border-radius: 12px;
                background: var(--primary-light, #EBF4FF); color: var(--primary, #007AFF);
                display: flex; justify-content: center; align-items: center; flex-shrink: 0;
            }
            .shuo-setting-icon svg { width: 21px; height: 21px; fill: none; stroke: currentColor; }
            .shuo-setting-info { flex-grow: 1; min-width: 0; }
            .shuo-setting-name {
                font-size: 14.5px; font-weight: 700; color: var(--text-main, #1c1c1e); margin-bottom: 2px;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .shuo-setting-desc { font-size: 11.5px; color: var(--text-sub, #8e8e93); line-height: 1.4; opacity: 0.85; }

            /* ── iOS Switch ── */
            .shuo-switch {
                appearance: none; -webkit-appearance: none;
                width: 50px; height: 28px; background: rgba(0,0,0,0.1);
                border-radius: 30px; position: relative; cursor: pointer; outline: none;
                transition: background 0.3s ease; flex-shrink: 0;
            }
            .shuo-switch::after {
                content: ''; position: absolute; top: 2px; left: 2px;
                width: 24px; height: 24px; background: #fff; border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .shuo-switch:checked { background: var(--primary, #007AFF); }
            .shuo-switch:checked::after { transform: translateX(22px); }

            /* ── Range ── */
            .shuo-range-container { width: 100px; flex-shrink: 0; }
            .shuo-range {
                -webkit-appearance: none; width: 100%; height: 6px;
                background: var(--primary-light, #EBF4FF); border-radius: 6px; outline: none;
            }
            .shuo-range::-webkit-slider-thumb {
                -webkit-appearance: none; appearance: none;
                width: 18px; height: 18px; border-radius: 50%;
                background: var(--primary, #007AFF); cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: transform 0.2s;
            }
            .shuo-range::-webkit-slider-thumb:active { transform: scale(1.3); }

            /* ── Footer 2×2 ── */
            .shuo-settings-footer {
                display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
                padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.06);
            }
            .shuo-btn {
                padding: 11px 8px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05);
                font-size: 13px; font-weight: 700; cursor: pointer;
                transition: all 0.3s ease; background: var(--card-bg, #f2f2f7);
                color: var(--text-main, #1c1c1e);
                box-shadow: 0 3px 8px rgba(0,0,0,0.03);
                display: flex; align-items: center; justify-content: center; gap: 6px;
            }
            .shuo-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
            .shuo-btn:active { transform: translateY(0); }
            .shuo-btn svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2.2; flex-shrink: 0; }
            .shuo-btn.primary { background: var(--primary, #007AFF); color: #fff; border: none; box-shadow: 0 4px 14px rgba(0,122,255,0.3); }
            .shuo-btn.success { background: #F0FFF6; color: #30D158; border-color: rgba(48,209,88,0.15); }
            .shuo-btn.warning { background: #FFFBF0; color: #FF9F0A; border-color: rgba(255,159,10,0.15); }
            .shuo-btn.danger  { background: #FFF0F3; color: #FF2D55; border-color: rgba(255,45,85,0.15); }

            /* ── Toast ── */
            .shuo-toast {
                position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px);
                background: rgba(28,28,30,0.9); color: #fff; padding: 10px 20px;
                border-radius: 24px; font-size: 13.5px; font-weight: 600;
                backdrop-filter: blur(10px); z-index: 999999999;
                opacity: 0; pointer-events: none; transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
                white-space: nowrap;
            }
            .shuo-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

            /* ── 动态功能类 ── */
            body.immersive-mode header,
            body.immersive-mode nav,
            body.immersive-mode footer {
                opacity: 0 !important; pointer-events: none !important; transform: translateY(-100%) !important;
            }
            body.termux-mode { font-family: 'Courier New', Consolas, 'SF Mono', monospace !important; }
            body.m3-mode { --radius: 28px !important; --shadow: 0 2px 6px rgba(0,0,0,0.08) !important; }
            body.debug-mode * { outline: 1px dashed rgba(0,122,255,0.35) !important; }
            html.shuo-smooth * { scroll-behavior: smooth !important; }

            /* 暗色模式 */
            html.shuo-dark { filter: invert(1) hue-rotate(180deg); }
            html.shuo-dark img,
            html.shuo-dark video,
            html.shuo-dark canvas,
            html.shuo-dark [style*="background-image"] { filter: invert(1) hue-rotate(180deg); }
            html.shuo-dark #shuoweb-settings-mask,
            html.shuo-dark #shuo-fps-monitor,
            html.shuo-dark #shuo-progress-bar,
            html.shuo-dark #shuo-totop-btn,
            html.shuo-dark .shuo-toast { filter: invert(1) hue-rotate(180deg); }

            /* 灰度模式 */
            html.shuo-grayscale { filter: grayscale(1); }
            html.shuo-dark.shuo-grayscale { filter: invert(1) hue-rotate(180deg) grayscale(1); }
            html.shuo-dark.shuo-grayscale #shuoweb-settings-mask,
            html.shuo-dark.shuo-grayscale #shuo-fps-monitor { filter: invert(1) hue-rotate(180deg) grayscale(1); }

            /* ── FPS 悬浮窗 ── */
            #shuo-fps-monitor {
                position: fixed; top: 15px; right: 15px; z-index: 99998;
                background: rgba(0,0,0,0.88); color: #0f0; font-family: 'SF Mono', Consolas, monospace;
                padding: 8px 14px; border-radius: 12px; font-size: 11.5px; font-weight: 600;
                pointer-events: none; display: none; line-height: 1.75;
                box-shadow: 0 4px 16px rgba(0,0,0,0.35); border: 1px solid rgba(0,255,0,0.25);
            }
            body.fps-mode #shuo-fps-monitor { display: block; }

            /* ── 阅读进度条 ── */
            #shuo-progress-bar {
                position: fixed; top: 0; left: 0; z-index: 999999;
                height: 3px; width: 0%;
                background: linear-gradient(90deg, var(--primary, #007AFF) 0%, #5856D6 60%, #AF52DE 100%);
                border-radius: 0 3px 3px 0;
                box-shadow: 0 0 12px var(--primary, #007AFF);
                transition: width 0.12s linear; display: none; pointer-events: none;
            }
            body.progress-mode #shuo-progress-bar { display: block; }

            /* ── 回顶按钮 ── */
            #shuo-totop-btn {
                position: fixed; bottom: 88px; right: 20px; z-index: 99997;
                width: 46px; height: 46px; border-radius: 50%;
                background: var(--primary, #007AFF); color: #fff; border: none;
                display: none; justify-content: center; align-items: center;
                cursor: pointer; box-shadow: 0 4px 16px rgba(0,122,255,0.4);
                opacity: 0; transform: translateY(16px) scale(0.8);
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            #shuo-totop-btn svg { width: 22px; height: 22px; fill: none; stroke: #fff; stroke-width: 2.5; stroke-linecap: round; }
            body.totop-mode #shuo-totop-btn { display: flex; }
            #shuo-totop-btn.visible { opacity: 1; transform: translateY(0) scale(1); }
            #shuo-totop-btn:hover { transform: scale(1.12) !important; box-shadow: 0 8px 28px rgba(0,122,255,0.55); }

            /* ── 鼠标光晕 ── */
            #shuo-cursor-glow {
                position: fixed; width: 300px; height: 300px; border-radius: 50%;
                background: radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%);
                pointer-events: none; z-index: 99990; transform: translate(-50%, -50%);
                transition: left 0.08s ease-out, top 0.08s ease-out;
                display: none;
            }
            body.highlight-mode #shuo-cursor-glow { display: block; }
        `;
        document.head.appendChild(style);
    }

    /* ================= 2. 构建 DOM ================= */
    function createDOM() {
        const mask = document.createElement('div');
        mask.className = 'shuo-settings-mask';
        mask.id = 'shuoweb-settings-mask';

        /* Tab 导航 */
        let tabHTML = `<div class="shuo-tab-nav" id="shuo-tab-nav">`;
        CATEGORIES.forEach((cat, i) => {
            tabHTML += `<button class="shuo-tab-btn${i === 0 ? ' active' : ''}" data-cat="${cat.id}">${cat.label}</button>`;
        });
        tabHTML += `</div>`;

        /* 搜索框 */
        const searchHTML = `
            <div class="shuo-search-wrap">
                <svg class="shuo-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-3.5-3.5"/>
                </svg>
                <input class="shuo-search-input" id="shuo-search" type="text" placeholder="搜索功能…" autocomplete="off">
            </div>`;

        /* 按分类分组构建设置项 */
        let listHTML = '';
        CATEGORIES.slice(1).forEach(cat => {
            const items = settingsOptions.filter(o => o.category === cat.id);
            if (!items.length) return;
            listHTML += `<div class="shuo-cat-label" data-label="${cat.id}">${cat.label}</div>`;
            items.forEach(opt => {
                const control = opt.type === 'switch'
                    ? `<input type="checkbox" class="shuo-switch" id="${opt.id}">`
                    : `<div class="shuo-range-container">
                           <input type="range" class="shuo-range" id="${opt.id}"
                               min="${opt.min}" max="${opt.max}" step="${opt.step}" value="${opt.value}">
                       </div>`;
                listHTML += `
                    <div class="shuo-setting-item" data-cat="${opt.category}" data-name="${opt.name}">
                        <div class="shuo-setting-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${opt.icon}</svg>
                        </div>
                        <div class="shuo-setting-info">
                            <div class="shuo-setting-name">${opt.name}</div>
                            <div class="shuo-setting-desc" id="desc-${opt.id}">${opt.desc}</div>
                        </div>
                        ${control}
                    </div>`;
            });
        });

        /* 按钮 SVG 简写 */
        const svgShare   = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>`;
        const svgExport  = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`;
        const svgImport  = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>`;
        const svgTrash   = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`;

        mask.innerHTML = `
            <div class="shuo-settings-panel" id="shuoweb-settings-panel">
                <div class="shuo-settings-header">
                    <h3 class="shuo-settings-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0
                                002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0
                                001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0
                                00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0
                                00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0
                                00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0
                                00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0
                                001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        Engineers Pro
                    </h3>
                    <div class="shuo-close-btn" id="shuo-close-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor"
                            stroke-width="2.5" fill="none">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </div>
                </div>
                ${tabHTML}
                ${searchHTML}
                <div class="shuo-settings-body" id="shuo-settings-body">
                    ${listHTML}
                </div>
                <div class="shuo-settings-footer">
                    <button class="shuo-btn primary" id="btn-copy-url">${svgShare} 分享入口</button>
                    <button class="shuo-btn success"  id="btn-export">${svgExport} 导出配置</button>
                    <button class="shuo-btn warning"  id="btn-import">${svgImport} 导入配置</button>
                    <button class="shuo-btn danger"   id="btn-clear-data">${svgTrash} 重置引擎</button>
                </div>
            </div>
        `;
        document.body.appendChild(mask);

        /* ── 附加 DOM 元素 ── */
        const fpsDiv = document.createElement('div');
        fpsDiv.id = 'shuo-fps-monitor';
        document.body.appendChild(fpsDiv);

        const progressBar = document.createElement('div');
        progressBar.id = 'shuo-progress-bar';
        document.body.appendChild(progressBar);

        const totopBtn = document.createElement('button');
        totopBtn.id = 'shuo-totop-btn';
        totopBtn.setAttribute('aria-label', '回到顶部');
        totopBtn.innerHTML = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 15l7-7 7 7"/></svg>`;
        document.body.appendChild(totopBtn);

        const glowDiv = document.createElement('div');
        glowDiv.id = 'shuo-cursor-glow';
        document.body.appendChild(glowDiv);

        const toast = document.createElement('div');
        toast.className = 'shuo-toast';
        toast.id = 'shuo-toast';
        document.body.appendChild(toast);

        const importInput = document.createElement('input');
        importInput.type = 'file'; importInput.id = 'shuo-import-input';
        importInput.accept = '.json'; importInput.style.display = 'none';
        document.body.appendChild(importInput);
    }

    /* ================= 3. 功能实现 ================= */

    /* Toast 工具 */
    let toastTimer;
    function showToast(msg) {
        const t = document.getElementById('shuo-toast');
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
    }

    /* FPS 监控 */
    let fpsLoopId;
    function toggleFPS(on) {
        const el = document.getElementById('shuo-fps-monitor');
        if (on) {
            let last = performance.now(), frames = 0;
            const loop = () => {
                const now = performance.now();
                frames++;
                if (now >= last + 1000) {
                    const fps = Math.round((frames * 1000) / (now - last));
                    const dom = document.getElementsByTagName('*').length;
                    const mem = (performance.memory)
                        ? `MEM: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(1)}MB`
                        : '';
                    el.innerHTML = `FPS: ${fps}<br>DOM: ${dom}${mem ? '<br>' + mem : ''}`;
                    el.style.color = fps < 30 ? '#ff3b30' : fps < 50 ? '#ffcc00' : '#34c759';
                    el.style.borderColor = el.style.color;
                    frames = 0; last = now;
                }
                fpsLoopId = requestAnimationFrame(loop);
            };
            fpsLoopId = requestAnimationFrame(loop);
        } else {
            cancelAnimationFrame(fpsLoopId);
            el.innerHTML = '';
        }
    }

    /* Emoji 净化 */
    let emojiObserver = null;
    function toggleEmojiPurifier(on) {
        const re = /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g;
        const purify = (node) => {
            if (node.nodeType === 3) {
                if (re.test(node.nodeValue)) node.nodeValue = node.nodeValue.replace(re, '');
            } else if (node.nodeType === 1 && node.childNodes) {
                if (node.id === 'shuoweb-settings-mask' || node.tagName?.toLowerCase() === 'svg') return;
                node.childNodes.forEach(purify);
            }
        };
        if (on) {
            purify(document.body);
            emojiObserver = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(purify)));
            emojiObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
        } else {
            if (emojiObserver) { emojiObserver.disconnect(); emojiObserver = null; }
            if (confirm('Emoji 已解除拦截。是否刷新页面以恢复原始显示？')) location.reload();
        }
    }

    /* 阅读进度条 */
    let progressH = null;
    function toggleProgress(on) {
        const bar = document.getElementById('shuo-progress-bar');
        if (on) {
            progressH = () => {
                const h = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
            };
            window.addEventListener('scroll', progressH, { passive: true });
            progressH();
        } else {
            if (progressH) window.removeEventListener('scroll', progressH);
            progressH = null; bar.style.width = '0%';
        }
    }

    /* 回顶按钮 */
    let totopH = null;
    function toggleTotop(on) {
        const btn = document.getElementById('shuo-totop-btn');
        if (on) {
            totopH = () => btn.classList.toggle('visible', window.scrollY > 300);
            window.addEventListener('scroll', totopH, { passive: true });
            btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
            totopH();
        } else {
            if (totopH) window.removeEventListener('scroll', totopH);
            totopH = null; btn.classList.remove('visible');
        }
    }

    /* 外链拦截 */
    let extH = null;
    function toggleExtLink(on) {
        if (on) {
            extH = (e) => {
                const a = e.target.closest('a');
                if (a && a.href && !a.href.startsWith(location.origin) && !/^(#|javascript)/.test(a.getAttribute('href') || '')) {
                    a.target = '_blank'; a.rel = 'noopener noreferrer';
                }
            };
            document.addEventListener('click', extH, true);
            document.querySelectorAll(`a[href]:not([href^="#"]):not([href^="javascript"])`).forEach(a => {
                try { if (new URL(a.href).origin !== location.origin) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } } catch {}
            });
        } else {
            if (extH) document.removeEventListener('click', extH, true);
            extH = null;
        }
    }

    /* 暗色模式 */
    function toggleDarkMode(on) {
        document.documentElement.classList.toggle('shuo-dark', on);
    }

    /* 灰度模式 */
    function toggleGrayscale(on) {
        document.documentElement.classList.toggle('shuo-grayscale', on);
    }

    /* 平滑滚动 */
    function toggleSmoothScroll(on) {
        document.documentElement.classList.toggle('shuo-smooth', on);
    }

    /* 鼠标光晕 */
    let glowH = null;
    function toggleHighlight(on) {
        const glow = document.getElementById('shuo-cursor-glow');
        if (on) {
            glowH = (e) => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; };
            window.addEventListener('mousemove', glowH, { passive: true });
        } else {
            if (glowH) window.removeEventListener('mousemove', glowH);
            glowH = null;
        }
    }

    /* ================= 4. 事件绑定 ================= */
    function bindEvents() {
        const mask = document.getElementById('shuoweb-settings-mask');
        const closeBtn = document.getElementById('shuo-close-btn');

        window.addEventListener('hashchange', checkHash);
        closeBtn.addEventListener('click', closeSettings);
        mask.addEventListener('click', e => { if (e.target === mask) closeSettings(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSettings(); });

        /* Tab 切换 */
        document.getElementById('shuo-tab-nav').addEventListener('click', e => {
            const btn = e.target.closest('.shuo-tab-btn');
            if (!btn) return;
            document.querySelectorAll('.shuo-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.cat;
            filterItems(cat, document.getElementById('shuo-search').value);
        });

        /* 搜索框 */
        document.getElementById('shuo-search').addEventListener('input', e => {
            const activeCat = document.querySelector('.shuo-tab-btn.active')?.dataset.cat || 'all';
            filterItems(activeCat, e.target.value);
        });

        /* Switch 绑定工厂 */
        const bindSwitch = (id, cls, cb) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('change', e => {
                const v = e.target.checked;
                if (cls) document.body.classList.toggle(cls, v);
                localStorage.setItem(`shuo_${id}`, v);
                if (cb) cb(v);
            });
        };

        bindSwitch('opt-immersive', 'immersive-mode');
        bindSwitch('opt-termux',   'termux-mode');
        bindSwitch('opt-m3',       'm3-mode');
        bindSwitch('opt-debug',    'debug-mode');
        bindSwitch('opt-fps',      'fps-mode', toggleFPS);
        bindSwitch('opt-noemoji',  '', toggleEmojiPurifier);
        bindSwitch('opt-progress', 'progress-mode', toggleProgress);
        bindSwitch('opt-totop',    'totop-mode', toggleTotop);
        bindSwitch('opt-extlink',  '', toggleExtLink);
        bindSwitch('opt-darkmode', '', toggleDarkMode);
        bindSwitch('opt-grayscale','', toggleGrayscale);
        bindSwitch('opt-noscroll', '', toggleSmoothScroll);
        bindSwitch('opt-highlight','highlight-mode', toggleHighlight);

        /* 动画速率 */
        const speedEl = document.getElementById('opt-speed');
        const speedDesc = document.getElementById('desc-opt-speed');
        speedEl.addEventListener('input', e => {
            const v = parseFloat(e.target.value);
            const map = { 0: '0s', 0.5: '0.6s', 1: '0.3s', 1.5: '0.15s', 2: '0.05s' };
            document.documentElement.style.setProperty('--transition',
                `all ${map[v] ?? '0.3s'} cubic-bezier(0.4, 0, 0.2, 1)`);
            speedDesc.textContent = v === 0 ? '已禁用全局动画' : `当前: ${v}x 阻尼`;
            localStorage.setItem('shuo_opt_speed', v);
        });

        /* 字体缩放 */
        const fontEl = document.getElementById('opt-fontsize');
        const fontDesc = document.getElementById('desc-opt-fontsize');
        fontEl.addEventListener('input', e => {
            const v = parseInt(e.target.value);
            document.documentElement.style.fontSize = v + '%';
            const label = v === 100 ? '标准' : v < 100 ? '缩小' : '放大';
            fontDesc.textContent = `当前: ${v}%（${label}）`;
            localStorage.setItem('shuo_opt_fontsize', v);
        });

        /* 分享入口 */
        document.getElementById('btn-copy-url').addEventListener('click', () => {
            navigator.clipboard.writeText(location.origin + location.pathname + '#setting')
                .then(() => showToast('✓ 入口链接已复制'))
                .catch(() => showToast('复制失败，请手动复制地址栏'));
        });

        /* 导出配置 */
        document.getElementById('btn-export').addEventListener('click', () => {
            const cfg = {};
            Object.keys(localStorage).filter(k => k.startsWith('shuo_'))
                .forEach(k => { cfg[k] = localStorage.getItem(k); });
            const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = Object.assign(document.createElement('a'), {
                href: url, download: `engineers-pro-${Date.now()}.json`
            });
            a.click(); URL.revokeObjectURL(url);
            showToast('✓ 配置已导出');
        });

        /* 导入配置 */
        document.getElementById('btn-import').addEventListener('click', () => {
            document.getElementById('shuo-import-input').click();
        });
        document.getElementById('shuo-import-input').addEventListener('change', function () {
            const file = this.files[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const cfg = JSON.parse(e.target.result);
                    Object.entries(cfg).forEach(([k, v]) => {
                        if (k.startsWith('shuo_')) localStorage.setItem(k, v);
                    });
                    if (confirm('✓ 配置导入成功！刷新页面以应用所有设置？')) location.reload();
                } catch { showToast('❌ 文件格式错误，请检查 JSON'); }
            };
            reader.readAsText(file);
            this.value = '';
        });

        /* 重置引擎 */
        document.getElementById('btn-clear-data').addEventListener('click', () => {
            if (confirm('确认清空所有开发者配置缓存？此操作不可撤销。')) {
                Object.keys(localStorage).filter(k => k.startsWith('shuo_'))
                    .forEach(k => localStorage.removeItem(k));
                location.href = location.pathname;
            }
        });
    }

    /* ── Tab + 搜索联合过滤 ── */
    function filterItems(cat, query) {
        const q = (query || '').trim().toLowerCase();
        const body = document.getElementById('shuo-settings-body');
        body.querySelectorAll('.shuo-setting-item').forEach(item => {
            const catMatch = cat === 'all' || item.dataset.cat === cat;
            const nameMatch = !q || item.dataset.name.toLowerCase().includes(q);
            item.classList.toggle('shuo-hidden', !catMatch || !nameMatch);
        });
        body.querySelectorAll('.shuo-cat-label').forEach(label => {
            const labelCat = label.dataset.label;
            const catShow = cat === 'all' || cat === labelCat;
            /* 如果该分组下的所有项都被隐藏，也隐藏标签 */
            const hasVisible = [...body.querySelectorAll(`.shuo-setting-item[data-cat="${labelCat}"]`)]
                .some(el => !el.classList.contains('shuo-hidden'));
            label.style.display = (catShow && hasVisible) ? '' : 'none';
        });
    }

    /* ================= 5. 数据恢复 ================= */
    function checkHash() {
        const mask = document.getElementById('shuoweb-settings-mask');
        if (window.location.hash === '#setting') {
            mask.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mask.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function closeSettings() {
        history.replaceState(null, null, location.pathname + location.search);
        checkHash();
    }

    function loadData() {
        const applySwitch = (id, cls, cb) => {
            const el = document.getElementById(id); if (!el) return;
            const v = localStorage.getItem(`shuo_${id}`) === 'true';
            el.checked = v;
            if (v) { if (cls) document.body.classList.add(cls); if (cb) cb(true); }
        };

        applySwitch('opt-immersive', 'immersive-mode');
        applySwitch('opt-termux',    'termux-mode');
        applySwitch('opt-m3',        'm3-mode');
        applySwitch('opt-debug',     'debug-mode');
        applySwitch('opt-fps',       'fps-mode', toggleFPS);
        applySwitch('opt-noemoji',   '', toggleEmojiPurifier);
        applySwitch('opt-progress',  'progress-mode', toggleProgress);
        applySwitch('opt-totop',     'totop-mode', toggleTotop);
        applySwitch('opt-extlink',   '', toggleExtLink);
        applySwitch('opt-darkmode',  '', toggleDarkMode);
        applySwitch('opt-grayscale', '', toggleGrayscale);
        applySwitch('opt-noscroll',  '', toggleSmoothScroll);
        applySwitch('opt-highlight', 'highlight-mode', toggleHighlight);

        const speedVal = localStorage.getItem('shuo_opt_speed');
        if (speedVal !== null) {
            const el = document.getElementById('opt-speed');
            el.value = speedVal; el.dispatchEvent(new Event('input'));
        }

        const fontVal = localStorage.getItem('shuo_opt_fontsize');
        if (fontVal !== null) {
            const el = document.getElementById('opt-fontsize');
            el.value = fontVal; el.dispatchEvent(new Event('input'));
        }

        checkHash();
    }

})();
