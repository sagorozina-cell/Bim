// ── API helper ───────────────────────────────────────────────────────────────
const api = {
  async post(url, data) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async get(url) {
    const r = await fetch(url);
    return r.json();
  },
};

// ── App state ─────────────────────────────────────────────────────────────────
const state = {
  user: null,
  settings: { pointsPerDollar: 1000 },
  isAdmin: false,
};
