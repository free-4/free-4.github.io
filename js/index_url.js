/* =========================
   字体引入
========================= */
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


/* =========================
   渲染页面逻辑
========================= */
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
                if(item.url !== "#") window.location.href = item.url;
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


/* =========================
   🏆 成就系统
========================= */
(function () {
    const ACHIEVEMENTS = [
        { id: "first_visit",    icon: "🌟", name: "初探者",      desc: "欢迎来到 shuoweb.com！",           secret: false },
        { id: "sudo_mode",      icon: "💻", name: "超级管理员",  desc: "通过 #sudo 解锁了隐藏通道",          secret: true  },
        { id: "matrix_mode",    icon: "🟩", name: "黑客帝国",    desc: "看见了数字雨，真相只在一念间",       secret: true  },
        { id: "hack_mode",      icon: "📺", name: "故障美学",    desc: "感受了像素与噪声的碰撞",             secret: true  },
        { id: "token_114514",   icon: "😅", name: "臭名昭著",    desc: "输入了传说中的 114514",              secret: true  },
        { id: "token_666666",   icon: "😈", name: "暗黑使徒",    desc: "召唤了 666666 的黑暗之力",           secret: true  },
        { id: "token_1024",     icon: "⌨️", name: "程序员节",    desc: "以 1024 致敬每一位码农",             secret: true  },
        { id: "konami_code",    icon: "🎮", name: "上上下下",    desc: "Konami Code 永远的神",               secret: true  },
        { id: "secret_word",    icon: "💌", name: "情书",         desc: '在页面上拼出了 "shuo"',             secret: true  },
        { id: "click_maniac",   icon: "👆", name: "疯狂点击",    desc: "连续点击标题 7 次",                   secret: true  },
        { id: "idle_watcher",   icon: "😴", name: "在线摸鱼",    desc: "静止不动 60 秒被发现了",              secret: true  },
        { id: "devtools_open",  icon: "🔍", name: "开发者视角",  desc: "用 DevTools 探索了网页的秘密",        secret: true  },
        { id: "open_panel",     icon: "🗂️", name: "成就猎人",    desc: "打开了成就面板，好奇心驱使你前行",   secret: false },
        { id: "all_unlocked",   icon: "👑", name: "全图鉴",      desc: "解锁了所有彩蛋成就，你是真正的探索者", secret: true },
    ];

    // 读取 & 保存
    function getUnlocked() {
        try { return JSON.parse(localStorage.getItem("shuoweb_achievements") || "[]"); }
        catch { return []; }
    }
    function saveUnlocked(arr) {
        localStorage.setItem("shuoweb_achievements", JSON.stringify(arr));
    }

    // 解锁成就
    window.unlockAchievement = function(id) {
        const unlocked = getUnlocked();
        if (unlocked.includes(id)) return;
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (!ach) return;
        unlocked.push(id);
        saveUnlocked(unlocked);
        showAchievementToast(ach);

        // 检查是否全部解锁（排除 all_unlocked 本身）
        const eggAchs = ACHIEVEMENTS.filter(a => a.id !== "all_unlocked").map(a => a.id);
        const allDone = eggAchs.every(id => unlocked.includes(id));
        if (allDone) setTimeout(() => window.unlockAchievement("all_unlocked"), 800);
    };

    // 成就弹窗通知
    function showAchievementToast(ach) {
        injectAchievementStyles();
        const toast = document.createElement("div");
        toast.className = "ach-toast";
        toast.innerHTML = `
            <div class="ach-toast-icon">${ach.icon}</div>
            <div class="ach-toast-info">
                <div class="ach-toast-title">🏆 成就解锁！</div>
                <div class="ach-toast-name">${ach.name}</div>
                <div class="ach-toast-desc">${ach.desc}</div>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add("ach-toast-show"), 50);
        setTimeout(() => {
            toast.classList.remove("ach-toast-show");
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    }

    // 成就面板
    function buildPanel() {
        injectAchievementStyles();
        const unlocked = getUnlocked();
        const existing = document.getElementById("ach-panel");
        if (existing) { existing.remove(); return; }

        window.unlockAchievement("open_panel");

        const panel = document.createElement("div");
        panel.id = "ach-panel";

        const count = unlocked.length;
        const total = ACHIEVEMENTS.length;

        const items = ACHIEVEMENTS.map(a => {
            const done = unlocked.includes(a.id);
            const hidden = a.secret && !done;
            return `<div class="ach-item ${done ? "ach-done" : "ach-locked"}">
                <span class="ach-item-icon">${hidden ? "❓" : a.icon}</span>
                <div class="ach-item-text">
                    <div class="ach-item-name">${hidden ? "???" : a.name}</div>
                    <div class="ach-item-desc">${hidden ? "这是一个隐藏成就" : a.desc}</div>
                </div>
                ${done ? '<span class="ach-check">✓</span>' : ''}
            </div>`;
        }).join("");

        panel.innerHTML = `
            <div class="ach-header">
                <span>🏆 成就 <small>${count} / ${total}</small></span>
                <button class="ach-close" onclick="document.getElementById('ach-panel').remove()">✕</button>
            </div>
            <div class="ach-progress-bar"><div class="ach-progress-fill" style="width:${(count/total*100).toFixed(1)}%"></div></div>
            <div class="ach-list">${items}</div>
            <div class="ach-hint">桌面按 <kbd>?</kbd> · 移动端长按标题</div>
        `;
        document.body.appendChild(panel);
        setTimeout(() => panel.classList.add("ach-panel-show"), 30);
    }

    // 触发器 1：键盘按 ? 打开面板（桌面端）
    document.addEventListener("keydown", e => {
        if (e.key === "?" || (e.shiftKey && e.key === "/")) buildPanel();
    });

    // 触发器 2：长按任意 section-title 600ms 打开面板（移动端）
    (function () {
        let longPressTimer = null;

        function onTouchStart() {
            longPressTimer = setTimeout(() => {
                longPressTimer = null;
                if (navigator.vibrate) navigator.vibrate(40); // 轻触觉反馈
                buildPanel();
            }, 600);
        }
        function cancelLongPress() {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }

        function bindLongPress() {
            document.querySelectorAll(".section-title").forEach(title => {
                title.addEventListener("touchstart", onTouchStart,   { passive: true });
                title.addEventListener("touchend",   cancelLongPress, { passive: true });
                title.addEventListener("touchmove",  cancelLongPress, { passive: true });
            });
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", bindLongPress);
        } else {
            bindLongPress();
        }
    })();

    // 首次访问
    window.unlockAchievement("first_visit");

    // -------- 样式注入 --------
    let stylesInjected = false;
    function injectAchievementStyles() {
        if (stylesInjected) return;
        stylesInjected = true;
        const s = document.createElement("style");
        s.textContent = `
/* 成就面板 */
#ach-panel {
    position: fixed;
    bottom: 30px;
    right: 20px;
    width: 320px;
    max-height: 520px;
    background: rgba(15, 15, 25, 0.95);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    z-index: 9001;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    transform: translateY(20px) scale(0.95);
    opacity: 0;
    transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), opacity 0.3s;
    overflow: hidden;
    font-family: 'ShuoWeb', -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
}
#ach-panel.ach-panel-show { transform: translateY(0) scale(1); opacity: 1; }

.ach-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 10px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.ach-header small { color: rgba(255,255,255,0.4); font-weight: 400; margin-left: 6px; }
.ach-close {
    background: none;
    border: none;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    font-size: 16px;
    padding: 2px 6px;
    border-radius: 6px;
    transition: background 0.15s, color 0.15s;
}
.ach-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

.ach-progress-bar {
    height: 3px;
    background: rgba(255,255,255,0.08);
    margin: 0;
}
.ach-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #f9ca24, #f0932b);
    transition: width 0.6s ease;
}

.ach-list {
    overflow-y: auto;
    padding: 8px 0;
    flex: 1;
}
.ach-list::-webkit-scrollbar { width: 4px; }
.ach-list::-webkit-scrollbar-track { background: transparent; }
.ach-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

.ach-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 16px;
    transition: background 0.15s;
}
.ach-item:hover { background: rgba(255,255,255,0.04); }
.ach-item-icon { font-size: 22px; width: 28px; text-align: center; flex-shrink: 0; }
.ach-item-text { flex: 1; }
.ach-item-name { font-size: 13px; font-weight: 600; color: #fff; }
.ach-item-desc { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }
.ach-locked .ach-item-icon { filter: grayscale(1); opacity: 0.3; }
.ach-locked .ach-item-name { color: rgba(255,255,255,0.25); }
.ach-check { color: #6fcf97; font-size: 14px; font-weight: 700; }

.ach-hint {
    padding: 8px 16px;
    font-size: 11px;
    color: rgba(255,255,255,0.2);
    border-top: 1px solid rgba(255,255,255,0.05);
    text-align: center;
}
.ach-hint kbd {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    padding: 1px 5px;
    font-size: 11px;
}

/* 成就 Toast */
.ach-toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(30px);
    opacity: 0;
    background: rgba(15,15,25,0.96);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 14px;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 99999;
    backdrop-filter: blur(20px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    transition: all 0.4s cubic-bezier(.34,1.56,.64,1);
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
    min-width: 260px;
    max-width: 90vw;
}
.ach-toast.ach-toast-show { opacity: 1; transform: translateX(-50%) translateY(0); }
.ach-toast-icon { font-size: 28px; }
.ach-toast-title { font-size: 11px; color: #f9ca24; font-weight: 600; letter-spacing: 0.05em; }
.ach-toast-name { font-size: 14px; font-weight: 700; color: #fff; margin-top: 2px; }
.ach-toast-desc { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 3px; }
        `;
        document.head.appendChild(s);
    }
    injectAchievementStyles();
})();


/* =========================
   🥚 彩蛋 1: #sudo 超管模式（原版增强）
========================= */
(function() {
    let isEggTriggered = false;

    function checkSudoEgg() {
        if (window.location.hostname === 'shuoweb.com' && window.location.hash === '#sudo') {
            triggerEasterEgg();
        }
    }

    function triggerEasterEgg() {
        if (isEggTriggered) return;
        isEggTriggered = true;
        window.unlockAchievement("sudo_mode");

        console.log(
            "%c[SUDO] Root Access Granted. Welcome to shuoweb.com.",
            "color: #00ff00; background: #000000; font-size: 18px; font-weight: bold; padding: 10px; border-radius: 5px;"
        );

        const body = document.body;
        const originalBg = body.style.backgroundColor;
        const originalColor = body.style.color;

        body.style.transition = "all 1.5s ease-in-out";
        body.style.backgroundColor = "#000000";
        body.style.color = "#00ff00";
        body.style.transform = "rotate(360deg)";

        setTimeout(() => {
            alert("Sudo 模式已激活！欢迎进入超级管理员隐藏通道 🕵️‍♂️");
            setTimeout(() => {
                body.style.backgroundColor = originalBg;
                body.style.color = originalColor;
                body.style.transform = "none";
                window.location.hash = "";
                isEggTriggered = false;
            }, 2000);
        }, 1500);
    }

    window.addEventListener('DOMContentLoaded', checkSudoEgg);
    window.addEventListener('hashchange', checkSudoEgg);
})();


/* =========================
   🥚 彩蛋 2: #matrix 数字雨
========================= */
(function() {
    function checkMatrixEgg() {
        if (window.location.hash === '#matrix') triggerMatrix();
    }

    function triggerMatrix() {
        window.unlockAchievement("matrix_mode");
        window.location.hash = "";

        const canvas = document.createElement("canvas");
        canvas.id = "matrix-canvas";
        canvas.style.cssText = `
            position:fixed; inset:0; z-index:88888;
            background:#000; cursor:pointer;
        `;
        canvas.title = "点击退出";
        document.body.appendChild(canvas);

        const tip = document.createElement("div");
        tip.style.cssText = `
            position:fixed; top:20px; left:50%; transform:translateX(-50%);
            color:#00ff41; font-family:monospace; font-size:13px; z-index:88889;
            background:rgba(0,0,0,0.6); padding:6px 14px; border-radius:20px;
            border:1px solid #00ff41; animation: matrixFadeIn 1s ease;
        `;
        tip.textContent = "点击任意处退出 Matrix";
        document.body.appendChild(tip);

        // 注入 keyframe
        if (!document.getElementById("matrix-style")) {
            const s = document.createElement("style");
            s.id = "matrix-style";
            s.textContent = `@keyframes matrixFadeIn{from{opacity:0}to{opacity:1}}`;
            document.head.appendChild(s);
        }

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const cols = Math.floor(canvas.width / 16);
        const drops = Array(cols).fill(1);
        const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";

        let raf;
        function draw() {
            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#00ff41";
            ctx.font = "15px monospace";
            drops.forEach((y, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillStyle = Math.random() > 0.95 ? "#ffffff" : "#00ff41";
                ctx.fillText(char, i * 16, y * 16);
                if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
            raf = requestAnimationFrame(draw);
        }
        draw();

        function exit() {
            cancelAnimationFrame(raf);
            canvas.remove();
            tip.remove();
        }
        canvas.addEventListener("click", exit);
    }

    window.addEventListener('hashchange', checkMatrixEgg);
    window.addEventListener('DOMContentLoaded', checkMatrixEgg);
})();


/* =========================
   🥚 彩蛋 3: #hack 故障特效
========================= */
(function() {
    function checkHackEgg() {
        if (window.location.hash === '#hack') triggerHack();
    }

    function triggerHack() {
        window.unlockAchievement("hack_mode");
        window.location.hash = "";

        if (!document.getElementById("hack-style")) {
            const s = document.createElement("style");
            s.id = "hack-style";
            s.textContent = `
@keyframes glitch1 {
  0%,100%{clip-path:polygon(0 0,100% 0,100% 35%,0 35%); transform:translate(-4px)}
  50%{clip-path:polygon(0 0,100% 0,100% 20%,0 20%); transform:translate(4px)}
}
@keyframes glitch2 {
  0%,100%{clip-path:polygon(0 60%,100% 60%,100% 100%,0 100%); transform:translate(4px)}
  50%{clip-path:polygon(0 75%,100% 75%,100% 100%,0 100%); transform:translate(-4px)}
}
.glitch-layer1{position:fixed;inset:0;z-index:77776;background:inherit;animation:glitch1 0.3s infinite;opacity:0.8;mix-blend-mode:screen;color:#ff0044;pointer-events:none;}
.glitch-layer2{position:fixed;inset:0;z-index:77777;background:inherit;animation:glitch2 0.3s infinite;opacity:0.8;mix-blend-mode:screen;color:#00ffcc;pointer-events:none;}
            `;
            document.head.appendChild(s);
        }

        const l1 = document.createElement("div"); l1.className = "glitch-layer1";
        const l2 = document.createElement("div"); l2.className = "glitch-layer2";
        document.body.appendChild(l1);
        document.body.appendChild(l2);

        // CRT 扫描线覆盖
        const crt = document.createElement("div");
        crt.style.cssText = `
            position:fixed;inset:0;z-index:77775;pointer-events:none;
            background: repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);
        `;
        document.body.appendChild(crt);

        alert("⚠️ 系统故障！Glitch 模式启动中...");

        setTimeout(() => {
            l1.remove(); l2.remove(); crt.remove();
        }, 3000);
    }

    window.addEventListener('hashchange', checkHackEgg);
    window.addEventListener('DOMContentLoaded', checkHackEgg);
})();


/* =========================
   🥚 彩蛋 4: token=114514（原版增强）
========================= */
(function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token !== "114514") return;
    if (localStorage.getItem("shuoweb_token_114514")) return;
    localStorage.setItem("shuoweb_token_114514", "1");

    window.unlockAchievement("token_114514");

    const egg = document.createElement("div");
    egg.innerHTML = `
        <div id="shuoweb-egg">
            <h1>SHUOWEB SECRET UNLOCKED</h1>
            <p>你发现了隐藏 Token 彩蛋！</p>
            <small>token=114514 · 点击关闭</small>
        </div>
    `;
    document.body.appendChild(egg);

    const style = document.createElement("style");
    style.textContent = `
#shuoweb-egg{position:fixed;inset:0;background:linear-gradient(135deg,#89f7fe,#fbc2eb);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:99999;color:#fff;font-family:-apple-system,BlinkMacSystemFont,PingFang SC,sans-serif;animation:eggFade 0.8s ease;text-align:center;cursor:pointer;}
#shuoweb-egg h1{font-size:32px;margin-bottom:10px;animation:pop 0.6s ease;}
#shuoweb-egg p{opacity:.9;}
@keyframes eggFade{from{opacity:0}to{opacity:1}}
@keyframes pop{0%{transform:scale(.5)}100%{transform:scale(1)}}
    `;
    document.head.appendChild(style);
    egg.onclick = () => egg.remove();
})();


/* =========================
   🥚 彩蛋 5: token=666666 暗黑模式
========================= */
(function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get("token") !== "666666") return;

    window.unlockAchievement("token_666666");

    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;
        justify-content:center;align-items:center;text-align:center;cursor:pointer;
        font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;
        background:radial-gradient(ellipse at center,#1a0000 0%,#000 70%);
        color:#ff2244;
    `;
    overlay.innerHTML = `
        <div style="font-size:80px;animation:demonicPulse 1.5s infinite alternate;">😈</div>
        <h1 style="font-size:28px;margin:16px 0 8px;letter-spacing:.1em;text-transform:uppercase;">暗黑之力 已觉醒</h1>
        <p style="opacity:.6;font-size:14px;">token=666666 · 666是野兽的数字</p>
        <small style="margin-top:20px;opacity:.3;font-size:11px;">点击任意处关闭</small>
        <style>
            @keyframes demonicPulse{from{transform:scale(1) rotate(-5deg)}to{transform:scale(1.15) rotate(5deg)}}
        </style>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = () => overlay.remove();
})();


/* =========================
   🥚 彩蛋 6: token=1024 程序员节
========================= */
(function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get("token") !== "1024") return;

    window.unlockAchievement("token_1024");

    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;
        justify-content:center;align-items:center;text-align:center;cursor:pointer;
        font-family:'Courier New',Courier,monospace;
        background:#0d1117;color:#58a6ff;
    `;
    overlay.innerHTML = `
        <pre style="font-size:13px;color:#3fb950;margin-bottom:20px;line-height:1.6;">
 ██╗ ██████╗ ██████╗ ██╗  ██╗
███║██╔═████╗╚════██╗██║  ██║
╚██║██║██╔██║ █████╔╝███████║
 ██║████╔╝██║██╔═══╝ ╚════██║
 ██║╚██████╔╝███████╗     ██║
 ╚═╝ ╚═════╝ ╚══════╝     ╚═╝
        </pre>
        <h2 style="font-size:20px;margin:0 0 10px;color:#79c0ff;">🧑‍💻 程序员节快乐！</h2>
        <p style="color:#8b949e;font-size:13px;">10月24日 · 2^10 = 1024</p>
        <code style="display:block;margin:16px;padding:12px 20px;background:#161b22;border:1px solid #30363d;border-radius:8px;font-size:12px;color:#a5d6ff;">
            while(alive) { eat(); sleep(); code(); }
        </code>
        <small style="color:#30363d;font-size:11px;">点击关闭</small>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = () => overlay.remove();
})();


/* =========================
   🥚 彩蛋 7: Konami Code
   ↑ ↑ ↓ ↓ ← → ← → B A
========================= */
(function () {
    const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let seq = [];

    document.addEventListener("keydown", e => {
        seq.push(e.key);
        if (seq.length > KONAMI.length) seq.shift();
        if (seq.join() === KONAMI.join()) {
            seq = [];
            triggerKonami();
        }
    });

    function triggerKonami() {
        window.unlockAchievement("konami_code");
        launchConfetti();
        const banner = document.createElement("div");
        banner.style.cssText = `
            position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);
            z-index:99998;background:linear-gradient(135deg,#f093fb,#f5576c,#fda085);
            color:#fff;padding:30px 50px;border-radius:20px;text-align:center;
            font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;
            box-shadow:0 20px 60px rgba(0,0,0,0.4);transition:transform 0.4s cubic-bezier(.34,1.56,.64,1);
        `;
        banner.innerHTML = `
            <div style="font-size:50px">🎮</div>
            <h2 style="margin:10px 0 5px;font-size:22px">Konami Code Activated!</h2>
            <p style="opacity:.8;font-size:13px">↑↑↓↓←→←→BA · 传说中的秘籍</p>
        `;
        document.body.appendChild(banner);
        setTimeout(() => banner.style.transform = "translate(-50%,-50%) scale(1)", 50);
        setTimeout(() => {
            banner.style.transform = "translate(-50%,-50%) scale(0)";
            setTimeout(() => banner.remove(), 400);
        }, 3000);
    }

    function launchConfetti() {
        const colors = ["#f9ca24","#f0932b","#6ab04c","#e55039","#1e90ff","#9b59b6","#1abc9c","#e74c3c"];
        for (let i = 0; i < 100; i++) {
            const dot = document.createElement("div");
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 6 + Math.random() * 8;
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
            s.textContent = `
@keyframes confettiFall {
  to { transform: translateY(105vh) rotate(720deg); opacity:0; }
}
            `;
            document.head.appendChild(s);
        }
    }
})();


/* =========================
   🥚 彩蛋 8: 输入 "shuo" 情书
========================= */
(function () {
    let buffer = "";
    const TARGET = "shuo";

    document.addEventListener("keypress", e => {
        buffer += e.key.toLowerCase();
        if (buffer.length > TARGET.length) buffer = buffer.slice(-TARGET.length);
        if (buffer === TARGET) {
            buffer = "";
            triggerLoveLetter();
        }
    });

    function triggerLoveLetter() {
        window.unlockAchievement("secret_word");
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;
            justify-content:center;align-items:center;text-align:center;cursor:pointer;
            font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;
            background:radial-gradient(ellipse,#1a1a2e,#16213e,#0f3460);
        `;
        overlay.innerHTML = `
            <div style="font-size:60px;animation:heartBeat 1s infinite alternate;">💌</div>
            <h2 style="color:#ff6b9d;font-size:22px;margin:14px 0 8px;">你找到了情书</h2>
            <p style="color:rgba(255,255,255,0.6);font-size:14px;max-width:280px;line-height:1.8;">
                感谢每一位探索 shuoweb.com 的你<br>
                好奇心是最美好的品质 ✨
            </p>
            <small style="color:rgba(255,255,255,0.2);font-size:11px;margin-top:24px;">点击关闭</small>
            <style>
                @keyframes heartBeat{from{transform:scale(1)}to{transform:scale(1.2)}}
            </style>
        `;
        document.body.appendChild(overlay);
        overlay.onclick = () => overlay.remove();
    }
})();


/* =========================
   🥚 彩蛋 9: 连击标题 7 次
========================= */
(function () {
    let clickCount = 0;
    let timer = null;

    // render() 执行后直接绑定，绕开 pointer-events 问题
    function bindTitleClicks() {
        document.querySelectorAll(".section-title").forEach(title => {
            // 强制覆盖其他 JS 可能设置的 pointer-events 限制
            title.style.setProperty("pointer-events", "auto", "important");
            title.style.cursor = "pointer";
            // 子元素（SVG 图标等）设为不拦截，让事件统一由标题处理
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

            // capture 模式防止被其他 JS 拦截；同时绑定 touchstart 支持移动端
            title.addEventListener("click",      handler, true);
            title.addEventListener("touchstart", handler, { capture: true, passive: true });
        });
    }

    // DOMContentLoaded 时绑定（render() 已同步执行）
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindTitleClicks);
    } else {
        bindTitleClicks();
    }

    function triggerClickEgg(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // 从点击位置爆开粒子
        const colors = ["#FFD700","#FF6347","#00CED1","#DA70D6","#7FFF00"];
        for (let i = 0; i < 30; i++) {
            const p = document.createElement("div");
            const angle = (i / 30) * Math.PI * 2;
            const dist = 60 + Math.random() * 80;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            const color = colors[Math.floor(Math.random() * colors.length)];
            p.style.cssText = `
                position:fixed;left:${cx}px;top:${cy}px;
                width:8px;height:8px;border-radius:50%;background:${color};
                z-index:99996;pointer-events:none;
                transition:all 0.6s ease-out;
                transform:translate(-50%,-50%);
            `;
            document.body.appendChild(p);
            requestAnimationFrame(() => {
                p.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
                p.style.opacity = "0";
            });
            setTimeout(() => p.remove(), 700);
        }

        // 标题短暂彩虹闪烁
        el.style.transition = "color 0.2s";
        const colors2 = ["#ff6b9d","#ffcc00","#00e5ff","#69ff47","#ff6b9d"];
        colors2.forEach((c, i) => {
            setTimeout(() => el.style.color = c, i * 100);
        });
        setTimeout(() => el.style.color = "", 600);
    }
})();


/* =========================
   🥚 彩蛋 10: 摸鱼 60 秒
========================= */
(function () {
    let idleTimer = null;
    let triggered = false;

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
            position:fixed;top:20px;left:50%;transform:translateX(-50%);
            z-index:99996;background:rgba(0,0,0,0.85);color:#fff;
            padding:12px 24px;border-radius:30px;font-size:14px;
            font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;
            border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(10px);
            animation:slideDown 0.4s ease;
        `;
        banner.innerHTML = `😴 你已经 60 秒没有动了，在摸鱼吗？`;

        if (!document.getElementById("idle-style")) {
            const s = document.createElement("style");
            s.id = "idle-style";
            s.textContent = `@keyframes slideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`;
            document.head.appendChild(s);
        }

        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 4000);

        // 重置，下次还能触发
        setTimeout(() => triggered = false, 5000);
    }

    ["mousemove","keydown","scroll","click","touchstart"].forEach(evt => {
        document.addEventListener(evt, resetTimer, { passive: true });
    });
    resetTimer();
})();


/* =========================
   🥚 彩蛋 11: DevTools 检测
========================= */
(function () {
    let alerted = false;
    const threshold = 160;

    setInterval(() => {
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;
        if ((widthDiff || heightDiff) && !alerted) {
            alerted = true;
            window.unlockAchievement("devtools_open");
            console.log(
                "%c👋 嘿，开发者！\n%c你正在检查 shuoweb.com 的源码，很好奇嘛？\n尝试输入: window.unlockAchievement('devtools_open')",
                "font-size:20px; color:#58a6ff;",
                "font-size:13px; color:#8b949e;"
            );
        }
    }, 1000);
})();
