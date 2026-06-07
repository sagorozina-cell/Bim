async function renderAdmin() {
  if (!state.isAdmin) { switchTab('profile'); return; }

  document.getElementById('screen-admin').innerHTML = `
    <div style="background:linear-gradient(135deg,#1A0A3D,#0F0A1E);padding:20px;border-bottom:1px solid var(--border);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <button onclick="adminBack()" style="background:none;border:none;color:white;font-size:22px;cursor:pointer;">←</button>
        <div>
          <h2 style="font-size:18px;font-weight:800;">🛡️ অ্যাডমিন প্যানেল</h2>
          <p style="color:var(--muted);font-size:11px;">সমস্ত সেটিংস নিয়ন্ত্রণ করুন</p>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" style="flex:1;font-size:12px;padding:8px;" onclick="showAdminSection('dashboard')">📊 ড্যাশবোর্ড</button>
        <button class="btn btn-ghost"   style="flex:1;font-size:12px;padding:8px;" onclick="showAdminSection('settings')">⚙️ সেটিংস</button>
        <button class="btn btn-ghost"   style="flex:1;font-size:12px;padding:8px;" onclick="showAdminSection('deposit')">💳 ডিপোজিট</button>
      </div>
    </div>
    <div class="p16" id="admin-content">লোড হচ্ছে...</div>
  `;

  showAdminSection('dashboard');
}

function adminBack() {
  state.isAdmin = false;
  document.getElementById('bottom-nav').style.display = 'flex';
  switchTab('profile');
}

async function showAdminSection(section) {
  // update button styles
  document.querySelectorAll('#screen-admin .btn').forEach(b => {
    b.className = b.textContent.includes(section==='dashboard'?'ড্যাশ':section==='settings'?'সেটিং':'ডিপো')
      ? 'btn btn-primary' : 'btn btn-ghost';
    b.style.flex = '1'; b.style.fontSize = '12px'; b.style.padding = '8px';
  });

  const el = document.getElementById('admin-content');
  if (!el) return;

  if (section === 'dashboard') {
    const res = await api.get('/api/admin/stats');
    if (!res.ok) { el.innerHTML = `<div class="alert alert-danger">এক্সেস নেই</div>`; return; }
    const s = res.stats;
    el.innerHTML = `
      <div class="grid-2 mb16">
        ${[
          {label:'মোট ইউজার', val:s.users, color:'#8B5CF6', icon:'👥'},
          {label:'মোট লেনদেন', val:s.totalTx, color:'#F59E0B', icon:'📊'},
          {label:'মোট উইথড্র', val:'$'+s.totalWithdrawn.toFixed(2), color:'#EF4444', icon:'💸'},
          {label:'মোট ডিপোজিট', val:'$'+s.totalDeposited.toFixed(2), color:'#10B981', icon:'💰'},
        ].map(i=>`
          <div class="card" style="border:1px solid ${i.color}20;">
            <p style="font-size:20px;margin-bottom:4px;">${i.icon}</p>
            <p style="font-size:20px;font-weight:800;color:${i.color};">${i.val}</p>
            <p style="color:var(--muted);font-size:11px;">${i.label}</p>
          </div>
        `).join('')}
      </div>
      <p class="section-title">সাম্প্রতিক লেনদেন</p>
      <div class="card">
        ${res.recentTx.length === 0
          ? `<p style="color:var(--muted);text-align:center;padding:20px 0;">কোনো লেনদেন নেই</p>`
          : res.recentTx.map(tx=>`
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);">
              <div>
                <p style="font-size:12px;font-weight:600;">${tx.description}</p>
                <p style="color:var(--muted);font-size:10px;">${new Date(tx.createdAt).toLocaleString('bn-BD')}</p>
              </div>
              <p style="font-weight:700;font-size:13px;color:${tx.type==='withdraw'?'var(--danger)':'var(--success)'}">
                ${tx.type==='withdraw'?'-':'+'}${tx.amount} ${tx.currency}
              </p>
            </div>
          `).join('')}
      </div>
    `;
  }

  if (section === 'settings') {
    const res = await api.get('/api/admin/settings');
    if (!res.ok) return;
    const s = res.settings;
    el.innerHTML = `
      <div class="card">
        <p style="font-weight:700;font-size:16px;margin-bottom:16px;">⚙️ পয়েন্ট ও পেমেন্ট সেটিংস</p>
        <div id="admin-save-msg"></div>

        ${[
          {label:'১ ডলার = কত পয়েন্ট', id:'s-ppd',   val:s.pointsPerDollar, type:'number'},
          {label:'সর্বনিম্ন উইথড্র (USDT)', id:'s-min', val:s.minWithdraw, type:'number'},
          {label:'সর্বোচ্চ উইথড্র (USDT)', id:'s-max', val:s.maxWithdraw, type:'number'},
          {label:'দৈনিক চেক-ইন পয়েন্ট', id:'s-ci',  val:s.dailyCheckinPoints, type:'number'},
          {label:'ভিডিও এড পয়েন্ট', id:'s-ad',       val:s.watchAdPoints, type:'number'},
          {label:'গণিত সমাধান পয়েন্ট', id:'s-ma',    val:s.solveMathPoints, type:'number'},
          {label:'রেফারেল পয়েন্ট', id:'s-ref',        val:s.referralPoints, type:'number'},
        ].map(f=>`
          <label class="input-label">${f.label}</label>
          <input id="${f.id}" type="${f.type}" value="${f.val}" style="margin-bottom:12px;"/>
        `).join('')}

        <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.05);border-radius:10px;padding:12px;margin-bottom:16px;">
          <p style="font-weight:600;font-size:14px;">মেইনটেন্যান্স মোড</p>
          <button id="maint-toggle" onclick="toggleMaintenance(${s.maintenanceMode})" style="width:48px;height:26px;border-radius:13px;border:none;cursor:pointer;background:${s.maintenanceMode?'var(--danger)':'rgba(255,255,255,.1)'};position:relative;transition:all .2s;">
            <div style="width:20px;height:20px;border-radius:50%;background:white;position:absolute;top:3px;left:${s.maintenanceMode?'25':'3'}px;transition:all .2s;"></div>
          </button>
        </div>

        <button class="btn btn-primary btn-full btn-lg" onclick="saveSettings()">💾 সেভ করুন</button>
      </div>
    `;
  }

  if (section === 'deposit') {
    const res = await api.get('/api/admin/settings');
    if (!res.ok) return;
    const s = res.settings;
    el.innerHTML = `
      <div class="card">
        <p style="font-weight:700;font-size:16px;margin-bottom:16px;">💳 ডিপোজিট সেটিংস</p>
        <div id="dep-save-msg"></div>

        <label class="input-label">USDT ডিপোজিট ঠিকানা</label>
        <input id="dep-addr" type="text" value="${s.depositAddress}" style="margin-bottom:12px;"/>

        <label class="input-label">USDT নেটওয়ার্ক</label>
        <input id="dep-net" type="text" value="${s.usdtNetwork}" placeholder="TRC20 / ERC20 / BEP20" style="margin-bottom:16px;"/>

        <div class="alert alert-warn mb16">⚠️ ঠিকানা পরিবর্তন করলে ইউজাররা নতুন ঠিকানায় পাঠাবে। সাবধানে পরিবর্তন করুন।</div>

        <!-- QR Preview -->
        <p style="color:var(--muted);font-size:12px;margin-bottom:8px;">বর্তমান QR কোড প্রিভিউ</p>
        <div style="text-align:center;margin-bottom:16px;">
          <div class="qr-box" style="display:inline-block;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(s.depositAddress)}" width="150" height="150" style="border-radius:6px;display:block;"/>
          </div>
        </div>

        <button class="btn btn-primary btn-full btn-lg" onclick="saveDepositSettings()">💾 সেভ করুন</button>
      </div>
    `;
  }
}

let maint = false;
function toggleMaintenance(current) {
  maint = !current;
  const btn = document.getElementById('maint-toggle');
  if (btn) {
    btn.style.background = maint ? 'var(--danger)' : 'rgba(255,255,255,.1)';
    btn.querySelector('div').style.left = maint ? '25px' : '3px';
    btn.onclick = () => toggleMaintenance(!maint);
  }
}

async function saveSettings() {
  const data = {
    pointsPerDollar:    parseFloat(document.getElementById('s-ppd')?.value)||1000,
    minWithdraw:        parseFloat(document.getElementById('s-min')?.value)||0.5,
    maxWithdraw:        parseFloat(document.getElementById('s-max')?.value)||500,
    dailyCheckinPoints: parseInt(document.getElementById('s-ci')?.value)||50,
    watchAdPoints:      parseInt(document.getElementById('s-ad')?.value)||20,
    solveMathPoints:    parseInt(document.getElementById('s-ma')?.value)||30,
    referralPoints:     parseInt(document.getElementById('s-ref')?.value)||100,
    maintenanceMode:    maint,
  };
  const res = await api.post('/api/admin/settings', data);
  const msgEl = document.getElementById('admin-save-msg');
  if (msgEl) {
    msgEl.innerHTML = `<div class="alert ${res.ok?'alert-success':'alert-danger'} mb12">${res.ok?'✅ সেটিংস সেভ হয়েছে!':'❌ সেভ ব্যর্থ হয়েছে'}</div>`;
    if (res.ok) { state.settings.pointsPerDollar = data.pointsPerDollar; }
  }
}

async function saveDepositSettings() {
  const data = {
    depositAddress: document.getElementById('dep-addr')?.value,
    usdtNetwork:    document.getElementById('dep-net')?.value,
  };
  const res = await api.post('/api/admin/settings', data);
  const msgEl = document.getElementById('dep-save-msg');
  if (msgEl) msgEl.innerHTML = `<div class="alert ${res.ok?'alert-success':'alert-danger'} mb12">${res.ok?'✅ ডিপোজিট সেটিংস সেভ হয়েছে!':'❌ সেভ ব্যর্থ হয়েছে'}</div>`;
}
