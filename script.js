document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('weijiabao');
    const sound = document.getElementById('sound');
    const crazySound = document.getElementById('crazy-sound');
    const localCountDisplay = document.getElementById('local-count');
    const totalCountDisplay = document.getElementById('total-count');
    const highScoreDisplay = document.getElementById('high-score');
    const crazyButton = document.getElementById('crazy-mode');
    const saveButton = document.getElementById('save-count');
    const shareButton = document.getElementById('share');
    const comboDisplay = document.getElementById('combo');
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let isCrazyMode = false;
    let localCount = localStorage.getItem('localClickCount') ? parseInt(localStorage.getItem('localClickCount')) : 0;
    let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
    let lastClickTime = 0;
    let comboCount = 0;

    // 初始化画布
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // 初始化显示
    localCountDisplay.textContent = localCount;
    highScoreDisplay.textContent = highScore;

    // 粒子效果
    let particles = [];
    function createParticle(x, y) {
        return {
            x,
            y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: Math.random() * 5 + 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            life: 20
        };
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        if (particles.length > 0) requestAnimationFrame(animateParticles);
    }

    // 获取总点击次数（使用 CountAPI）
    async function fetchTotalClicks() {
        try {
            const response = await fetch('https://api.countapi.xyz/get/weijiabao/prank');
            const data = await response.json();
            totalCountDisplay.textContent = data.value || 0;
        } catch (error) {
            totalCountDisplay.textContent = '无法加载';
            console.error('CountAPI 错误:', error);
        }
    }

    // 更新总点击次数（使用 CountAPI）
    async function updateTotalClicks() {
        try {
            const response = await fetch('https://api.countapi.xyz/hit/weijiabao/prank');
            const data = await response.json();
            totalCountDisplay.textContent = data.value;
        } catch (error) {
            totalCountDisplay.textContent = '无法加载';
            console.error('CountAPI 错误:', error);
        }
    }

    // 初始化总点击次数
    fetchTotalClicks();

    // 点击图片事件
    img.addEventListener('click', (e) => {
        localCount++;
        localCountDisplay.textContent = localCount;
        localStorage.setItem('localClickCount', localCount);
        if (localCount > highScore) {
            highScore = localCount;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('highScore', highScore);
        }

        // 播放音效
        const currentSound = isCrazyMode && crazySound.src ? crazySound : sound;
        currentSound.currentTime = 0;
        currentSound.play().catch(() => console.log('音效播放失败'));

        // 连击检测
        const now = Date.now();
        if (now - lastClickTime < 1000) {
            comboCount++;
            if (comboCount >= 3) {
                comboDisplay.classList.remove('combo-hidden');
                setTimeout(() => comboDisplay.classList.add('combo-hidden'), 500);
            }
        } else {
            comboCount = 1;
        }
        lastClickTime = now;

        // 随机背景颜色
        document.body.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 80%)`;

        // 粒子效果
        const rect = img.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
            particles.push(createParticle(e.clientX, e.clientY));
        }
        animateParticles();

        // 疯狂模式效果
        if (isCrazyMode) {
            img.classList.add('crazy');
            document.body.classList.add('crazy-background');
            setTimeout(() => {
                img.classList.remove('crazy');
                document.body.classList.remove('crazy-background');
            }, 500);
        }

        // 更新总点击次数
        updateTotalClicks();
    });

    // 疯狂模式切换
    crazyButton.addEventListener('click', () => {
        isCrazyMode = !isCrazyMode;
        img.src = isCrazyMode ? 'assets/zR_crazy.png' : 'assets/zR.png';
        crazyButton.textContent = isCrazyMode ? '退出疯狂模式' : '进入疯狂模式';
    });

    // 保存点击次数
    saveButton.addEventListener('click', () => {
        alert(`已保存！本设备点击次数：${localCount}`);
    });

    // 分享功能
    shareButton.addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('链接已复制到剪贴板，分享给朋友吧！');
        });
    });
});