const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    color: "#00FFAA"
};

let bullets = [];
let enemies = [];
let keys = {};
let score = 0;

// Detectar teclas
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        speed: 7,
        color: "yellow"
    });
}

function createEnemy() {
    const x = Math.random() * (canvas.width - 40);
    enemies.push({
        x,
        y: -40,
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 2,
        color: "red"
    });
}

function drawRect(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Puntaje: " + score, 10, 30);
}

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

let shootCooldown = 0;
let enemySpawnTimer = 0;

// Crear un contenedor de "Game Over" y reiniciar
const gameOverContainer = document.createElement("div");
gameOverContainer.style.position = "absolute";
gameOverContainer.style.top = "50%";
gameOverContainer.style.left = "50%";
gameOverContainer.style.transform = "translate(-50%, -50%)";
gameOverContainer.style.textAlign = "center";
gameOverContainer.style.color = "white";
gameOverContainer.style.fontSize = "30px";
gameOverContainer.style.display = "none"; // Inicialmente oculto
document.body.appendChild(gameOverContainer);

const restartButton = document.createElement("button");
restartButton.innerText = "Volver a jugar";
restartButton.style.padding = "10px 20px";
restartButton.style.fontSize = "18px";
restartButton.style.backgroundColor = "#28a745";
restartButton.style.color = "white";
restartButton.style.border = "none";
restartButton.style.borderRadius = "5px";
restartButton.style.cursor = "pointer";
gameOverContainer.appendChild(restartButton);

restartButton.addEventListener("click", restartGame);

function showGameOver() {
    gameOverContainer.style.display = "block"; // Mostrar el contenedor de Game Over
    gameOverContainer.innerHTML = `<h2>¡Perdiste!</h2><p>Puntaje final: ${score}</p>`;
}

function restartGame() {
    // Reiniciar las variables del juego
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 60;
    bullets = [];
    enemies = [];
    score = 0;
    shootCooldown = 0;
    enemySpawnTimer = 0;
    keys = {};

    gameOverContainer.style.display = "none"; // Ocultar el contenedor de Game Over
    gameLoop(); // Reiniciar el bucle del juego
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Movimiento del jugador
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;
    if (keys["Space"] && shootCooldown <= 0) {
        shoot();
        shootCooldown = 20;
    }

    drawRect(player);

    // Balas
    bullets.forEach((b, i) => {
        b.y -= b.speed;
        drawRect(b);
        if (b.y + b.height < 0) bullets.splice(i, 1);
    });

    // Enemigos
    enemySpawnTimer--;
    if (enemySpawnTimer <= 0) {
        createEnemy();
        enemySpawnTimer = 60;
    }

    enemies.forEach((e, i) => {
        e.y += e.speed;
        drawRect(e);

        // Colisión con jugador
        if (isColliding(player, e)) {
            showGameOver(); // Mostrar el mensaje de Game Over
            return; // Detener el juego
        }

        // Colisión con balas
        bullets.forEach((b, j) => {
            if (isColliding(b, e)) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score++;
            }
        });

        if (e.y > canvas.height) enemies.splice(i, 1);
    });

    drawScore();

    if (shootCooldown > 0) shootCooldown--;

    requestAnimationFrame(gameLoop);
}

gameLoop();
