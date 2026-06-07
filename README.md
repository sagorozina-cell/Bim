# 🎯 TON Earn App — Node.js + Telegram Mini App

## 📁 ফাইল স্ট্রাকচার
```
ton-earn-node/
├── server.js            # Express server
├── routes/
│   ├── user.js          # ইউজার API
│   ├── tasks.js         # টাস্ক API (চেক-ইন, এড, গণিত)
│   ├── wallet.js        # ওয়ালেট API (ডিপোজিট/উইথড্র)
│   └── admin.js         # অ্যাডমিন API
├── public/
│   ├── index.html       # Single Page App
│   ├── css/style.css    # সম্পূর্ণ CSS
│   └── js/
│       ├── api.js       # API helper
│       ├── ui.js        # UI helper
│       ├── app.js       # Bootstrap
│       └── screens/     # সব স্ক্রিন
├── render.yaml          # Render auto-deploy
└── .env.example         # Environment config
```

## 🚀 GitHub → Render Deploy

### Step 1: GitHub এ আপলোড
```bash
git init
git add .
git commit -m "TON Earn App v1.0"
git remote add origin https://github.com/YOUR_NAME/ton-earn-app.git
git push -u origin main
```

### Step 2: Render.com
1. [render.com](https://render.com) → **New Web Service**
2. GitHub repo connect করুন
3. Settings:
   - **Build:** `npm install`
   - **Start:** `npm start`
4. Environment Variables:
   - `SESSION_SECRET` = যেকোনো random string
   - `ADMIN_PASSWORD` = আপনার পাসওয়ার্ড

## 🔐 Admin Panel
- প্রোফাইল → অ্যাডমিন প্যানেল → পাসওয়ার্ড: `admin123`

## 📱 Telegram Bot
1. @BotFather → `/newbot`
2. `/newapp` → Web App URL = আপনার Render URL

## 💡 Features
- ✅ দৈনিক চেক-ইন
- ✅ ভিডিও এড (progress bar সহ)
- ✅ গণিত সমাধান (numpad)
- ✅ নম্বর ধাঁধা গেম
- ✅ স্পিন & উইন গেম
- ✅ TON Keeper deep link
- ✅ USDT QR Code (auto-generate)
- ✅ পয়েন্ট → USDT কনভার্ট
- ✅ Admin Panel (rate, ঠিকানা, সব সেটিংস)
