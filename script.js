// === Particle Background Animation with Mouse + Click Explosion ===
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const numParticles = 80;
let mouse = { x: null, y: null, radius: 120 };
let pulseEffects = []; // store click pulse animations

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse position
window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Track mouse clicks for explosion
window.addEventListener('click', (event) => {
  pulseEffects.push({
    x: event.x,
    y: event.y,
    radius: 0,
    maxRadius: 250,
    opacity: 0.8,
  });
});

// === Particle Object ===
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Move particles slightly toward mouse
    if (distance < mouse.radius) {
      this.x -= dx / 20;
      this.y -= dy / 20;
    } else {
      this.x += this.speedX;
      this.y += this.speedY;
    }

    // Bounce off edges
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let glow = Math.max(0.3, 1 - distance / 150);
    ctx.fillStyle = `rgba(0,255,224,${glow})`;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

// === Initialize Particles ===
function initParticles() {
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

// === Connect Particles ===
function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const opacity = 1 - distance / 120;
        ctx.strokeStyle = `rgba(0,255,224,${opacity * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

// === Draw Click Pulse Effect ===
function drawPulses() {
  for (let i = 0; i < pulseEffects.length; i++) {
    let pulse = pulseEffects[i];

    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0,255,224,${pulse.opacity})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    pulse.radius += 6;
    pulse.opacity -= 0.02;

    if (pulse.opacity <= 0) {
      pulseEffects.splice(i, 1);
      i--;
    }
  }
}

// === Animate Everything ===
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  connectParticles();
  drawPulses();

  requestAnimationFrame(animate);
}

// Start animation
initParticles();
animate();
