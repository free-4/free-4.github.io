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