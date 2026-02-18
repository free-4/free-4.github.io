// 一次性插入 CSS + 头部 + 底部 + 主题逻辑
(function() {
  // ====================== 全局样式 ======================
  const style = document.createElement('style');
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

/* ========= 页脚 ========= */
footer {
  text-align: center;
  padding: 40px;
  color: var(--text-sub);
  font-size: 14px;
}
/* 移动端适配 */
@media (max-width: 480px) {
  .hero { padding: 40px 15px 30px; }
}
  `;
  document.head.appendChild(style);

  // ====================== 插入头部 ======================
  const header = document.createElement('header');
  header.innerHTML = `
    <div class="logo">SHUOWEB.</div>
    <button class="theme-btn" onclick="toggleTheme()" id="themeText">切换主题</button>
  `;
  document.body.prepend(header);

  // ====================== 插入底部 ======================
  const footer = document.createElement('footer');
  footer.innerHTML = `&copy; 2026 SHUOWEB.COM · 始终保持好奇心`;
  document.body.appendChild(footer);

  // ====================== 主题系统 ======================
  window.toggleTheme = function() {
    const isPink = document.body.classList.toggle("pink");
    localStorage.setItem("theme", isPink ? "pink" : "blue");
    updateThemeButton(isPink);
  }

  function updateThemeButton(isPink) {
    const btn = document.getElementById("themeText");
    if (!btn) return;
    btn.innerText = isPink ? "克莱因蓝" : "浪漫极客粉";
  }

  // 初始化主题
  if (localStorage.getItem("theme") === "pink") {
    document.body.classList.add("pink");
    setTimeout(() => updateThemeButton(true), 0);
  } else {
    setTimeout(() => updateThemeButton(false), 0);
  }
})();
