(function () {

  /* ========= 防重复加载 ========= */
  if (window.__SHUOWEB_UI__) return;
  window.__SHUOWEB_UI__ = true;


  /* ========= 等待 body存在 ========= */
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }


  ready(init);


  function init() {

    /* ================= 样式 ================= */
    if (!document.getElementById("shuoweb-style")) {
      const style = document.createElement("style");
      style.id = "shuoweb-style";

      style.textContent = `
:root {
  --primary: #007AFF;
  --primary-light: #E3F2FD;
  --bg: #F8FAFC;
  --card-bg: rgba(255, 255, 255, 0.8);
  --text-main: #1E293B;
  --text-sub: #64748B;
  --shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  --radius: 16px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
body.pink {
  --primary: #FF2D55;
  --primary-light: #FFF0F3;
  --bg: #FFF5F7;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: var(--bg);
  color: var(--text-main);
  transition: var(--transition);
  line-height: 1.6;
}

/* ========= 顶部导航 ========= */
header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.3);
}
.logo {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--primary), #5856D6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.theme-btn {
  cursor: pointer;
  border: none;
  background: var(--primary);
  color: white;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.2);
  transition: var(--transition);
}
.theme-btn:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* ========= 动画 ========= */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.section {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* ========= Hero 区域 ========= */
.hero {
  padding: 60px 20px 40px;
  text-align: center;
}
.hero h1 {
  font-size: clamp(28px, 5vw, 42px);
  margin: 0 0 12px 0;
  font-weight: 800;
  color: var(--text-main);
}
.hero p {
  color: var(--text-sub);
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
}

/* ========= 内容布局 ========= */
#content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 60px;
}
.section {
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease-out forwards;
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 5px;
}
.section-title svg {
  width: 22px;
  height: 22px;
  color: var(--primary);
}

/* ========= 卡片设计 ========= */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}
.card {
  background: var(--card-bg);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: var(--radius);
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), transparent);
  opacity: 0;
  transition: var(--transition);
  z-index: 0;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1);
  border-color: var(--primary);
}
.card:hover::before {
  opacity: 0.03;
}
.icon-box {
  position: relative;
  z-index: 1;
  width: 48px;
  height: 48px;
  margin: 0 auto 15px;
  background: var(--primary-light);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  transition: var(--transition);
}
.card:hover .icon-box {
  transform: rotate(-5deg) scale(1.1);
  background: var(--primary);
  color: white;
}
.card-title {
  position: relative;
  z-index: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

/* ========= 页脚 ========= */
footer {
  text-align: center;
  padding: 40px;
  color: var(--text-sub);
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .hero {
    padding: 40px 15px 30px;
  }
}

/* 按钮基础样式（和你现有主题统一） */
.btn {
  position: relative;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 22px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background: var(--primary);
  color: #fff;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 1. 缩放 + 高亮（最通用） */
.btn-scale:hover {
  transform: scale(1.06);
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.25);
}
.btn-scale:active {
  transform: scale(0.97);
}

/* 2. 上浮动 */
.btn-float:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

/* 3. 扫光效果 */
.btn-shine::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.6s ease;
}
.btn-shine:hover::after {
  left: 100%;
}

/* 4. 边框呼吸 */
.btn-border {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}
.btn-border:hover {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 0 12px var(--primary);
}

/* 5. 圆角变方 */
.btn-rect {
  border-radius: 8px;
}
.btn-rect:hover {
  border-radius: 2px;
}

/* 6. 脉冲扩散 */
.btn-pulse:hover {
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.2);
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.4); }
  100% { box-shadow: 0 0 0 12px transparent; }
}
.btn-pulse:hover {
  animation: pulse 1.2s infinite;
}

/* ========= 卡片设计（完整版 · 含按压动效 + 无默认高亮） ========= */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}
.card {
  background: var(--card-bg);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: var(--radius);
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;

  /* 去掉点击蓝色高亮 */
  -webkit-tap-highlight-color: transparent;
  outline: none;
  user-select: none;
}
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), transparent);
  opacity: 0;
  transition: var(--transition);
  z-index: 0;
}

/* 悬浮效果 */
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1);
  border-color: var(--primary);
}
.card:hover::before {
  opacity: 0.03;
  left: 100%;
}

/* 按压效果（点击下去） */
.card:active {
  transform: translateY(-2px) scale(0.97);
  box-shadow: 0 8px 20px -10px rgba(0,0,0,0.1);
}

.icon-box {
  position: relative;
  z-index: 1;
  width: 48px;
  height: 48px;
  margin: 0 auto 15px;
  background: var(--primary-light);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  transition: var(--transition);
}
.card:hover .icon-box {
  transform: rotate(-5deg) scale(1.1);
  background: var(--primary);
  color: white;
}

.card-title {
  position: relative;
  z-index: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

/* ===============================
   全局文本居中 · 独立版 · 适配双主题
=============================== */

/* 标题全局居中 */
h1,
h2,
h3,
h4,
h5,
h6 {
  text-align: center !important;
  color: var(--text-main) !important;
  font-weight: 700 !important;
  transition: var(--transition) !important;
}

/* 段落全局居中 */
p {
  text-align: center !important;
  color: var(--text-sub) !important;
  transition: var(--transition) !important;
}

/* 列表全局居中 + 去掉小圆点 */
ul,
ol {
  list-style: none !important;
  padding-left: 0 !important;
  text-align: center !important;
  transition: var(--transition) !important;
}

ul li,
ol li {
  text-align: center !important;
  color: var(--text-sub) !important;
  transition: var(--transition) !important;
}

/* ===============================
   视频标签样式 · 适配当前主题
=============================== */

/* 视频容器（让视频居中、带圆角、防拖拽） */
video {
  display: block;
  max-width: 100%;
  width: 100%;
  height: auto;
  margin: 1rem auto;
  border-radius: var(--radius);
  background: #000;
  outline: none;
  -webkit-user-drag: none;
  user-select: none;
  pointer-events: auto;
  transition: var(--transition);
  box-shadow: var(--shadow);
}

/* 视频外层包裹（用于居中、间距、磨砂背景） */
.video-box {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 1.2rem auto;
  padding: 12px;
  background: var(--card-bg);
  border-radius: calc(var(--radius) + 4px);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .video-box {
    padding: 8px;
    margin: 1rem auto;
  }
  video {
    border-radius: 12px;
  }
}

/* ===============================
   全局 <a href> 链接 → 主题按钮样式（已优化）
=============================== */

/* 全局所有链接 - 统一处理 */
a,
a[href] {
  display: inline-block !important;
  text-align: center !important;
  width: fit-content !important;
  
  /* 按钮基础样式 */
  background-color: var(--primary) !important;
  color: #fff !important;
  border-radius: var(--radius) !important;
  padding: 10px 24px !important;
  margin: 8px auto !important;
  
  text-decoration: none !important;
  font-weight: 500 !important;
  font-size: 15px !important;
  line-height: 1.4 !important;
  white-space: nowrap !important;
  
  border: none !important;
  outline: none !important;
  box-shadow: var(--shadow) !important;
  transition: var(--transition) !important;
  
  /* 禁止长按弹窗 */
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* 按钮悬浮效果 */
a:hover,
a[href]:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
  opacity: 0.92 !important;
  color: #fff !important;
}

/* 按钮点击效果 */
a:active,
a[href]:active {
  transform: translateY(1px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

      `;

      document.head.appendChild(style);
    }


    /* ================= Header ================= */

    if (!document.getElementById("shuoweb-header")) {

      const header = document.createElement("header");
      header.id = "shuoweb-header";

      header.innerHTML = `
        <div class="logo">SHUOWEB</div>
        <button class="theme-btn" id="themeText">切换主题</button>
      `;

      // 插入到 body 最前
      document.body.insertBefore(header, document.body.firstChild);
    }


    /* ================= Footer ================= */

    if (!document.getElementById("shuoweb-footer")) {
  const footer = document.createElement("footer");
  footer.id = "shuoweb-footer";

  footer.innerHTML = `
    <div class="footer-links">
      <a href="https://github.com/free-4/free-4.github.io/issues" class="footer-link" target="_blank">评论区</a>
    </div>
    <p>&copy; 2026 SHUOWEB.COM · 始终保持好奇心</p>
  `;

  document.body.appendChild(footer);
}


    /* ================= 主题系统 ================= */

    window.toggleTheme = function () {
      const isPink = document.body.classList.toggle("pink");
      localStorage.setItem("theme", isPink ? "pink" : "blue");
      updateBtn(isPink);
    };

    document
      .getElementById("themeText")
      ?.addEventListener("click", toggleTheme);


    function updateBtn(isPink) {
      const btn = document.getElementById("themeText");
      if (btn)
        btn.innerText = isPink ? "克莱因蓝" : "浪漫极客粉";
    }

    const saved = localStorage.getItem("theme") === "pink";
    if (saved) document.body.classList.add("pink");
    updateBtn(saved);
  }

})();

let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  // 1. 处理"变身"效果：滚动超过 50px 就收缩
  if (currentScroll > 50 && header) {
    header.classList.add('scrolled');
  } else if (header) {
    header.classList.remove('scrolled');
  }

  // 2. 进阶：向下滚动隐藏，向上滚动显示（防干扰模式）
  if (currentScroll > lastScroll && currentScroll > 200 && header) {
    header.style.transform = 'translateY(-120%)'; // 隐藏
  } else if (header) {
    header.style.transform = 'translateY(0)'; // 显示
  }
  lastScroll = currentScroll;
});

// 禁止文本选择、复制、剪切、粘贴
document.addEventListener('DOMContentLoaded', function () {
  // 禁止选择
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
  document.body.style.msUserSelect = 'none';

  // 禁止复制、剪切、右键菜单
  document.addEventListener('copy', e => e.preventDefault());
  document.addEventListener('cut', e => e.preventDefault());
  document.addEventListener('contextmenu', e => e.preventDefault());
});

// 加强版禁止复制、选中、右键、打印、保存、控制台提取
(function() {
  // 禁止选中
  document.documentElement.style.userSelect = 'none';
  document.documentElement.style.webkitUserSelect = 'none';
  document.documentElement.style.msUserSelect = 'none';

  // 禁止剪切、复制、粘贴
  document.addEventListener('copy', e => e.preventDefault());
  document.addEventListener('cut', e => e.preventDefault());
  document.addEventListener('paste', e => e.preventDefault());

  // 禁止右键菜单
  document.addEventListener('contextmenu', e => e.preventDefault());

  // 禁止拖动图片/内容
  document.addEventListener('dragstart', e => e.preventDefault());

  // 禁止打印、另存为快捷键
  document.addEventListener('keydown', function(e) {
    // Ctrl+S / Ctrl+P / Ctrl+U / F12
    if (
      (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u')) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      return false;
    }
  });

  // 禁止开发者工具常用选中提取
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
})();
