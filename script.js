// Script principal para o campo de golfe interativo e página principal

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('campo');
    if (canvas) {
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

            ctx.beginPath();
            ctx.fillStyle = '#000000';
            ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
            ctx.fill();

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
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vx *= 0.99;
            ball.vy *= 0.99;

            if (Math.abs(ball.vx) < 0.01) ball.vx = 0;
            if (Math.abs(ball.vy) < 0.01) ball.vy = 0;

            if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
                ball.vx *= -1;
                ball.x = Math.max(ball.radius, Math.min(ball.x, canvas.width - ball.radius));
            }
            if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
                ball.vy *= -1;
                ball.y = Math.max(ball.radius, Math.min(ball.y, canvas.height - ball.radius));
            }

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
    }

    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.dataset.target;
            contents.forEach((c) => {
                c.classList.toggle('active', c.id === targetId);
            });
        });
    });
});

