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

@font-face {
    font-family: '666font';
    src: url('https://shuoweb.com/css/font.ttf');
}

body {
  margin: 0;
  font-family: '666font', sans-serif;
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

/* =============================== 全局通用 DIV 样式 =============================== */
/* 这里的策略是针对作为“直接子级”或“块级容器”的 div 进行增强 */
div {
    /* 继承主题定义的变量 */
    border-radius: var(--radius);
    transition: var(--transition);
    /* 默认不加背景，但如果是主要内容块，它会显得非常干净 */
}

/* 模拟卡片效果：自动识别具有实际内容的 div (可选，让布局更高级) */
div:not(:empty) {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1); /* 极其微弱的边框线 */
}

/* =============================== 全局通用 INPUT 样式 =============================== */
input {
    /* 基础尺寸与间距 */
    width: 50%; /* 可根据需要改 auto */
    max-width: 400px;
    padding: 12px 16px;
    margin: 8px 0;
    
    /* 核心视觉：磨砂玻璃感 */
    background: var(--card-bg);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius); /* 自动跟随全局圆角 */
    
    /* 文字样式 */
    color: var(--text-main);
    font-size: 14px;
    font-family: inherit;
    
    /* 交互与性能 */
    outline: none;
    transition: var(--transition);
    box-shadow: var(--shadow);
    -webkit-appearance: none; /* 移除移动端原生阴影 */
}

/* 占位符颜色调整 */
input::placeholder {
    color: var(--text-sub);
    opacity: 0.6;
}

/* 重点：获取焦点时的状态 */
input:focus {
    background: #ffffff; /* 聚焦时变白，增加对比度 */
    border-color: var(--primary); /* 边框变主题色 */
    box-shadow: 0 0 0 4px var(--primary-light); /* 呼吸灯外发光 */
    transform: translateY(-1px); /* 轻微上浮感 */
}

/* 针对粉色主题的自动适配 (如果需要特殊微调) */
body.pink input:focus {
    box-shadow: 0 0 0 4px rgba(255, 45, 85, 0.15);
}



/* =============================== 全局通用 BUTTON 样式 =============================== */
/* 彻底重写所有原生按钮，使其符合克莱因蓝/极客粉主题 */
button {
    /* 基础布局 */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 24px;
    margin: 5px;
    
    /* 视觉特征 */
    background: var(--primary);
    color: #FFFFFF !important;
    border: none;
    outline: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    
    /* 动画与交互 */
    position: relative;
    overflow: hidden;
    transition: var(--transition);
    box-shadow: var(--shadow);
    
    /* 移动端优化 */
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    white-space: nowrap;
}

/* 鼠标悬停：上浮 + 呼吸感 */
button:hover {
    transform: translateY(-3px) scale(1.02);
    filter: brightness(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* 点击反馈：物理压感回弹 */
button:active {
    transform: translateY(1px) scale(0.95);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.1s ease; /* 瞬间反馈 */
}

/* 扫光动效：利用伪元素实现 */
button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    transition: none;
}

button:hover::before {
    left: 100%;
    transition: all 0.6s ease;
}

/* 针对禁用状态的自动处理 */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    background: var(--text-sub);
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
  transition: all 0.3s ease;
}
.card:hover .card-title {
  transform: translateY(-2px);
  color: var(--primary);
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

/* 悬停时的"胶囊"背景 */
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

.navbar {
  /* 你现有的属性... */
  position: relative;
  overflow: hidden; /* 裁剪流光 */
}

/* 增加一根流动的细线 */
.navbar::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: -100%;
  width: 50%;
  height: 1px;
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(255, 255, 255, 0.8), 
    #4facfe, 
    transparent
  );
  animation: sweep 5s infinite linear;
}

@keyframes sweep {
  0% { left: -100%; }
  100% { left: 200%; }
}

/* 移动端加强版：禁止选中、复制、长按弹窗 */
* {
  /* 核心禁止选中 */
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  
  /* 禁止系统长按菜单 */
  -webkit-touch-callout: none !important;
  touch-callout: none !important;

  /* 禁止点击高亮 */
  -webkit-tap-highlight-color: transparent !important;
  -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
}

/* 允许输入框正常使用（不影响表单） */
input, textarea, select, [contenteditable="true"] {
  user-select: text !important;
  -webkit-user-select: text !important;
  -webkit-touch-callout: default !important;
}

/* 禁止拖动图片、链接 */
img, a, picture {
  user-drag: none !important;
  -webkit-user-drag: none !important;
}

/* 移动端滚动流畅不卡顿 */
html, body {
  -webkit-overflow-scrolling: touch !important;
  overflow-scrolling: touch !important;
}

/* ===============================
   文本 & 列表 · 完美适配当前主题
=============================== */

/* 标题 */
h1, h2, h3, h4, h5, h6 {
  margin: 1rem 0 0.7rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text-main);
  user-select: none;
  transition: var(--transition);
}
h1 { font-size: 26px; }
h2 { font-size: 24px; }
h3 { font-size: 22px; }
h4 { font-size: 20px; }
h5 { font-size: 18px; }
h6 { font-size: 16px; }

/* 段落 */
p {
  margin: 0.7rem 0;
  line-height: 1.7;
  font-size: 15px;
  color: var(--text-sub);
  user-select: none;
  transition: var(--transition);
}

/* 列表共用 */
ul, ol {
  margin: 0.8rem 0;
  padding-left: 1.4rem;
  user-select: none;
  transition: var(--transition);
}

/* 无序列表 */
ul {
  list-style: none;
  padding-left: 1rem;
}
ul li {
  position: relative;
  margin: 0.5rem 0;
  line-height: 1.6;
  font-size: 15px;
  color: var(--text-sub);
  padding-left: 0.4rem;
}
ul li::before {
  content: '';
  position: absolute;
  left: -0.9rem;
  top: 0.65rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
  opacity: 0.65;
  transition: var(--transition);
}

/* 有序列表 */
ol {
  list-style: none;
  counter-reset: ol-num;
  padding-left: 1.2rem;
}
ol li {
  position: relative;
  margin: 0.5rem 0;
  line-height: 1.6;
  font-size: 15px;
  color: var(--text-sub);
  padding-left: 0.4rem;
}
ol li::before {
  counter-increment: ol-num;
  content: counter(ol-num) ".";
  position: absolute;
  left: -1.4rem;
  color: var(--primary);
  opacity: 0.75;
  font-weight: 600;
  transition: var(--transition);
}

/* ===============================
   移动端适配
=============================== */
@media (max-width: 768px) {
  h1 { font-size: 24px; }
  h2 { font-size: 22px; }
  h3 { font-size: 20px; }
  h4 { font-size: 18px; }
  h5 { font-size: 17px; }
  h6 { font-size: 16px; }

  p, ul li, ol li {
    font-size: 14px;
    line-height: 1.6;
  }
}

/* ===============================
   全新独立文本居中样式（适配双主题）
=============================== */

/* 标题居中 */
.article h2,
.article h3,
.article h4,
.article h5,
.article h6 {
  text-align: center;
  color: var(--text-main);
  font-weight: 700;
  margin: 1rem 0;
  transition: var(--transition);
}

/* 段落居中 */
.article p {
  text-align: center;
  color: var(--text-sub);
  line-height: 1.7;
  margin: 0.6rem 0;
  transition: var(--transition);
}

/* 列表居中 + 无小圆点 */
.article ul,
.article ol {
  list-style: none;
  padding-left: 0;
  text-align: center;
  margin: 1rem 0;
  transition: var(--transition);
}

.article li {
  color: var(--text-sub);
  margin: 0.4rem 0;
  transition: var(--transition);
}

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

/* ⚠️ 关键修复：链接居中的核心规则 */
a {
  display: inline-block !important;
  margin-left: auto !important;
  margin-right: auto !important;
  text-align: center !important;
  
  /* 按钮样式 */
  background-color: var(--primary) !important;
  color: #fff !important;
  border-radius: var(--radius) !important;
  padding: 12px 28px !important;
  
  text-decoration: none !important;
  font-weight: 500 !important;
  font-size: 15px !important;
  white-space: nowrap !important;
  
  border: none !important;
  outline: none !important;
  box-shadow: var(--shadow) !important;
  transition: var(--transition) !important;
  
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none !important;
}

/* 按钮悬浮效果 */
a:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  opacity: 0.92 !important;
  color: #fff !important;
}

/* 按钮点击效果 */
a:active {
  transform: translateY(1px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

/* 让所有包含链接的容器也自动居中 */
body {
  text-align: center;
}

/* 每日一言 - 刷新句子按钮 */
.refresh-btn {
  cursor: pointer;
  border: none;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 28px;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(0, 122, 255, 0.15);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

/* 悬浮动效 */
.refresh-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 22px rgba(0, 122, 255, 0.2);
}

/* 点击动效 */
.refresh-btn:active {
  transform: translateY(0) scale(0.97);
  transition: all 0.1s ease;
}

/* 粉色主题自动适配 */
body.pink .refresh-btn {
  box-shadow: 0 6px 18px rgba(255, 45, 85, 0.15);
}
body.pink .refresh-btn:hover {
  box-shadow: 0 8px 22px rgba(255, 45, 85, 0.2);
}

/* 点击波纹动画 */
.refresh-btn::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  transform: scale(0);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.3s ease;
}
.refresh-btn:active::after {
  transform: scale(1.2);
  opacity: 1;
  transition: 0s;
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
    <p>&copy; 2026 SHUOWEB.COM · 不忘初心</p>
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

  if (!header) return;

  // 1. 处理"变身"效果：滚动超过 50px 就收缩
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

// 禁止双指缩放
document.addEventListener('touchmove', function(e) {
  if (e.touches.length >= 2) {
    e.preventDefault();
  }
}, { passive: false });

// 禁止手势缩放（针对 iOS Safari 等）
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

// 禁止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);