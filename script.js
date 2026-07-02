/* ============================================================
   SUNETHTHA'S 21ST BIRTHDAY — SCRIPT.JS
   Vanilla JS. Organized by feature. Search "CUSTOMIZE" for the
   spots you'll most likely want to edit.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (window.gsap && window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);
  initLoadingScreen();
  initAmbientFloaters();
  initThemeToggle();
  initBackgroundMusic();
  initDotNav();
  initSmoothNextButtons();
  initStartSurpriseButton();
  initTypewriter();
  initGiftGame();
  initCake();
  initFinalCelebration();
  initReplayButton();
  if (window.AOS) AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
});

/* ------------------------------------------------------------
   LOADING SCREEN
------------------------------------------------------------ */
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  const finish = () => {
    setTimeout(() => screen.classList.add('hidden'), 900);
  };
  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish);
}

/* ------------------------------------------------------------
   AMBIENT FLOATING HEARTS / SPARKLES / MINI BALLOONS
   Continuously spawns lightweight floaters across the whole page.
------------------------------------------------------------ */
function initAmbientFloaters() {
  const layer = document.getElementById('ambient-layer');
  const hearts = ['💗', '💕', '💓'];
  const sparkles = ['✦', '✧', '⋆'];
  const balloons = ['🎈'];

  function spawn(type) {
    const el = document.createElement('span');
    const left = Math.random() * 100;
    const duration = 10 + Math.random() * 8;
    const drift = (Math.random() * 120 - 60) + 'px';
    const size = type === 'balloon' ? (24 + Math.random() * 20) : (14 + Math.random() * 14);

    el.style.left = left + 'vw';
    el.style.setProperty('--drift', drift);
    el.style.setProperty('--size', size + 'px');
    el.style.animationDuration = duration + 's';
    el.classList.add('floaty', `floaty--${type}`);

    if (type === 'heart') el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    else if (type === 'sparkle') el.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    else el.textContent = balloons[0];

    layer.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 500);
  }

  // Gentle ambient cadence — kept sparse so it never feels busy.
  setInterval(() => spawn('heart'), 1800);
  setInterval(() => spawn('sparkle'), 1400);
  setInterval(() => spawn('balloon'), 4200);
}

/* ------------------------------------------------------------
   DARK / LIGHT MODE TOGGLE
------------------------------------------------------------ */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const icon = btn.querySelector('i');
  const saved = localStorage.getItem('suneththa-theme');
  const initial = saved || 'light';
  setTheme(initial);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('suneththa-theme', next);
  });

  function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.setAttribute('data-theme', mode);
    icon.className = mode === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

/* ------------------------------------------------------------
   BACKGROUND MUSIC AUTO-PLAY
   Plays music automatically on first user interaction.
   CUSTOMIZE: place your track at assets/music/birthday-song.mp3
------------------------------------------------------------ */
function initBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  let hasStarted = false;

  const startPlay = () => {
    if (hasStarted) return;
    audio.volume = 0.5;
    audio.play().then(() => {
      hasStarted = true;
      removeInteractionListeners();
    }).catch((err) => {
      // Autoplay-restricted browsers — fail silently and wait for next interaction
      console.log('Autoplay deferred: waiting for user interaction.', err);
    });
  };

  const removeInteractionListeners = () => {
    document.removeEventListener('click', startPlay);
    document.removeEventListener('touchstart', startPlay);
    document.removeEventListener('keydown', startPlay);
  };

  // Listen to any user interaction to trigger audio play
  document.addEventListener('click', startPlay);
  document.addEventListener('touchstart', startPlay);
  document.addEventListener('keydown', startPlay);
}

/* ------------------------------------------------------------
   DOT NAVIGATION (active state via IntersectionObserver)
------------------------------------------------------------ */
function initDotNav() {
  const dots = document.querySelectorAll('.dot-nav .dot');
  const sections = document.querySelectorAll('.page');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach((d) => d.classList.toggle('active', d.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.5 });

  sections.forEach((s) => observer.observe(s));
}

/* ------------------------------------------------------------
   "NEXT" BUTTONS — smooth scroll to next section
------------------------------------------------------------ */
function initSmoothNextButtons() {
  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-next'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ------------------------------------------------------------
   "START THE SURPRISE" BUTTON — cinematic transition to page 2
------------------------------------------------------------ */
function initStartSurpriseButton() {
  const btn = document.getElementById('start-surprise-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const target = document.getElementById('page2');
    if (window.gsap) {
      gsap.to(window, {
        duration: 1.1,
        scrollTo: { y: target, offsetY: 0 },
        ease: 'power3.inOut',
      });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    burstConfetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  });
}

/* ------------------------------------------------------------
   TYPEWRITER EFFECT — Page 2 letter
   CUSTOMIZE: edit the `message` string below to change the letter.
------------------------------------------------------------ */
function initTypewriter() {
  const target = document.getElementById('typewriter-target');
  const cursor = document.getElementById('typewriter-cursor');
  if (!target) return;

  const message =
`Dear Suneththa,

Happy 21st Birthday!

May your life always be filled with love, happiness, success, peace and unforgettable memories.

May all your dreams come true.

Happy Birthday!`;

  let started = false;
  const section = document.getElementById('page2');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        typeText(message, target, cursor, 28);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(section);
}

function typeText(text, target, cursor, speed) {
  let i = 0;
  target.textContent = '';
  const interval = setInterval(() => {
    target.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (cursor) cursor.style.display = 'none';
    }
  }, speed);
}

/* ------------------------------------------------------------
   GIFT GAME — Page 5
   CUSTOMIZE: change `correctGift` (1, 2, or 3) to move the prize.
------------------------------------------------------------ */
function initGiftGame() {
  const boxes = document.querySelectorAll('.gift-box');
  const feedback = document.getElementById('gift-feedback');
  const modal = document.getElementById('gift-modal');
  const continueBtn = document.getElementById('gift-continue-btn');
  if (!boxes.length) return;

  const correctGift = '2'; // CUSTOMIZE: which box (1/2/3) holds the surprise
  let solved = false;

  boxes.forEach((box) => {
    box.addEventListener('click', () => {
      if (solved) return;

      if (box.dataset.gift === correctGift) {
        solved = true;
        box.classList.add('opened');
        feedback.textContent = '🎉 You found it!';
        launchFireworks(2200);
        burstConfetti({ particleCount: 140, spread: 100, origin: { y: 0.6 } });
        setTimeout(() => openModal(modal), 500);
      } else {
        box.classList.remove('shake');
        void box.offsetWidth; // restart animation
        box.classList.add('shake');
        feedback.textContent = 'Oops! Try Again 😄';
      }
    });
  });

  continueBtn.addEventListener('click', () => {
    closeModal(modal);
    const next = document.getElementById('page6');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  });
}

function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

/* ------------------------------------------------------------
   CAKE CANDLE — Page 6
------------------------------------------------------------ */
function initCake() {
  const candleBtn = document.getElementById('candle-btn');
  const caption = document.getElementById('cake-caption');
  const sound = document.getElementById('celebration-sound');
  if (!candleBtn) return;

  let blown = false;
  candleBtn.addEventListener('click', () => {
    if (blown) return;
    blown = true;
    candleBtn.classList.add('blown');
    caption.textContent = 'Wish made! 🌟 Happy 21st Birthday!';

    if (sound) {
      sound.volume = 0.6;
      sound.play().catch(() => {});
    }

    launchFireworks(2600);
    burstConfetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
  });
}

/* ------------------------------------------------------------
   FINAL PAGE — auto celebration when reached
------------------------------------------------------------ */
function initFinalCelebration() {
  const finalSection = document.getElementById('page7');
  if (!finalSection) return;
  let triggered = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        launchFireworks(3000);
        burstConfetti({ particleCount: 160, spread: 120, origin: { y: 0.4 } });
      }
    });
  }, { threshold: 0.5 });

  observer.observe(finalSection);
}

function initReplayButton() {
  const btn = document.getElementById('replay-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const first = document.getElementById('page1');
    if (first) first.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ------------------------------------------------------------
   CONFETTI (canvas-confetti library)
------------------------------------------------------------ */
function burstConfetti(options = {}) {
  if (typeof confetti !== 'function') return;
  const canvas = document.getElementById('confetti-canvas');
  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
  myConfetti({
    particleCount: 100,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#EE6B96', '#FFC1DD', '#F2C567', '#FFFFFF', '#D94E7C'],
    ...options,
  });
}

/* ------------------------------------------------------------
   FIREWORKS (custom canvas particle system)
------------------------------------------------------------ */
function launchFireworks(durationMs = 2000) {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#EE6B96', '#F2C567', '#FFC1DD', '#FFFFFF', '#B93865'];
  let particles = [];
  const endTime = Date.now() + durationMs;
  let rafId;

  function createBurst(x, y) {
    const count = 40;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3.5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 2,
      });
    }
  }

  let lastBurst = 0;
  function frame(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!lastBurst || ts - lastBurst > 550) {
      const x = canvas.width * (0.2 + Math.random() * 0.6);
      const y = canvas.height * (0.2 + Math.random() * 0.35);
      createBurst(x, y);
      lastBurst = ts;
    }

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045; // gravity
      p.life -= 0.014;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    particles = particles.filter((p) => p.life > 0);

    if (Date.now() < endTime || particles.length > 0) {
      rafId = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(rafId);
    }
  }

  requestAnimationFrame(frame);
}

window.addEventListener('resize', () => {
  const canvas = document.getElementById('fireworks-canvas');
  if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
});
