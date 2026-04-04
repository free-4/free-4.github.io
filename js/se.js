(function () {
    /* ========= 防重复加载 ========= */
    if (window.__SHUOWEB_SETTINGS_PRO__) return;
    window.__SHUOWEB_SETTINGS_PRO__ = true;

    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(initSettings);

    /* ================= 核心配置数据 (可扩展) ================= */
    const settingsOptions = [
        {
            id: 'opt-immersive',
            name: '沉浸浏览模式',
            desc: '隐藏导航与页脚，专注内容阅读',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>`
        },
        {
            id: 'opt-fps',
            name: '实时性能监控',
            desc: '在屏幕右上角显示 FPS 曲线与性能开销',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>`
        },
        {
            id: 'opt-termux',
            name: 'Termux 终端环境',
            desc: '全局等宽字体，适配移动端代码阅读与编译',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`
        },
        {
            id: 'opt-noemoji',
            name: '严格极简 (Emoji 净化)',
            desc: '全局拦截并移除系统自带 Emoji，仅保留纯净 SVG',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/>`
        },
        {
            id: 'opt-m3',
            name: 'Material Design 3 引擎',
            desc: '切换至 Google M3 圆角与扁平化投影逻辑',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>`
        },
        {
            id: 'opt-debug',
            name: '前端布局调试网格',
            desc: '显示所有 DOM 元素的边界，辅助页面开发',
            type: 'switch',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>`
        },
        {
            id: 'opt-speed',
            name: 'UI 物理回弹速率',
            desc: '当前: 1.0x (阻尼优化)',
            type: 'range',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>`
        }
    ];

    function initSettings() {
        injectStyle();
        createDOM();
        bindEvents();
        loadData();
    }

    /* ================= 1. 注入加强版样式 ================= */
    function injectStyle() {
        if (document.getElementById("shuoweb-settings-style-pro")) return;
        const style = document.createElement("style");
        style.id = "shuoweb-settings-style-pro";
        style.textContent = `
            /* 基础遮罩与面板 */
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
                width: 92%; max-width: 520px; max-height: 85vh;
                background: var(--bg);
                border-radius: 28px; padding: 24px;
                box-shadow: 0 40px 80px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.8);
                transform: translateY(50px) scale(0.92);
                transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                display: flex; flex-direction: column; overflow: hidden;
            }
            .shuo-settings-mask.active .shuo-settings-panel { transform: translateY(0) scale(1); }

            /* 头部设计 */
            .shuo-settings-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 20px; padding: 0 8px 16px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            }
            .shuo-settings-title {
                font-size: 22px; font-weight: 800; color: var(--text-main); margin: 0;
                display: flex; align-items: center; gap: 10px;
                letter-spacing: -0.5px;
            }
            .shuo-settings-title svg { width: 24px; height: 24px; color: var(--primary); }

            .shuo-close-btn {
                width: 36px; height: 36px; border-radius: 50%;
                background: var(--primary-light); color: var(--primary);
                display: flex; justify-content: center; align-items: center;
                cursor: pointer; transition: all 0.3s ease;
            }
            .shuo-close-btn:hover { transform: rotate(90deg); background: var(--primary); color: #fff; }

            /* 滚动区域优化 */
            .shuo-settings-body {
                overflow-y: auto; overflow-x: hidden;
                padding: 4px 8px 24px; display: flex; flex-direction: column; gap: 12px;
                scrollbar-width: none; -webkit-overflow-scrolling: touch;
            }
            .shuo-settings-body::-webkit-scrollbar { display: none; }

            /* 设置项卡片 */
            .shuo-setting-item {
                display: flex; align-items: center; gap: 16px;
                padding: 16px; background: var(--card-bg);
                border-radius: 20px; border: 1px solid rgba(255,255,255,0.5);
                box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .shuo-setting-item:hover {
                transform: translateX(4px); border-color: var(--primary-light);
                box-shadow: 0 8px 25px rgba(0,0,0,0.05);
            }
            
            .shuo-setting-icon {
                width: 42px; height: 42px; border-radius: 12px;
                background: var(--primary-light); color: var(--primary);
                display: flex; justify-content: center; align-items: center; flex-shrink: 0;
            }
            .shuo-setting-icon svg { width: 22px; height: 22px; fill: none; stroke: currentColor; }

            .shuo-setting-info { flex-grow: 1; }
            .shuo-setting-name { font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 3px; }
            .shuo-setting-desc { font-size: 12px; color: var(--text-sub); line-height: 1.4; opacity: 0.8; }

            /* iOS 风格 Switch */
            .shuo-switch {
                appearance: none; -webkit-appearance: none;
                width: 50px; height: 28px; background: rgba(0, 0, 0, 0.1);
                border-radius: 30px; position: relative; cursor: pointer; outline: none;
                transition: background 0.3s ease; flex-shrink: 0;
            }
            .shuo-switch::after {
                content: ''; position: absolute; top: 2px; left: 2px;
                width: 24px; height: 24px; background: #fff; border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .shuo-switch:checked { background: var(--primary); }
            .shuo-switch:checked::after { transform: translateX(22px); }

            /* 滑块样式 */
            .shuo-range-container { width: 100px; flex-shrink: 0; }
            .shuo-range {
                -webkit-appearance: none; width: 100%; height: 6px;
                background: var(--primary-light); border-radius: 6px; outline: none;
            }
            .shuo-range::-webkit-slider-thumb {
                -webkit-appearance: none; appearance: none;
                width: 18px; height: 18px; border-radius: 50%;
                background: var(--primary); cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: transform 0.2s;
            }
            .shuo-range::-webkit-slider-thumb:active { transform: scale(1.3); }

            /* 底部动作组 */
            .shuo-settings-footer {
                display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
                padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.06);
            }
            .shuo-btn {
                padding: 12px; border-radius: 16px; border: none; font-size: 14px; font-weight: 700;
                cursor: pointer; transition: all 0.3s ease; background: var(--card-bg); color: var(--text-main);
                box-shadow: 0 4px 10px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05);
            }
            .shuo-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
            .shuo-btn.primary { background: var(--primary); color: #fff; border: none; }
            .shuo-btn.danger { background: #FFF0F3; color: #FF2D55; border: none; }

            /* ================= 动态功能类注入 ================= */
            body.immersive-mode header, body.immersive-mode footer { 
                opacity: 0 !important; pointer-events: none !important; transform: translateY(-100%) !important; 
            }
            body.termux-mode { font-family: 'Courier New', Consolas, monospace !important; }
            body.m3-mode { --radius: 28px !important; --shadow: 0 2px 6px rgba(0,0,0,0.08) !important; }
            body.debug-mode * { outline: 1px dashed rgba(0, 122, 255, 0.4) !important; }

            /* FPS 监控悬浮窗 */
            #shuo-fps-monitor {
                position: fixed; top: 15px; right: 15px; z-index: 99998;
                background: rgba(0,0,0,0.8); color: #0f0; font-family: monospace;
                padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;
                pointer-events: none; display: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border: 1px solid rgba(0,255,0,0.3);
            }
            body.fps-mode #shuo-fps-monitor { display: block; }
        `;
        document.head.appendChild(style);
    }

    /* ================= 2. 构建 DOM ================= */
    function createDOM() {
        const mask = document.createElement('div');
        mask.className = 'shuo-settings-mask';
        mask.id = 'shuoweb-settings-mask';

        // 组装设置项列表
        let listHTML = '';
        settingsOptions.forEach(opt => {
            const control = opt.type === 'switch' 
                ? `<input type="checkbox" class="shuo-switch" id="${opt.id}">`
                : `<div class="shuo-range-container"><input type="range" class="shuo-range" id="${opt.id}" min="0" max="2" step="0.5" value="1"></div>`;
            
            listHTML += `
                <div class="shuo-setting-item">
                    <div class="shuo-setting-icon"><svg viewBox="0 0 24 24">${opt.icon}</svg></div>
                    <div class="shuo-setting-info">
                        <div class="shuo-setting-name">${opt.name}</div>
                        <div class="shuo-setting-desc" id="desc-${opt.id}">${opt.desc}</div>
                    </div>
                    ${control}
                </div>
            `;
        });

        mask.innerHTML = `
            <div class="shuo-settings-panel" id="shuoweb-settings-panel">
                <div class="shuo-settings-header">
                    <h3 class="shuo-settings-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        Engineers Pro
                    </h3>
                    <div class="shuo-close-btn" id="shuo-close-btn"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></div>
                </div>
                <div class="shuo-settings-body">
                    ${listHTML}
                </div>
                <div class="shuo-settings-footer">
                    <button class="shuo-btn primary" id="btn-copy-url">分享状态</button>
                    <button class="shuo-btn danger" id="btn-clear-data">重置引擎</button>
                </div>
            </div>
        `;
        document.body.appendChild(mask);

        // 注入 FPS 监控 DOM
        const fpsDiv = document.createElement('div');
        fpsDiv.id = 'shuo-fps-monitor';
        document.body.appendChild(fpsDiv);
    }

    /* ================= 3. 核心极客功能实现 ================= */
    
    // FPS 监控器核心引擎
    let fpsLoopId;
    function toggleFPS(isActive) {
        const fpsDiv = document.getElementById('shuo-fps-monitor');
        if (isActive) {
            let lastTime = performance.now();
            let frames = 0;
            const loop = () => {
                const now = performance.now();
                frames++;
                if (now >= lastTime + 1000) {
                    const fps = Math.round((frames * 1000) / (now - lastTime));
                    fpsDiv.innerText = `FPS: ${fps} | DOM: ${document.getElementsByTagName('*').length}`;
                    // 性能警报变色
                    fpsDiv.style.color = fps < 30 ? '#ff3b30' : (fps < 50 ? '#ffcc00' : '#34c759');
                    fpsDiv.style.borderColor = fpsDiv.style.color;
                    frames = 0;
                    lastTime = now;
                }
                fpsLoopId = requestAnimationFrame(loop);
            };
            fpsLoopId = requestAnimationFrame(loop);
        } else {
            cancelAnimationFrame(fpsLoopId);
        }
    }

    // Emoji 净化器 (DOM TreeWalker 劫持)
    let emojiObserver = null;
    function toggleEmojiPurifier(isActive) {
        // 匹配大部分 Emoji 的正则
        const emojiRegex = /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g;
        
        const purifyNode = (node) => {
            if (node.nodeType === 3) { // Text Node
                if (emojiRegex.test(node.nodeValue)) {
                    node.nodeValue = node.nodeValue.replace(emojiRegex, '');
                }
            } else if (node.nodeType === 1 && node.childNodes) { // Element Node
                // 跳过我们自己的设置面板和 SVG 标签
                if (node.id === 'shuoweb-settings-mask' || node.tagName.toLowerCase() === 'svg') return;
                node.childNodes.forEach(purifyNode);
            }
        };

        if (isActive) {
            purifyNode(document.body); // 初始清理
            // 监听新插入的 DOM 节点
            emojiObserver = new MutationObserver((mutations) => {
                mutations.forEach(m => m.addedNodes.forEach(purifyNode));
            });
            emojiObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
        } else {
            if (emojiObserver) {
                emojiObserver.disconnect();
                emojiObserver = null;
            }
            // 提示刷新恢复
            if(confirm('Emoji 已解除拦截。是否刷新页面以恢复原有的 Emoji 显示？')){
                location.reload();
            }
        }
    }

    /* ================= 4. 事件绑定与逻辑中枢 ================= */
    function bindEvents() {
        const mask = document.getElementById('shuoweb-settings-mask');
        const closeBtn = document.getElementById('shuo-close-btn');

        // Hash 监听
        window.addEventListener('hashchange', checkHash);
        closeBtn.addEventListener('click', closeSettings);
        mask.addEventListener('click', (e) => { if (e.target === mask) closeSettings(); });

        // 通用状态切换工厂
        const bindSwitch = (id, classStr, callback = null) => {
            document.getElementById(id).addEventListener('change', (e) => {
                const checked = e.target.checked;
                if (classStr) document.body.classList.toggle(classStr, checked);
                localStorage.setItem(`shuo_${id}`, checked);
                if (callback) callback(checked);
            });
        };

        bindSwitch('opt-immersive', 'immersive-mode');
        bindSwitch('opt-termux', 'termux-mode');
        bindSwitch('opt-m3', 'm3-mode');
        bindSwitch('opt-debug', 'debug-mode');
        bindSwitch('opt-fps', 'fps-mode', toggleFPS);
        bindSwitch('opt-noemoji', '', toggleEmojiPurifier);

        // 动画速率调节
        const speedInput = document.getElementById('opt-speed');
        const speedDesc = document.getElementById('desc-opt-speed');
        speedInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            let timeStr = '0.3s';
            if (val === 0) timeStr = '0s';
            else if (val === 0.5) timeStr = '0.6s'; 
            else if (val === 1.5) timeStr = '0.15s'; 
            else if (val === 2) timeStr = '0.05s'; 
            
            document.documentElement.style.setProperty('--transition', `all ${timeStr} cubic-bezier(0.4, 0, 0.2, 1)`);
            speedDesc.textContent = val === 0 ? '已禁用全局动画' : `当前: ${val}x 阻尼`;
            localStorage.setItem('shuo_opt_speed', val);
        });

        // 底部动作按钮
        document.getElementById('btn-copy-url').addEventListener('click', function() {
            navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#setting');
            const originalText = this.innerText;
            this.innerText = '已复制入口链接';
            setTimeout(() => { this.innerText = originalText; }, 2000);
        });

        document.getElementById('btn-clear-data').addEventListener('click', () => {
            if (confirm('确认清空所有开发者配置缓存？')) {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('shuo_')) localStorage.removeItem(key);
                });
                location.href = location.pathname; 
            }
        });
    }

    /* ================= 5. 数据恢复与控制面板显隐 ================= */
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
        history.replaceState(null, null, window.location.pathname + window.location.search);
        checkHash(); 
    }

    function loadData() {
        const applySwitch = (id, classStr, callback = null) => {
            const val = localStorage.getItem(`shuo_${id}`) === 'true';
            document.getElementById(id).checked = val;
            if (val) {
                if (classStr) document.body.classList.add(classStr);
                if (callback) callback(true);
            }
        };

        applySwitch('opt-immersive', 'immersive-mode');
        applySwitch('opt-termux', 'termux-mode');
        applySwitch('opt-m3', 'm3-mode');
        applySwitch('opt-debug', 'debug-mode');
        applySwitch('opt-fps', 'fps-mode', toggleFPS);
        applySwitch('opt-noemoji', '', toggleEmojiPurifier);

        const speedVal = localStorage.getItem('shuo_opt_speed');
        if (speedVal !== null) {
            const input = document.getElementById('opt-speed');
            input.value = speedVal;
            input.dispatchEvent(new Event('input'));
        }

        checkHash();
    }

})();
