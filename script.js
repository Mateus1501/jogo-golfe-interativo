const canvas = document.getElementById('campo');
const ctx = canvas.getContext('2d');

const ball = {
    x: 100,
    y: canvas.height / 2,
    radius: 10,
    color: '#ffffff',
    vx: 0,
    vy: 0
};

const hole = {
    x: canvas.width - 100,
    y: canvas.height / 2,
    radius: 15
};

let isDragging = false;
let startDrag = { x: 0, y: 0 };

function drawCourse() {
    ctx.fillStyle = '#90ee90';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // hole
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fill();

    // ball
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    if (isDragging) {
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(startDrag.x, startDrag.y);
        ctx.strokeStyle = '#0000ff';
        ctx.stroke();
    }
}

function update() {
    // apply velocity
    ball.x += ball.vx;
    ball.y += ball.vy;

    // friction
    ball.vx *= 0.99;
    ball.vy *= 0.99;

    if (Math.abs(ball.vx) < 0.01) ball.vx = 0;
    if (Math.abs(ball.vy) < 0.01) ball.vy = 0;

    // boundaries
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.vx *= -1;
        ball.x = Math.max(ball.radius, Math.min(ball.x, canvas.width - ball.radius));
    }
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy *= -1;
        ball.y = Math.max(ball.radius, Math.min(ball.y, canvas.height - ball.radius));
    }

    // check hole
    const dist = Math.hypot(ball.x - hole.x, ball.y - hole.y);
    if (dist < hole.radius) {
        alert('Parabéns! Você acertou o buraco!');
        reset();
    }

    drawCourse();
    requestAnimationFrame(update);
}

function reset() {
    ball.x = 100;
    ball.y = canvas.height / 2;
    ball.vx = 0;
    ball.vy = 0;
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dist = Math.hypot(mouseX - ball.x, mouseY - ball.y);
    if (dist <= ball.radius) {
        isDragging = true;
        startDrag.x = mouseX;
        startDrag.y = mouseY;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    ball.vx = (ball.x - mouseX) * 0.1;
    ball.vy = (ball.y - mouseY) * 0.1;
    isDragging = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    startDrag.x = e.clientX - rect.left;
    startDrag.y = e.clientY - rect.top;
});

drawCourse();
requestAnimationFrame(update);
