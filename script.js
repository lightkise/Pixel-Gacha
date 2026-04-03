/* ============================================================
   🏆 灵感盒子 - 物理预判 + 防误触音效优化版 (手机丝滑适配版)
   ============================================================ */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let gachaList = []; 
let globalTick = 0; 

// --- 🎵 音频系统 ---
const bgm = new Audio('bgm.mp3'); 
bgm.loop = true;
bgm.volume = 0.15; 

const clickSounds = [
    new Audio('assets/click1.mp3'), 
    new Audio('assets/click2.mp3'), 
    new Audio('assets/click3.mp3')
];
clickSounds.forEach(s => { s.volume = 0.4; s.preload = "auto"; });

// 音频池：解决并发播放延迟
const popPool = [];
const POOL_SIZE = 6; 
for (let i = 0; i < POOL_SIZE; i++) {
    const s = new Audio('assets/pop.mp3');
    s.preload = "auto";
    s.volume = 0.25; 
    popPool.push(s);
}

let poolIndex = 0;
let lastPopTime = 0; 
let isAudioStarted = false;
let lastClickIndex = -1;
let isPointerActive = false; 

const mouse = { x: null, y: null, radius: 180, lastX: null, lastY: null, vx: 0, vy: 0 };
const kaomojis = ["(๑• . •๑)", "(╯3╰)", "(*^▽^*)", "(O^~^O)", "(≖ᴗ≖)✧", "(๑¯∀¯๑)", "Σ( ° △ °|||)"];

function playPopEffect() {
    if (!isPointerActive) return;
    const now = Date.now();
    if (now - lastPopTime > 65) {
        const s = popPool[poolIndex];
        s.currentTime = 0.08; 
        s.play().catch(() => {});
        poolIndex = (poolIndex + 1) % POOL_SIZE;
        lastPopTime = now;
    }
}

// --- 🖱️ 点击喷射逻辑 ---
function refreshText(e) {
    if(e) e.preventDefault();

    let randomIndex;
    do { 
        randomIndex = Math.floor(Math.random() * clickSounds.length); 
    } while (randomIndex === lastClickIndex && clickSounds.length > 1);
    lastClickIndex = randomIndex;
    
    clickSounds[randomIndex].currentTime = 0;
    clickSounds[randomIndex].play();

    if (!isAudioStarted) {
        bgm.play().catch(() => {});
        isAudioStarted = true;
    }

    // ✨ 手机端自动启动性能保护：限制场上扭蛋数量
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const limit = isMobile ? 10 : 80; // 手机限10个，电脑维持原感
    while (gachaList.length >= limit) {
        const oldest = gachaList.shift();
        if (oldest && oldest.el) oldest.el.remove();
    }

    const titleEl = document.querySelector('.title');
    if (titleEl) {
        const words = ["LUCKY!", "BINGO!", "AGAIN?", "SURPRISE!", "OH YEAH!"];
        titleEl.innerHTML = `${words[Math.floor(Math.random() * words.length)]} <br> <span>${kaomojis[Math.floor(Math.random() * kaomojis.length)]}</span>`;
        titleEl.style.transform = 'scale(0.95)';
        setTimeout(() => titleEl.style.transform = 'scale(1)', 100);
    }

    const startX = e ? (e.clientX || (e.touches && e.touches[0].clientX)) : window.innerWidth / 2;
    const startY = e ? (e.clientY || (e.touches && e.touches[0].clientY)) : window.innerHeight / 2;
    gachaList.push(new Gacha(startX, startY));
}

// --- 🥚 扭蛋类 ---
class Gacha {
    constructor(x, y) {
        this.radius = 14; 
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() * -6) - 4;
        this.gravity = 0.5; this.bounce = 0.45; this.friction = 0.96; 
        this.color = `hsl(${Math.random() * 360}, 75%, 70%)`;
        this.el = document.createElement('div');
        this.el.className = 'pixel-gacha';
        this.setGachaStyle();
        document.body.appendChild(this.el);
    }
    setGachaStyle() {
        const c = this.color;
        // ✨ 增加 will-change 提示显卡提前准备
        this.el.style.cssText = `position:fixed;left:0;top:0;width:4px;height:4px;pointer-events:none;z-index:999;image-rendering:pixelated;will-change:transform;box-shadow:8px 0 white,12px 0 white,16px 0 white,4px 4px white,8px 4px rgba(255,255,255,0.4),12px 4px rgba(255,255,255,0.4),16px 4px rgba(255,255,255,0.4),20px 4px white,0px 8px white,4px 8px rgba(255,255,255,0.3),20px 8px rgba(255,255,255,0.3),24px 8px white,0px 12px ${c},4px 12px ${c},8px 12px ${c},12px 12px ${c},16px 12px ${c},20px 12px ${c},24px 12px ${c},4px 16px ${c},8px 16px ${c},12px 16px ${c},16px 16px ${c},20px 16px ${c},8px 20px ${c},12px 20px ${c},16px 20px ${c};`;
    }
    update(index) {
        this.vy += this.gravity; 
        this.x += this.vx; 
        this.y += this.vy;

        const dxM = this.x - mouse.x; 
        const dyM = this.y - mouse.y;
        const distM = Math.sqrt(dxM*dxM + dyM*dyM);
        
        if (distM < 95) {
            const force = (95 - distM) / 95;
            const angle = Math.atan2(dyM, dxM);
            this.vx += Math.cos(angle) * force * 6 + mouse.vx * 0.25;
            this.vy += Math.sin(angle) * force * 6 + mouse.vy * 0.25;

            if (Math.abs(mouse.vx) > 2 || Math.abs(mouse.vy) > 2) {
                playPopEffect();
            }
        }

        if (this.x < -60 || this.x > window.innerWidth + 60) { this.el.remove(); gachaList.splice(index, 1); return; }
        if (this.y + this.radius * 2 > window.innerHeight) {
            this.y = window.innerHeight - this.radius * 2;
            this.vy *= -this.bounce; this.vx *= 0.9;
        }

        for (let other of gachaList) {
            if (other === this) continue;
            const dx = this.x - other.x; const dy = this.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 28) {
                const angle = Math.atan2(dy, dx);
                const overlap = 28 - dist;
                this.x += Math.cos(angle) * overlap * 0.5; this.y += Math.sin(angle) * overlap * 0.5;
            }
        }

        // ✨ 手机端自动启用 translate3d 开启硬件加速
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        if (isMobile) {
            this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
        } else {
            this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        }
    }
}

// --- ✨ 指针监测 ---
window.addEventListener('mouseenter', () => { isPointerActive = true; });
window.addEventListener('mouseleave', () => { isPointerActive = false; });
window.addEventListener('touchstart', () => { isPointerActive = true; }, {passive: false});
window.addEventListener('touchend', () => { isPointerActive = false; });

window.addEventListener('mousemove', (e) => {
    if (mouse.lastX === null) {
        mouse.lastX = e.x;
        mouse.lastY = e.y;
    }
    mouse.vx = e.x - mouse.lastX;
    mouse.vy = e.y - mouse.lastY;
    mouse.lastX = e.x; mouse.lastY = e.y;
    mouse.x = e.x; mouse.y = e.y;
    isPointerActive = true; 
});

window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (mouse.lastX === null) {
        mouse.lastX = touch.clientX;
        mouse.lastY = touch.clientY;
    }
    mouse.vx = touch.clientX - mouse.lastX;
    mouse.vy = touch.clientY - mouse.lastY;
    mouse.lastX = touch.clientX; mouse.lastY = touch.clientY;
    mouse.x = touch.clientX; mouse.y = touch.clientY;
    isPointerActive = true;
}, {passive: false});

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 150; i++) particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 1.5 + 1.5, opacity: 0, phase: Math.random() * Math.PI * 2 
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    globalTick += 0.02;
    for (let i = gachaList.length - 1; i >= 0; i--) { gachaList[i].update(i); }
    particles.forEach(p => {
        let dx = p.x - mouse.x, dy = p.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
            let prox = 1 - (dist / mouse.radius);
            p.vx += (dx / dist) * prox * 0.6 + mouse.vx * prox * 0.3;
            p.vy += (dy / dist) * prox * 0.6 + mouse.vy * prox * 0.3;
        }
        p.x += p.vx; p.y += p.vy; p.vx *= 0.98; p.vy *= 0.98;
        if (p.x < -10 || p.x > canvas.width + 10 || p.y < -10 || p.y > canvas.height + 10) {
            p.x = Math.random() * canvas.width; p.y = Math.random() * canvas.height; p.opacity = 0;
        }
        if (p.opacity < 1) p.opacity += 0.05;
        let blink = 0.3 + Math.abs(Math.sin(globalTick + p.phase)) * 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * blink})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(animate);
}

init(); animate();
window.addEventListener('resize', init);
document.querySelector('.title').addEventListener('mousedown', refreshText);
document.querySelector('.title').addEventListener('touchstart', refreshText);