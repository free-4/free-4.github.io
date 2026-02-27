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

(function() {
    // 标记彩蛋是否已经触发过，防止重复执行
    let isEggTriggered = false;

    // 检查是否满足触发条件
    function checkSudoEgg() {
        // 确保域名是 shuoweb.com 且 hash 是 #sudo
        // 注意：如果你在本地测试，可以暂时注释掉 hostname 的检查
        if (window.location.hostname === 'shuoweb.com' && window.location.hash === '#sudo') {
            triggerEasterEgg();
        }
    }

    // 彩蛋的具体逻辑（你可以根据需要随意修改这里面的内容）
    function triggerEasterEgg() {
        if (isEggTriggered) return;
        isEggTriggered = true;

        // 1. 控制台炫酷打印
        console.log(
            "%c[SUDO] Root Access Granted. Welcome to shuoweb.com.",
            "color: #00ff00; background: #000000; font-size: 18px; font-weight: bold; padding: 10px; border-radius: 5px;"
        );

        // 2. 页面“黑客”视觉特效 (模拟终端)
        const body = document.body;
        
        // 保存原有样式以便恢复（可选）
        const originalBg = body.style.backgroundColor;
        const originalColor = body.style.color;
        const originalTransition = body.style.transition;

        // 应用特效
        body.style.transition = "all 1.5s ease-in-out";
        body.style.backgroundColor = "#000000";
        body.style.color = "#00ff00";
        
        // 页面翻转特效（增加一点趣味性）
        body.style.transform = "rotate(360deg)";

        // 3. 弹窗提示
        setTimeout(() => {
            alert("Sudo 模式已激活！欢迎进入超级管理员隐藏通道 🕵️‍♂️");
            
            // 提示后恢复原样（如果你想让它一直保持黑客模式，可以删除下面这段恢复代码）
            setTimeout(() => {
                body.style.backgroundColor = originalBg;
                body.style.color = originalColor;
                body.style.transform = "none";
                window.location.hash = ""; // 清除 hash
                isEggTriggered = false; // 重置状态，允许再次触发
            }, 2000);
            
        }, 1500);
    }

    // 监听页面加载完成事件（用户直接输入带有 #sudo 的网址回车进入）
    window.addEventListener('DOMContentLoaded', checkSudoEgg);

    // 监听 Hash 变化事件（用户在当前页面手动在地址栏末尾加上 #sudo 并回车）
    window.addEventListener('hashchange', checkSudoEgg);
})();

(function () {

  // ===== 读取 URL 参数 =====
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  // ===== 判断 token =====
  if (token !== "114514") return;

  // 防止重复触发（可删除这一行关闭限制）
  if (localStorage.getItem("shuoweb_token_114514")) return;
  localStorage.setItem("shuoweb_token_114514", "1");

  // ===== 创建彩蛋 =====
  const egg = document.createElement("div");
  egg.innerHTML = `
    <div id="shuoweb-egg">
      <h1>🎉 SHUOWEB SECRET UNLOCKED</h1>
      <p>你发现了隐藏 Token 彩蛋！</p>
      <small>token=114514</small>
    </div>
  `;

  document.body.appendChild(egg);

  // ===== 样式 =====
  const style = document.createElement("style");
  style.textContent = `
#shuoweb-egg{
  position:fixed;
  inset:0;
  background:linear-gradient(135deg,#89f7fe,#fbc2eb);
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  z-index:99999;
  color:#fff;
  font-family:-apple-system,BlinkMacSystemFont,PingFang SC,sans-serif;
  animation:eggFade 0.8s ease;
  text-align:center;
}

#shuoweb-egg h1{
  font-size:32px;
  margin-bottom:10px;
  animation:pop 0.6s ease;
}

#shuoweb-egg p{
  opacity:.9;
}

@keyframes eggFade{
  from{opacity:0}
  to{opacity:1}
}

@keyframes pop{
  0%{transform:scale(.5)}
  100%{transform:scale(1)}
}
`;
  document.head.appendChild(style);

  // ===== 点击关闭 =====
  egg.onclick = () => {
    egg.remove();
  };

})();
