// ── UI helpers ────────────────────────────────────────────────────────────────
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function openModal(html) {
  const bd = document.getElementById('modal-backdrop');
  const m  = document.getElementById('modal');
  m.innerHTML = `<div class="modal-handle"></div>${html}`;
  bd.classList.remove('hidden');
  m.classList.remove('hidden');
  requestAnimationFrame(() => m.classList.add('open'));
}

function closeModal() {
  const bd = document.getElementById('modal-backdrop');
  const m  = document.getElementById('modal');
  m.classList.remove('open');
  setTimeout(() => { bd.classList.add('hidden'); m.classList.add('hidden'); }, 300);
}

function switchTab(tab) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Show target
  const screen = document.getElementById('screen-' + tab);
  if (screen) screen.classList.add('active');
  const btn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
  if (btn) btn.classList.add('active');

  // Render
  const renderFns = {
    home: renderHome,
    tasks: renderTasks,
    games: renderGames,
    wallet: renderWallet,
    profile: renderProfile,
    admin: renderAdmin,
  };
  if (renderFns[tab]) renderFns[tab]();
}

function fmt(n, dec = 8) {
  return parseFloat(n || 0).toFixed(dec);
}

function ptsToUsdt(pts) {
  return (pts / (state.settings.pointsPerDollar || 1000)).toFixed(8);
}

function makeQR(text, size = 180) {
  // Simple QR via free API
  return `<img src="https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}" width="${size}" height="${size}" style="border-radius:8px;"/>`;
}

function copyText(txt) {
  navigator.clipboard.writeText(txt).then(() => showToast('✅ কপি হয়েছে!'));
}
