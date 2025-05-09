// Obtención del canvas y su contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Clase para objetos del juego
class GameObject {
    constructor(x, y, width, height, speed, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Clase para el jugador
class Player extends GameObject {
    constructor() {
        super(
            canvas.width / 2 - 25,
            canvas.height - 60,
            50,
            50,
            5,
            "#00FFAA"
        );
    }

    move(direction) {
        if (direction === "left" && this.x > 0) {
            this.x -= this.speed;
        }
        if (direction === "right" && this.x + this.width < canvas.width) {
            this.x += this.speed;
        }
    }

    shoot(bullets) {
        bullets.push(
            new Bullet(
                this.x + this.width / 2 - 2.5,
                this.y,
                5,
                10,
                7,
                "yellow"
            )
        );
        
        // Efecto visual de propulsión al disparar
        this.thrusterEffect = 10;
    }
    
    draw() {
        // Guardar contexto actual
        ctx.save();
        
        // Color base de la nave
        const mainColor = "#00FFAA";
        const secondaryColor = "#0088FF";
        const accentColor = "#FF5500";
        
        // Centro de la nave para dibujar
        const centerX = this.x + this.width / 2;
        
        // Cuerpo principal de la nave (triángulo)
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.moveTo(centerX, this.y);
        ctx.lineTo(centerX - 20, this.y + 40);
        ctx.lineTo(centerX + 20, this.y + 40);
        ctx.closePath();
        ctx.fill();
        
        // Alas de la nave
        ctx.fillStyle = secondaryColor;
        
        // Ala izquierda
        ctx.beginPath();
        ctx.moveTo(centerX - 15, this.y + 15);
        ctx.lineTo(centerX - 30, this.y + 40);
        ctx.lineTo(centerX - 10, this.y + 40);
        ctx.closePath();
        ctx.fill();
        
        // Ala derecha
        ctx.beginPath();
        ctx.moveTo(centerX + 15, this.y + 15);
        ctx.lineTo(centerX + 30, this.y + 40);
        ctx.lineTo(centerX + 10, this.y + 40);
        ctx.closePath();
        ctx.fill();
        
        // Cabina de la nave
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(centerX, this.y + 15, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Efecto de brillo en la cabina
        ctx.fillStyle = "#AAFFFF";
        ctx.beginPath();
        ctx.arc(centerX - 1, this.y + 14, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Propulsores
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.rect(centerX - 15, this.y + 40, 8, 5);
        ctx.rect(centerX + 7, this.y + 40, 8, 5);
        ctx.fill();
        
        // Fuego de propulsión
        if (this.thrusterEffect > 0) {
            // Fuego grande cuando dispara
            this.drawThruster(centerX - 11, this.y + 45, 8, 15, "#FF5500", "#FFAA00");
            this.drawThruster(centerX + 11, this.y + 45, 8, 15, "#FF5500", "#FFAA00");
            this.thrusterEffect--;
        } else {
            // Fuego normal en reposo
            this.drawThruster(centerX - 11, this.y + 45, 8, 8, "#FF5500", "#FFAA00");
            this.drawThruster(centerX + 11, this.y + 45, 8, 8, "#FF5500", "#FFAA00");
        }
        
        // Restaurar contexto
        ctx.restore();
    }
    
    drawThruster(x, y, width, height, colorStart, colorEnd) {
        // Crear un gradiente para el fuego
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        
        // Dibujar el fuego con forma ondulatoria
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        const flameWidth = width / 2;
        
        ctx.moveTo(x - flameWidth, y);
        
        // Forma ondulatoria aleatorizada
        const waveHeight = height / 5;
        const steps = 5;
        
        for (let i = 1; i <= steps; i++) {
            const yPos = y + (height * i / steps);
            const xOffset = Math.sin(Date.now() / 100 + i) * waveHeight;
            ctx.lineTo(x + xOffset, yPos);
        }
        
        for (let i = steps; i >= 1; i--) {
            const yPos = y + (height * i / steps);
            const xOffset = Math.sin(Date.now() / 90 + i + 3) * waveHeight;
            ctx.lineTo(x + width + xOffset, yPos);
        }
        
        ctx.lineTo(x + width + flameWidth, y);
        ctx.closePath();
        ctx.fill();
    }
}

// Clase para las balas
class Bullet extends GameObject {
    constructor(x, y, width, height, speed, color) {
        super(x, y, width, height, speed, color);
        this.lifeTime = 0;
    }
    
    update() {
        this.y -= this.speed;
        this.lifeTime++;
    }
    
    draw() {
        // Efecto de estela
        const trailLength = 5;
        const opacity = 0.7;
        
        // Dibujar estela
        for (let i = 0; i < trailLength; i++) {
            const size = this.width - (i * 0.5);
            if (size <= 0) continue;
            
            ctx.fillStyle = `rgba(255, 255, 100, ${opacity - (i * 0.15)})`;
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + this.height + (i * 3),
                size,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // Dibujar bala principal
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Brillo central
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}

// Clase para los enemigos
class Enemy extends GameObject {
    constructor(x, y, width, height, speed, color) {
        super(x, y, width, height, speed, color);
        this.type = Math.floor(Math.random() * 3); // 0, 1, o 2 para diferentes tipos de enemigos
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }
    
    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Diferentes tipos de naves enemigas
        switch (this.type) {
            case 0: // Nave redonda
                this.drawRoundEnemy();
                break;
            case 1: // Nave triangular
                this.drawTriangularEnemy();
                break;
            case 2: // Nave con forma de X
                this.drawXShapedEnemy();
                break;
        }
        
        ctx.restore();
    }
    
    drawRoundEnemy() {
        // Cuerpo principal
        ctx.fillStyle = "#FF3355";
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Escudo frontal
        ctx.fillStyle = "#8800FF";
        ctx.beginPath();
        ctx.arc(0, -this.height / 4, this.width / 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Ojos
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(-this.width / 6, -this.height / 8, this.width / 12, 0, Math.PI * 2);
        ctx.arc(this.width / 6, -this.height / 8, this.width / 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilas
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(-this.width / 6, -this.height / 8, this.width / 20, 0, Math.PI * 2);
        ctx.arc(this.width / 6, -this.height / 8, this.width / 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawTriangularEnemy() {
        // Cuerpo principal
        ctx.fillStyle = "#FF8800";
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Detalles
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 4);
        ctx.lineTo(-this.width / 4, this.height / 4);
        ctx.lineTo(this.width / 4, this.height / 4);
        ctx.closePath();
        ctx.fill();
        
        // Ventana
        ctx.fillStyle = "#33CCFF";
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawXShapedEnemy() {
        // Cuerpo principal
        ctx.fillStyle = "#00AA88";
        const size = this.width / 2;
        
        // Forma de X
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size, 0);
        ctx.closePath();
        ctx.fill();
        
        // Centro
        ctx.fillStyle = "#FFCC00";
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Punto central
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Clase para gestionar colisiones
class CollisionDetector {
    static isColliding(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }
}

// Clase principal del juego
class Game {
    constructor() {
        this.player = new Player();
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.keys = {};
        this.score = 0;
        this.gameOver = false;
        this.shootCooldown = 0;
        this.enemySpawnTimer = 0;
        this.setupEventListeners();
        this.gameOverScreen = document.createElement("div");
        this.setupGameOverScreen();
        this.stars = this.createStars();
        this.starSpeed = 0.5;
        
        // Agregar controles móviles
        this.isMobile = this.checkIfMobile();
        if (this.isMobile) {
            this.setupMobileControls();
        }
        
        // Estado para los controles táctiles
        this.mobileControls = {
            left: false,
            right: false,
            shoot: false
        };
    }
    
    // Verificar si el dispositivo es móvil
    checkIfMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Configurar controles para dispositivos móviles
    setupMobileControls() {
        // Contenedor para los controles
        const controlsContainer = document.createElement("div");
        controlsContainer.id = "mobileControls";
        controlsContainer.style.position = "absolute";
        controlsContainer.style.bottom = "10px";
        controlsContainer.style.left = "0";
        controlsContainer.style.width = "100%";
        controlsContainer.style.display = "flex";
        controlsContainer.style.justifyContent = "space-between";
        controlsContainer.style.padding = "0 20px";
        controlsContainer.style.boxSizing = "border-box";
        controlsContainer.style.zIndex = "1000";
        
        // Controles de dirección (izquierda)
        const leftButton = this.createMobileButton("⬅️", "leftBtn", "left");
        
        // Botón de disparo
        const shootButton = this.createMobileButton("🔥", "shootBtn", "shoot");
        
        // Controles de dirección (derecha)
        const rightButton = this.createMobileButton("➡️", "rightBtn", "right");
        
        // Contenedor para dirección
        const directionContainer = document.createElement("div");
        directionContainer.style.display = "flex";
        directionContainer.style.gap = "10px";
        
        directionContainer.appendChild(leftButton);
        directionContainer.appendChild(rightButton);
        
        // Añadir botones al contenedor
        controlsContainer.appendChild(directionContainer);
        controlsContainer.appendChild(shootButton);
        
        // Añadir el contenedor de controles al body
        document.body.appendChild(controlsContainer);
        
        // Prevenir el scroll en dispositivos móviles cuando se tocan los controles
        controlsContainer.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }
    
    // Crear un botón móvil
    createMobileButton(text, id, control) {
        const button = document.createElement("div");
        button.id = id;
        button.innerText = text;
        button.style.width = "70px";
        button.style.height = "70px";
        button.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        button.style.borderRadius = "50%";
        button.style.display = "flex";
        button.style.justifyContent = "center";
        button.style.alignItems = "center";
        button.style.fontSize = "24px";
        button.style.userSelect = "none";
        button.style.cursor = "pointer";
        
        // Eventos táctiles
        button.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.mobileControls[control] = true;
        });
        
        button.addEventListener("touchend", (e) => {
            e.preventDefault();
            this.mobileControls[control] = false;
        });
        
        button.addEventListener("touchcancel", (e) => {
            e.preventDefault();
            this.mobileControls[control] = false;
        });
        
        return button;
    }
    
    createStars() {
        const stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1
            });
        }
        return stars;
    }
    
    createExplosion(x, y, color) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            const size = Math.random() * 3 + 2;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size,
                color: color || "#FF8800",
                life: 30 + Math.random() * 20
            });
        }
    }

    setupEventListeners() {
        document.addEventListener("keydown", (e) => (this.keys[e.code] = true));
        document.addEventListener("keyup", (e) => (this.keys[e.code] = false));
        
        // Ajustar tamaño del canvas en caso de que cambien las dimensiones de la ventana
        window.addEventListener("resize", () => this.resizeCanvas());
        
        // Ajustar el canvas inicialmente
        this.resizeCanvas();
    }
    
    // Función para ajustar el tamaño del canvas
    resizeCanvas() {
        const gameContainer = document.getElementById("gameContainer") || document.body;
        canvas.width = Math.min(window.innerWidth, 800);
        canvas.height = Math.min(window.innerHeight - 100, 600);
        
        // Reposicionar al jugador cuando cambia el tamaño del canvas
        if (this.player) {
            this.player.x = canvas.width / 2 - 25;
            this.player.y = canvas.height - 60;
        }
    }

    setupGameOverScreen() {
        this.gameOverScreen.id = "gameOverScreen";
        this.gameOverScreen.style.position = "absolute";
        this.gameOverScreen.style.top = "50%";
        this.gameOverScreen.style.left = "50%";
        this.gameOverScreen.style.transform = "translate(-50%, -50%)";
        this.gameOverScreen.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        this.gameOverScreen.style.color = "white";
        this.gameOverScreen.style.padding = "20px";
        this.gameOverScreen.style.borderRadius = "10px";
        this.gameOverScreen.style.textAlign = "center";
        this.gameOverScreen.style.display = "none";
        this.gameOverScreen.style.zIndex = "2000"; // Asegurar que esté por encima de otros elementos
        
        const restartButton = document.createElement("button");
        restartButton.textContent = "Jugar de Nuevo";
        restartButton.style.padding = "10px 20px";
        restartButton.style.fontSize = "16px";
        restartButton.style.marginTop = "15px";
        restartButton.style.cursor = "pointer";
        restartButton.style.backgroundColor = "#00FFAA";
        restartButton.style.border = "none";
        restartButton.style.borderRadius = "5px";
        
        restartButton.addEventListener("click", () => this.restart());
        restartButton.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.restart();
        });
        
        this.gameOverScreen.appendChild(document.createElement("h2")).textContent = "¡Game Over!";
        this.scoreElement = document.createElement("p");
        this.gameOverScreen.appendChild(this.scoreElement);
        this.gameOverScreen.appendChild(restartButton);
        
        document.body.appendChild(this.gameOverScreen);
    }

    createEnemy() {
        const x = Math.random() * (canvas.width - 40);
        // Colores aleatorios para mayor variedad
        const colors = ["#FF3355", "#8800FF", "#FF8800", "#00AA88"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.enemies.push(
            new Enemy(x, -40, 40, 40, 2 + Math.random() * 2, randomColor)
        );
    }

    update() {
        if (this.gameOver) return;

        // Actualizar estrellas del fondo
        this.updateStars();

        // Movimiento del jugador (teclado)
        if (this.keys["ArrowLeft"]) this.player.move("left");
        if (this.keys["ArrowRight"]) this.player.move("right");
        if (this.keys["Space"] && this.shootCooldown <= 0) {
            this.player.shoot(this.bullets);
            this.shootCooldown = 20;
        }
        
        // Movimiento del jugador (controles móviles)
        if (this.mobileControls.left) this.player.move("left");
        if (this.mobileControls.right) this.player.move("right");
        if (this.mobileControls.shoot && this.shootCooldown <= 0) {
            this.player.shoot(this.bullets);
            this.shootCooldown = 20;
        }

        // Actualización de balas
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();
            if (this.bullets[i].y + this.bullets[i].height < 0) {
                this.bullets.splice(i, 1);
            }
        }

        // Actualización de partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Generación y actualización de enemigos
        this.enemySpawnTimer--;
        if (this.enemySpawnTimer <= 0) {
            this.createEnemy();
            // Reducir el tiempo de spawn a medida que avanza el juego
            this.enemySpawnTimer = Math.max(20, 60 - Math.floor(this.score / 10) * 5);
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update();

            // Colisión con jugador
            if (CollisionDetector.isColliding(this.player, this.enemies[i])) {
                // Crear explosión grande
                this.createExplosion(
                    this.player.x + this.player.width / 2,
                    this.player.y + this.player.height / 2,
                    "#00FFAA"
                );
                this.gameOver = true;
                this.showGameOver();
                return;
            }

            // Colisión con balas
            for (let j = this.bullets.length - 1; j >= 0; j--) {
                if (
                    CollisionDetector.isColliding(
                        this.bullets[j],
                        this.enemies[i]
                    )
                ) {
                    // Crear explosión en la posición del enemigo
                    this.createExplosion(
                        this.enemies[i].x + this.enemies[i].width / 2,
                        this.enemies[i].y + this.enemies[i].height / 2,
                        this.enemies[i].color
                    );
                    
                    this.enemies.splice(i, 1);
                    this.bullets.splice(j, 1);
                    this.score++;
                    break;
                }
            }

            // Enemigo fuera de pantalla
            if (i >= 0 && this.enemies[i] && this.enemies[i].y > canvas.height) {
                this.enemies.splice(i, 1);
            }
        }

        if (this.shootCooldown > 0) this.shootCooldown--;
    }
    
    updateStars() {
        for (let i = 0; i < this.stars.length; i++) {
            this.stars[i].y += this.stars[i].speed;
            
            // Si la estrella sale de la pantalla, la reposicionamos arriba
            if (this.stars[i].y > canvas.height) {
                this.stars[i].y = 0;
                this.stars[i].x = Math.random() * canvas.width;
            }
        }
    }

    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar fondo
        this.drawBackground();
        
        // Dibujar estrellas
        this.drawStars();

        // Dibujar partículas
        this.drawParticles();

        // Dibujar jugador
        this.player.draw();

        // Dibujar balas
        this.bullets.forEach((bullet) => bullet.draw());

        // Dibujar enemigos
        this.enemies.forEach((enemy) => enemy.draw());

        // Dibujar puntuación
        this.drawScore();
    }
    
    drawBackground() {
        // Crear un gradiente para el fondo espacial
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#000022");
        gradient.addColorStop(0.5, "#000044");
        gradient.addColorStop(1, "#000033");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    drawStars() {
        for (const star of this.stars) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawParticles() {
        for (const p of this.particles) {
            const alpha = p.life / 30;
            ctx.fillStyle = `rgba(${this.hexToRgb(p.color)}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    hexToRgb(hex) {
        // Convertir color hex a RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }

    drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Puntaje: " + this.score, 10, 30);
    }
    
    showGameOver() {
        this.scoreElement.textContent = `Puntaje final: ${this.score}`;
        this.gameOverScreen.style.display = "block";
        
        // Ocultar los controles móviles si están presentes
        const mobileControls = document.getElementById("mobileControls");
        if (mobileControls) {
            mobileControls.style.display = "none";
        }
    }
    
    restart() {
        this.gameOverScreen.style.display = "none";
        this.player = new Player();
        this.bullets = [];
        this.enemies = [];
        this.score = 0;
        this.gameOver = false;
        this.shootCooldown = 0;
        this.enemySpawnTimer = 0;
        
        // Mostrar nuevamente los controles móviles si están presentes
        const mobileControls = document.getElementById("mobileControls");
        if (mobileControls) {
            mobileControls.style.display = "flex";
        }
        
        this.gameLoop();
    }

    gameLoop() {
        this.update();
        this.render();
        if (!this.gameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    start() {
        this.gameLoop();
    }
}

// Crear el contenedor del juego
function createGameContainer() {
    const gameContainer = document.createElement("div");
    gameContainer.id = "gameContainer";
    gameContainer.style.position = "relative";
    gameContainer.style.margin = "0 auto";
    gameContainer.style.maxWidth = "800px";
    gameContainer.style.overflow = "hidden";
    
    document.body.appendChild(gameContainer);
    return gameContainer;
}

// Iniciar el juego
window.onload = () => {
    // Crear el contenedor del juego
    const gameContainer = createGameContainer();
    
    // Preparar estilos para el cuerpo y contenedor
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#000";
    document.body.style.fontFamily = "Arial, sans-serif";
    
    // Si no existe el canvas, crear uno nuevo
    let canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "gameCanvas";
        canvas.width = Math.min(window.innerWidth, 800);
        canvas.height = Math.min(window.innerHeight - 100, 600);
        canvas.style.display = "block";
        canvas.style.margin = "0 auto";
        gameContainer.appendChild(canvas);
    }
    
    // Crear instrucciones para móvil
    const mobileInstructionsDiv = document.createElement("div");
    mobileInstructionsDiv.id = "mobileInstructions";
    mobileInstructionsDiv.style.color = "white";
    mobileInstructionsDiv.style.textAlign = "center";
    mobileInstructionsDiv.style.padding = "10px";
    mobileInstructionsDiv.style.fontSize = "14px";
    mobileInstructionsDiv.style.position = "absolute";
    mobileInstructionsDiv.style.top = "5px";
    mobileInstructionsDiv.style.left = "50%";
    mobileInstructionsDiv.style.transform = "translateX(-50%)";
    mobileInstructionsDiv.style.width = "100%";
    mobileInstructionsDiv.style.zIndex = "1000";
    
    // Detectar si es dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        mobileInstructionsDiv.textContent = "⬅️ ➡️ para moverte • 🔥 para disparar";
        gameContainer.appendChild(mobileInstructionsDiv);
        
        // Ocultar las instrucciones después de 5 segundos
        setTimeout(() => {
            mobileInstructionsDiv.style.opacity = "0";
            mobileInstructionsDiv.style.transition = "opacity 1s";
        }, 5000);
    }
    
    const game = new Game();
    game.start();
};
  
      
