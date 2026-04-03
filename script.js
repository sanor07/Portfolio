(function bootSequence() {
  const logEl = document.getElementById('boot-log');
  const fillEl = document.getElementById('boot-fill');
  const bootScreen = document.getElementById('boot-screen');

  const logs = [
    { t: 80,  cls: 'bl-dim',  txt: '[ BIOS ] Initializing system...' },
    { t: 200, cls: 'bl-ok',   txt: '[ OK   ] Memory check passed — 16384MB' },
    { t: 380, cls: 'bl-ok',   txt: '[ OK   ] Network interfaces detected' },
    { t: 520, cls: 'bl-warn', txt: '[ WARN ] Firewall disabled — entering offensive mode' },
    { t: 700, cls: 'bl-ok',   txt: '[ OK   ] Kali Linux kernel 6.x loaded' },
    { t: 880, cls: 'bl-dim',  txt: '[ INFO ] Loading security modules...' },
    { t: 1050, cls: 'bl-ok',  txt: '[ OK   ] Nmap, Metasploit, Wireshark — READY' },
    { t: 1200, cls: 'bl-ok',  txt: '[ OK   ] Shell access granted' },
    { t: 1400, cls: 'bl-dim', txt: '[ SYS  ] Mounting portfolio filesystem...' },
    { t: 1650, cls: 'bl-ok',  txt: '[ OK   ] All systems operational' },
    { t: 1800, cls: 'bl-ok',  txt: '\n[ BOOT COMPLETE ] Welcome, Operator.' },
  ];

  logs.forEach(({ t, cls, txt }) => {
    setTimeout(() => {
      const span = document.createElement('span');
      span.className = 'bl ' + cls;
      span.textContent = txt;
      logEl.appendChild(span);
      const pct = Math.min(100, (t / 1900) * 100);
      fillEl.style.width = pct + '%';
    }, t);
  });

  setTimeout(() => {
    fillEl.style.width = '100%';
    setTimeout(() => {
      bootScreen.style.opacity = '0';
      setTimeout(() => {
        bootScreen.style.display = 'none';
        initApp();
      }, 500);
    }, 300);
  }, 2100);
})();

/* ── APP INIT ── */
function initApp() {
  initParticles();
  initCursor();
  initNavbar();
  initHero();
  initSkillTabs();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initProjectFilter();
  initTerminal();
  initHexGrid();
}

/* ── PARTICLE CANVAS ── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return; // ✅ FIX
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -999, y: -999 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); particles = createParticles(); });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function createParticles() {
    const arr = [];
    const count = Math.floor((canvas.width * canvas.height) / 10000);
    for (let i = 0; i < count; i++) arr.push(newParticle());
    return arr;
  }

  function newParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.5 + .3,
      a: Math.random() * .5 + .05,
    };
  }

  particles = createParticles();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const a = dist < 120 ? p.a + (1 - dist / 120) * .5 : p.a;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,135,${a})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,135,${.08 * (1 - d / 80)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ── CURSOR ── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!cursor || window.innerWidth < 768) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top = ty + 'px';
  });

  function animTrail() {
    cx += (tx - cx) * .12;
    cy += (ty - cy) * .12;
    trail.style.left = cx + 'px';
    trail.style.top = cy + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  document.querySelectorAll('a,button,input,select,textarea,.proj-card,.skill-item,.tool-badge').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '12px'; cursor.style.height = '12px'; });
  });
}

/* ── NAVBAR ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ── HERO TYPEWRITER ── */
function initHero() {
  const preEl = document.getElementById('hero-pre-text');
  const tagEl = document.getElementById('hero-tagline');

  typeText(preEl, 'INITIALIZING PORTFOLIO...', 60, () => {
    setTimeout(() => typeText(preEl, 'ACCESS GRANTED — WELCOME', 60), 300);
  });

  const tags = [
    'Ethical Hacker',
    'Penetration Tester',
    'Cybersecurity Expert',
    'Web Developer',
    'Bug Bounty Hunter',
  ];
  let ti = 0, ci = 0, deleting = false;

  function typeTag() {
    const word = tags[ti];
    if (!deleting) {
      tagEl.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; setTimeout(typeTag, 1800); return; }
    } else {
      tagEl.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; ti = (ti + 1) % tags.length; }
    }
    setTimeout(typeTag, deleting ? 60 : 90);
  }
  typeTag();
}

function typeText(el, text, speed, cb) {
  let i = 0;
  el.textContent = '';
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) { clearInterval(iv); if (cb) cb(); }
  }, speed);
}

/* ── HEX GRID ── */
function initHexGrid() {
  const grid = document.getElementById('hex-grid');
  if (!grid) return;
  const chars = '0123456789ABCDEF';
  const cells = 36;
  for (let i = 0; i < cells; i++) {
    const cell = document.createElement('div');
    cell.className = 'hex-cell';
    cell.textContent = chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
    cell.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
    cell.style.setProperty('--delay', (Math.random() * 4) + 's');
    cell.style.borderColor = `rgba(0,255,135,${0.1 + Math.random() * 0.3})`;
    cell.style.color = Math.random() > 0.7 ? 'var(--accent)' : 'var(--text-dim)';

    setInterval(() => {
      cell.textContent = chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
    }, 800 + Math.random() * 2000);

    grid.appendChild(cell);
  }
}

/* ── SKILL TABS ── */
function initSkillTabs() {
  const tabs = document.querySelectorAll('.skill-tab');
  const cats = document.querySelectorAll('.skill-category');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      cats.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const cat = document.querySelector(`.skill-category[data-cat="${tab.dataset.cat}"]`);
      if (cat) { cat.classList.add('active'); animateBars(cat); }
    });
  });

  // animate first tab
  const firstCat = document.querySelector('.skill-category.active');
  if (firstCat) setTimeout(() => animateBars(firstCat), 300);
}

function animateBars(container) {
  container.querySelectorAll('.sbar-item').forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('visible');
      const fill = item.querySelector('.sbar-fill');
      if (fill) fill.style.width = fill.style.getPropertyValue('--pct') || '0%';
    }, i * 100);
  });
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.proj-card, .about-card, .edu-item, .exp-item, .sub-proj, .service-card, .reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('reveal', 'visible'), idx * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => { el.classList.add('reveal'); obs.observe(el); });
}

/* ── SKILL BARS — INTERSECTION ── */
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateBars(e.target.closest('.section') || e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('#skills').forEach(el => obs.observe(el));
}

/* ── COUNTERS ── */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          let cur = 0;
          const step = Math.ceil(target / 40);
          const iv = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = cur;
            if (cur >= target) clearInterval(iv);
          }, 40);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  const heroEl = document.getElementById('hero');
  if (heroEl) obs.observe(heroEl);
}

/* ── PROJECT FILTER ── */
function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.proj-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.style.display = match ? '' : 'none';
        card.style.opacity = match ? '1' : '0';
      });
    });
  });
}

/* ── PROJECT EXPAND ── */
function toggleExpand(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('open');
  btn.classList.toggle('open');
  const chevron = btn.querySelector('i');
  if (chevron) chevron.style.transform = el.classList.contains('open') ? 'rotate(180deg)' : '';
  btn.querySelector('span') || (btn.innerHTML = btn.innerHTML);
}

/* ── ATTACK SIMULATION ── */
let simRunning = false;
let simTimeout = [];

const simScripts = {
  pentest: [
    { t: 200,  cls: 'cmd',     msg: '> nmap -sV -sC -O {target}' },
    { t: 600,  cls: 'info',    msg: '[*] Starting Nmap 7.94 scan...' },
    { t: 1000, cls: 'info',    msg: '[*] Host is up (0.002s latency)' },
    { t: 1400, cls: 'info',    msg: '[*] Open ports: 22/ssh, 80/http, 443/https, 3306/mysql' },
    { t: 1800, cls: 'warn',    msg: '[!] Port 3306 (MySQL) exposed to public — CRITICAL' },
    { t: 2200, cls: 'cmd',     msg: '> dirb http://{target} /usr/share/wordlists/dirb/common.txt' },
    { t: 2600, cls: 'info',    msg: '[*] Scanning directories...' },
    { t: 3000, cls: 'warn',    msg: '[!] Found: /admin (403) /backup (200) /config.php (200)' },
    { t: 3400, cls: 'cmd',     msg: '> sqlmap -u "http://{target}/login.php" --dbs' },
    { t: 3800, cls: 'info',    msg: '[*] Testing SQL injection vectors...' },
    { t: 4200, cls: 'danger',  msg: '[!] VULNERABLE: Parameter "id" is injectable (UNION-based)' },
    { t: 4600, cls: 'danger',  msg: '[!] Databases exposed: information_schema, users_db, admin_panel' },
    { t: 5000, cls: 'cmd',     msg: '> msfconsole -q -x "use exploit/multi/handler"' },
    { t: 5400, cls: 'warn',    msg: '[*] Metasploit Framework 6.3 loaded...' },
    { t: 5800, cls: 'warn',    msg: '[*] Setting payload: linux/x64/shell_reverse_tcp' },
    { t: 6200, cls: 'danger',  msg: '[!] Exploit sent — awaiting reverse shell...' },
    { t: 6600, cls: 'success', msg: '[+] Reverse shell received! uid=www-data' },
    { t: 7000, cls: 'cmd',     msg: '> sudo -l — checking sudo privileges...' },
    { t: 7400, cls: 'danger',  msg: '[!] User www-data can run /usr/bin/python3 as root' },
    { t: 7800, cls: 'cmd',     msg: '> sudo python3 -c "import pty; pty.spawn(\'/bin/bash\')"' },
    { t: 8200, cls: 'success', msg: '[+] ROOT SHELL OBTAINED — uid=0(root)' },
    { t: 8600, cls: 'success', msg: '[+] OPERATION COMPLETE — System fully compromised (simulation)' },
  ],
  sqli: [
    { t: 200,  cls: 'cmd',    msg: '> sqlmap -u "http://{target}/index.php?id=1" --level=5' },
    { t: 700,  cls: 'info',   msg: '[*] Testing GET parameter "id"...' },
    { t: 1200, cls: 'info',   msg: '[*] Trying payloads: 1 OR 1=1, UNION SELECT NULL, ...' },
    { t: 1700, cls: 'danger', msg: '[!] Injectable: boolean-based blind, time-based blind' },
    { t: 2200, cls: 'cmd',    msg: '> sqlmap ... --dbs' },
    { t: 2700, cls: 'warn',   msg: '[*] Fetching databases...' },
    { t: 3200, cls: 'success',msg: '[+] Databases: information_schema, shop_db, admin_db' },
    { t: 3700, cls: 'cmd',    msg: '> sqlmap ... -D admin_db --tables' },
    { t: 4200, cls: 'success',msg: '[+] Tables: users, sessions, products, orders' },
    { t: 4700, cls: 'cmd',    msg: '> sqlmap ... -T users --dump' },
    { t: 5200, cls: 'danger', msg: '[!] Dumped 847 user records — plaintext passwords found!' },
    { t: 5700, cls: 'success',msg: '[+] Admin credentials recovered: admin:P@ssw0rd123' },
  ],
  portscan: [
    { t: 200,  cls: 'cmd',   msg: '> nmap -p- -T4 -A -v {target}' },
    { t: 600,  cls: 'info',  msg: '[*] Scanning all 65535 ports...' },
    { t: 1100, cls: 'info',  msg: '[*] 22/tcp  open  ssh     OpenSSH 8.2' },
    { t: 1500, cls: 'info',  msg: '[*] 80/tcp  open  http    Apache 2.4.41' },
    { t: 1900, cls: 'warn',  msg: '[!] 21/tcp  open  ftp     vsftpd 3.0.3 — ANON LOGIN ALLOWED' },
    { t: 2300, cls: 'warn',  msg: '[!] 23/tcp  open  telnet  — UNENCRYPTED PROTOCOL' },
    { t: 2700, cls: 'danger',msg: '[!] 3389/tcp open rdp    MS RDP — CVE-2019-0708 (BlueKeep)' },
    { t: 3100, cls: 'info',  msg: '[*] 443/tcp open  ssl/https' },
    { t: 3500, cls: 'info',  msg: '[*] 8080/tcp open http-proxy' },
    { t: 4000, cls: 'success',msg: '[+] Scan complete — 12 open ports found, 4 critical findings' },
  ],
  bruteforce: [
    { t: 200,  cls: 'cmd',   msg: '> hydra -l admin -P /usr/share/wordlists/rockyou.txt {target} ssh' },
    { t: 600,  cls: 'info',  msg: '[*] Hydra v9.5 (c) 2023 by van Hauser/THC' },
    { t: 1000, cls: 'info',  msg: '[*] Attacking: ssh://target:22 with 14344399 passwords' },
    { t: 1500, cls: 'dim',   msg: '[*] Tried: admin/password, admin/123456, admin/admin...' },
    { t: 2000, cls: 'dim',   msg: '[*] Progress: 12.3% (1762222 attempts)...' },
    { t: 2500, cls: 'warn',  msg: '[!] Connection throttled — implementing delays...' },
    { t: 3000, cls: 'dim',   msg: '[*] Progress: 34.7% (4977426 attempts)...' },
    { t: 3500, cls: 'dim',   msg: '[*] Progress: 67.2% (9639382 attempts)...' },
    { t: 4000, cls: 'success',msg: '[+] LOGIN FOUND: admin:sunshine2019' },
    { t: 4500, cls: 'success',msg: '[+] SSH access granted with credentials' },
  ],
};

const stageTimings = [0, 0.18, 0.36, 0.55, 0.75, 0.95];

function startSimulation() {
  if (simRunning) return;
  simRunning = true;
  document.getElementById('sim-result').style.display = 'none';
  document.getElementById('spo-pct').textContent = '0%';
  document.getElementById('spo-fill').style.width = '0%';

  const target = document.getElementById('sim-target').value;
  const attackType = document.getElementById('sim-attack').value;
  const logBody = document.getElementById('sim-log-body');
  const script = simScripts[attackType] || simScripts.pentest;
  const totalDuration = script[script.length - 1].t + 600;

  logBody.innerHTML = '';
  document.querySelectorAll('.sim-stage').forEach(s => {
    s.classList.remove('active', 'done');
    s.querySelector('.stage-fill').style.width = '0%';
  });

  // Log lines
  script.forEach(({ t, cls, msg }) => {
    const tid = setTimeout(() => {
      const line = document.createElement('span');
      line.className = 'log-line ' + cls;
      line.textContent = msg.replace('{target}', target);
      logBody.appendChild(line);
      logBody.scrollTop = logBody.scrollHeight;
    }, t);
    simTimeout.push(tid);
  });

  // Stage progression
  stageTimings.forEach((pct, idx) => {
    if (idx === 0) return;
    const t = Math.floor(pct * totalDuration);
    const tid = setTimeout(() => {
      const stages = document.querySelectorAll('.sim-stage');
      stages.forEach((s, si) => {
        if (si < idx) s.classList.add('done'), s.classList.remove('active');
        if (si === idx - 1) s.classList.add('active');
      });
    }, t);
    simTimeout.push(tid);
  });

  // Progress bar
  const startTime = Date.now();
  function updateProgress() {
    const elapsed = Date.now() - startTime;
    const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
    document.getElementById('spo-fill').style.width = pct + '%';
    document.getElementById('spo-pct').textContent = pct + '%';
    if (pct < 100) requestAnimationFrame(updateProgress);
  }
  requestAnimationFrame(updateProgress);

  // Final
  const finalTid = setTimeout(() => {
    document.querySelectorAll('.sim-stage').forEach(s => {
      s.classList.add('done');
      s.classList.remove('active');
      s.querySelector('.stage-fill').style.width = '100%';
    });
    document.getElementById('sim-result').style.display = 'block';
    document.getElementById('spo-fill').style.width = '100%';
    document.getElementById('spo-pct').textContent = '100%';
    simRunning = false;
  }, totalDuration + 400);
  simTimeout.push(finalTid);
}

function resetSimulation() {
  simRunning = false;
  simTimeout.forEach(t => clearTimeout(t));
  simTimeout = [];
  document.getElementById('sim-log-body').innerHTML = '<div class="log-line muted">[ SYSTEM ] Ready. Waiting for operator command...</div>';
  document.getElementById('sim-result').style.display = 'none';
  document.getElementById('spo-fill').style.width = '0%';
  document.getElementById('spo-pct').textContent = '0%';
  document.querySelectorAll('.sim-stage').forEach(s => {
    s.classList.remove('active', 'done');
    s.querySelector('.stage-fill').style.width = '0%';
  });
}

/* ── TERMINAL ── */
function initTerminal() {
  const input = document.getElementById('term-input');
  const output = document.getElementById('term-output');
  let history = [];
  let histIdx = -1;

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (cmd) {
        history.unshift(cmd);
        histIdx = -1;
        printHistory(cmd);
        processCommand(cmd.toLowerCase());
        input.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      histIdx = Math.min(histIdx + 1, history.length - 1);
      input.value = history[histIdx] || '';
    } else if (e.key === 'ArrowDown') {
      histIdx = Math.max(histIdx - 1, -1);
      input.value = histIdx >= 0 ? history[histIdx] : '';
    }
  });

  function printHistory(cmd) {
    const row = document.createElement('div');
    row.className = 'term-history-line';
    row.innerHTML = `<span class="term-history-prompt">sanowar@kali:~$</span><span class="term-history-cmd">${escHtml(cmd)}</span>`;
    output.appendChild(row);
  }

  function print(text, cls = '') {
    const lines = text.split('\n');
    lines.forEach(line => {
      const span = document.createElement('span');
      span.className = 'term-out-line ' + cls;
      span.textContent = line;
      output.appendChild(span);
    });
    output.scrollTop = output.scrollHeight;
    document.getElementById('term-body').scrollTop = 9999;
  }

  function processCommand(cmd) {
    switch (cmd) {
      case 'help':
        print('');
        print('Available commands:', 'green');
        print('  help        — Show this help menu', 'dim');
        print('  whoami      — Display operator profile', 'dim');
        print('  skills      — List technical skills', 'dim');
        print('  projects    — Display all projects', 'dim');
        print('  contact     — Show contact information', 'dim');
        print('  certs       — List certifications', 'dim');
        print('  clear       — Clear terminal', 'dim');
        print('  ls          — List portfolio sections', 'dim');
        print('  cat about   — Read about file', 'dim');
        print('  nmap sim    — Run port scan simulation', 'dim');
        print('  sudo hack   — Access hack simulation', 'dim');
        print('');
        break;

      case 'whoami':
        print('');
        print('┌─────────────────────────────────────────┐', 'green');
        print('│  OPERATOR PROFILE                       │', 'green');
        print('├─────────────────────────────────────────┤', 'green');
        print('│  Name      : Sanowar Hussain            │', 'white');
        print('│  Role      : Penetration Tester         │', 'white');
        print('│  Location  : Guwahati, Assam, India     │', 'white');
        print('│  Status    : Open to Opportunities      │', 'green');
        print('│  Certs     : 8 active certifications    │', 'white');
        print('│  LinkedIn  : linkedin.com/in/sano18     │', 'blue');
        print('│  GitHub    : github.com/sanor07         │', 'blue');
        print('└─────────────────────────────────────────┘', 'green');
        print('');
        break;

      case 'skills':
        print('');
        print('>> Security Skills:', 'yellow');
        print('   [████████░░] Penetration Testing   90%', 'green');
        print('   [████████░░] Vulnerability Assess  85%', 'green');
        print('   [███████░░░] Cryptography          80%', 'green');
        print('   [████████░░] Malware Analysis      85%', 'green');
        print('   [████████░░] SQL Injection         88%', 'green');
        print('');
        print('>> Development Skills:', 'yellow');
        print('   [████████░░] HTML5 / CSS3          88%', 'blue');
        print('   [███████░░░] JavaScript            75%', 'blue');
        print('   [████████░░] C / C++               78%', 'blue');
        print('');
        print('>> Tools:', 'yellow');
        print('   Kali Linux | Nmap | Metasploit | Wireshark | Dirb | VirtualBox', 'dim');
        print('');
        break;

      case 'projects':
        print('');
        print('>> PROJECT MANIFEST', 'green');
        print('──────────────────────────────────────────', 'dim');
        print('');
        print('[CYBERSECURITY]', 'yellow');
        print('  01. Ransomware Incident Response & Case Study', 'white');
        print('      Tools: Kali Linux, Nmap, Metasploit, Cryptography', 'dim');
        print('      Status: COMPLETED ✓', 'green');
        print('');
        print('  02. Penetration Testing — Cybersecurity Internship', 'white');
        print('      Tools: Nmap, Dirb, Burp Suite, OWASP methodology', 'dim');
        print('      Status: COMPLETED ✓', 'green');
        print('');
        print('  03. Virtual Hacking Lab — Kali Linux Environment', 'white');
        print('      Tools: VirtualBox, Wireshark, Nmap, Linux CLI', 'dim');
        print('      Status: ACTIVE 🔴', 'yellow');
        print('');
        print('[WEB DEVELOPMENT]', 'blue');
        print('  04. Responsive Web Design — freeCodeCamp (4 Projects)', 'white');
        print('      Tools: HTML5, CSS3, Flexbox, Grid, Accessibility', 'dim');
        print('      Status: CERTIFIED ★', 'green');
        print('');
        print('[DATA / OSINT]', 'yellow');
        print('  05. Email Intelligence Collection — OSINT Campaign', 'white');
        print('      Tools: OSINT, Email Headers, Data Validation', 'dim');
        print('      Status: COMPLETED ✓', 'green');
        print('');
        break;

      case 'contact':
        print('');
        print('>> CONTACT INFORMATION', 'green');
        print('   Email    : sanor9518@gmail.com', 'white');
        print('   LinkedIn : linkedin.com/in/sano18', 'blue');
        print('   GitHub   : github.com/sanor07', 'blue');
        print('   Location : Guwahati, Assam, India', 'dim');
        print('');
        break;

      case 'certs':
        print('');
        print('>> CERTIFICATIONS', 'green');
        print('   [✓] Cyber Security Virtual Internship', 'white');
        print('   [✓] SQL Injection Attacks', 'white');
        print('   [✓] Shields Up', 'white');
        print('   [✓] Cyber Security Workshop', 'white');
        print('   [✓] Introduction to CIP', 'white');
        print('   [✓] Ethical Hacking Essentials', 'white');
        print('   [✓] Cyber Security Professional', 'white');
        print('   [✓] Responsive Web Design — freeCodeCamp', 'white');
        print('');
        break;

      case 'clear':
        output.innerHTML = '';
        break;

      case 'ls':
        print('');
        print('about.txt  skills.dat  projects/  certs/  contact.json', 'green');
        print('');
        break;

      case 'cat about':
        print('');
        print('Sanowar Hussain — Ethical Hacker & Penetration Tester', 'white');
        print('Experienced in simulating cyber attacks to identify vulnerabilities.', 'dim');
        print('Dual background in Cybersecurity + Web Development.', 'dim');
        print('Proficient in Kali Linux, Nmap, Metasploit, Wireshark.', 'dim');
        print('');
        break;

      case 'nmap sim':
        print('');
        print('Launching nmap simulation...', 'yellow');
        print('Scroll up to #simulation section or click "Hack Sim" in nav.', 'dim');
        setTimeout(() => document.getElementById('simulation').scrollIntoView({ behavior: 'smooth' }), 500);
        break;

      case 'sudo hack':
        print('');
        print('[sudo] password for sanowar: ••••••••', 'dim');
        setTimeout(() => {
          print('Access granted. Launching hack simulation...', 'green');
          setTimeout(() => {
            document.getElementById('simulation').scrollIntoView({ behavior: 'smooth' });
            setTimeout(startSimulation, 800);
          }, 800);
        }, 600);
        break;

      default:
        print(`bash: ${cmd}: command not found. Type 'help' for available commands.`, 'red');
    }
    output.scrollTop = output.scrollHeight;
  }
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ── CONTACT FORM ── */
function handleFormSubmit(btn) {
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> TRANSMITTING...';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> MESSAGE SENT!';
    btn.style.borderColor = 'var(--accent)';
    btn.style.color = 'var(--accent)';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> TRANSMIT MESSAGE';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 3000);
  }, 1500);
}

/* ── CLOSE MODAL ── */
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modal-overlay').classList.remove('open');
}
