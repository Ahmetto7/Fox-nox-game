const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('startOverlay');

canvas.width = 600;
canvas.height = 200;

// GÖRSELLERİ YÜKLE (İnternetten hazır ve hızlı linkler)
const foxImg = new Image();
foxImg.src = 'https://img.icons8.com/color/96/fox.png'; // Senin tilki yerine tatlı bir tilki ikonu

const obstacleImg = new Image();
obstacleImg.src = 'https://img.icons8.com/color/48/tree.png'; // Orman engeli

let player = { x: 50, y: 150, w: 40, h: 40, dy: 0, jump: -12, gravity: 0.8, grounded: false };
let obstacles = [];
let score = 0;
let gameActive = false;
let gameSpeed = 5;

function spawnObstacle() {
    obstacles.push({ x: canvas.width, y: canvas.height - 40, w: 30, h: 40 });
}

function update() {
    if (!gameActive) return;

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h;
        player.dy = 0;
        player.grounded = true;
    }

    obstacles.forEach((obs) => {
        obs.x -= gameSpeed;
        if (player.x < obs.x + obs.w && player.x + player.w > obs.x && player.y < obs.y + obs.h && player.y + player.h > obs.y) {
            gameActive = false;
            alert("Oyun Bitti! Skor: " + Math.floor(score/10));
            location.reload(); // Sayfayı yenileyip resetler
        }
    });

    obstacles = obstacles.filter(obs => obs.x + obs.w > 0);
    score++;
    scoreElement.innerText = Math.floor(score / 10);
    gameSpeed += 0.001;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Tilkiyi Çiz
    ctx.drawImage(foxImg, player.x, player.y, player.w, player.h);

    // Engelleri Çiz
    obstacles.forEach(obs => {
        ctx.drawImage(obstacleImg, obs.x, obs.y, obs.w, obs.h);
    });

    update();
    requestAnimationFrame(draw);
}

startBtn.addEventListener('click', () => {
    gameActive = true;
    overlay.style.display = 'none';
    setInterval(() => { if(gameActive) spawnObstacle(); }, 1500);
});

window.addEventListener('keydown', (e) => { if(e.code === 'Space') { player.dy = player.jump; player.grounded = false; }});
canvas.addEventListener('touchstart', () => { player.dy = player.jump; player.grounded = false; });

draw();
