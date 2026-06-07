const express = require('express');
const { v4: uuidv4 } = require('uuid');

module.exports = (db) => {
  const router = express.Router();

  router.post('/init', (req, res) => {
    const { tg_id, name } = req.body;
    const id = tg_id || req.session.userId || uuidv4();
    if (!db.users[id]) {
      db.users[id] = {
        id, name: name || 'ব্যবহারকারী',
        points: 0, balance: 0, totalEarned: 0, totalWithdrawn: 0, level: 1,
        referralCode: 'REF' + id.slice(0,6).toUpperCase(),
        tasks: { checkin: null, watchAd: null, solveMath: null },
        createdAt: new Date().toISOString(),
      };
    }
    req.session.userId = id;
    res.json({ ok: true, user: db.users[id] });
  });

  router.get('/me', (req, res) => {
    const u = db.users[req.session.userId];
    if (!u) return res.json({ ok: false });
    res.json({ ok: true, user: u, settings: { pointsPerDollar: db.settings.pointsPerDollar } });
  });

  return router;
};
