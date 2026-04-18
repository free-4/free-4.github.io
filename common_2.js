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
/* ═══════════════════════════════════════════════════════════════
   resend-pro.css  ·  Enhanced Resend-inspired Design System
   Fully covers all classes from common.js + rich animations
   Dark-first · Developer-focused · Motion-rich · Mobile-ready
   ═══════════════════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap');

/* ─── 1. Design Tokens ─────────────────────────────────────── */
:root {
  /* Brand / Primary */
  --primary:        #ffffff;
  --primary-rgb:    255,255,255;
  --primary-light:  rgba(255,255,255,0.08);
  --primary-glow:   rgba(255,255,255,0.12);

  /* Backgrounds */
  --bg:             #0a0a0a;
  --bg-secondary:   #111111;
  --bg-tertiary:    #161616;
  --bg-elevated:    #1c1c1c;
  --bg-overlay:     rgba(10,10,10,0.85);
  --card-bg:        rgba(255,255,255,0.03);

  /* Text */
  --text-main:      #ededed;
  --text-sub:       #888888;
  --text-faint:     #444444;
  --text-inverse:   #0a0a0a;

  /* Borders */
  --border:         rgba(255,255,255,0.07);
  --border-strong:  rgba(255,255,255,0.12);
  --border-focus:   rgba(255,255,255,0.30);

  /* Semantic */
  --success:        #22c55e;
  --success-bg:     rgba(34,197,94,0.08);
  --success-border: rgba(34,197,94,0.20);
  --warning:        #f59e0b;
  --warning-bg:     rgba(245,158,11,0.08);
  --warning-border: rgba(245,158,11,0.20);
  --error:          #ef4444;
  --error-bg:       rgba(239,68,68,0.08);
  --error-border:   rgba(239,68,68,0.20);
  --info:           #3b82f6;
  --info-bg:        rgba(59,130,246,0.08);
  --info-border:    rgba(59,130,246,0.20);

  /* Typography */
  --font-sans:  'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono:  'Geist Mono', 'SF Mono', Consolas, 'Fira Code', monospace;

  /* Spacing & Shape */
  --radius:       10px;
  --radius-sm:    6px;
  --radius-lg:    14px;
  --radius-xl:    20px;
  --radius-pill:  9999px;

  /* Shadows */
  --shadow:         0 0 0 1px var(--border), 0 4px 24px rgba(0,0,0,0.5);
  --shadow-sm:      0 1px 4px rgba(0,0,0,0.4);
  --shadow-lg:      0 0 0 1px var(--border), 0 16px 48px rgba(0,0,0,0.7);
  --shadow-glow:    0 0 30px rgba(255,255,255,0.04);

  /* Transitions */
  --transition:     all 0.22s cubic-bezier(0.4,0,0.2,1);
  --transition-spring: all 0.45s cubic-bezier(0.34,1.56,0.64,1);
  --ease-out:       cubic-bezier(0.16,1,0.3,1);

  /* Nav */
  --nav-h: 56px;
}

/* Pink theme override (from common.js body.pink) */
body.pink {
  --primary:       #ff2d55;
  --primary-rgb:   255,45,85;
  --primary-light: rgba(255,45,85,0.10);
  --primary-glow:  rgba(255,45,85,0.15);
  --bg:            #0f080a;
}

/* ─── 2. Reset ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
html.shuo-smooth * { scroll-behavior: smooth !important; }

body {
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.65;
  color: var(--text-main);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background 0.4s var(--ease-out), color 0.4s var(--ease-out);
  min-height: 100vh;
}

button, a, [role="button"] {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

/* ─── 3. Global Theme Transition ───────────────────────────── */
*, ::before, ::after {
  transition:
    color        0.35s cubic-bezier(0.4,0,0.2,1),
    background   0.35s cubic-bezier(0.4,0,0.2,1),
    background-color 0.35s cubic-bezier(0.4,0,0.2,1),
    border-color 0.35s cubic-bezier(0.4,0,0.2,1),
    fill         0.35s cubic-bezier(0.4,0,0.2,1),
    stroke       0.35s cubic-bezier(0.4,0,0.2,1),
    opacity      0.35s cubic-bezier(0.4,0,0.2,1);
}

/* ─── 4. Scrollbar ─────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.10);
  border-radius: var(--radius-pill);
}
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
::selection { background: rgba(255,255,255,0.12); color: var(--text-main); }

/* ─── 5. Typography ────────────────────────────────────────── */
h1,h2,h3,h4,h5,h6 {
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.03em;
  color: var(--text-main);
  transition: color 0.35s;
  user-select: none;
  margin: 1em 0 0.6em;
}
h1 { font-size: clamp(1.75rem, 4vw, 2.75rem); letter-spacing: -0.05em; font-weight: 800; }
h2 { font-size: clamp(1.5rem, 3vw, 2.25rem);  letter-spacing: -0.04em; }
h3 { font-size: clamp(1.25rem, 2.5vw, 1.75rem); letter-spacing: -0.03em; }
h4 { font-size: clamp(1.1rem, 2vw, 1.35rem); }
h5 { font-size: 1.05rem; }
h6 { font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-sub); font-weight: 600; }

p {
  font-size: 15px;
  line-height: 1.75;
  color: var(--text-sub);
  margin: 0.65em 0;
  transition: color 0.35s;
  user-select: none;
}
p.lead { font-size: 1.125rem; color: var(--text-sub); }

a {
  color: var(--text-main);
  text-decoration: none;
  transition: opacity 0.18s var(--ease-out), color 0.18s var(--ease-out);
}
a:hover { opacity: 0.72; }

strong,b { font-weight: 600; color: var(--text-main); }
em,i     { font-style: italic; }
small    { font-size: 0.8125rem; color: var(--text-sub); }
mark     { background: rgba(255,255,255,0.10); color: var(--text-main); padding: 0.1em 0.35em; border-radius: 4px; }
del,s    { color: var(--text-faint); }
code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.15em 0.4em;
  color: var(--text-main);
}
pre {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  line-height: 1.7;
  color: var(--text-main);
}
pre code { background: none; border: none; padding: 0; font-size: inherit; }
kbd {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-strong);
  border-bottom-width: 2px;
  border-radius: 4px;
  padding: 0.1em 0.45em;
  color: var(--text-main);
}

/* Lists */
ul,ol {
  padding-left: 1.4rem;
  color: var(--text-sub);
  line-height: 1.75;
  margin: 0.75rem 0;
  transition: var(--transition);
  user-select: none;
}
ul { list-style: none; padding-left: 1rem; }
ul li {
  position: relative;
  margin: 0.4rem 0;
  font-size: 15px;
  padding-left: 0.4rem;
  color: var(--text-sub);
}
ul li::before {
  content: '';
  position: absolute;
  left: -0.85rem; top: 0.62rem;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(var(--primary-rgb),0.5);
  transition: background 0.35s;
}
ol { list-style: none; counter-reset: ol-num; padding-left: 1.2rem; }
ol li {
  position: relative;
  margin: 0.4rem 0;
  font-size: 15px;
  padding-left: 0.4rem;
  color: var(--text-sub);
}
ol li::before {
  counter-increment: ol-num;
  content: counter(ol-num) ".";
  position: absolute;
  left: -1.4rem;
  color: var(--primary);
  font-weight: 600;
  opacity: 0.7;
  transition: color 0.35s;
}

blockquote {
  border-left: 2px solid var(--border-strong);
  padding-left: 1.25rem;
  margin-left: 0;
  color: var(--text-sub);
  font-style: italic;
}
blockquote cite { display: block; font-size: 0.8125rem; font-style: normal; color: var(--text-faint); margin-top: 0.5rem; }
blockquote cite::before { content: '— '; }

hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }

/* Mobile typography */
@media (max-width: 768px) {
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }
  h4 { font-size: 1.1rem; }
  p, ul li, ol li { font-size: 14px; line-height: 1.65; }
}

/* ─── 6. Layout Primitives ─────────────────────────────────── */
#content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
}
@media (max-width: 768px) { #content { padding: 0 1rem 3rem; } }

.container       { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; width: 100%; }
.container-sm    { max-width: 640px; }
.container-md    { max-width: 768px; }
.container-lg    { max-width: 1024px; }
.container-xl    { max-width: 1280px; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.25rem;
}
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 768px) {
  .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .grid, .grid-2, .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
}

/* ─── 7. Header / Nav ──────────────────────────────────────── */
header,
.header,
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  height: var(--nav-h);
  background: rgba(10,10,10,0.80);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border);
  transition: background 0.4s, border-color 0.4s, box-shadow 0.4s, top 0.5s, width 0.5s, border-radius 0.5s;
  overflow: hidden;
}

/* Sweep shimmer on navbar bottom edge */
.navbar {
  position: relative;
}
.navbar::after,
header::after {
  content: "";
  position: absolute;
  bottom: 0; left: -100%;
  width: 50%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), rgba(255,255,255,0.08), transparent);
  animation: nav-sweep 8s infinite linear;
  pointer-events: none;
}
@keyframes nav-sweep {
  0%   { left: -100%; }
  100% { left: 200%; }
}

/* Scrolled pill header */
header.scrolled,
.header.scrolled {
  top: 12px;
  width: 90%;
  left: 5%;
  position: fixed;
  border-radius: var(--radius-xl);
  padding: 0 1.5rem;
  height: 48px;
  box-shadow: 0 0 0 1px var(--border-strong), 0 12px 40px rgba(0,0,0,0.5);
  background: rgba(16,16,16,0.92);
}

/* Logo */
.logo {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, var(--text-main) 0%, rgba(255,255,255,0.55) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: opacity 0.2s;
  text-decoration: none;
  white-space: nowrap;
}
.logo:hover { opacity: 0.75; }

/* Nav list (pill style) */
.nav-list {
  display: flex;
  list-style: none;
  padding: 4px;
  background: rgba(255,255,255,0.04);
  border-radius: var(--radius-pill);
  gap: 2px;
}

.nav-link {
  position: relative;
  z-index: 2;
  padding: 6px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-sub);
  text-decoration: none;
  border-radius: var(--radius-pill);
  transition: color 0.22s;
  white-space: nowrap;
  /* Text shimmer effect */
  background: linear-gradient(90deg, var(--text-sub) 40%, var(--text-main) 50%, var(--text-sub) 60%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.07);
  border-radius: var(--radius-pill);
  z-index: -1;
  opacity: 0;
  transform: scale(0.85);
  transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
}
.nav-link:hover { background-position: -60% 0; transition: background-position 0.5s ease; opacity: 1; }
.nav-link:hover::before { opacity: 1; transform: scale(1); }
.nav-link.active { -webkit-text-fill-color: var(--text-main); background: none; }

/* Nav item hover capsule */
.nav-item {
  position: relative;
  z-index: 1;
}
.nav-item::before {
  content: '';
  position: absolute;
  inset: 4px -8px;
  background: rgba(255,255,255,0.06);
  border-radius: var(--radius-sm);
  z-index: -1;
  opacity: 0;
  transform: scale(0.88);
  transition: all 0.28s cubic-bezier(0.23,1,0.32,1);
}
.nav-item:hover::before { opacity: 1; transform: scale(1); }

/* Theme toggle button */
.theme-btn {
  cursor: pointer;
  border: 1px solid var(--border-strong);
  background: var(--bg-elevated);
  color: var(--text-main);
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: var(--font-sans);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  transition: all 0.22s var(--ease-out) !important;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.theme-btn::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent);
  transition: left 0.55s ease;
}
.theme-btn:hover { background: var(--bg-hover,#222); border-color: var(--border-focus); transform: translateY(-1px) scale(1.04); }
.theme-btn:hover::after { left: 100%; }
.theme-btn:active { transform: translateY(0) scale(0.97); }

/* ─── 8. Hero ──────────────────────────────────────────────── */
.hero {
  padding: 4rem 1.5rem 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: hero-in 0.8s var(--ease-out) both;
}
@keyframes hero-in {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero::before {
  content: '';
  position: absolute;
  top: -160px; left: 50%;
  transform: translateX(-50%);
  width: 700px; height: 500px;
  background: radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 70%);
  pointer-events: none;
}
.hero h1 {
  font-size: clamp(2rem,5vw,3.5rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  margin: 0 0 0.75rem;
  line-height: 1.05;
  animation: fade-up 0.7s 0.1s var(--ease-out) both;
}
.hero p {
  font-size: clamp(0.9375rem,2vw,1.1rem);
  color: var(--text-sub);
  max-width: 540px;
  margin: 0 auto 2rem;
  line-height: 1.75;
  animation: fade-up 0.7s 0.2s var(--ease-out) both;
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── 9. Sections ──────────────────────────────────────────── */
.section {
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.6s var(--ease-out) both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  margin-bottom: 1.25rem;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding-left: 4px;
}
.section-title svg { width: 20px; height: 20px; color: var(--primary); flex-shrink: 0; }

/* ─── 10. Cards ────────────────────────────────────────────── */
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.25rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.28s var(--ease-out),
              box-shadow 0.28s var(--ease-out),
              transform 0.28s var(--ease-out),
              background 0.28s var(--ease-out) !important;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
  /* Stagger entrance */
  animation: card-in 0.5s var(--ease-out) both;
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.04), transparent 60%);
  opacity: 0;
  transition: opacity 0.35s;
  pointer-events: none;
}
.card:hover {
  transform: translateY(-6px);
  border-color: var(--border-strong);
  box-shadow: 0 0 0 1px var(--border-strong), 0 24px 48px rgba(0,0,0,0.6);
  background: rgba(255,255,255,0.035);
}
.card:hover::before { opacity: 1; }

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);
}
.card-title {
  position: relative;
  z-index: 1;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: -0.02em;
  transition: color 0.28s, transform 0.28s !important;
}
.card:hover .card-title { color: var(--primary); transform: translateY(-1px); }
.card-description { font-size: 0.8125rem; color: var(--text-sub); margin-top: 2px; }
.card-footer { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: flex-end; gap: 0.625rem; }

/* Icon box inside card */
.icon-box {
  position: relative; z-index: 1;
  width: 46px; height: 46px;
  margin: 0 auto 1rem;
  background: var(--primary-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary);
  font-size: 1.125rem;
  transition: all 0.32s cubic-bezier(0.34,1.56,0.64,1) !important;
}
.card:hover .icon-box {
  transform: rotate(-6deg) scale(1.15);
  background: rgba(var(--primary-rgb),0.15);
  border-color: rgba(var(--primary-rgb),0.2);
  box-shadow: 0 6px 20px rgba(var(--primary-rgb),0.15);
}

/* Glass card */
.glass-card {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  transition: box-shadow 0.3s, background 0.3s, transform 0.3s, border-color 0.3s !important;
}
.glass-card:hover {
  background: rgba(255,255,255,0.055);
  border-color: rgba(255,255,255,0.14);
  box-shadow: 0 20px 48px rgba(0,0,0,0.5);
  transform: translateY(-4px);
}

/* ─── 11. Buttons ──────────────────────────────────────────── */
button,
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  height: 36px;
  padding: 0 1rem;
  border-radius: var(--radius);
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  text-decoration: none;
  letter-spacing: -0.01em;
  background: var(--bg-elevated);
  color: var(--text-main);
  transition:
    background 0.18s var(--ease-out),
    color 0.18s var(--ease-out),
    border-color 0.18s var(--ease-out),
    box-shadow 0.18s var(--ease-out),
    transform 0.18s var(--ease-out),
    filter 0.18s var(--ease-out) !important;
}

/* Shimmer sweep on all buttons */
button::before, .btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  transition: none;
  pointer-events: none;
}
button:hover::before, .btn:hover::before {
  left: 100%;
  transition: left 0.55s ease;
}

button:hover, .btn:hover { transform: translateY(-2px) scale(1.02); }
button:active, .btn:active {
  transform: translateY(1px) scale(0.97);
  transition: transform 0.08s ease, box-shadow 0.08s ease !important;
}
button:disabled, .btn:disabled {
  opacity: 0.35; cursor: not-allowed; transform: none !important; pointer-events: none;
}
button:focus-visible, .btn:focus-visible {
  outline: 2px solid var(--text-main); outline-offset: 2px;
}

/* Primary button */
.btn-primary, button.btn-primary {
  background: var(--text-main);
  color: var(--text-inverse);
  border-color: transparent;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.15);
}
.btn-primary:hover { background: #d4d4d4; }

/* Secondary */
.btn-secondary, button.btn-secondary {
  background: var(--bg-elevated);
  color: var(--text-main);
  border-color: var(--border-strong);
}
.btn-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.22); }

/* Ghost */
.btn-ghost, button.btn-ghost {
  background: transparent; color: var(--text-sub); border-color: transparent;
}
.btn-ghost:hover { background: rgba(255,255,255,0.06); color: var(--text-main); }

/* Danger */
.btn-danger, button.btn-danger {
  background: var(--error-bg); color: var(--error); border-color: var(--error-border);
}
.btn-danger:hover { background: rgba(239,68,68,0.14); }

/* Sizes */
.btn-sm { height: 28px; padding: 0 0.625rem; font-size: 0.75rem; border-radius: 6px; }
.btn-lg { height: 44px; padding: 0 1.5rem; font-size: 1rem; border-radius: var(--radius-lg); }
.btn-xl { height: 52px; padding: 0 2rem; font-size: 1.0625rem; border-radius: var(--radius-xl); }
.btn-icon { padding: 0; width: 36px; }
.btn-icon.btn-sm { width: 28px; }
.btn-icon.btn-lg { width: 44px; }
.btn-full { width: 100%; }

/* Button animation modifiers (common.js classes) */
.btn-scale:hover { transform: scale(1.07) !important; box-shadow: 0 0 0 1px var(--border), 0 8px 24px rgba(0,0,0,0.4); }
.btn-scale:active { transform: scale(0.96) !important; }

.btn-float:hover { transform: translateY(-5px) !important; box-shadow: 0 12px 28px rgba(0,0,0,0.45); }

.btn-shine::after {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
  transition: left 0.6s ease;
}
.btn-shine:hover::after { left: 100%; }

.btn-border {
  background: transparent;
  color: var(--primary);
  border: 1.5px solid rgba(var(--primary-rgb),0.35);
}
.btn-border:hover {
  background: rgba(var(--primary-rgb),0.08);
  border-color: rgba(var(--primary-rgb),0.55);
  box-shadow: 0 0 20px rgba(var(--primary-rgb),0.15);
}

.btn-rect { border-radius: 8px; }
.btn-rect:hover { border-radius: 3px; }

.btn-pulse:hover {
  box-shadow: 0 0 0 4px rgba(var(--primary-rgb),0.12);
  animation: btn-pulse-anim 1.2s infinite;
}
@keyframes btn-pulse-anim {
  0%   { box-shadow: 0 0 0 0   rgba(var(--primary-rgb),0.35); }
  100% { box-shadow: 0 0 0 14px rgba(var(--primary-rgb),0);   }
}

/* Loading state */
.btn-loading { pointer-events: none; opacity: 0.7; }
.btn-loading::after {
  content: '';
  width: 14px; height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: btn-spin 0.65s linear infinite;
  margin-left: 6px;
  flex-shrink: 0;
}
@keyframes btn-spin { to { transform: rotate(360deg); } }

/* Theme / refresh button */
.theme-btn,
.refresh-btn {
  border: 1px solid var(--border-strong);
  background: var(--bg-elevated);
  color: var(--text-main);
  padding: 7px 18px;
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  transition: all 0.28s cubic-bezier(0.25,1,0.5,1) !important;
  box-shadow: var(--shadow-sm);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  font-family: var(--font-sans);
}
.refresh-btn {
  padding: 10px 26px;
  border-radius: var(--radius-pill);
}
.refresh-btn::after {
  content: '';
  position: absolute;
  width: 100%; height: 100%;
  top: 0; left: 0;
  background: rgba(255,255,255,0.08);
  border-radius: inherit;
  transform: scale(0); opacity: 0;
  transition: transform 0.5s ease, opacity 0.3s ease;
}
.refresh-btn:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
.refresh-btn:active { transform: translateY(0) scale(0.97); transition: all 0.08s ease !important; }
.refresh-btn:active::after { transform: scale(1.2); opacity: 1; transition: none !important; }

/* Combo duang (bouncing idle animation) */
.combo-duang {
  display: inline-block;
  will-change: transform;
  animation: continuous-duang 2.8s infinite ease-in-out;
  transition: transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.4s ease;
}
.combo-duang:hover {
  animation: none;
  transform: scale(1.06) translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.5);
}
.combo-duang:active {
  animation: none;
  transform: scale(0.91) translateY(2px);
  transition: transform 0.08s ease, box-shadow 0.08s ease !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
@keyframes continuous-duang {
  0%   { transform: scale(1); }
  12%  { transform: scale(1.10) translateY(-5px); }
  25%  { transform: scale(0.94) translateY(2px); }
  38%  { transform: scale(1.04); }
  55%  { transform: scale(1); }
  100% { transform: scale(1); }
}

/* ─── 12. Links ────────────────────────────────────────────── */
.link-plain { text-decoration: none !important; }

.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: var(--primary-light);
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.22s var(--ease-out);
}
.link-btn:hover { background: rgba(255,255,255,0.10); border-color: var(--border-strong); transform: translateY(-1px); opacity: 1; }

.footer-link {
  display: inline-block;
  margin: 0 8px;
  padding: 5px 14px;
  background: var(--primary-light);
  color: var(--text-sub);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  position: relative;
  overflow: hidden;
  transition: all 0.28s cubic-bezier(0.25,1,0.5,1);
}
.footer-link::after {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent);
  transition: left 0.55s ease;
}
.footer-link:hover { background: rgba(255,255,255,0.08); color: var(--text-main); border-color: var(--border-strong); transform: translateY(-2px) scale(1.04); opacity: 1; }
.footer-link:hover::after { left: 100%; }
.footer-link:active { transform: translateY(0) scale(0.96); }

/* ─── 13. Forms ────────────────────────────────────────────── */
.form-group { display: flex; flex-direction: column; gap: 6px; }

label, .label {
  font-size: 0.8125rem; font-weight: 500; color: var(--text-main); display: block;
}
.label-optional::after {
  content: ' (optional)'; font-weight: 400; color: var(--text-faint); font-size: 0.75rem;
}
.field-hint  { font-size: 0.75rem; color: var(--text-sub); line-height: 1.5; }
.field-error { font-size: 0.75rem; color: var(--error); display: flex; align-items: center; gap: 4px; }

input[type="text"],
input[type="email"],
input[type="password"],
input[type="url"],
input[type="tel"],
input[type="number"],
input[type="search"],
input[type="date"],
input[type="time"],
input[type="datetime-local"],
input {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--text-main);
  background: var(--bg-secondary);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0 0.75rem;
  height: 36px;
  width: 100%;
  max-width: 400px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s, transform 0.18s;
  box-shadow: var(--shadow-sm);
}
input::placeholder { color: var(--text-faint); opacity: 1; }
input:hover  { border-color: var(--border-focus); }
input:focus  {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb),0.06);
  background: var(--bg-tertiary,#161616);
  transform: translateY(-1px);
}
input:disabled { opacity: 0.4; cursor: not-allowed; }
input.input-error  { border-color: var(--error-border);   box-shadow: 0 0 0 3px var(--error-bg); }
input.input-success{ border-color: var(--success-border); }
body.pink input:focus { box-shadow: 0 0 0 3px rgba(255,45,85,0.10); }

textarea {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  color: var(--text-main);
  background: var(--bg-secondary);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.75rem;
  width: 100%;
  max-width: 800px;
  min-height: 120px;
  resize: vertical;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  line-height: 1.65;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s, transform 0.18s;
  margin: 8px 0;
}
textarea::placeholder { color: var(--text-faint); opacity: 1; }
textarea:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb),0.06);
  background: var(--bg-tertiary,#161616);
  transform: translateY(-1px);
}
textarea:disabled {
  opacity: 0.4; cursor: not-allowed;
  background: rgba(255,255,255,0.02);
}
textarea[readonly] { background: rgba(255,255,255,0.02); box-shadow: none; transform: none; }
body.pink textarea:focus { box-shadow: 0 0 0 3px rgba(255,45,85,0.10); }

select {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--text-main);
  background: var(--bg-secondary);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0 2rem 0 0.75rem;
  height: 36px;
  width: 100%;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.18s, box-shadow 0.18s;
}
select:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(var(--primary-rgb),0.06); }

/* Checkbox / Radio */
input[type="checkbox"],
input[type="radio"] {
  width: 16px; height: 16px;
  min-width: 16px;
  padding: 0; max-width: 16px;
  border: 1px solid var(--border-strong);
  background: var(--bg-secondary);
  cursor: pointer;
  flex-shrink: 0;
  -webkit-appearance: none; appearance: none;
  position: relative;
  transition: background 0.18s, border-color 0.18s, box-shadow 0.18s;
  transform: none;
}
input[type="checkbox"]:checked,
input[type="radio"]:checked {
  background: var(--text-main);
  border-color: var(--text-main);
}
input[type="checkbox"] { border-radius: 4px; }
input[type="radio"]    { border-radius: 50%; }
input[type="checkbox"]:checked::after {
  content: '';
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-58%) rotate(45deg);
  width: 4px; height: 7px;
  border: 2px solid var(--text-inverse);
  border-top: none; border-left: none;
}
input[type="radio"]:checked::after {
  content: '';
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  width: 6px; height: 6px;
  background: var(--text-inverse);
  border-radius: 50%;
}
input[type="checkbox"]:focus-visible,
input[type="radio"]:focus-visible {
  outline: 2px solid var(--text-main); outline-offset: 2px;
}
input[type="checkbox"]:hover,
input[type="radio"]:hover { border-color: var(--border-focus); }

.checkbox-label, .radio-label {
  display: inline-flex; align-items: center; gap: 8px;
  cursor: pointer; font-size: 0.875rem; color: var(--text-main); user-select: none;
}

/* Range */
input[type="range"] {
  height: 4px; padding: 0; border: none;
  border-radius: var(--radius-pill);
  background: var(--border-strong);
  cursor: pointer; outline: none;
  max-width: unset; min-width: unset;
  transform: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px; height: 16px;
  background: var(--text-main);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  transition: transform 0.18s var(--ease-out);
}
input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.25); }
input[type="range"]::-webkit-slider-thumb:active { transform: scale(1.4); }

/* Toggle */
.toggle { position: relative; width: 36px; height: 20px; display: inline-flex; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-track {
  position: absolute; inset: 0;
  background: var(--border-strong);
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background 0.22s;
}
.toggle-track::after {
  content: '';
  position: absolute; top: 3px; left: 3px;
  width: 14px; height: 14px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
}
.toggle input:checked + .toggle-track { background: var(--text-main); }
.toggle input:checked + .toggle-track::after { transform: translateX(16px); background: var(--text-inverse); }

/* Input prefix/suffix wrapper */
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-wrapper input { flex: 1; }
.input-prefix, .input-suffix {
  position: absolute; display: flex; align-items: center;
  color: var(--text-faint); font-size: 0.875rem; pointer-events: none;
}
.input-prefix { left: 10px; }
.input-suffix { right: 10px; }
.input-wrapper .input-prefix ~ input { padding-left: 2rem; }

/* ─── 14. Badges ───────────────────────────────────────────── */
.badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.6875rem; font-weight: 500;
  height: 21px; padding: 0 7px;
  border-radius: 4px;
  white-space: nowrap; line-height: 1;
}
.badge-default  { background: var(--bg-elevated); color: var(--text-sub); border: 1px solid var(--border-strong); }
.badge-success  { background: var(--success-bg); color: var(--success); border: 1px solid var(--success-border); }
.badge-error    { background: var(--error-bg);   color: var(--error);   border: 1px solid var(--error-border); }
.badge-warning  { background: var(--warning-bg); color: var(--warning); border: 1px solid var(--warning-border); }
.badge-info     { background: var(--info-bg);    color: var(--info);    border: 1px solid var(--info-border); }
.badge-dot::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; animation: dot-pulse 2s infinite; }
@keyframes dot-pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.35; } }

/* ─── 15. Alerts ───────────────────────────────────────────── */
.alert { display: flex; gap: 10px; padding: 14px; border-radius: var(--radius-lg); font-size: 0.875rem; line-height: 1.65; animation: alert-in 0.35s var(--ease-out) both; }
@keyframes alert-in { from{ opacity:0; transform: translateY(-6px); } to{ opacity:1; transform:none; } }
.alert-icon  { flex-shrink: 0; line-height: 1.6; }
.alert-title { font-weight: 600; margin-bottom: 2px; }
.alert-default  { background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-sub); }
.alert-default .alert-title { color: var(--text-main); }
.alert-success  { background: var(--success-bg); border: 1px solid var(--success-border); color: var(--success); }
.alert-error    { background: var(--error-bg);   border: 1px solid var(--error-border);   color: var(--error); }
.alert-warning  { background: var(--warning-bg); border: 1px solid var(--warning-border); color: var(--warning); }
.alert-info     { background: var(--info-bg);    border: 1px solid var(--info-border);    color: var(--info); }

/* ─── 16. Tables ───────────────────────────────────────────── */
table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
th {
  text-align: left; font-weight: 500;
  font-size: 0.6875rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-faint); padding: 10px 14px;
  border-bottom: 1px solid var(--border);
}
td { padding: 10px 14px; border-bottom: 1px solid var(--border); color: var(--text-sub); vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tbody tr { transition: background 0.15s; }
tbody tr:hover { background: rgba(255,255,255,0.025); }
.table-wrapper { border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* ─── 17. Tabs ─────────────────────────────────────────────── */
.tabs { display: flex; border-bottom: 1px solid var(--border); overflow-x: auto; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab {
  font-size: 0.875rem; font-weight: 500; color: var(--text-sub);
  padding: 10px 16px;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  cursor: pointer; text-decoration: none;
  transition: color 0.18s, border-color 0.18s;
  white-space: nowrap;
}
.tab:hover  { color: var(--text-main); opacity: 1; }
.tab.active { color: var(--text-main); border-bottom-color: var(--text-main); }

.tabs-pill { display: inline-flex; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 4px; gap: 4px; }
.tabs-pill .tab { border-bottom: none; border-radius: var(--radius); padding: 6px 16px; margin: 0; }
.tabs-pill .tab.active { background: var(--bg-elevated); color: var(--text-main); box-shadow: var(--shadow-sm); }

/* ─── 18. Avatar ───────────────────────────────────────────── */
.avatar {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%; overflow: hidden;
  background: var(--bg-elevated); border: 1px solid var(--border);
  flex-shrink: 0; font-weight: 600; color: var(--text-sub); user-select: none;
}
.avatar-sm  { width: 24px; height: 24px; font-size: 0.6875rem; }
.avatar-md  { width: 32px; height: 32px; font-size: 0.8125rem; }
.avatar-lg  { width: 40px; height: 40px; font-size: 0.9375rem; }
.avatar-xl  { width: 56px; height: 56px; font-size: 1.25rem; }
.avatar-2xl { width: 80px; height: 80px; font-size: 2rem; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-group { display: flex; }
.avatar-group .avatar { margin-left: -8px; border: 2px solid var(--bg); }
.avatar-group .avatar:first-child { margin-left: 0; }

/* ─── 19. Tooltip ──────────────────────────────────────────── */
[data-tooltip] { position: relative; }
[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute; bottom: calc(100% + 7px); left: 50%;
  transform: translateX(-50%) translateY(4px);
  font-size: 0.75rem; font-family: var(--font-sans);
  background: rgba(28,28,28,0.95);
  border: 1px solid var(--border-strong);
  color: var(--text-main);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  white-space: nowrap; pointer-events: none;
  opacity: 0;
  transition: opacity 0.18s, transform 0.18s;
  z-index: 999;
  backdrop-filter: blur(8px);
}
[data-tooltip]:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ─── 20. Progress ─────────────────────────────────────────── */
.progress { height: 4px; background: var(--bg-elevated); border-radius: var(--radius-pill); overflow: hidden; }
.progress-bar { height: 100%; border-radius: var(--radius-pill); background: var(--text-main); transition: width 0.4s var(--ease-out); }
.progress-bar.success { background: var(--success); }
.progress-bar.error   { background: var(--error); }
.progress-bar.warning { background: var(--warning); }
/* Indeterminate */
.progress-bar.indeterminate {
  width: 40% !important;
  animation: progress-slide 1.5s infinite ease-in-out;
  background: linear-gradient(90deg, transparent, var(--text-main), transparent);
}
@keyframes progress-slide { 0%{ transform:translateX(-150%); } 100%{ transform:translateX(350%); } }

/* Skeleton */
.skeleton {
  background: linear-gradient(90deg, var(--bg-elevated) 25%, rgba(255,255,255,0.05) 50%, var(--bg-elevated) 75%);
  background-size: 200% 100%;
  border-radius: var(--radius);
  animation: skeleton-shimmer 1.6s infinite;
}
@keyframes skeleton-shimmer { from{ background-position:200% 0; } to{ background-position:-200% 0; } }

/* ─── 21. Modal ────────────────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  animation: fade-in 0.22s var(--ease-out);
}
@keyframes fade-in { from{opacity:0;} to{opacity:1;} }
.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-xl);
  width: 100%; max-width: 500px;
  box-shadow: var(--shadow-lg);
  animation: modal-in 0.4s var(--ease-out);
}
@keyframes modal-in { from{opacity:0;transform:translateY(20px) scale(0.96);} to{opacity:1;transform:none;} }
.modal-header { padding: 1.5rem 1.5rem 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.modal-title  { font-size: 1.125rem; font-weight: 600; letter-spacing: -0.03em; }
.modal-close  { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); border: none; background: transparent; color: var(--text-faint); cursor: pointer; font-size: 18px; line-height: 1; transition: background 0.15s, color 0.15s; flex-shrink: 0; }
.modal-close:hover { background: var(--bg-elevated); color: var(--text-main); }
.modal-body   { padding: 1.25rem 1.5rem; }
.modal-footer { padding: 0 1.5rem 1.5rem; display: flex; align-items: center; justify-content: flex-end; gap: 10px; }

/* ─── 22. Dropdown ─────────────────────────────────────────── */
.dropdown { position: relative; display: inline-block; }
.dropdown-menu {
  position: absolute; top: calc(100% + 6px); left: 0;
  min-width: 160px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  padding: 4px; box-shadow: var(--shadow-lg); z-index: 50;
  animation: menu-in 0.18s var(--ease-out);
}
@keyframes menu-in { from{opacity:0;transform:translateY(-6px) scale(0.97);} to{opacity:1;transform:none;} }
.dropdown-menu.align-right { left: auto; right: 0; }
.menu-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px; font-size: 0.875rem; color: var(--text-sub);
  border-radius: var(--radius-sm); cursor: pointer; text-decoration: none;
  transition: background 0.14s, color 0.14s;
  width: 100%; background: none; border: none; text-align: left; font-family: var(--font-sans);
}
.menu-item:hover { background: rgba(255,255,255,0.06); color: var(--text-main); opacity: 1; }
.menu-item.danger:hover { background: var(--error-bg); color: var(--error); }
.menu-separator { height: 1px; background: var(--border); margin: 4px 0; }

/* ─── 23. Video ────────────────────────────────────────────── */
video {
  display: block; max-width: 100%; width: 100%; height: auto;
  margin: 1rem auto;
  border-radius: var(--radius);
  background: #000; outline: none;
  -webkit-user-drag: none; user-select: none;
  transition: var(--transition);
  box-shadow: var(--shadow);
}
.video-box {
  position: relative; width: 100%; max-width: 800px; margin: 1.25rem auto;
  padding: 10px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius-lg) + 4px);
  box-shadow: var(--shadow);
  transition: var(--transition);
}
.video-box:hover { border-color: var(--border-strong); box-shadow: var(--shadow-lg); }
@media (max-width: 768px) { .video-box { padding: 6px; } video { border-radius: 10px; } }

/* ─── 24. Article ──────────────────────────────────────────── */
.article h2, .article h3, .article h4, .article h5, .article h6 { text-align: center; }
.article p   { text-align: center; }
.article ul, .article ol { list-style: none; padding-left: 0; text-align: center; }
.article li  { color: var(--text-sub); margin: 0.35rem 0; }

/* ─── 25. Footer ───────────────────────────────────────────── */
footer {
  text-align: center; padding: 2.5rem;
  color: var(--text-faint); font-size: 0.875rem;
  border-top: 1px solid var(--border);
  transition: color 0.4s;
}
footer a { color: var(--text-sub); }
footer a:hover { color: var(--text-main); opacity: 1; }
.footer-links { margin-bottom: 1rem; }

/* ─── 26. Divider / Misc ────────────────────────────────────── */
.divider {
  display: flex; align-items: center; gap: 1rem;
  color: var(--text-faint); font-size: 0.75rem;
  letter-spacing: 0.08em; text-transform: uppercase;
}
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* Focus ring */
:focus-visible { outline: 2px solid var(--text-main); outline-offset: 2px; }

/* ─── 27. Animations Library ────────────────────────────────── */

/* Entrance */
@keyframes fadeIn        { from{opacity:0;} to{opacity:1;} }
@keyframes fadeInUp      { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:none;} }
@keyframes fadeInDown    { from{opacity:0;transform:translateY(-20px);} to{opacity:1;transform:none;} }
@keyframes fadeInLeft    { from{opacity:0;transform:translateX(-20px);} to{opacity:1;transform:none;} }
@keyframes fadeInRight   { from{opacity:0;transform:translateX(20px);} to{opacity:1;transform:none;} }
@keyframes scaleIn       { from{opacity:0;transform:scale(0.88);} to{opacity:1;transform:scale(1);} }
@keyframes slideInUp     { from{transform:translateY(100%);} to{transform:none;} }
@keyframes slideInDown   { from{transform:translateY(-100%);} to{transform:none;} }
@keyframes blurIn        { from{opacity:0;filter:blur(12px);} to{opacity:1;filter:blur(0);} }
@keyframes popIn         { 0%{opacity:0;transform:scale(0.7);} 70%{transform:scale(1.06);} 100%{opacity:1;transform:scale(1);} }
@keyframes rotateIn      { from{opacity:0;transform:rotate(-12deg) scale(0.92);} to{opacity:1;transform:none;} }
@keyframes flipInX       { from{opacity:0;transform:perspective(600px) rotateX(-25deg);} to{opacity:1;transform:none;} }
@keyframes flipInY       { from{opacity:0;transform:perspective(600px) rotateY(-25deg);} to{opacity:1;transform:none;} }

/* Continuous / Loop */
@keyframes float         { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
@keyframes pulse-ring    { 0%{transform:scale(1);opacity:1;} 100%{transform:scale(1.5);opacity:0;} }
@keyframes wiggle        { 0%,100%{transform:rotate(0);} 25%{transform:rotate(-4deg);} 75%{transform:rotate(4deg);} }
@keyframes heartbeat     { 0%,100%{transform:scale(1);} 14%{transform:scale(1.15);} 28%{transform:scale(1);} 42%{transform:scale(1.1);} 70%{transform:scale(1);} }
@keyframes spin          { to{transform:rotate(360deg);} }
@keyframes ping          { 0%{transform:scale(1);opacity:1;} 100%{transform:scale(2);opacity:0;} }
@keyframes bounce        { 0%,100%{transform:translateY(0);animation-timing-function:cubic-bezier(0.8,0,1,1);} 50%{transform:translateY(-24px);animation-timing-function:cubic-bezier(0,0,0.2,1);} }
@keyframes rubber-band   { 0%{transform:scaleX(1);} 30%{transform:scaleX(1.25) scaleY(0.75);} 40%{transform:scaleX(0.75) scaleY(1.25);} 60%{transform:scaleX(1.15) scaleY(0.85);} 80%{transform:scaleX(0.95) scaleY(1.05);} 100%{transform:scaleX(1);} }
@keyframes shake         { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(8px);} 60%{transform:translateX(-5px);} 80%{transform:translateX(5px);} }
@keyframes tada          { 0%{transform:scale(1);} 10%,20%{transform:scale(0.9) rotate(-5deg);} 30%,50%,70%,90%{transform:scale(1.1) rotate(5deg);} 40%,60%,80%{transform:scale(1.1) rotate(-5deg);} 100%{transform:scale(1) rotate(0);} }
@keyframes jello         { 0%,100%{transform:skewX(0) skewY(0);} 30%{transform:skewX(-12deg) skewY(-12deg);} 40%{transform:skewX(6deg) skewY(6deg);} 50%{transform:skewX(-4deg) skewY(-4deg);} 65%{transform:skewX(2deg) skewY(2deg);} 75%{transform:skewX(-1.5deg) skewY(-1.5deg);} }
@keyframes glow-pulse    { 0%,100%{box-shadow:0 0 8px rgba(var(--primary-rgb),0.15);} 50%{box-shadow:0 0 28px rgba(var(--primary-rgb),0.40);} }
@keyframes typewriter    { from{width:0;} to{width:100%;} }
@keyframes blink-cursor  { 50%{border-color:transparent;} }
@keyframes gradient-shift { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
@keyframes text-shimmer  { 0%{background-position:150% center;} 100%{background-position:-50% center;} }
@keyframes morph         { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;} }

/* Utility animation classes */
.animate-fade-in       { animation: fadeIn       0.5s var(--ease-out) both; }
.animate-fade-up       { animation: fadeInUp     0.6s var(--ease-out) both; }
.animate-fade-down     { animation: fadeInDown   0.6s var(--ease-out) both; }
.animate-fade-left     { animation: fadeInLeft   0.6s var(--ease-out) both; }
.animate-fade-right    { animation: fadeInRight  0.6s var(--ease-out) both; }
.animate-scale-in      { animation: scaleIn      0.45s var(--ease-out) both; }
.animate-pop-in        { animation: popIn        0.5s var(--ease-out) both; }
.animate-blur-in       { animation: blurIn       0.7s var(--ease-out) both; }
.animate-rotate-in     { animation: rotateIn     0.5s var(--ease-out) both; }
.animate-flip-x        { animation: flipInX      0.6s var(--ease-out) both; }
.animate-flip-y        { animation: flipInY      0.6s var(--ease-out) both; }
.animate-float         { animation: float        3s ease-in-out infinite; }
.animate-bounce        { animation: bounce       1.2s infinite; }
.animate-wiggle        { animation: wiggle       0.5s ease-in-out; }
.animate-heartbeat     { animation: heartbeat    1.4s ease infinite; }
.animate-spin          { animation: spin         0.8s linear infinite; }
.animate-ping          { animation: ping         1.5s cubic-bezier(0,0,0.2,1) infinite; }
.animate-rubber-band   { animation: rubber-band  0.8s var(--ease-out); }
.animate-shake         { animation: shake        0.6s var(--ease-out); }
.animate-tada          { animation: tada         1s var(--ease-out); }
.animate-jello         { animation: jello        0.9s var(--ease-out); }
.animate-glow          { animation: glow-pulse   2s ease-in-out infinite; }
.animate-morph         { animation: morph        6s ease-in-out infinite; }

/* Gradient text shimmer */
.text-shimmer {
  background: linear-gradient(120deg, var(--text-sub) 20%, var(--text-main) 50%, var(--text-sub) 80%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: text-shimmer 3s linear infinite;
}
/* Gradient animated background */
.gradient-animated {
  background: linear-gradient(270deg, #0a0a0a, #1a1a1a, #0f0f0f, #111);
  background-size: 400% 400%;
  animation: gradient-shift 8s ease infinite;
}
/* Typewriter effect */
.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid var(--text-main);
  animation: typewriter 3s steps(40,end) both, blink-cursor 0.75s step-end infinite;
}

/* Delay utilities */
.delay-75  { animation-delay: 75ms; }
.delay-100 { animation-delay: 100ms; }
.delay-150 { animation-delay: 150ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-500 { animation-delay: 500ms; }
.delay-700 { animation-delay: 700ms; }
.delay-1000{ animation-delay: 1000ms; }

/* ─── 28. Settings Panel (shuoweb) ──────────────────────────── */
.shuo-settings-mask {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  display: flex; justify-content: center; align-items: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s var(--ease-out);
}
.shuo-settings-mask.active { opacity: 1; pointer-events: auto; }

.shuo-settings-panel {
  width: 92%; max-width: 520px; max-height: 88vh;
  background: var(--bg-secondary);
  border: 1px solid var(--border-strong);
  border-radius: 24px; padding: 22px 22px 18px;
  box-shadow: var(--shadow-lg);
  transform: translateY(40px) scale(0.93);
  transition: transform 0.48s cubic-bezier(0.34,1.56,0.64,1);
  display: flex; flex-direction: column; overflow: hidden;
}
.shuo-settings-mask.active .shuo-settings-panel { transform: none; }

.shuo-settings-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 14px; padding: 0 2px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.shuo-settings-title {
  font-size: 1.125rem; font-weight: 800; color: var(--text-main);
  margin: 0; display: flex; align-items: center; gap: 9px;
  letter-spacing: -0.04em;
}
.shuo-settings-title svg { width: 20px; height: 20px; color: var(--primary); flex-shrink: 0; }

.shuo-close-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg-elevated); color: var(--text-sub);
  border: 1px solid var(--border); display: flex; justify-content: center; align-items: center;
  cursor: pointer; flex-shrink: 0; font-family: var(--font-sans);
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.18s, color 0.18s;
}
.shuo-close-btn:hover { transform: rotate(90deg); background: var(--bg-hover,#222); color: var(--text-main); }

/* Search */
.shuo-search-wrap { position: relative; margin-bottom: 12px; flex-shrink: 0; }
.shuo-search-icon {
  position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
  width: 15px; height: 15px; color: var(--text-faint); pointer-events: none;
}
.shuo-search-input {
  width: 100%; box-sizing: border-box;
  padding: 9px 12px 9px 34px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-strong);
  background: var(--bg-tertiary,#161616);
  color: var(--text-main); font-size: 0.875rem;
  outline: none; font-family: var(--font-sans);
  transition: border-color 0.18s, box-shadow 0.18s;
  -webkit-appearance: none;
  max-width: unset;
}
.shuo-search-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(var(--primary-rgb),0.06); transform: none; }

/* Scroll area */
.shuo-settings-body {
  overflow-y: auto; overflow-x: hidden;
  padding: 2px 0 6px; display: flex; flex-direction: column; gap: 6px;
  scrollbar-width: none; -webkit-overflow-scrolling: touch;
  flex: 1; min-height: 0;
}
.shuo-settings-body::-webkit-scrollbar { display: none; }

/* Category label */
.shuo-cat-label {
  font-size: 0.6875rem; font-weight: 700; color: var(--text-faint);
  text-transform: uppercase; letter-spacing: 0.12em;
  padding: 8px 2px 2px;
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}
.shuo-cat-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* Setting item */
.shuo-setting-item {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 12px;
  background: var(--bg-tertiary,#161616);
  border-radius: var(--radius-lg); border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: border-color 0.22s, box-shadow 0.22s;
  flex-shrink: 0;
}
@media (hover: hover) {
  .shuo-setting-item:hover { border-color: var(--border-strong); box-shadow: 0 4px 16px rgba(0,0,0,0.35); }
}
.shuo-setting-item.shuo-hidden { display: none !important; }

.shuo-setting-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--primary-light); color: var(--primary);
  border: 1px solid var(--border); 
  display: flex; justify-content: center; align-items: center; flex-shrink: 0;
}
.shuo-setting-icon svg { width: 18px; height: 18px; fill: none; stroke: currentColor; }
.shuo-setting-info { flex-grow: 1; min-width: 0; }
.shuo-setting-name {
  font-size: 0.875rem; font-weight: 600; color: var(--text-main);
  margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.shuo-setting-desc { font-size: 0.6875rem; color: var(--text-sub); line-height: 1.45; }

/* iOS-style switch */
.shuo-switch {
  appearance: none; -webkit-appearance: none;
  width: 48px; height: 26px;
  background: var(--border-strong);
  border-radius: 30px; position: relative; cursor: pointer; outline: none;
  transition: background 0.26s ease; flex-shrink: 0;
}
.shuo-switch::after {
  content: ''; position: absolute; top: 2px; left: 2px;
  width: 22px; height: 22px; background: #fff; border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  transition: transform 0.36s cubic-bezier(0.34,1.56,0.64,1);
}
.shuo-switch:checked { background: var(--text-main); }
.shuo-switch:checked::after { transform: translateX(22px); background: var(--text-inverse); }

/* Range */
.shuo-range-container { width: 92px; flex-shrink: 0; }
.shuo-range {
  -webkit-appearance: none; width: 100%; height: 5px;
  background: var(--border-strong); border-radius: 5px; outline: none; cursor: pointer;
  max-width: unset; transform: none; padding: 0; border: none; height: 5px;
}
.shuo-range::-webkit-slider-thumb {
  -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
  background: var(--text-main); cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  transition: transform 0.15s;
}
.shuo-range::-webkit-slider-thumb:active { transform: scale(1.3); }

/* Buttons 2×2 grid */
.shuo-settings-footer {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  padding-top: 12px; border-top: 1px solid var(--border); flex-shrink: 0;
}
.shuo-btn {
  padding: 11px 8px; border-radius: var(--radius-lg); border: none;
  font-size: 0.8125rem; font-weight: 700; cursor: pointer;
  transition: filter 0.18s, transform 0.18s !important;
  display: flex; align-items: center; justify-content: center; gap: 5px;
  line-height: 1; -webkit-tap-highlight-color: transparent; font-family: var(--font-sans);
}
@media (hover: hover) {
  .shuo-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
}
.shuo-btn:active { filter: brightness(0.9); transform: translateY(0) scale(0.97) !important; }
.shuo-btn svg { width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 2.2; flex-shrink: 0; }
.shuo-btn.primary { background: var(--text-main);  color: var(--text-inverse); box-shadow: 0 4px 14px rgba(255,255,255,0.10); }
.shuo-btn.success { background: var(--success);     color: #fff; box-shadow: 0 4px 14px rgba(34,197,94,0.25); }
.shuo-btn.warning { background: var(--warning);     color: #000; box-shadow: 0 4px 14px rgba(245,158,11,0.25); }
.shuo-btn.danger  { background: var(--error);       color: #fff; box-shadow: 0 4px 14px rgba(239,68,68,0.25); }

/* Toast */
.shuo-toast {
  position: fixed; bottom: 36px; left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(28,28,28,0.96);
  border: 1px solid var(--border-strong);
  color: var(--text-main);
  padding: 10px 22px;
  border-radius: 24px; font-size: 0.8125rem; font-weight: 600;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  z-index: 999999999; opacity: 0; pointer-events: none;
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  white-space: nowrap; font-family: var(--font-sans);
}
.shuo-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ─── 29. Feature Mode Classes ──────────────────────────────── */
body.immersive-mode header,
body.immersive-mode nav,
body.immersive-mode .header,
body.immersive-mode footer {
  opacity: 0 !important; pointer-events: none !important;
  transform: translateY(-100%) !important;
}
body.termux-mode { font-family: var(--font-mono) !important; }
body.termux-mode * { font-family: var(--font-mono) !important; }
body.m3-mode { --radius: 24px !important; --shadow: 0 2px 8px rgba(0,0,0,0.2) !important; }
body.debug-mode * { outline: 1px dashed rgba(255,255,255,0.18) !important; }

html.shuo-dark { filter: invert(1) hue-rotate(180deg); }
html.shuo-dark img, html.shuo-dark video, html.shuo-dark canvas,
html.shuo-dark [style*="background-image"] { filter: invert(1) hue-rotate(180deg); }
html.shuo-dark #shuoweb-settings-mask,
html.shuo-dark #shuo-fps-monitor,
html.shuo-dark #shuo-progress-bar,
html.shuo-dark #shuo-totop-btn,
html.shuo-dark .shuo-toast { filter: invert(1) hue-rotate(180deg); }

html.shuo-grayscale { filter: grayscale(1); }
html.shuo-dark.shuo-grayscale { filter: invert(1) hue-rotate(180deg) grayscale(1); }

/* ─── 30. Widgets ───────────────────────────────────────────── */
/* Reading progress bar */
#shuo-progress-bar {
  position: fixed; top: 0; left: 0; z-index: 999999;
  height: 2px; width: 0%;
  background: linear-gradient(90deg, var(--text-main) 0%, rgba(255,255,255,0.5) 100%);
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 12px rgba(255,255,255,0.3);
  transition: width 0.1s linear; display: none; pointer-events: none;
}
body.progress-mode #shuo-progress-bar { display: block; }

/* FPS monitor */
#shuo-fps-monitor {
  position: fixed; top: 14px; right: 14px; z-index: 99998;
  background: rgba(0,0,0,0.92);
  border: 1px solid rgba(34,197,94,0.3);
  color: var(--success);
  font-family: var(--font-mono);
  padding: 7px 12px; border-radius: var(--radius-sm);
  font-size: 0.6875rem; font-weight: 600;
  pointer-events: none; display: none; line-height: 1.7;
  box-shadow: 0 4px 16px rgba(0,0,0,0.5);
}
body.fps-mode #shuo-fps-monitor { display: block; }

/* Back to top button */
#shuo-totop-btn {
  position: fixed; bottom: 88px; right: 20px; z-index: 99997;
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--bg-elevated) !important;
  border: 1px solid var(--border-strong) !important;
  outline: none !important;
  display: none; justify-content: center; align-items: center;
  cursor: pointer; padding: 0;
  box-shadow: var(--shadow);
  opacity: 0; transform: translateY(18px) scale(0.8);
  transition: opacity 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s;
  -webkit-tap-highlight-color: transparent;
}
body.totop-mode #shuo-totop-btn { display: flex; }
#shuo-totop-btn.visible { opacity: 1; transform: none; }
#shuo-totop-btn:hover { box-shadow: var(--shadow-lg); transform: scale(1.12) !important; }
#shuo-totop-btn:active { transform: scale(0.94) !important; }

/* Cursor glow */
#shuo-cursor-glow {
  position: fixed; width: 320px; height: 320px; border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--primary-rgb),0.05) 0%, transparent 70%);
  pointer-events: none; z-index: 99990;
  transform: translate(-50%,-50%);
  transition: left 0.07s ease-out, top 0.07s ease-out; display: none;
}
body.highlight-mode #shuo-cursor-glow { display: block; }

/* ─── 31. Utility Classes ───────────────────────────────────── */
.sr-only    { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border-width:0; }
.truncate   { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.overflow-hidden { overflow:hidden; }
.relative   { position:relative; }
.absolute   { position:absolute; }
.flex       { display:flex; }
.flex-col   { flex-direction:column; }
.flex-wrap  { flex-wrap:wrap; }
.items-center { align-items:center; }
.items-start  { align-items:flex-start; }
.justify-between { justify-content:space-between; }
.justify-center  { justify-content:center; }
.justify-end     { justify-content:flex-end; }
.gap-2 { gap:0.5rem; }
.gap-3 { gap:0.75rem; }
.gap-4 { gap:1rem; }
.gap-6 { gap:1.5rem; }
.gap-8 { gap:2rem; }
.text-center  { text-align:center !important; }
.text-right   { text-align:right; }
.text-muted   { color:var(--text-sub) !important; }
.text-faint   { color:var(--text-faint) !important; }
.text-success { color:var(--success) !important; }
.text-error   { color:var(--error) !important; }
.text-warning { color:var(--warning) !important; }
.text-mono    { font-family:var(--font-mono) !important; }
.text-xs  { font-size:0.6875rem; }
.text-sm  { font-size:0.875rem; }
.text-base{ font-size:0.9375rem; }
.text-lg  { font-size:1.125rem; }
.text-xl  { font-size:1.25rem; }
.font-medium  { font-weight:500; }
.font-semibold{ font-weight:600; }
.font-bold    { font-weight:700; }
.font-black   { font-weight:900; }
.leading-tight  { line-height:1.2; }
.leading-relaxed{ line-height:1.8; }
.tracking-tight  { letter-spacing:-0.04em; }
.tracking-wider  { letter-spacing:0.08em; }
.tracking-widest { letter-spacing:0.14em; }
.rounded-full { border-radius:9999px; }
.rounded-lg   { border-radius:var(--radius-lg); }
.border       { border:1px solid var(--border); }
.border-strong{ border:1px solid var(--border-strong); }
.mt-1{margin-top:.25rem;} .mt-2{margin-top:.5rem;} .mt-3{margin-top:.75rem;}
.mt-4{margin-top:1rem;}   .mt-6{margin-top:1.5rem;} .mt-8{margin-top:2rem;}
.mb-1{margin-bottom:.25rem;} .mb-2{margin-bottom:.5rem;} .mb-3{margin-bottom:.75rem;}
.mb-4{margin-bottom:1rem;}   .mb-6{margin-bottom:1.5rem;} .mb-8{margin-bottom:2rem;}
.p-3{padding:.75rem;} .p-4{padding:1rem;} .p-5{padding:1.25rem;} .p-6{padding:1.5rem;}
.hidden { display:none !important; }
.hide-mobile {}

/* ─── 32. Mobile Responsive ─────────────────────────────────── */
@media (max-width: 768px) {
  header, .header, .navbar { padding: 0 1.25rem; height: 52px; }
  header.scrolled, .header.scrolled { width: 92%; left: 4%; top: 8px; }
  .nav-list { display: none; }
  #content { padding: 0 1rem 2.5rem; }
  .hero { padding: 2.5rem 1rem 2rem; }
  .grid-2 { grid-template-columns: 1fr; }
  .modal { max-width: 100%; border-radius: var(--radius-xl) var(--radius-xl) 0 0; }
  .modal-overlay { align-items: flex-end; padding: 0; }
  .hide-mobile { display: none !important; }
  @keyframes modal-in { from{opacity:0;transform:translateY(100%);} to{opacity:1;transform:none;} }
}
@media (max-width: 600px) {
  .shuo-settings-mask { align-items: flex-end; }
  .shuo-settings-panel {
    width: 100%; max-width: 100%; max-height: 91vh;
    border-radius: 20px 20px 0 0;
    padding: 0 14px calc(18px + env(safe-area-inset-bottom,0px));
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.32,0.72,0,1);
    box-shadow: 0 -8px 40px rgba(0,0,0,0.4);
  }
  .shuo-settings-mask.active .shuo-settings-panel { transform: none; }
  .shuo-settings-panel::before {
    content: ''; display: block; width: 32px; height: 4px;
    background: var(--border-strong); border-radius: 2px;
    margin: 10px auto 14px; flex-shrink: 0;
  }
  .shuo-settings-title { font-size: 1rem; }
  .shuo-setting-item { padding: 10px 10px; gap: 9px; border-radius: var(--radius); }
  .shuo-setting-icon { width: 34px; height: 34px; border-radius: 9px; }
  .shuo-setting-icon svg { width: 16px; height: 16px; }
  .shuo-setting-name { font-size: 0.8125rem; }
  .shuo-setting-desc { font-size: 0.625rem; }
  .shuo-switch { width: 44px; height: 24px; }
  .shuo-switch::after { width: 20px; height: 20px; }
  .shuo-switch:checked::after { transform: translateX(20px); }
  .shuo-range-container { width: 76px; }
  .shuo-settings-footer { gap: 7px; padding-top: 10px; }
  .shuo-btn { font-size: 0.75rem; padding: 10px 6px; border-radius: var(--radius); gap: 4px; }
  .shuo-btn svg { width: 12px; height: 12px; }
  #shuo-totop-btn { bottom: calc(72px + env(safe-area-inset-bottom,0px)); right: 14px; width: 40px; height: 40px; }
  .shuo-toast { bottom: calc(22px + env(safe-area-inset-bottom,0px)); }
}
@media (max-width: 380px) {
  .shuo-settings-title { font-size: 0.9rem; gap: 6px; }
  .shuo-settings-title svg { width: 17px; height: 17px; }
  .shuo-btn { font-size: 0.6875rem; }
}
@media (max-width: 480px) {
  .card-footer { flex-direction: column-reverse; align-items: stretch; }
  .card-footer .btn { width: 100%; justify-content: center; }
  .modal-footer { flex-direction: column-reverse; }
  .modal-footer .btn { width: 100%; justify-content: center; }
  .btn-xl { height: 48px; font-size: 0.9375rem; }
  pre { font-size: 0.75rem; padding: 1rem; border-radius: var(--radius); }
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
    <p>&copy; 2026 SHUOWEB.COM · 不忘初心</p><br>
    页面浏览量：<span id="vercount_value_page_pv">Loading</span>
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

!function(){"use strict";const t=[];let e=!1,n=null;const o="visitorCountData",a=async()=>{const t=window.location.href;if(!t.startsWith("http"))return null;const e=new AbortController,n=setTimeout((()=>e.abort()),5e3);try{const o=await fetch("https://events.vercount.one/api/v2/log",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:t}),signal:e.signal});if(clearTimeout(n),!o.ok)throw new Error(`HTTP ${o.status}`);return(t=>"success"===t?.status&&t.data?t.data:"error"===t?.status?(console.warn("API error:",t.message),t.data||{site_uv:0,site_pv:0,page_pv:0}):t||{site_uv:0,site_pv:0,page_pv:0})(await o.json())}catch(t){return clearTimeout(n),"AbortError"===t.name?console.warn("Request timeout"):console.warn("API error:",t.message),null}},s=()=>{if(n)return n;return n={},["site_pv","page_pv","site_uv"].forEach((t=>{n[`busuanzi_value_${t}`]=document.getElementById(`busuanzi_value_${t}`),n[`busuanzi_container_${t}`]=document.getElementById(`busuanzi_container_${t}`),n[`vercount_value_${t}`]=document.getElementById(`vercount_value_${t}`),n[`vercount_container_${t}`]=document.getElementById(`vercount_container_${t}`)})),n},r=t=>{const e=s();["site_pv","page_pv","site_uv"].forEach((n=>{const o=String(t[n]||"0"),a=e[`busuanzi_value_${n}`],s=e[`vercount_value_${n}`];a&&(a.textContent=o),s&&(s.textContent=o)}))},u=()=>{const t=s();["site_pv","page_pv","site_uv"].forEach((e=>{const n=t[`busuanzi_container_${e}`],o=t[`vercount_container_${e}`];n&&(n.style.display="inline"),o&&(o.style.display="inline")}))};var i;i=async()=>{(()=>{const t=s();["site_pv","page_pv","site_uv"].forEach((e=>{const n=t[`busuanzi_container_${e}`],o=t[`vercount_container_${e}`];n&&(n.style.display="none"),o&&(o.style.display="none")}))})();const t=await a();if(t)r(t),(t=>{try{localStorage.setItem(o,JSON.stringify(t))}catch(t){}})(t),u();else{const t=(()=>{try{const t=localStorage.getItem(o);return t?JSON.parse(t):null}catch(t){return null}})();t&&(r(t),u())}},e||"loading"!==document.readyState?i():(t.push(i),document.addEventListener("DOMContentLoaded",(()=>{e=!0,t.forEach((t=>t()))}),{once:!0}))}();

(function () {
    /* ========= 防重复加载 ========= */
    if (window.__SHUOWEB_SETTINGS_PRO__) return;
    window.__SHUOWEB_SETTINGS_PRO__ = true;

    function ready(fn) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
        else fn();
    }
    ready(initSettings);

    /* ================= 分类定义（仅用于分组标签）================= */
    const CATEGORIES = [
        { id: 'experience', label: '体验' },
        { id: 'appearance', label: '外观' },
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
            /* ── 遮罩 ── */
            .shuo-settings-mask {
                position: fixed; inset: 0; z-index: 99999;
                background: rgba(15, 23, 42, 0.45);
                backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                display: flex; justify-content: center; align-items: center;
                opacity: 0; pointer-events: none;
                transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .shuo-settings-mask.active { opacity: 1; pointer-events: auto; }

            /* ── 面板（桌面居中）── */
            .shuo-settings-panel {
                width: 92%; max-width: 520px; max-height: 88vh;
                background: #ffffff;
                border-radius: 28px; padding: 24px 24px 20px;
                box-shadow: 0 40px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.6);
                transform: translateY(50px) scale(0.92);
                transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                display: flex; flex-direction: column; overflow: hidden;
                box-sizing: border-box;
            }
            .shuo-settings-mask.active .shuo-settings-panel { transform: translateY(0) scale(1); }

            /* ── 头部 ── */
            .shuo-settings-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 16px; padding: 0 4px 16px;
                border-bottom: 1px solid rgba(0,0,0,0.06);
                flex-shrink: 0;
            }
            .shuo-settings-title {
                font-size: 20px; font-weight: 800; color: #1c1c1e;
                margin: 0; display: flex; align-items: center; gap: 10px; letter-spacing: -0.4px;
            }
            .shuo-settings-title svg { width: 22px; height: 22px; color: #007AFF; flex-shrink: 0; }
            .shuo-close-btn {
                width: 36px; height: 36px; border-radius: 50%;
                background: #EBF4FF; color: #007AFF;
                display: flex; justify-content: center; align-items: center;
                cursor: pointer; transition: all 0.3s ease; flex-shrink: 0;
            }
            .shuo-close-btn:hover { transform: rotate(90deg); background: #007AFF; color: #fff; }

            /* ── 搜索框 ── */
            .shuo-search-wrap {
                position: relative; margin-bottom: 14px; flex-shrink: 0;
            }
            .shuo-search-icon {
                position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
                width: 16px; height: 16px; color: #8e8e93; pointer-events: none;
            }
            .shuo-search-input {
                width: 100%; box-sizing: border-box; padding: 10px 14px 10px 36px;
                border-radius: 14px; border: 1.5px solid rgba(0,0,0,0.08);
                background: #f2f2f7; color: #1c1c1e;
                font-size: 14px; outline: none;
                transition: border-color 0.2s, box-shadow 0.2s;
                -webkit-appearance: none;
            }
            .shuo-search-input:focus {
                border-color: #007AFF;
                box-shadow: 0 0 0 3px rgba(0,122,255,0.12);
            }

            /* ── 滚动区 ── */
            .shuo-settings-body {
                overflow-y: auto; overflow-x: hidden;
                padding: 2px 0 8px; display: flex; flex-direction: column; gap: 8px;
                scrollbar-width: none; -webkit-overflow-scrolling: touch;
                flex: 1; min-height: 0;
            }
            .shuo-settings-body::-webkit-scrollbar { display: none; }

            /* ── 分组标签 ── */
            .shuo-cat-label {
                font-size: 11px; font-weight: 800; color: #8e8e93;
                text-transform: uppercase; letter-spacing: 1.4px;
                padding: 8px 4px 2px;
                display: flex; align-items: center; gap: 8px;
                flex-shrink: 0;
            }
            .shuo-cat-label::after {
                content: ''; flex: 1; height: 1px;
                background: rgba(142,142,147,0.3);
            }

            /* ── 设置卡片 ── */
            .shuo-setting-item {
                display: flex; align-items: center; gap: 12px;
                padding: 13px 14px; background: #f2f2f7;
                border-radius: 18px; border: 1px solid rgba(0,0,0,0.04);
                box-shadow: 0 1px 6px rgba(0,0,0,0.04);
                transition: border-color 0.25s, box-shadow 0.25s;
                flex-shrink: 0;
            }
            @media (hover: hover) {
                .shuo-setting-item:hover {
                    border-color: #c7dcff;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.07);
                }
            }
            .shuo-setting-item.shuo-hidden { display: none !important; }

            .shuo-setting-icon {
                width: 40px; height: 40px; border-radius: 11px;
                background: #EBF4FF; color: #007AFF;
                display: flex; justify-content: center; align-items: center; flex-shrink: 0;
            }
            .shuo-setting-icon svg { width: 20px; height: 20px; fill: none; stroke: currentColor; }
            .shuo-setting-info { flex-grow: 1; min-width: 0; }
            .shuo-setting-name {
                font-size: 14px; font-weight: 700; color: #1c1c1e; margin-bottom: 2px;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .shuo-setting-desc {
                font-size: 11.5px; color: #6e6e73; line-height: 1.4;
            }

            /* ── iOS Switch ── */
            .shuo-switch {
                appearance: none; -webkit-appearance: none;
                width: 50px; height: 28px; background: rgba(0,0,0,0.12);
                border-radius: 30px; position: relative; cursor: pointer; outline: none;
                transition: background 0.28s ease; flex-shrink: 0;
            }
            .shuo-switch::after {
                content: ''; position: absolute; top: 2px; left: 2px;
                width: 24px; height: 24px; background: #fff; border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.22);
                transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .shuo-switch:checked { background: #007AFF; }
            .shuo-switch:checked::after { transform: translateX(22px); }

            /* ── Range ── */
            .shuo-range-container { width: 96px; flex-shrink: 0; }
            .shuo-range {
                -webkit-appearance: none; width: 100%; height: 6px;
                background: #d0e4ff; border-radius: 6px; outline: none; cursor: pointer;
            }
            .shuo-range::-webkit-slider-thumb {
                -webkit-appearance: none; appearance: none;
                width: 20px; height: 20px; border-radius: 50%;
                background: #007AFF; cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.22); transition: transform 0.15s;
            }
            .shuo-range::-webkit-slider-thumb:active { transform: scale(1.3); }

            /* ── Footer 2×2 ── */
            .shuo-settings-footer {
                display: grid; grid-template-columns: 1fr 1fr; gap: 9px;
                padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06);
                flex-shrink: 0;
            }
            .shuo-btn {
                padding: 12px 8px; border-radius: 16px; border: none;
                font-size: 13px; font-weight: 700; cursor: pointer;
                transition: filter 0.2s ease, transform 0.2s ease;
                display: flex; align-items: center; justify-content: center; gap: 6px;
                line-height: 1; -webkit-tap-highlight-color: transparent;
            }
            @media (hover: hover) {
                .shuo-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
            }
            .shuo-btn:active { filter: brightness(0.92); transform: translateY(0) scale(0.97); }
            .shuo-btn svg {
                width: 14px; height: 14px; fill: none;
                stroke: currentColor; stroke-width: 2.2; flex-shrink: 0;
            }
            /* ── 按钮：全部使用实色背景 + 白色文字，确保高对比度 ── */
            .shuo-btn.primary { background: #007AFF; color: #ffffff; box-shadow: 0 4px 14px rgba(0,122,255,0.38); }
            .shuo-btn.success { background: #25C452; color: #ffffff; box-shadow: 0 4px 14px rgba(37,196,82,0.38); }
            .shuo-btn.warning { background: #F5970A; color: #ffffff; box-shadow: 0 4px 14px rgba(245,151,10,0.38); }
            .shuo-btn.danger  { background: #E8234A; color: #ffffff; box-shadow: 0 4px 14px rgba(232,35,74,0.38); }

            /* ── Toast ── */
            .shuo-toast {
                position: fixed; bottom: 36px; left: 50%;
                transform: translateX(-50%) translateY(16px);
                background: rgba(28,28,30,0.92); color: #fff; padding: 10px 22px;
                border-radius: 24px; font-size: 13.5px; font-weight: 600;
                backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                z-index: 999999999;
                opacity: 0; pointer-events: none;
                transition: all 0.32s cubic-bezier(0.34,1.56,0.64,1);
                white-space: nowrap;
            }
            .shuo-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

            /* ── 动态功能类 ── */
            body.immersive-mode header,
            body.immersive-mode nav,
            body.immersive-mode footer {
                opacity: 0 !important; pointer-events: none !important;
                transform: translateY(-100%) !important;
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
                background: rgba(0,0,0,0.88); color: #0f0;
                font-family: 'SF Mono', Consolas, monospace;
                padding: 8px 14px; border-radius: 12px; font-size: 11.5px; font-weight: 600;
                pointer-events: none; display: none; line-height: 1.75;
                box-shadow: 0 4px 16px rgba(0,0,0,0.35); border: 1px solid rgba(0,255,0,0.25);
            }
            body.fps-mode #shuo-fps-monitor { display: block; }

            /* ── 阅读进度条 ── */
            #shuo-progress-bar {
                position: fixed; top: 0; left: 0; z-index: 999999;
                height: 3px; width: 0%;
                background: linear-gradient(90deg, #007AFF 0%, #5856D6 60%, #AF52DE 100%);
                border-radius: 0 3px 3px 0;
                box-shadow: 0 0 10px #007AFF;
                transition: width 0.1s linear; display: none; pointer-events: none;
            }
            body.progress-mode #shuo-progress-bar { display: block; }

            /* ── 回顶按钮 ── */
            #shuo-totop-btn {
                position: fixed; bottom: 88px; right: 20px; z-index: 99997;
                width: 48px; height: 48px; border-radius: 50%;
                background: #007AFF !important;
                border: none !important; outline: none !important;
                display: none; justify-content: center; align-items: center;
                cursor: pointer; padding: 0;
                box-shadow: 0 4px 18px rgba(0,122,255,0.42);
                opacity: 0; transform: translateY(16px) scale(0.8);
                transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                            box-shadow 0.25s ease;
                -webkit-tap-highlight-color: transparent;
            }
            body.totop-mode #shuo-totop-btn { display: flex; }
            #shuo-totop-btn.visible { opacity: 1; transform: translateY(0) scale(1); }
            #shuo-totop-btn:hover { box-shadow: 0 8px 28px rgba(0,122,255,0.55); transform: scale(1.1) !important; }
            #shuo-totop-btn:active { transform: scale(0.95) !important; }

            /* ── 鼠标光晕 ── */
            #shuo-cursor-glow {
                position: fixed; width: 300px; height: 300px; border-radius: 50%;
                background: radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%);
                pointer-events: none; z-index: 99990; transform: translate(-50%, -50%);
                transition: left 0.08s ease-out, top 0.08s ease-out; display: none;
            }
            body.highlight-mode #shuo-cursor-glow { display: block; }

            /* ════════════════════════════════════════
               移动端适配：底部弹出 Sheet 样式
               ════════════════════════════════════════ */
            @media (max-width: 600px) {
                /* 遮罩改为底部对齐 */
                .shuo-settings-mask {
                    align-items: flex-end;
                }
                /* 面板从底部弹出，圆角仅上方 */
                .shuo-settings-panel {
                    width: 100%;
                    max-width: 100%;
                    max-height: 91vh;
                    border-radius: 22px 22px 0 0;
                    padding: 16px 16px calc(20px + env(safe-area-inset-bottom, 0px));
                    transform: translateY(100%);
                    transition: transform 0.42s cubic-bezier(0.32, 0.72, 0, 1);
                    box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
                }
                .shuo-settings-mask.active .shuo-settings-panel {
                    transform: translateY(0);
                }
                /* 顶部拖动指示条 */
                .shuo-settings-panel::before {
                    content: '';
                    display: block;
                    width: 36px; height: 4px;
                    background: rgba(0,0,0,0.15);
                    border-radius: 2px;
                    margin: 0 auto 14px;
                    flex-shrink: 0;
                }
                .shuo-settings-title { font-size: 17px; }
                .shuo-settings-header { margin-bottom: 12px; padding-bottom: 12px; }
                /* 设置项更紧凑 */
                .shuo-setting-item {
                    padding: 11px 12px; gap: 10px; border-radius: 14px;
                }
                .shuo-setting-icon {
                    width: 36px; height: 36px; border-radius: 9px;
                }
                .shuo-setting-icon svg { width: 18px; height: 18px; }
                .shuo-setting-name { font-size: 13.5px; }
                .shuo-setting-desc { font-size: 11px; }
                /* Switch 稍小 */
                .shuo-switch { width: 46px; height: 26px; }
                .shuo-switch::after { width: 22px; height: 22px; }
                .shuo-switch:checked::after { transform: translateX(20px); }
                /* Range 控件 */
                .shuo-range-container { width: 78px; }
                /* 底部按钮 */
                .shuo-settings-footer { gap: 8px; padding-top: 12px; }
                .shuo-btn {
                    font-size: 12.5px; padding: 11px 6px;
                    border-radius: 14px; gap: 5px;
                }
                .shuo-btn svg { width: 13px; height: 13px; }
                /* 回顶按钮适配底部安全区 */
                #shuo-totop-btn {
                    bottom: calc(76px + env(safe-area-inset-bottom, 0px));
                    right: 16px;
                    width: 44px; height: 44px;
                }
                /* Toast 留出安全区 */
                .shuo-toast {
                    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
                }
            }

            @media (max-width: 380px) {
                .shuo-settings-title { font-size: 15.5px; gap: 7px; }
                .shuo-settings-title svg { width: 18px; height: 18px; }
                .shuo-btn { font-size: 11.5px; }
            }
        `;
        document.head.appendChild(style);
    }

    /* ================= 2. 构建 DOM ================= */
    function createDOM() {
        const mask = document.createElement('div');
        mask.className = 'shuo-settings-mask';
        mask.id = 'shuoweb-settings-mask';

        /* 搜索框（无 Tab 导航）*/
        const searchHTML = `
            <div class="shuo-search-wrap">
                <svg class="shuo-search-icon" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="7"/>
                    <path stroke-linecap="round" d="M21 21l-3.5-3.5"/>
                </svg>
                <input class="shuo-search-input" id="shuo-search" type="search"
                    placeholder="搜索功能…" autocomplete="off" autocorrect="off" spellcheck="false">
            </div>`;

        /* 按分类构建列表 */
        let listHTML = '';
        CATEGORIES.forEach(cat => {
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

        /* 按钮 SVG */
        const svgShare  = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0
            110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0
            00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>`;
        const svgExport = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`;
        const svgImport = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>`;
        const svgTrash  = `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6
            m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`;

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
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        Engineers Pro
                    </h3>
                    <div class="shuo-close-btn" id="shuo-close-btn" role="button" aria-label="关闭">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor"
                            stroke-width="2.5" fill="none">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </div>
                </div>
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

        /* ── FPS 监控 ── */
        const fpsDiv = document.createElement('div');
        fpsDiv.id = 'shuo-fps-monitor';
        document.body.appendChild(fpsDiv);

        /* ── 进度条 ── */
        const progressBar = document.createElement('div');
        progressBar.id = 'shuo-progress-bar';
        document.body.appendChild(progressBar);

        /* ── 回顶按钮（内联 SVG 属性，确保任意宿主页面均可渲染）── */
        const totopBtn = document.createElement('button');
        totopBtn.id = 'shuo-totop-btn';
        totopBtn.setAttribute('aria-label', '回到顶部');
        totopBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24" width="22" height="22"
            fill="none"
            stroke="#ffffff"
            stroke-width="2.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="display:block;pointer-events:none;">
            <path d="M5 15l7-7 7 7"/>
        </svg>`;
        document.body.appendChild(totopBtn);

        /* ── 光晕 ── */
        const glowDiv = document.createElement('div');
        glowDiv.id = 'shuo-cursor-glow';
        document.body.appendChild(glowDiv);

        /* ── Toast ── */
        const toast = document.createElement('div');
        toast.className = 'shuo-toast';
        toast.id = 'shuo-toast';
        document.body.appendChild(toast);

        /* ── 导入文件选择 ── */
        const importInput = document.createElement('input');
        importInput.type = 'file'; importInput.id = 'shuo-import-input';
        importInput.accept = '.json'; importInput.style.display = 'none';
        document.body.appendChild(importInput);
    }

    /* ================= 3. 功能实现 ================= */

    /* Toast */
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
                if (a && a.href && !a.href.startsWith(location.origin) &&
                    !/^(#|javascript)/.test(a.getAttribute('href') || '')) {
                    a.target = '_blank'; a.rel = 'noopener noreferrer';
                }
            };
            document.addEventListener('click', extH, true);
            document.querySelectorAll(`a[href]:not([href^="#"]):not([href^="javascript"])`).forEach(a => {
                try {
                    if (new URL(a.href).origin !== location.origin) {
                        a.target = '_blank'; a.rel = 'noopener noreferrer';
                    }
                } catch {}
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

        /* 搜索框（已移除 Tab，直接按文字过滤）*/
        document.getElementById('shuo-search').addEventListener('input', e => {
            filterItems(e.target.value);
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
                } catch { showToast('文件格式错误，请检查 JSON'); }
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

    /* ── 搜索过滤（已移除分类 Tab，仅保留文字搜索）── */
    function filterItems(query) {
        const q = (query || '').trim().toLowerCase();
        const body = document.getElementById('shuo-settings-body');
        body.querySelectorAll('.shuo-setting-item').forEach(item => {
            const nameMatch = !q || item.dataset.name.toLowerCase().includes(q);
            item.classList.toggle('shuo-hidden', !nameMatch);
        });
        /* 若某分类下所有项都被搜索隐藏，也隐藏分类标签 */
        body.querySelectorAll('.shuo-cat-label').forEach(label => {
            const labelCat = label.dataset.label;
            const hasVisible = [...body.querySelectorAll(`.shuo-setting-item[data-cat="${labelCat}"]`)]
                .some(el => !el.classList.contains('shuo-hidden'));
            label.style.display = hasVisible ? '' : 'none';
        });
    }

    /* ================= 5. 状态恢复 ================= */
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