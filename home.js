function renderHome() {
  const u = state.user;
  if (!u) return;
  const usdtVal = ptsToUsdt(u.points);

  document.getElementById('screen-home').innerHTML = `
    <!-- Hero -->
    <div class="header">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;position:relative;">
        <div>
          <p style="color:rgba(255,255,255,.7);font-size:13px;">স্বাগতম,</p>
          <h2 style="font-size:22px;">${u.name} 👋</h2>
          <span class="badge badge-gold" style="margin-top:4px;">⭐ লেভেল ${u.level}</span>
        </div>
        <div style="background:rgba(255,255,255,.15);border-radius:14px;padding:10px 16px;display:flex;align-items:center;gap:8px;backdrop-filter:blur(10px);">
          <span style="font-size:18px;">⭐</span>
          <span style="font-size:20px;font-weight:700;">${(u.points||0).toLocaleString()}</span>
        </div>
      </div>

      <!-- Balance grid -->
      <div class="grid-2" style="position:relative;">
        <div style="background:rgba(255,255,255,.1);border-radius:14px;padding:14px;border:1px solid rgba(255,255,255,.15);">
          <p style="color:rgba(255,255,255,.6);font-size:11px;margin-bottom:4px;">💰 ব্যালেন্স</p>
          <p style="font-size:15px;font-weight:800;color:#10B981;">${fmt(u.balance)}</p>
          <p style="color:rgba(255,255,255,.5);font-size:10px;">USDT</p>
        </div>
        <div style="background:rgba(255,255,255,.1);border-radius:14px;padding:14px;border:1px solid rgba(255,255,255,.15);">
          <p style="color:rgba(255,255,255,.6);font-size:11px;margin-bottom:4px;">⭐ পয়েন্ট মূল্য</p>
          <p style="font-size:15px;font-weight:800;color:#F59E0B;">≈ $${parseFloat(usdtVal).toFixed(4)}</p>
          <p style="color:rgba(255,255,255,.5);font-size:10px;">USDT সমতুল্য</p>
        </div>
      </div>
    </div>

    <div class="p16">
      <!-- Rate card -->
      <div class="card mb16" style="display:flex;align-items:center;justify-content:space-between;margin-top:-8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="background:rgba(108,47,217,.2);border-radius:10px;padding:8px;font-size:18px;">📈</div>
          <div>
            <p style="color:var(--muted);font-size:11px;">বর্তমান রেট</p>
            <p style="font-weight:700;font-size:14px;">${(state.settings.pointsPerDollar||1000).toLocaleString()} পয়েন্ট = $1.00</p>
          </div>
        </div>
        <span style="color:var(--accent);font-size:18px;">⚡</span>
      </div>

      <!-- Daily checkin -->
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));border-radius:16px;padding:16px;display:flex;align-items:center;gap:14px;" class="mb16">
        <div style="font-size:40px;">🎁</div>
        <div style="flex:1;">
          <p style="font-weight:700;font-size:15px;margin-bottom:3px;">দৈনিক চেক-ইন</p>
          <p style="color:rgba(255,255,255,.7);font-size:12px;">আজ চেক-ইন করে পয়েন্ট নিন</p>
        </div>
        <button class="btn btn-ghost" onclick="switchTab('tasks')" style="font-size:13px;padding:8px 14px;">চেক-ইন</button>
      </div>

      <!-- Watch ad -->
      <p class="section-title">এড দেখে পয়েন্ট ইনকাম</p>
      <div class="list-item mb16">
        <div class="list-icon" style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));">▶️</div>
        <div class="list-body">
          <p class="list-title">ভিডিও এড দেখুন</p>
          <p class="list-sub">এবং পয়েন্ট সংগ্রহ করুন</p>
        </div>
        <button class="btn btn-primary" onclick="switchTab('tasks')" style="font-size:12px;padding:8px 14px;">এড দেখুন</button>
        <span class="badge badge-gold">⭐20</span>
      </div>

      <!-- Stats -->
      <div class="grid-2 mb16">
        <div class="card" style="text-align:center;">
          <p style="color:var(--muted);font-size:11px;margin-bottom:4px;">আজকের রোজগার</p>
          <p style="font-size:22px;font-weight:800;color:var(--accent);">${u.points||0}</p>
          <p style="color:var(--muted);font-size:10px;">পয়েন্ট</p>
        </div>
        <div class="card" style="text-align:center;">
          <p style="color:var(--muted);font-size:11px;margin-bottom:4px;">মোট রোজগার</p>
          <p style="font-size:22px;font-weight:800;">${u.totalEarned||0}</p>
          <p style="color:var(--muted);font-size:10px;">পয়েন্ট</p>
        </div>
      </div>

      <!-- Quick actions -->
      <p class="section-title">দ্রুত অ্যাকশন</p>
      <div class="grid-2">
        <button class="btn btn-ghost" onclick="switchTab('wallet')" style="padding:14px;font-size:14px;">💰 ডিপোজিট</button>
        <button class="btn btn-ghost" onclick="switchTab('wallet')" style="padding:14px;font-size:14px;">💸 উইথড্র</button>
        <button class="btn btn-ghost" onclick="switchTab('games')"  style="padding:14px;font-size:14px;">🎮 গেম খেলুন</button>
        <button class="btn btn-ghost" onclick="switchTab('profile')" style="padding:14px;font-size:14px;">👥 রেফার করুন</button>
      </div>
    </div>
  `;
}
