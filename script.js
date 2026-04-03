(function bootSequence() {
  const logEl = document.getElementById('boot-log');
  const fillEl = document.getElementById('boot-fill');
  const bootScreen = document.getElementById('boot-screen');

  if (!logEl || !fillEl || !bootScreen) {
    console.warn("Boot elements missing");
    initApp();
    return;
  }

  const logs = [
    { t: 80, txt: '[ BIOS ] Initializing system...' },
    { t: 200, txt: '[ OK ] Memory check passed' },
    { t: 400, txt: '[ OK ] Network interfaces detected' },
    { t: 600, txt: '[ WARN ] Firewall disabled' },
    { t: 800, txt: '[ OK ] Security modules loaded' },
    { t: 1000, txt: '[ OK ] System ready' },
  ];

  logs.forEach(({ t, txt }) => {
    setTimeout(() => {
      const span = document.createElement('div');
      span.textContent = txt;
      logEl.appendChild(span);
      fillEl.style.width = (t / 10) + '%';
    }, t);
  });

  setTimeout(() => {
    fillEl.style.width = '100%';
    setTimeout(() => {
      bootScreen.style.opacity = '0';
      setTimeout(() => {
        bootScreen.style.display = 'none';

        try {
          initApp();
        } catch (e) {
          console.error("Init error:", e);
        }

      }, 500);
    }, 300);
  }, 1500);
})();

/* ── INIT APP ── */
function initApp() {
  try { initParticles(); } catch(e){ console.error(e); }
  try { initCursor(); } catch(e){ console.error(e); }
  try { initNavbar(); } catch(e){ console.error(e); }
  try { initHero(); } catch(e){ console.error(e); }
  try { initSkillTabs(); } catch(e){ console.error(e); }
  try { initScrollReveal(); } catch(e){ console.error(e); }
  try { initSkillBars(); } catch(e){ console.error(e); }
  try { initCounters(); } catch(e){ console.error(e); }
  try { initProjectFilter(); } catch(e){ console.error(e); }
  try { initTerminal(); } catch(e){ console.error(e); }
  try { initHexGrid(); } catch(e){ console.error(e); }
}

/* ── PARTICLES ── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
  }

  draw();
}

/* ── CURSOR ── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
}

/* ── NAVBAR ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');

  if (!nav || !hamburger || !links) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    links.classList.toggle('open');
  });
}

/* ── HERO ── */
function initHero() {
  const tagEl = document.getElementById('hero-tagline');
  if (!tagEl) return;

  const tags = ['Ethical Hacker', 'Penetration Tester', 'Cybersecurity Expert'];
  let i = 0;

  setInterval(() => {
    tagEl.textContent = tags[i];
    i = (i + 1) % tags.length;
  }, 2000);
}

/* ── EMPTY SAFE FUNCTIONS ── */
function initSkillTabs() {}
function initScrollReveal() {}
function initSkillBars() {}
function initCounters() {}
function initProjectFilter() {}
function initHexGrid() {}

/* ── TERMINAL ── */
function initTerminal() {
  const input = document.getElementById('term-input');
  const output = document.getElementById('term-output');

  if (!input || !output) return;

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      const div = document.createElement('div');
      div.textContent = '> ' + cmd;
      output.appendChild(div);
      input.value = '';
    }
  });
}
