const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

const ballRadius = 10;

const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'RebeccaPurple',
    dy: 10,
    score: 0
};

const ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'Plum',
    dy: 4,
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 4,
    dx: 4,
    dy: 4,
    color: '#000'
};

const hitSound = new Audio('hit.mp3');
const playerScoreSound = new Audio('playerScore.mp3');
const aiScoreSound = new Audio('aiScore2.mp3');

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10, '#fff');
    }
}

function drawScore(x, y, score) {
    context.fillStyle = '#000';
    context.font = '35px Arial';
    context.fillText(score, x, y);
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, '#fff');
    drawNet();
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawScore(canvas.width / 4, canvas.height / 5, player.score);
    drawScore(3 * canvas.width / 4, canvas.height / 5, ai.score);
}

function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    let playerPaddle = ball.x < canvas.width / 2 ? player : ai;
    if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width && 
        ball.x + ball.radius > playerPaddle.x && 
        ball.y + ball.radius > playerPaddle.y && 
        ball.y - ball.radius < playerPaddle.y + playerPaddle.height) {
        
        let collidePoint = (ball.y - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        ball.dx = direction * ball.speed * Math.cos(angleRad);
        ball.dy = ball.speed * Math.sin(angleRad);

        ball.speed += 0.5; // Erhöht die Geschwindigkeit des Balls nach jeder Kollision

        hitSound.play();
    }

    if (ball.x - ball.radius < 0) {
        ai.score++;
        aiScoreSound.play();
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        playerScoreSound.play();
        resetBall();
    }

    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;

    ai.y += ai.dy * (ball.y < ai.y ? -1 : 1);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 4;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

function game() {
    update();
    draw();
}

setInterval(game, 1000 / 60);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        player.y -= player.dy * 5;
    } else if (event.key === 'ArrowDown') {
        player.y += player.dy * 5;
    }
});
