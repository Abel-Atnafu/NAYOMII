/* ============================================================
   MAIN.JS — Orchestration layer
   Initialises all modules, sets up scroll-driven animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Build all dynamic DOM sections ──────────────────────
  MemoriesModule.build();

  // ── 2. Start particle canvas ────────────────────────────────
  Particles.init();

  // ── 3. Start the cinematic opening sequence ─────────────────
  //    When Cinema calls back, the overture is visible and the
  //    user can start scrolling.
  Cinema.init(onExperienceReady);

  // ── 4. Music toggle ─────────────────────────────────────────
  initMusic();

});

/* ── Called when the cover reveal finishes ─────────────────── */
function onExperienceReady() {
  setupScrollAnimations();
  setupParallax();
  setupFinalMessage();
}

/* ── IntersectionObserver for scroll-driven reveals ─────────── */
function setupScrollAnimations() {
  const generalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // One-shot: unobserve once visible
        generalObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // All standard animate-on-scroll elements
  document.querySelectorAll(
    '.animate-on-scroll, ' +
    '.chapter-marker, ' +
    '.love-reason, ' +
    '.timeline-entry, ' +
    '.mosaic-cell'
  ).forEach(el => generalObserver.observe(el));

  // Polaroids (slightly lower threshold so they trigger earlier)
  const polaroidObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        polaroidObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.polaroid').forEach(el => polaroidObserver.observe(el));

  // Memory text blocks
  const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        textObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.memory-text').forEach(el => textObserver.observe(el));

  // Final name — triggers the heartbeat animation
  const finaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        finaleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const finalName = document.getElementById('final-name');
  if (finalName) finaleObserver.observe(finalName);
}

/* ── Scroll-driven parallax on cover image ──────────────────── */
function setupParallax() {
  const coverImg = document.getElementById('cover-image');
  if (!coverImg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Only apply while the overture is in view
        const overture = document.getElementById('overture');
        if (overture && scrollY < window.innerHeight) {
          coverImg.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── Trigger final message word-by-word reveal on scroll ───── */
function setupFinalMessage() {
  const msgEl = document.getElementById('final-message');
  if (!msgEl) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger by adding a class that starts the CSS animations
        msgEl.classList.add('revealing');
        observer.unobserve(msgEl);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(msgEl);
}

/* ── Music button (graceful — optional background audio) ────── */
function initMusic() {
  const btn   = document.getElementById('unmute-btn');
  let   audio = null;
  let   muted = true;

  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!audio) {
      // Only create audio on explicit user interaction (browser policy)
      // User can replace this URL with any ambient audio track they host
      // e.g. place an "ambient.mp3" in the root and reference it as 'ambient.mp3'
      audio = new Audio();
      audio.loop   = true;
      audio.volume = 0;

      // Try to load a local file if it exists; otherwise skip silently
      audio.src = 'ambient.mp3';
      audio.load();
    }

    if (muted) {
      audio.play().then(() => {
        fadeVolume(audio, 0, 0.35, 3000);
        btn.setAttribute('aria-label', 'Mute music');
        btn.style.borderColor = 'var(--gold)';
      }).catch(() => {
        // Silently ignore if no audio file is present
      });
    } else {
      fadeVolume(audio, audio.volume, 0, 1500, () => audio.pause());
      btn.setAttribute('aria-label', 'Unmute music');
      btn.style.borderColor = '';
    }

    muted = !muted;
  });
}

function fadeVolume(audio, from, to, duration, onComplete) {
  const steps    = 40;
  const interval = duration / steps;
  const delta    = (to - from) / steps;
  let   current  = from;
  let   count    = 0;

  const timer = setInterval(() => {
    current += delta;
    count++;
    audio.volume = Math.max(0, Math.min(1, current));

    if (count >= steps) {
      clearInterval(timer);
      audio.volume = to;
      if (onComplete) onComplete();
    }
  }, interval);
}
