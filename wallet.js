// ── Wallet / Withdraw / Deposit Screen ───────────────────────────────────────
let walletInfo = null;

async function loadWalletInfo() {
  const res = await api.get('/api/wallet/info');
  if (res.ok) walletInfo = res;
}

function renderWallet() {
  const u = state.user;
  loadWalletInfo().then(() => _drawWallet());
  _drawWallet(); // draw immediately with cached data
}

function _drawWallet() {
  const u = state.user;
  const w = walletInfo;
  const ptsPerDollar = w?.pointsPerDollar || state.settings.pointsPerDollar || 1000;

  document.getElementById('screen-wallet').innerHTML = `
    <div class="header">
      <h2>ওয়ালেট</h2>
      <p>আপনার পেমেন্ট</p>
    </div>
    <div class="p16" style="margin-top:-8px;">

      <!-- Balance card -->
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));border-radius:20px;padding:24px;margin-bottom:16px;border:1px solid rgba(139,92,246,.3);">
        <p style="color:rgba(255,255,255,.7);font-size:13px;margin-bottom:6px;">💰 মোট ব্যালেন্স</p>
        <p style="font-size:26px;font-weight:900;">${fmt(u?.balance)} USDT</p>
        <div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.15);">
          <div>
            <p style="color:rgba(255,255,255,.6);font-size:11px;">⭐ পয়েন্ট</p>
            <p style="font-weight:800;font-size:16px;">${(u?.points||0).toLocaleString()}</p>
          </div>
          <div style="text-align:right;">
            <p style="color:rgba(255,255,255,.6);font-size:11px;">পয়েন্ট মূল্য</p>
            <p style="font-weight:800;font-size:16px;color:var(--accent);">≈ $${ptsToUsdt(u?.points||0)}</p>
          </div>
        </div>
      </div>

      <!-- Rate info -->
      <div class="alert alert-info mb16">
        📊 বর্তমান রেট: <strong>${ptsPerDollar.toLocaleString()} পয়েন্ট = $1.00 USDT</strong>
      </div>

      <!-- Action buttons -->
      <button class="btn btn-success btn-full btn-lg mb12" onclick="openDeposit()">💰 ডিপোজিট করুন</button>
      <button class="btn btn-primary btn-full btn-lg mb12" onclick="openWithdraw()">💸 উইথড্র করুন</button>
      <button class="btn btn-ghost btn-full btn-lg mb12" onclick="openConvert()">🔄 পয়েন্ট → USDT কনভার্ট</button>

      <!-- Transactions -->
      <div id="tx-list"><p style="color:var(--muted);font-size:13px;text-align:center;padding:20px 0;">লোড হচ্ছে...</p></div>
    </div>
  `;
  loadTxList();
}

async function loadTxList() {
  const res = await api.get('/api/wallet/transactions');
  const el = document.getElementById('tx-list');
  if (!el) return;
  if (!res.ok || !res.transactions.length) {
    el.innerHTML = `<p style="color:var(--muted);font-size:13px;text-align:center;padding:20px 0;">কোনো লেনদেন নেই</p>`;
    return;
  }
  el.innerHTML = `
    <p class="section-title">সাম্প্রতিক লেনদেন</p>
    ${res.transactions.map(tx=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);">
        <div>
          <p style="font-size:13px;font-weight:600;">${tx.description}</p>
          <p style="color:var(--muted);font-size:11px;">${new Date(tx.createdAt).toLocaleDateString('bn-BD')}</p>
        </div>
        <div style="text-align:right;">
          <p style="font-weight:700;color:${tx.type==='withdraw'?'var(--danger)':'var(--success)'};font-size:13px;">
            ${tx.type==='withdraw'?'-':'+'}${tx.amount} ${tx.currency}
          </p>
          <p style="font-size:10px;color:${tx.status==='completed'?'var(--success)':tx.status==='pending'?'var(--accent)':'var(--danger)'}">
            ${tx.status==='completed'?'✅ সম্পন্ন':tx.status==='pending'?'⏳ পেন্ডিং':'❌ ব্যর্থ'}
          </p>
        </div>
      </div>
    `).join('')}
  `;
}

// ── Deposit modal ─────────────────────────────────────────────────────────────
function openDeposit() {
  const addr = walletInfo?.depositAddress || 'TYourDepositAddressHere';
  const net  = walletInfo?.usdtNetwork || 'TRC20';
  openModal(`
    <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">💰 ডিপোজিট</h3>
    <p style="color:var(--muted);font-size:13px;margin-bottom:16px;">USDT জমা করুন</p>

    <div class="alert alert-success mb12">নেটওয়ার্ক: <strong>${net}</strong> — শুধুমাত্র ${net} নেটওয়ার্কে পাঠান</div>

    <!-- QR -->
    <div style="text-align:center;margin-bottom:16px;">
      <div class="qr-box" style="display:inline-block;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(addr)}" width="180" height="180" style="border-radius:6px;display:block;"/>
      </div>
    </div>

    <p style="color:var(--muted);font-size:12px;margin-bottom:6px;">ডিপোজিট ঠিকানা</p>
    <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.05);border-radius:10px;padding:12px;margin-bottom:16px;">
      <p style="flex:1;font-size:12px;word-break:break-all;">${addr}</p>
      <button onclick="copyText('${addr}')" style="background:none;border:none;cursor:pointer;font-size:18px;">📋</button>
    </div>

    <!-- TON Keeper -->
    <button class="btn btn-ton btn-full btn-lg mb12" onclick="openTonKeeper('deposit','${addr}')">
      💎 TON Keeper দিয়ে ডিপোজিট
    </button>

    <div class="alert alert-warn">⚠️ ডিপোজিট নিশ্চিত হতে ১০–৩০ মিনিট সময় লাগতে পারে</div>
  `);
}

// ── Withdraw modal ────────────────────────────────────────────────────────────
function openWithdraw() {
  const min = walletInfo?.minWithdraw || 0.5;
  const max = walletInfo?.maxWithdraw || 500;
  const bal = state.user?.balance || 0;
  openModal(`
    <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">💸 উইথড্র</h3>
    <p style="color:var(--muted);font-size:13px;margin-bottom:16px;">ব্যালেন্স তুলে নিন</p>

    <div style="background:linear-gradient(135deg,var(--card),var(--card2));border-radius:14px;padding:14px;margin-bottom:16px;border:1px solid var(--border);">
      <p style="color:var(--muted);font-size:12px;">উপলব্ধ ব্যালেন্স</p>
      <p style="font-size:22px;font-weight:800;color:var(--success);">${fmt(bal)} USDT</p>
      <p style="color:var(--muted);font-size:11px;margin-top:4px;">সর্বনিম্ন: $${min} | সর্বোচ্চ: $${max}</p>
    </div>

    <div id="wd-msg"></div>

    <label class="input-label">উইথড্র পরিমাণ (USDT)</label>
    <input id="wd-amount" type="number" placeholder="0.00" style="margin-bottom:12px;" min="${min}" max="${max}" step="0.01"/>

    <label class="input-label">আপনার USDT ওয়ালেট ঠিকানা</label>
    <input id="wd-addr" type="text" placeholder="ঠিকানা লিখুন..." style="margin-bottom:16px;"/>

    <button class="btn btn-ton btn-full btn-lg mb12" onclick="openTonKeeperWithdraw()">💎 TON Keeper দিয়ে উইথড্র</button>
    <button class="btn btn-primary btn-full btn-lg" onclick="submitWithdraw()">উইথড্র করুন</button>
  `);
}

async function submitWithdraw() {
  const amount = document.getElementById('wd-amount')?.value;
  const addr   = document.getElementById('wd-addr')?.value;
  const msgEl  = document.getElementById('wd-msg');
  const res = await api.post('/api/wallet/withdraw', { amount, walletAddress: addr });
  if (msgEl) {
    msgEl.innerHTML = `<div class="alert ${res.ok?'alert-success':'alert-danger'} mb12">${res.ok?'✅ '+res.msg:'❌ '+res.msg}</div>`;
  }
  if (res.ok) {
    state.user.balance = parseFloat(res.balance);
    setTimeout(() => { closeModal(); renderWallet(); }, 1500);
  }
}

// ── Convert modal ─────────────────────────────────────────────────────────────
function openConvert() {
  const pts = state.user?.points || 0;
  const ppu = walletInfo?.pointsPerDollar || state.settings.pointsPerDollar || 1000;
  openModal(`
    <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">🔄 পয়েন্ট → USDT</h3>
    <p style="color:var(--muted);font-size:13px;margin-bottom:16px;">পয়েন্ট কনভার্ট করুন</p>

    <div style="background:linear-gradient(135deg,var(--card),var(--card2));border-radius:14px;padding:14px;margin-bottom:16px;border:1px solid var(--border);">
      <p style="color:var(--muted);font-size:12px;">আপনার পয়েন্ট</p>
      <p style="font-size:26px;font-weight:800;color:var(--accent);">⭐ ${pts.toLocaleString()}</p>
      <p style="color:var(--muted);font-size:12px;margin-top:6px;">রেট: ${ppu.toLocaleString()} পয়েন্ট = $1.00 USDT</p>
    </div>

    <div id="cv-msg"></div>

    <label class="input-label">কত পয়েন্ট কনভার্ট করবেন?</label>
    <input id="cv-pts" type="number" placeholder="পয়েন্ট সংখ্যা" style="margin-bottom:8px;" oninput="updateCvPreview(${ppu})"/>
    <p id="cv-preview" style="color:var(--primary-light);font-size:13px;font-weight:600;margin-bottom:16px;"></p>

    <button class="btn btn-primary btn-full btn-lg" onclick="submitConvert()">কনভার্ট করুন</button>
  `);
}

function updateCvPreview(ppu) {
  const pts = parseInt(document.getElementById('cv-pts')?.value) || 0;
  const el  = document.getElementById('cv-preview');
  if (el) el.textContent = pts > 0 ? `${pts} পয়েন্ট = $${(pts/ppu).toFixed(8)} USDT` : '';
}

async function submitConvert() {
  const pts   = document.getElementById('cv-pts')?.value;
  const msgEl = document.getElementById('cv-msg');
  const res   = await api.post('/api/wallet/convert', { points: pts });
  if (msgEl) {
    msgEl.innerHTML = `<div class="alert ${res.ok?'alert-success':'alert-danger'} mb12">${res.ok?`✅ ${pts} পয়েন্ট → $${res.usdt} USDT কনভার্ট হয়েছে!`:'❌ '+res.msg}</div>`;
  }
  if (res.ok) {
    state.user.points  = res.points;
    state.user.balance = parseFloat(res.balance);
    setTimeout(() => { closeModal(); renderWallet(); renderHome(); }, 1800);
  }
}

// ── TON Keeper deep links ─────────────────────────────────────────────────────
function openTonKeeper(action, addr) {
  const url = `https://app.tonkeeper.com/transfer/${addr}?text=deposit_usdt`;
  window.open(url, '_blank');
}
function openTonKeeperWithdraw() {
  const addr = document.getElementById('wd-addr')?.value;
  if (!addr) { showToast('⚠️ আগে ওয়ালেট ঠিকানা দিন'); return; }
  window.open(`https://app.tonkeeper.com/transfer/${addr}`, '_blank');
}
