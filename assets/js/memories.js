/* ============================================================
   MEMORIES.JS — Builds all dynamic sections from data
   Reads: MEMORIES, LOVE_REASONS, SPECIAL_DATES, FINAL_MESSAGE
          HER_NAME, YOUR_NAME from data/memories.js
   ============================================================ */

const MemoriesModule = (() => {

  /* ── Roman numerals ──────────────────────────────────────── */
  const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X',
                 'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];

  /* ── Random rotation for polaroids (stable per index) ───── */
  function polaroidRotation(index) {
    const rotations = [-2, 1.5, -1, 2, -1.5, 0.8, -0.5, 1.8, -2, 1.2];
    return rotations[index % rotations.length];
  }

  /* ── Build memory chapters ───────────────────────────────── */
  function buildMemories() {
    if (typeof MEMORIES === 'undefined' || !MEMORIES.length) return;

    const container = document.getElementById('memories-container');

    MEMORIES.forEach((mem, i) => {
      const rot   = polaroidRotation(i);
      const side  = mem.position === 'right' ? 'right' : 'left';
      const slideX = side === 'left' ? '-30px' : '30px';

      const article = document.createElement('article');
      article.className = 'memory-chapter';
      article.setAttribute('aria-label', `Memory ${i + 1}: ${mem.caption}`);

      article.innerHTML = `
        <div class="chapter-marker" data-observe>
          <span class="chapter-numeral">${ROMAN[i] || (i + 1)}</span>
          <span class="chapter-title">${escHtml(mem.caption)}</span>
        </div>

        <div class="memory-scene ${side}">
          <div class="polaroid"
               style="--rotation:${rot}deg; --delay:${0.1 + i * 0.05}s"
               data-observe-polaroid>
            <img src="photos/${escHtml(mem.photo)}"
                 alt="${escHtml(mem.caption)}"
                 loading="lazy" />
            <p class="polaroid-date">${escHtml(mem.date)}</p>
            <p class="polaroid-caption">${escHtml(mem.caption)}</p>
          </div>

          <div class="memory-text"
               style="--slide-x:${slideX}"
               data-observe-text>
            <p class="memory-body">${escHtml(mem.body)}</p>
          </div>
        </div>
      `;

      container.appendChild(article);
    });
  }

  /* ── Build love reasons list ─────────────────────────────── */
  function buildLoveReasons() {
    if (typeof LOVE_REASONS === 'undefined' || !LOVE_REASONS.length) return;

    const list = document.getElementById('love-reasons');

    LOVE_REASONS.forEach((reason, i) => {
      const li = document.createElement('li');
      li.className = 'love-reason';
      li.style.setProperty('--reason-delay', `${i * 0.12}s`);
      li.textContent = reason;
      list.appendChild(li);
    });
  }

  /* ── Build timeline ──────────────────────────────────────── */
  function buildTimeline() {
    if (typeof SPECIAL_DATES === 'undefined' || !SPECIAL_DATES.length) return;

    const list = document.getElementById('timeline-list');

    SPECIAL_DATES.forEach((entry, i) => {
      const li = document.createElement('li');
      li.className = 'timeline-entry';
      li.style.setProperty('--entry-delay', `${i * 0.1}s`);
      li.innerHTML = `
        <p class="timeline-date">${escHtml(entry.date)}</p>
        <p class="timeline-label">${escHtml(entry.label)}</p>
      `;
      list.appendChild(li);
    });
  }

  /* ── Build mosaic ────────────────────────────────────────── */
  function buildMosaic() {
    if (typeof MEMORIES === 'undefined' || !MEMORIES.length) return;

    const grid = document.getElementById('mosaic-grid');

    // Layout patterns: assign tall/wide classes for variety
    const layouts = [
      'tall', '', '', 'wide', '', 'tall', '', '', '', 'wide', '', ''
    ];

    MEMORIES.forEach((mem, i) => {
      const cell = document.createElement('div');
      cell.className = `mosaic-cell ${layouts[i % layouts.length]}`;
      cell.style.setProperty('--mosaic-delay', `${(i % 3) * 0.15 + Math.floor(i / 3) * 0.1}s`);

      const img = document.createElement('img');
      img.src     = `photos/${mem.photo}`;
      img.alt     = mem.caption;
      img.loading = 'lazy';

      cell.appendChild(img);
      grid.appendChild(cell);
    });
  }

  /* ── Build final message ─────────────────────────────────── */
  function buildFinale() {
    const msgEl  = document.getElementById('final-message');
    const nameEl = document.getElementById('final-name');

    if (msgEl && typeof FINAL_MESSAGE !== 'undefined') {
      // Split into words and wrap each in a span with a delay
      const words = FINAL_MESSAGE.split(/(\s+)/);
      let wordIndex = 0;

      msgEl.innerHTML = words.map(token => {
        if (/^\s+$/.test(token)) return token; // preserve whitespace
        const span = `<span class="word" style="--delay:${wordIndex * 0.07}s">${escHtml(token)}</span>`;
        wordIndex++;
        return span;
      }).join('');
    }

    if (nameEl && typeof HER_NAME !== 'undefined') {
      nameEl.textContent = HER_NAME;
    }
  }

  /* ── Build coda ──────────────────────────────────────────── */
  function buildCoda() {
    const namesEl = document.getElementById('coda-names');
    const dateEl  = document.getElementById('coda-date');

    if (namesEl && typeof HER_NAME !== 'undefined' && typeof YOUR_NAME !== 'undefined') {
      namesEl.textContent = `${YOUR_NAME} & ${HER_NAME}`;
    }

    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  }

  /* ── Escape HTML to prevent XSS ─────────────────────────── */
  function escHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ── Public API ──────────────────────────────────────────── */
  function build() {
    buildMemories();
    buildLoveReasons();
    buildTimeline();
    buildMosaic();
    buildFinale();
    buildCoda();
  }

  return { build };
})();
