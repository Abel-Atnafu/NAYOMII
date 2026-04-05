/* ============================================================
   PARTICLES.JS — Canvas ambient floating particles
   Rose petals / soft light spots
   ============================================================ */

const Particles = (() => {
  const PARTICLE_COUNT = 38;
  const COLORS = [
    'rgba(212, 115, 106, 0.45)',  // rose
    'rgba(201, 169, 110, 0.35)',  // gold
    'rgba(245, 230, 200, 0.25)',  // cream
    'rgba(140, 74, 71, 0.3)',     // deep rose
  ];

  let canvas, ctx;
  let particles = [];
  let width, height;
  let animFrameId;
  let mouseX = -1000, mouseY = -1000;

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x      = Math.random() * width;
      this.y      = initial ? Math.random() * height : height + 20;
      this.vx     = (Math.random() - 0.5) * 0.25;
      this.vy     = -(0.18 + Math.random() * 0.35);
      this.size   = 2 + Math.random() * 4;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.angle  = Math.random() * Math.PI * 2;
      this.spin   = (Math.random() - 0.5) * 0.018;
      this.phase  = Math.random() * Math.PI * 2;
      this.phaseSpeed = 0.008 + Math.random() * 0.008;
      this.wobble = 0.2 + Math.random() * 0.5;
    }

    update() {
      this.phase  += this.phaseSpeed;
      this.angle  += this.spin;
      this.x      += this.vx + Math.sin(this.phase) * this.wobble;
      this.y      += this.vy;

      // Subtle mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.3;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }

      if (this.y < -20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // Draw as a soft elongated ellipse (petal shape)
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();

      ctx.restore();
    }
  }

  function init() {
    canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    ctx    = canvas.getContext('2d');
    resize();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    loop();
  }

  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onTouchMove(e) {
    if (e.touches.length) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.update();
      p.draw();
    }

    animFrameId = requestAnimationFrame(loop);
  }

  return { init };
})();
