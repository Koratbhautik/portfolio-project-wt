/* ════════════════════════════════════════════
   BHAUTIK KORAT PORTFOLIO — script.js
════════════════════════════════════════════ */

/* ── 1. DARK MODE ── */
const darkBtn  = document.getElementById('darkBtn');
const darkIcon = document.getElementById('darkIcon');

(function initTheme() {
  if (localStorage.getItem('bk-theme') === 'dark') {
    document.body.classList.add('dark');
    darkIcon.className = 'bi bi-sun-fill';
  }
})();

darkBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const dark = document.body.classList.contains('dark');
  darkIcon.className = dark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  localStorage.setItem('bk-theme', dark ? 'dark' : 'light');
});


/* ── 2. MOBILE MENU ── */
const menuBtn  = document.getElementById('menuBtn');
const mobMenu  = document.getElementById('mobMenu');
const hamIcon  = document.getElementById('hamIcon');

menuBtn.addEventListener('click', () => {
  const open = mobMenu.classList.toggle('open');
  hamIcon.className = open ? 'bi bi-x-lg' : 'bi bi-list';
});

document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    mobMenu.classList.remove('open');
    hamIcon.className = 'bi bi-list';
  });
});


/* ── 3. NAVBAR SCROLL + ACTIVE LINK ── */
const nav      = document.getElementById('mainNav');
const sections = document.querySelectorAll('section[id]');
const nmLinks  = document.querySelectorAll('.nm');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);

  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) cur = s.id;
  });
  nmLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + cur) l.classList.add('active');
  });
});


/* ── 4. SCROLL REVEAL ── */
const revEls = document.querySelectorAll('[data-reveal]');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(
        () => e.target.classList.add('revealed'),
        parseInt(e.target.dataset.delay) || 0
      );
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revEls.forEach(el => revObs.observe(el));


/* ── 5. TYPED TEXT ── */
const typedEl = document.getElementById('typedEl');
if (typedEl) {
  const roles = [
    'CSE Student @ JG University 🎓',
    'IoT & Hardware Developer ⚡',
    'Video Editor — CapCut & Premiere Pro 🎬',
    'Colour Grading — Lightroom & Premiere 🎨',
    'Web Developer — HTML, CSS & JS 💻',
  ];
  let ri = 0, ci = 0, del = false;

  function tick() {
    const cur = roles[ri];
    if (!del) {
      typedEl.textContent = cur.substring(0, ci + 1);
      ci++;
      if (ci === cur.length) { del = true; setTimeout(tick, 1800); return; }
    } else {
      typedEl.textContent = cur.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        del = false;
        ri = (ri + 1) % roles.length;
        setTimeout(tick, 380);
        return;
      }
    }
    setTimeout(tick, del ? 26 : 58);
  }
  tick();
}


/* ── 6. CONTACT FORM VALIDATION ── */
const form   = document.getElementById('contactForm');
const fOK    = document.getElementById('fSuccess');
const fFail  = document.getElementById('fError');
const EM_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function vField(id, errId, fn) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errId);
  const ok  = fn(el.value.trim());
  el.classList.toggle('ferr', !ok);
  el.classList.toggle('fok',   ok);
  err.classList.toggle('show', !ok);
  return ok;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  fOK.classList.add('d-none');
  fFail.classList.add('d-none');

  const a = vField('fname',    'fnameErr',    v => v.length > 0);
  const b = vField('femail',   'femailErr',   v => EM_RE.test(v));
  const c = vField('fsubject', 'fsubjectErr', v => v.length > 0);
  const d = vField('fmessage', 'fmessageErr', v => v.length > 0);

  if (a && b && c && d) {
    fOK.classList.remove('d-none');
    form.reset();
    ['fname','femail','fsubject','fmessage'].forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('fok','ferr');
    });
    document.querySelectorAll('.cf-err').forEach(el => el.classList.remove('show'));
  } else {
    fFail.classList.remove('d-none');
  }
});

/* ── 7. FORCE CV DOWNLOAD ── */
function forceCvDownload(e) {
  e.preventDefault();
  fetch('cv.png')
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = 'Bhautik_Korat_CV.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      // fallback: direct link
      window.open('cv.png', '_blank');
    });
}

const cvBtn    = document.getElementById('cvDownloadBtn');
const mobCvBtn = document.getElementById('mobCvDownloadBtn');
if (cvBtn)    cvBtn.addEventListener('click', forceCvDownload);
if (mobCvBtn) mobCvBtn.addEventListener('click', forceCvDownload);

['fname','femail','fsubject','fmessage'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    if (this.value.trim()) {
      this.classList.remove('ferr');
      this.classList.add('fok');
      const e = document.getElementById(id + 'Err');
      if (e) e.classList.remove('show');
    }
  });
});
