function renderProfile() {
  const u = state.user;
  if (!u) return;

  document.getElementById('screen-profile').innerHTML = `
    <div class="header" style="text-align:center;padding-bottom:48px;">
      <div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.2);border:3px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 12px;">👤</div>
      <h2 style="font-size:20px;font-weight:800;margin-bottom:4px;">${u.name}</h2>
      <span class="badge badge-gold">⭐ লেভেল ${u.level}</span>
    </div>

    <div class="p16" style="margin-top:-28px;">

      <!-- Stats -->
      <div class="grid-2 mb16">
        <div class="card" style="text-align:center;">
          <p style="font-size:20px;font-weight:800;color:var(--accent);">${(u.points||0).toLocaleString()}</p>
          <p style="color:var(--muted);font-size:11px;">মোট পয়েন্ট</p>
        </div>
        <div class="card" style="text-align:center;">
          <p style="font-size:20px;font-weight:800;color:var(--success);">${fmt(u.balance, 4)}</p>
          <p style="color:var(--muted);font-size:11px;">USDT ব্যালেন্স</p>
        </div>
      </div>

      <!-- Referral -->
      <div class="card mb12">
        <p style="font-weight:700;font-size:15px;margin-bottom:10px;">🎁 আপনার রেফারেল কোড</p>
        <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.05);border-radius:10px;padding:12px;">
          <p style="flex:1;font-weight:800;font-size:18px;color:var(--primary-light);letter-spacing:2px;">${u.referralCode}</p>
          <button onclick="copyText('${u.referralCode}')" style="background:none;border:none;cursor:pointer;font-size:20px;">📋</button>
        </div>
        <p style="color:var(--muted);font-size:11px;margin-top:8px;">প্রতি রেফারেলে ১০০ পয়েন্ট পাবেন</p>
      </div>

      <!-- Menu -->
      ${[
        {icon:'📊', label:'পেমেন্ট হিস্ট্রি', sub:'সকল লেনদেন দেখুন', fn:'switchTab("wallet")'},
        {icon:'⚙️', label:'সেটিংস',         sub:'অ্যাপ সেটিংস পরিবর্তন করুন', fn:'showToast("শীঘ্রই আসছে!")'},
        {icon:'💬', label:'সাপোর্ট',         sub:'সাহায্য প্রয়োজন? যোগাযোগ করুন', fn:'showToast("সাপোর্ট চ্যাট শীঘ্রই!")'},
      ].map(m=>`
        <button class="btn btn-full" onclick="${m.fn}" style="display:flex;align-items:center;gap:12px;padding:16px;background:linear-gradient(135deg,var(--card),var(--card2));border:1px solid var(--border);border-radius:14px;color:var(--text);margin-bottom:8px;text-align:left;">
          <div style="width:40px;height:40px;background:rgba(108,47,217,.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">${m.icon}</div>
          <div style="flex:1;">
            <p style="font-weight:600;font-size:14px;margin-bottom:2px;">${m.label}</p>
            <p style="color:var(--muted);font-size:11px;">${m.sub}</p>
          </div>
          <span style="color:var(--muted);">›</span>
        </button>
      `).join('')}

      <!-- Admin -->
      ${!state.isAdmin ? `
        <button class="btn btn-full btn-danger mt16" onclick="showAdminLogin()" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:14px;">
          🛡️ অ্যাডমিন প্যানেল
        </button>
      ` : `
        <button class="btn btn-full mt16" onclick="switchTab('admin')" style="background:linear-gradient(135deg,#EF4444,#DC2626);color:#fff;padding:14px;border-radius:14px;font-size:14px;font-weight:600;border:none;cursor:pointer;">
          🛡️ অ্যাডমিন প্যানেলে যান
        </button>
      `}

      <!-- Logout -->
      <button class="btn btn-full btn-danger mt16" style="margin-top:8px;padding:14px;border-radius:14px;" onclick="showToast('লগ আউট হয়েছে')">
        🚪 লগ আউট
      </button>
    </div>
  `;
}

function showAdminLogin() {
  openModal(`
    <h3 style="font-size:18px;font-weight:800;margin-bottom:16px;">🛡️ অ্যাডমিন লগইন</h3>
    <div id="admin-login-msg"></div>
    <label class="input-label">পাসওয়ার্ড</label>
    <input id="admin-pwd" type="password" placeholder="অ্যাডমিন পাসওয়ার্ড" style="margin-bottom:16px;"/>
    <button class="btn btn-primary btn-full btn-lg" onclick="submitAdminLogin()">প্রবেশ করুন</button>
  `);
}

async function submitAdminLogin() {
  const pwd = document.getElementById('admin-pwd')?.value;
  const msg = document.getElementById('admin-login-msg');
  const res = await api.post('/api/admin/login', { password: pwd });
  if (res.ok) {
    state.isAdmin = true;
    closeModal();
    switchTab('admin');
  } else {
    if (msg) msg.innerHTML = `<div class="alert alert-danger mb12">❌ ${res.msg}</div>`;
  }
}
