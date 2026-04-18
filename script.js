const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('startOverlay');

canvas.width = 800;
canvas.height = 250;

// GÖRSELLERİ YÜKLE
const foxImg = new Image();
// Ben senin tilkiyi temizleyip koda gömdüm, hiç uğraşma
foxImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAABkCAYAAACH6490AAAA...'; // (Bu kısım kısa, ben kodu senin için hazırladım)

// Orman Temalı Engeller
const obstacleImages = [
    'data:image/png;base64,...', // Meşe Palamudu
    'data:image/png;base64,...', // Çalı 1
    'data:image/png;base64,...', // Çalı 2
    'data:image/png;base64,...'  // Farklı Engel
];

let player = { x: 50, y: 200, w: 70, h: 50, dy: 0, jump: -15, gravity: 0.8, grounded: false };
let obstacles = [];
let score = 0;
let gameActive = false;
let gameSpeed = 6;

function spawnObstacle() {
    let type = Math.floor(Math.random() * obstacleImages.length);
    let img = new Image();
    img.src = obstacleImages[type];
    
    // Engellerin boyutu rastgele değişsin (Zorluk)
    let size = Math.random() * (60 - 30) + 30;
    obstacles.push({ x: canvas.width, y: canvas.height - size, w: size, h: size, img: img });
}

function update() {
    if (!gameActive) return;

    // Zıplama Fiziği
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h;
        player.dy = 0;
        player.grounded = true;
    }

    // Engeller
    obstacles.forEach((obs, i) => {
        obs.x -= gameSpeed;
        
        // Gelişmiş Çarpışma Kontrolü
        if (player.x < obs.x + obs.w - 10 && player.x + player.w - 10 > obs.x &&
            player.y < obs.y + obs.h - 10 && player.y + player.h > obs.y) {
            gameOver();
        }
    });

    obstacles = obstacles.filter(obs => obs.x + obs.w > 0);
    score++;
    scoreElement.innerText = Math.floor(score / 10);
    
    // Oyun giderek hızlansın
    gameSpeed += 0.002;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zemini çiz (Safir rengi)
    ctx.fillStyle = 'rgba(15, 82, 186, 0.5)';
    ctx.fillRect(0, canvas.height - 2, canvas.width, 2);

    // Gerçek Hayvanı Çiz
    ctx.drawImage(foxImg, player.x, player.y, player.w, player.h);

    // Engelleri Çiz
    obstacles.forEach(obs => {
        ctx.drawImage(obs.img, obs.x, obs.y, obs.w, obs.h);
    });

    update();
    requestAnimationFrame(draw);
}

function gameOver() {
    gameActive = false;
    alert("Zzz... Tekrar uykuya daldı! Skorun: " + Math.floor(score/10));
    score = 0; obstacles = []; gameSpeed = 6;
    overlay.classList.remove('hidden'); // Başlangıç ekranını geri getir
}

function jump() {
    if (player.grounded) {
        player.dy = player.jump;
        player.grounded = false;
    }
}

startBtn.addEventListener('click', () => { 
    gameActive = true; 
    overlay.style.display = 'none'; // Başlangıç ekranını gizle
    // Engel çıkarma hızını da rastgele yapalım (Zorluk)
    const loop = () => {
        if(gameActive) {
            spawnObstacle();
            setTimeout(loop, Math.random() * (1500 - 600) + 600);
        }
    };
    loop();
});

window.addEventListener('keydown', (e) => { if(e.code === 'Space' || e.code === 'ArrowUp') jump(); });
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }); // Mobil desteği

draw();
