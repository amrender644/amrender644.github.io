'use strict';
/* Amrender Singh Portfolio — main.js
   No eval. No innerHTML with user data. No unsafe-inline.
   CSS.escape on dynamic selectors. Whitelist-validated localStorage.
   Rate-limited, time-gated, sanitised contact form.
   Magnetic buttons. Aurora cursor. */

/* ── 1. THEME ─────────────────────────────────────────────────────────── */
const THEMES = Object.freeze(['dark','light']);

function getTheme() {
  try { const v = localStorage.getItem('theme'); return THEMES.includes(v) ? v : 'dark'; }
  catch { return 'dark'; }
}
function saveTheme(t) {
  try { if (THEMES.includes(t)) localStorage.setItem('theme', t); } catch {}
}
function applyTheme(t) {
  if (!THEMES.includes(t)) return;
  document.documentElement.setAttribute('data-theme', t);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const nxt = cur === 'dark' ? 'light' : 'dark';
  applyTheme(nxt);
  saveTheme(nxt);
}

applyTheme(getTheme());

/* ── 2. DOM READY ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  initCursor();
  initTyping();
  initObservers();
  initNameReveal();
  initTilt();
  initMagnetic();
  initTerminal();
  initNavbar();
  initCharCounter();
  initForm();
});

/* ── 3. CUSTOM CURSOR ─────────────────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // JS cursor initialized successfully, safe to activate custom cursor styling
  document.body.classList.add('custom-cursor-active');

  let mx = -100, my = -100, rx = -100, ry = -100, rafId;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
  });

  function loop() {
    dot.style.transform = 'translate3d(' + mx + 'px, ' + my + 'px, 0) translate(-50%, -50%)';
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.transform = 'translate3d(' + rx + 'px, ' + ry + 'px, 0) translate(-50%, -50%)';
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);

  document.addEventListener('mouseover', function (e) {
    if (e.target && typeof e.target.closest === 'function' &&
        e.target.closest('a,button,[role=button],input,textarea,select')) {
      document.body.classList.add('c-hover');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target && typeof e.target.closest === 'function' &&
        e.target.closest('a,button,[role=button],input,textarea,select')) {
      document.body.classList.remove('c-hover');
    }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(rafId);
    else rafId = requestAnimationFrame(loop);
  });
}

/* ── 4. TYPING ANIMATION ─────────────────────────────────────────────── */
function initTyping() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const roles = [
    'Security Architect',
    'Penetration Tester',
    'AI Security Engineer',
    'LLM Security Tester',
    'AppSec Lead',
    'Red Team Operator'
  ];

  let ri = 0, ci = 0, del = false, tid;

  function tick() {
    const cur = roles[ri];
    if (!del) {
      ci++;
      el.textContent = cur.slice(0, ci);
      if (ci === cur.length) {
        del = true;
        tid = setTimeout(tick, 2400);
        return;
      }
      tid = setTimeout(tick, 72 + Math.random() * 28);
    } else {
      ci--;
      el.textContent = cur.slice(0, ci);
      if (ci === 0) {
        del = false;
        ri  = (ri + 1) % roles.length;
        tid = setTimeout(tick, 400);
        return;
      }
      tid = setTimeout(tick, 32 + Math.random() * 14);
    }
  }
  tid = setTimeout(tick, 1000);
}

/* ── 5. HERO NAME REVEAL ─────────────────────────────────────────────── */
function initNameReveal() {
  const first = document.querySelector('.hn-first');
  const last  = document.querySelector('.hn-last');
  if (!first || !last) return;

  first.style.opacity = '0';
  first.style.transform = 'translateY(20px)';
  last.style.opacity  = '0';
  last.style.transform = 'translateY(20px)';

  setTimeout(function () {
    first.style.transition = 'opacity .7s ease, transform .7s ease';
    first.style.opacity = '1';
    first.style.transform = 'translateY(0)';
  }, 150);

  setTimeout(function () {
    last.style.transition = 'opacity .7s ease, transform .7s ease';
    last.style.opacity = '1';
    last.style.transform = 'translateY(0)';
  }, 320);
}

/* ── 6. INTERSECTION OBSERVERS ───────────────────────────────────────── */
function initObservers() {
  // Scroll reveal — stagger delay for groups
  const revObs = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e, i) {
      if (!e.isIntersecting) return;
      const delay = (e.target.dataset.delay || 0);
      e.target.style.transitionDelay = delay + 'ms';
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Add stagger to bento card siblings
  document.querySelectorAll('.reveal').forEach(function (el, idx) {
    // Check if parent is a bento/grid container for stagger
    const parent = el.parentElement;
    if (parent && (parent.classList.contains('about-bento') ||
                   parent.classList.contains('skills-bento') ||
                   parent.classList.contains('certs-bento') ||
                   parent.classList.contains('comm-grid') ||
                   parent.classList.contains('proj-bento'))) {
      const siblings = Array.from(parent.querySelectorAll('.reveal'));
      const pos = siblings.indexOf(el);
      el.dataset.delay = pos * 60;
    }
    revObs.observe(el);
  });

  // Active nav — CSS.escape prevents selector injection
  const secs = document.querySelectorAll('section[id]');
  const nls  = document.querySelectorAll('.nav-links a');

  const navObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      const id = CSS.escape(e.target.getAttribute('id') || '');
      nls.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    });
  }, { threshold: 0.3 });

  secs.forEach(function (s) { navObs.observe(s); });
}

/* ── 7. 3D TILT ON PROJECT CARDS ─────────────────────────────────────── */
function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  const MAX = 10;

  document.querySelectorAll('.proj-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left  - r.width / 2)  / (r.width / 2);
      const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
      card.style.transform = [
        'perspective(900px)',
        'rotateX(' + (-dy * MAX) + 'deg)',
        'rotateY(' + (dx * MAX) + 'deg)',
        'translateZ(8px)'
      ].join(' ');
      card.style.transition = 'transform .08s ease';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform .6s ease, border-color .35s, box-shadow .35s';
    });
  });
}

/* ── 8. MAGNETIC BUTTONS ─────────────────────────────────────────────── */
function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const r  = btn.getBoundingClientRect();
      const x  = e.clientX - r.left - r.width  / 2;
      const y  = e.clientY - r.top  - r.height / 2;
      btn.style.transform = 'translate(' + (x * 0.22) + 'px, ' + (y * 0.22) + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
      btn.style.transition = 'transform .4s cubic-bezier(.23,1,.32,1)';
      setTimeout(function () { btn.style.transition = ''; }, 400);
    });
  });
}

/* ── 9. TERMINAL ANIMATION ───────────────────────────────────────────── */
function initTerminal() {
  const out = document.getElementById('term-out');
  if (!out) return;

  const SCRIPT = [
    { t:'log',     s:'# LLM Chatbot Security Test' },
    { t:'log',     s:'# OWASP LLM Top 10  |  amrender@kali' },
    { t:'blank' },
    { t:'cmd',     s:'python3 llm_test.py --target https://api.target.com/chat' },
    { t:'blank' },
    { t:'log',     s:'[*] Test 1: Direct Prompt Injection' },
    { t:'output',  s:'  Payload: "Ignore previous instructions..."' },
    { t:'output',  s:'  System prompt content leaked           VULN' },
    { t:'blank' },
    { t:'log',     s:'[*] Test 2: Indirect via RAG' },
    { t:'output',  s:'  Injected payload into indexed document' },
    { t:'output',  s:'  Model followed injected instruction    VULN' },
    { t:'blank' },
    { t:'log',     s:'[*] Test 3: Data Leakage' },
    { t:'output',  s:'  Training data extraction attempt' },
    { t:'output',  s:'  No sensitive data returned             PASS' },
    { t:'blank' },
    { t:'log',     s:'[*] Test 4: Jailbreak' },
    { t:'output',  s:'  Roleplay-based safety bypass' },
    { t:'output',  s:'  Safety filters held                    PASS' },
    { t:'blank' },
    { t:'warn',    s:'[!] 2 issues confirmed — writing report...' },
    { t:'success', s:'[✓] chatbot_audit.pdf saved' },
  ];

  function mkEl(cls, text) {
    const el = document.createElement('div');
    el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function mkCursor() {
    const c = document.createElement('span');
    c.className = 'tcur';
    c.setAttribute('aria-hidden', 'true');
    return c;
  }
  function rmCursors() { out.querySelectorAll('.tcur').forEach(function (c) { c.remove(); }); }

  let li = 0, ci = 0, curEl = null, curCmd = null, tid = null;

  function resetState() { li = 0; ci = 0; curEl = null; curCmd = null; }

  function tick() {
    if (li >= SCRIPT.length) {
      tid = setTimeout(function () {
        out.textContent = '';
        resetState();
        tid = setTimeout(tick, 500);
      }, 4000);
      return;
    }

    const step = SCRIPT[li];

    if (step.t === 'blank') {
      out.appendChild(mkEl('tblank'));
      rmCursors();
      out.appendChild(mkCursor());
      li++; ci = 0; curEl = null; curCmd = null;
      out.scrollTop = out.scrollHeight;
      tid = setTimeout(tick, 55);
      return;
    }

    if (ci === 0) {
      rmCursors();
      if (step.t === 'cmd') {
        curEl = mkEl('tl-cmd');
        const p = document.createElement('span');
        p.className = 'tp';
        p.textContent = '$ ';
        curEl.appendChild(p);
        curCmd = document.createElement('span');
        curCmd.className = 'tc';
        curEl.appendChild(curCmd);
      } else {
        const cls = step.t === 'output'  ? 'to'  :
                    step.t === 'warn'    ? 'tw'  :
                    step.t === 'success' ? 'ts'  : 'tcm';
        curEl = mkEl(cls);
      }
      out.appendChild(curEl);
    }

    const text = step.s;
    if (step.t === 'cmd' && curCmd) {
      curCmd.textContent = text.slice(0, ci + 1);
    } else if (curEl) {
      curEl.textContent = text.slice(0, ci + 1);
    }
    ci++;

    if (ci >= text.length) {
      rmCursors();
      out.appendChild(mkCursor());
      li++; ci = 0; curEl = null; curCmd = null;
      out.scrollTop = out.scrollHeight;
      const delay = step.t === 'cmd' ? 440 :
                    step.t === 'output' ? 85 : 130;
      tid = setTimeout(tick, delay);
      return;
    }

    out.scrollTop = out.scrollHeight;
    tid = setTimeout(tick, step.t === 'cmd' ? 28 + Math.random() * 18 : 12 + Math.random() * 8);
  }

  const aiSec = document.getElementById('ai-security');
  if (!aiSec) return;

  new IntersectionObserver(function (entries, obs) {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    tid = setTimeout(tick, 700);
  }, { threshold: 0.25 }).observe(aiSec);
}

/* ── 10. NAVBAR SCROLL EFFECT & MOBILE NAV ───────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else                     nav.classList.remove('scrolled');
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  const toggle = document.getElementById('mobileNavToggle');
  const links = nav.querySelector('.nav-links');
  if (toggle && links) {
    function closeMenu() {
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.classList.remove('nav-active');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      const isOpen = toggle.classList.toggle('open');
      links.classList.toggle('open', isOpen);
      document.body.classList.toggle('nav-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && links.classList.contains('open')) {
        closeMenu();
      }
    });
  }
}

/* ── 11. CHAR COUNTER ────────────────────────────────────────────────── */
function initCharCounter() {
  const ta = document.getElementById('f-msg');
  const ct = document.getElementById('charCt');
  if (!ta || !ct) return;
  const MAX = 2000;
  ta.addEventListener('input', function () {
    const n = ta.value.length;
    ct.textContent = n + ' / ' + MAX;
    ct.classList.toggle('warn', n > MAX * 0.85);
  });
}

/* ── 12. SECURE CONTACT FORM ─────────────────────────────────────────── */
function initForm() {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('submitBtn');
  if (!form || !btn) return;

  const txtEl  = btn.querySelector('.f-submit-txt');
  const PAGE_T = Date.now();
  const MIN_MS = 5000;
  const RL_KEY = 'pf_v4';
  const RL_MAX = 3;
  const RL_WIN = 3600000;
  const LIMITS = Object.freeze({ name:100, email:200, subject:200, message:2000 });
  const EMAIL  = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[a-zA-Z0-9-]{1,253}(?:\.[a-zA-Z]{2,})+$/;

  function sanitise(s) {
    return String(s)
      .replace(/</g, '\u003c')
      .replace(/>/g, '\u003e')
      .replace(/\x00/g, '')
      .trim();
  }

  function checkRL() {
    try {
      let d = null;
      try { d = JSON.parse(sessionStorage.getItem(RL_KEY)); } catch {}
      const now = Date.now();
      if (!d || typeof d.c !== 'number' || typeof d.t !== 'number') d = { c:0, t:now };
      if (now - d.t > RL_WIN) d = { c:0, t:now };
      if (d.c >= RL_MAX) {
        const m = Math.ceil((RL_WIN - (now - d.t)) / 60000);
        return { ok:false, msg:'Too many messages. Try again in ' + m + ' min.' };
      }
      d.c++;
      sessionStorage.setItem(RL_KEY, JSON.stringify(d));
      return { ok:true };
    } catch { return { ok:true }; }
  }

  function setState(txt, bg, dis) {
    if (txtEl) txtEl.textContent = txt;
    btn.style.background = bg || '';
    btn.disabled = dis;
  }

  function reset(ms) {
    setTimeout(function () {
      setState('Send Message', '', false);
    }, ms || 4500);
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // 1. Time gate
    if (Date.now() - PAGE_T < MIN_MS) {
      setState('Please wait…', 'rgba(251,191,36,.8)', true);
      reset(2500);
      return;
    }

    // 2. Rate limit
    const rl = checkRL();
    if (!rl.ok) {
      setState(rl.msg, 'rgba(251,191,36,.8)', true);
      reset(5000);
      return;
    }

    const raw = new FormData(form);

    // 3. Honeypot
    if (String(raw.get('_gotcha') || '').length > 0) {
      setState('Sent!', '', true);
      form.reset();
      reset(4000);
      return;
    }

    // 3b. hCaptcha validation — require token before submission
    const captchaToken = String(raw.get('h-captcha-response') || '').trim();
    if (!captchaToken) {
      setState('Please complete the captcha', 'rgba(251,191,36,.8)', false);
      reset(3500);
      return;
    }

    // 4. Validate field lengths
    for (const [f, max] of Object.entries(LIMITS)) {
      if (String(raw.get(f) || '').trim().length > max) {
        setState(f + ' too long (max ' + max + ')', 'rgba(251,191,36,.8)', false);
        reset();
        return;
      }
    }

    // 5. Validate email
    if (!EMAIL.test(String(raw.get('email') || '').trim())) {
      setState('Invalid email address', 'rgba(251,191,36,.8)', false);
      reset();
      return;
    }

    // 6. Validate action URL before fetching — defense in depth.
    //    Note: this check protects against accidental misconfiguration
    //    (e.g. a stray action="" or wrong domain), not against a malicious
    //    actor reading this file — the Form ID itself is not a secret.
    //    Real spam protection against direct-POST abuse lives in Formspree's
    //    dashboard: "Restrict to Domain" + server-side hCaptcha Secret Key.
    const action = form.getAttribute('action') || '';
    if (!action.startsWith('https://formspree.io/')) {
      setState('Form not configured yet', 'rgba(251,191,36,.8)', false);
      reset();
      return;
    }

    // 7. Sanitise and build clean FormData
    const clean = new FormData();
    for (const [k, v] of raw.entries()) {
      clean.append(k, typeof v === 'string' ? sanitise(v) : v);
    }

    setState('Sending…', '', true);

    // 8. Hardened fetch
    try {
      const res = await fetch(action, {
        method: 'POST',
        body: clean,
        headers: { 'Accept': 'application/json' },
        credentials: 'omit',
        mode: 'cors',
        referrerPolicy: 'no-referrer'
      });

      if (res.ok) {
        setState('Message Sent', 'linear-gradient(135deg,#059669,#34d399)', true);
        form.reset();
        if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
        const ct = document.getElementById('charCt');
        if (ct) ct.textContent = '0 / 2000';
        reset(5000);
      } else {
        let msg = 'Submission failed';
        try {
          const body = await res.json();
          if (Array.isArray(body.errors) && body.errors[0]) {
            msg = String(body.errors[0].message || '').slice(0, 80) || msg;
          } else if (body.error) {
            msg = String(body.error).slice(0, 80);
          } else if (body.message) {
            msg = String(body.message).slice(0, 80);
          }
        } catch {}
        setState(msg, 'rgba(251,191,36,.8)', false);
        reset();
      }
    } catch (err) {
      setState(
        err.name === 'TypeError' ? 'Network error — email me directly' : 'Error — amrenderpro3@gmail.com',
        'rgba(251,191,36,.8)', false
      );
      reset(5000);
    }
  });
}
