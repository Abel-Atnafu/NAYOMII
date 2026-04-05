/* ============================================================
   CINEMA.JS — Opening sequence
   Deception screen → Title card → Shutter reveal
   ============================================================ */

const Cinema = (() => {
  const DECEPTION_LINES = [
    '> initializing...',
    '',
    '> loading files...',
    '',
    '> found: 1 item',
    '',
    '> opening...',
  ];

  let onReadyCallback = null;

  /* ── Typewriter ──────────────────────────────────────────── */
  function typeLines(el, lines, charDelay = 18, lineDelay = 140) {
    return new Promise(resolve => {
      const cursor = document.getElementById('cursor');
      let lineIndex = 0;
      let charIndex = 0;
      let currentText = '';

      function typeNext() {
        if (lineIndex >= lines.length) {
          resolve();
          return;
        }

        const line = lines[lineIndex];

        if (charIndex < line.length) {
          currentText += line[charIndex];
          el.textContent = currentText;
          charIndex++;
          setTimeout(typeNext, charDelay);
        } else {
          currentText += '\n';
          el.textContent = currentText;
          lineIndex++;
          charIndex = 0;
          setTimeout(typeNext, lineDelay);
        }
      }

      typeNext();
    });
  }

  /* ── Deception → Title ───────────────────────────────────── */
  async function runDeception() {
    const section = document.getElementById('deception');
    const termEl  = document.getElementById('terminal-text');
    const cursor  = document.getElementById('cursor');

    // Type out the fake terminal text
    await typeLines(termEl, DECEPTION_LINES, 16, 120);

    // Pause so she reads the last line
    await delay(900);

    // Stop cursor blinking, fade it out
    cursor.style.animation = 'none';
    cursor.style.opacity   = '0';

    // Small pause, then fade the whole deception screen
    await delay(500);
    section.classList.add('fade-out');

    // After fade, show title card and remove deception from flow
    await delay(1500);
    section.style.display = 'none';
    showTitleCard();
  }

  /* ── Title Card ──────────────────────────────────────────── */
  function showTitleCard() {
    const titleCard = document.getElementById('title-card');
    titleCard.classList.remove('hidden');

    // Update title with her actual name from data
    const titleName = document.getElementById('title-name');
    if (typeof HER_NAME !== 'undefined') {
      titleName.textContent = HER_NAME.toUpperCase();
    }

    // Show music button after a moment
    setTimeout(() => {
      const btn = document.getElementById('unmute-btn');
      if (btn) btn.classList.add('visible');
    }, 2000);

    // Listen for any click/touch to begin
    function onBegin(e) {
      titleCard.removeEventListener('click', onBegin);
      titleCard.removeEventListener('touchend', onBegin);
      showOverture();
    }

    titleCard.addEventListener('click', onBegin);
    titleCard.addEventListener('touchend', onBegin);
  }

  /* ── Overture (cover reveal) ─────────────────────────────── */
  function showOverture() {
    const titleCard = document.getElementById('title-card');
    const overture  = document.getElementById('overture');

    // Fade out title card
    titleCard.style.transition = 'opacity 0.8s ease';
    titleCard.style.opacity = '0';

    setTimeout(() => {
      titleCard.classList.add('hidden');
      overture.classList.remove('hidden');

      // Short delay then trigger shutter open on cover image
      setTimeout(() => {
        const img = document.getElementById('cover-image');
        img.classList.add('open');

        // Set the relationship start date
        const dateEl = document.getElementById('cover-date');
        if (dateEl && typeof RELATIONSHIP_START !== 'undefined') {
          dateEl.textContent = RELATIONSHIP_START;
        }

        // Reveal the text overlay after the shutter finishes (~2.2s)
        setTimeout(() => {
          const coverText = document.querySelector('.cover-text');
          if (coverText) coverText.classList.add('visible');

          // Signal that the main experience is ready to scroll
          if (onReadyCallback) onReadyCallback();
        }, 2400);

      }, 200);
    }, 850);
  }

  /* ── Public API ──────────────────────────────────────────── */
  function init(readyCallback) {
    onReadyCallback = readyCallback;
    runDeception();
  }

  return { init };

  /* ── Helpers ─────────────────────────────────────────────── */
  function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
})();
