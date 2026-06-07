// ── App Bootstrap ─────────────────────────────────────────────────────────────
async function init() {
  // Get Telegram user if available
  let tgUser = null;
  try {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
    }
  } catch(e) {}

  // Init user session
  const res = await api.post('/api/user/init', {
    tg_id: tgUser?.id?.toString() || null,
    name:  tgUser ? (tgUser.first_name + ' ' + (tgUser.last_name||'')).trim() : 'Demo User',
  });

  if (res.ok) {
    state.user = res.user;
  }

  // Load settings
  const me = await api.get('/api/user/me');
  if (me.ok) {
    state.user    = me.user;
    state.settings = me.settings;
  }

  // Show app
  document.getElementById('splash').style.display = 'none';
  document.getElementById('main').style.display   = 'block';

  // Bottom nav listeners
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Render home
  switchTab('home');
}

// Start
window.addEventListener('DOMContentLoaded', init);
