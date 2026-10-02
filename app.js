/* ============================================================
   KAB Resource Hub — Interactions, Animations, Tracking
   ============================================================ */

(function () {
  'use strict';

  /* Year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Reveal on scroll */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* 3D tilt + cursor shine */
  const isTouch = matchMedia('(hover: none)').matches;
  if (!isTouch) {
    document.querySelectorAll('.card-3d').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * -3.5;
        const ry = ((x - cx) / cx) * 3.5;

        card.style.transform = `translateY(-8px) scale(1.015) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }

  /* Toast */
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer;

  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2400);
  }

  /* Animated counter */
  function animateNumber(el, to, duration = 900) {
    const from = parseInt(el.textContent, 10) || 0;
    if (from === to) return;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* Stats */
  const STORAGE_KEY = 'kab_stats_v2';

  function loadStats() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (raw && typeof raw === 'object') {
        return {
          visits: raw.visits || 0,
          downloads: raw.downloads || {},
          firstVisit: raw.firstVisit || new Date().toISOString(),
          lastVisit: raw.lastVisit || null,
        };
      }
    } catch { /* ignore */ }
    return { visits: 0, downloads: {}, firstVisit: new Date().toISOString(), lastVisit: null };
  }

  function saveStats(stats) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); } catch {}
  }

  /* Record visit */
  const stats = loadStats();
  stats.visits += 1;
  stats.lastVisit = new Date().toISOString();
  saveStats(stats);

  console.log(
    `%c📊 KAB Hub · Visit #${stats.visits}`,
    'background:#f04e23;color:#fff;padding:4px 10px;border-radius:6px;font-weight:600'
  );

  /* Update stat chips */
  const statDownloads = document.getElementById('stat-downloads');
  const statMaterials = document.getElementById('stat-materials');
  const totalDownloads = Object.values(stats.downloads).reduce((a, b) => a + b, 0);

  if (statDownloads) animateNumber(statDownloads, totalDownloads);
  if (statMaterials) {
    const cardCount = document.querySelectorAll('.card-3d').length;
    animateNumber(statMaterials, cardCount);
  }

  /* Download tracking */
  document.querySelectorAll('[data-track="download"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const material = btn.getAttribute('data-material') || 'Unknown';

      const s = loadStats();
      s.downloads[material] = (s.downloads[material] || 0) + 1;
      saveStats(s);

      console.log(
        `%c⬇️ Download: ${material} (total: ${s.downloads[material]})`,
        'background:#1a1a1a;color:#fff;padding:4px 10px;border-radius:6px'
      );

      if (statDownloads) {
        const total = Object.values(s.downloads).reduce((a, b) => a + b, 0);
        animateNumber(statDownloads, total);
      }

      showToast(`Downloading: ${material}`);

      if (window.plausible) {
        window.plausible('Download', { props: { material } });
      }
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({
          path: `download/${material}`,
          title: `Download: ${material}`,
          event: true,
        });
      }
    });
  });

  /* View tracking */
  document.querySelectorAll('.btn-view, a[href^="materials/"]:not([download])').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card-3d');
      const material = card ? card.getAttribute('data-material') : 'Unknown';
      console.log(`👁️ View: ${material}`);
      if (window.plausible) window.plausible('View', { props: { material } });
    });
  });

  /* Console helper */
  window.KAB_stats = function () {
    const s = loadStats();
    console.log('%c📈 KAB Hub Statistics', 'font-size:14px;font-weight:700');
    console.log('Visits (this browser):', s.visits);
    console.log('First visit:', s.firstVisit);
    console.log('Last visit:', s.lastVisit);
    console.log('Downloads:', s.downloads);
    return s;
  };

  console.log(
    '%cTip: type KAB_stats() in the console to see your stats.',
    'color:#6b7280;font-style:italic'
  );
})();