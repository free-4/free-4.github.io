(function () {

  /* ========= 防重复加载 ========= */
  if (window.__SHUOWEB_UI__) return;
  window.__SHUOWEB_UI__ = true;


  /* ========= 等待 body 存在 ========= */
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
  transition: all 0.3s ease;
}
.card:hover .card-title {
  transform: translateY(-2px);
  color: var(--primary);
}

/* 主题按钮 - 优化版 */
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
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  /* 去掉点击蓝色高亮 */
  -webkit-tap-highlight-color: transparent;
  outline: none;
  user-select: none;
}

/* 扫光效果 */
.theme-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  transition: all 0.6s ease;
}

/* 悬浮 */
.theme-btn:hover {
  transform: translateY(-2px) scale(1.05);
  filter: brightness(1.08);
}
.theme-btn:hover::after {
  left: 100%;
}

/* 按压效果 */
.theme-btn:active {
  transform: translateY(0) scale(0.96);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 全局统一过渡 */
* {
  transition: var(--transition);
}

/* 主题色渐变过渡 */
:root, body.pink {
  transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 头部导航渐变 */
header {
  transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
}

/* Logo 颜色渐变 */
.logo {
  transition: background 0.4s;
}

/* 按钮增强过渡 */
.theme-btn {
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 卡片全套流畅过渡 */
.card {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.icon-box {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-title {
  transition: transform 0.3s, color 0.3s;
}

/* 标题、文字颜色渐变 */
.hero h1,
.hero p,
.section-title {
  transition: color 0.4s;
}

/* 页脚文字渐变 */
footer {
  transition: color 0.4s;
}

/* 全局主题切换渐变动画 */
*,
::before,
::after {
  transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              fill 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              stroke 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 主题适配链接样式 */
a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* 无下划线链接（加 class="link-plain"） */
.link-plain {
  text-decoration: none !important;
}

/* 按钮式链接（加 class="link-btn"） */
.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
}
.link-btn:hover {
  background: var(--primary);
  color: #fff;
  transform: translateY(-1px);
}

/* 全局链接样式（适配主题） */
a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}
a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* 页脚友情链接 - 高级动效按钮 */
.footer-link {
  display: inline-block;
  margin: 0 10px;
  padding: 6px 14px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  user-select: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 扫光动效 */
.footer-link::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s ease;
}

/* 悬浮效果 */
.footer-link:hover {
  background: var(--primary);
  color: #fff;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}
.footer-link:hover::after {
  left: 100%;
}

/* 按压效果 */
.footer-link:active {
  transform: translateY(0) scale(0.96);
}

/* 1. 基础类：平时持续跳动，同时备好过渡效果 */
.combo-duang {
  display: inline-block;
  will-change: transform;
  
  /* 挂载持续跳动的动画 (假设你已经定义了 continuous-duang 关键帧) */
  animation: continuous-duang 2.5s infinite ease-in-out;
  
  /* 提前写好过渡曲线，等动画停掉时，这个过渡就会生效 */
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
              box-shadow 0.4s ease;
}

/* 2. 悬浮状态：打断动画，执行放大 */
.combo-duang:hover {
  /* 关键：取消循环动画，防止它干扰悬停效果 */
  animation: none; 
  
  /* 执行常规的交互 Duang */
  transform: scale(1.05) translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

/* 3. 点击状态：打断动画，执行下压 */
.combo-duang:active {
  animation: none;
  transform: scale(0.92) translateY(2px);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 之前写过的关键帧 (如果你没存的话，贴在这里) */
@keyframes continuous-duang {
  0%   { transform: scale(1); }
  15%  { transform: scale(1.1) translateY(-4px); }
  30%  { transform: scale(0.95) translateY(2px); }
  45%  { transform: scale(1.03); }
  60%  { transform: scale(1); }
  100% { transform: scale(1); }
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: 
    box-shadow 0.3s ease, 
    background 0.3s ease, 
    transform 0.3s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.2);
  /* 增加阴影弥散范围，模拟悬浮高度增加 */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
}

.nav-list {
  display: flex;
  position: relative;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1); /* 在磨砂之上加一层极淡的背景 */
  border-radius: 50px;
}

.nav-link {
  position: relative;
  z-index: 2;
  padding: 10px 20px;
  transition: color 0.3s ease;
}

/* 使用伪元素制作跟随滑块 */
/* 注意：这个纯CSS方案是针对单个Item的，若需跨Item平滑移动需少量JS */
.nav-link::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  z-index: -1;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* 带有弹性回弹 */
}

.nav-link:hover::before {
  opacity: 1;
  transform: scale(1);
}

.nav-link {
  background: linear-gradient(90deg, #fff, #fff, #4facfe, #fff, #fff);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent; /* 隐藏原始文字颜色 */
  transition: background-position 0s;
}

.nav-link:hover {
  background-position: -100% 0;
  transition: background-position 0.6s ease;
}

/* 默认状态 */
.header {
  position: fixed;
  top: 0;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 20px 0;
}

/* 滚动状态 (需要配合简单的 JS 添加 .scrolled 类) */
.header.scrolled {
  top: 20px;
  width: 90%; /* 宽度收缩 */
  left: 5%;
  border-radius: 20px;
  padding: 10px 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-item {
  position: relative;
  z-index: 1;
}

/* 悬停时的“胶囊”背景 */
.nav-item::before {
  content: "";
  position: absolute;
  inset: 5px -10px; /* 控制胶囊的大小范围 */
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  z-index: -1;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.nav-item:hover::before {
  opacity: 1;
  transform: scale(1);
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
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // 1. 处理“变身”效果：滚动超过 50px 就收缩
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // 2. 进阶：向下滚动隐藏，向上滚动显示（防干扰模式）
  if (currentScroll > lastScroll && currentScroll > 200) {
    header.style.transform = 'translateY(-120%)'; // 隐藏
  } else {
    header.style.transform = 'translateY(0)'; // 显示
  }
  lastScroll = currentScroll;
});
