let gameContainer = document.querySelector(".game-container");
let scoreText = document.querySelector(".score-text");

let foodX, foodY;
let headX = 12, headY = 12;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let score = 0;
let speed = 150;
let intervalId;

let soundOn = true;

function generateFood() {
    foodX = Math.floor(Math.random() * 25) + 1;
    foodY = Math.floor(Math.random() * 25) + 1;

    for (let segment of snakeBody) {
        if (segment[0] === foodX && segment[1] === foodY) {
            generateFood();  
            return;
        }
    }
}

function playSound(id) {
    if (soundOn) {
        const sound = document.getElementById(id);
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }
}

function gameOver() {
    headX = 12;
    headY = 12;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    speed = 150;
    
    generateFood();
    clearInterval(intervalId);
    intervalId = setInterval(renderGame, speed);
    scoreText.textContent = "Score : " + score;
    document.getElementById("game-over").style.display = "block";
    playSound("gameover-sound");
}

function increaseSpeed() {
    if (speed > 50) {
        speed -= 10;
        clearInterval(intervalId);
        intervalId = setInterval(renderGame, speed);
    }
}

function renderGame() {
    let updatedGame = `<div class="food" style="grid-area: ${foodY}/${foodX};"></div>`;

    if (headX === foodX && headY === foodY) {
        snakeBody.push([foodX, foodY]);  
        generateFood();
        score += 10;
        scoreText.textContent = "Score : " + score;
        playSound("eat-sound");

        if (score % 100 === 0 && score !== 0) {
            increaseSpeed();
        }
    }

    snakeBody.pop();
    headX += velocityX;
    headY += velocityY;
    snakeBody.unshift([headX, headY]);

    if (headX < 1 || headY < 1 || headX > 25 || headY > 25) {
        gameOver();
    }

    for (let i = 1; i < snakeBody.length; i++) {
        if (headX === snakeBody[i][0] && headY === snakeBody[i][1]) {
            gameOver();
        }
    }

    for (let segment of snakeBody) {
        updatedGame += `<div class="snake" style="grid-area: ${segment[1]}/${segment[0]};"></div>`;
    }

    gameContainer.innerHTML = updatedGame;
}

generateFood();
intervalId = setInterval(renderGame, speed);

document.addEventListener("keydown", (e) => {
    document.getElementById("game-over").style.display = "none";

    switch (e.key) {
        case "ArrowUp":
            if (velocityY !== 1) { velocityX = 0; velocityY = -1; }
            break;
        case "ArrowDown":
            if (velocityY !== -1) { velocityX = 0; velocityY = 1; }
            break;
        case "ArrowLeft":
            if (velocityX !== 1) { velocityX = -1; velocityY = 0; }
            break;
        case "ArrowRight":
            if (velocityX !== -1) { velocityX = 1; velocityY = 0; }
            break;
    }
});

const toggleBtn = document.getElementById("toggle-theme");
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

document.getElementById("restart-btn").addEventListener("click", () => {
    gameOver();
    document.getElementById("game-over").style.display = "none";
});

const toggleSoundBtn = document.getElementById("toggle-sound");
toggleSoundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    toggleSoundBtn.textContent = soundOn ? "🔊" : "🔇";
    toggleSoundBtn.setAttribute("aria-pressed", soundOn);
});
