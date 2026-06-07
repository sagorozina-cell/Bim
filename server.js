require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'ton-earn-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// ── In-memory DB (replace with real DB for production) ───────────────────────
const db = {
  users: {},
  transactions: [],
  settings: {
    pointsPerDollar: 1000,
    minWithdraw: 0.5,
    maxWithdraw: 500,
    depositAddress: 'TYourUSDT_TRC20_AddressHere',
    usdtNetwork: 'TRC20',
    dailyCheckinPoints: 50,
    watchAdPoints: 20,
    solveMathPoints: 30,
    referralPoints: 100,
    maintenanceMode: false,
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  }
};

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/user', require('./routes/user')(db));
app.use('/api/tasks', require('./routes/tasks')(db));
app.use('/api/wallet', require('./routes/wallet')(db));
app.use('/api/admin', require('./routes/admin')(db));

// ── Serve SPA ────────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ TON Earn App running on http://localhost:${PORT}`);
});
