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

      footer.innerHTML =
        "&copy; 2026 SHUOWEB.COM · 始终保持好奇心";

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