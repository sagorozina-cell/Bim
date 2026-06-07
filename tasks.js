let mathQuestion = null;

function newMath() {
  const a = Math.floor(Math.random() * 50) + 1;
  const b = Math.floor(Math.random() * 30) + 1;
  const ops = ['+', '-'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  mathQuestion = { q: `${a} ${op} ${b} = ?`, ans: op === '+' ? a + b : a - b };
  const el = document.getElementById('math-q');
  if (el) el.textContent = mathQuestion.q;
}

function renderTasks() {
  const u = state.user;
  const today = new Date().toDateString();
  const checkinDone = u?.tasks?.checkin === today;
  const adDone      = u?.tasks?.watchAd === today;
  const mathDone    = u?.tasks?.solveMath === today;

  document.getElementById('screen-tasks').innerHTML = `
    <div class="header">
      <h2>টাস্ক</h2>
      <p>আপনার জন্য কাজ</p>
    </div>
    <div class="p16" style="margin-top:-8px;">

      <!-- Checkin -->
      <div class="list-item">
        <div class="list-icon" style="background:${checkinDone?'rgba(16,185,129,.2)':'rgba(108,47,217,.2)'};">📅</div>
        <div class="list-body">
          <p class="list-title">দৈনিক চেক-ইন</p>
          <span class="badge badge-gold">⭐ 50 পয়েন্ট</span>
        </div>
        ${checkinDone
          ? `<span style="font-size:22px;">✅</span>`
          : `<button class="btn btn-primary" style="font-size:12px;padding:8px 14px;" onclick="doCheckin()">চেক-ইন করুন</button>`}
      </div>

      <!-- Watch ad -->
      <div class="list-item">
        <div class="list-icon" style="background:${adDone?'rgba(16,185,129,.2)':'rgba(108,47,217,.2)'};">▶️</div>
        <div class="list-body">
          <p class="list-title">ভিডিও এড দেখুন</p>
          <span class="badge badge-gold">⭐ 20 পয়েন্ট</span>
          <div id="ad-progress-wrap" style="display:none;margin-top:6px;">
            <div class="progress-bar"><div class="progress-fill" id="ad-bar" style="width:0%"></div></div>
            <p style="font-size:11px;color:var(--muted);margin-top:3px;" id="ad-pct">0%</p>
          </div>
        </div>
        ${adDone
          ? `<span style="font-size:22px;">✅</span>`
          : `<button class="btn btn-primary" style="font-size:12px;padding:8px 14px;" id="ad-btn" onclick="doWatchAd()">এড দেখুন</button>`}
      </div>

      <!-- Refer -->
      <div class="list-item">
        <div class="list-icon" style="background:rgba(108,47,217,.2);">👥</div>
        <div class="list-body">
          <p class="list-title">বন্ধুকে ইনভাইট করুন</p>
          <span class="badge badge-gold">⭐ 100 পয়েন্ট</span>
        </div>
        <button class="btn btn-primary" style="font-size:12px;padding:8px 14px;" onclick="switchTab('profile')">ইনভাইট</button>
      </div>

      <!-- Math -->
      <div class="card mt16">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div class="list-icon" style="background:${mathDone?'rgba(16,185,129,.2)':'rgba(108,47,217,.2)'};">🧮</div>
          <div>
            <p class="list-title">গণিত সমাধান করুন</p>
            <span class="badge badge-gold">⭐ 30 পয়েন্ট</span>
          </div>
          ${mathDone ? `<span style="font-size:22px;margin-left:auto;">✅</span>` : ''}
        </div>

        ${!mathDone ? `
          <p id="math-q" style="font-size:28px;font-weight:800;color:var(--primary-light);text-align:center;margin-bottom:14px;">লোড হচ্ছে...</p>
          <p id="math-msg" style="text-align:center;font-size:13px;min-height:20px;margin-bottom:12px;"></p>
          <input id="math-input" type="number" placeholder="উত্তর লিখুন" style="text-align:center;font-size:20px;font-weight:700;margin-bottom:12px;"/>
          <div class="numpad mb12">
            ${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="numpad-key" onclick="mathKey(${n})">${n}</button>`).join('')}
            <button class="numpad-key" onclick="mathKey(0)">0</button>
            <button class="numpad-key numpad-del" onclick="mathDel()">⌫</button>
          </div>
          <button class="btn btn-primary btn-full btn-lg" onclick="submitMath()">উত্তর জমা দিন</button>
        ` : `<p style="text-align:center;color:var(--success);font-weight:600;">আজকের গণিত সমাধান হয়েছে ✅</p>`}
      </div>
    </div>
  `;

  if (!mathDone) newMath();
}

function mathKey(n) {
  const inp = document.getElementById('math-input');
  if (inp) inp.value += n;
}
function mathDel() {
  const inp = document.getElementById('math-input');
  if (inp) inp.value = inp.value.slice(0, -1);
}

async function doCheckin() {
  const res = await api.post('/api/tasks/checkin', {});
  if (res.ok) {
    state.user.points = res.total;
    state.user.tasks.checkin = new Date().toDateString();
    showToast(`✅ ${res.points} পয়েন্ট পেয়েছেন!`);
    renderTasks();
    renderHome();
  } else {
    showToast('⚠️ ' + res.msg);
  }
}

async function doWatchAd() {
  const btn = document.getElementById('ad-btn');
  const wrap = document.getElementById('ad-progress-wrap');
  const bar = document.getElementById('ad-bar');
  const pct = document.getElementById('ad-pct');
  if (!btn) return;
  btn.disabled = true; btn.textContent = 'দেখছেন...';
  if (wrap) wrap.style.display = 'block';
  let p = 0;
  const iv = setInterval(() => {
    p += 10;
    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = p + '%';
    if (p >= 100) {
      clearInterval(iv);
      api.post('/api/tasks/watch-ad', {}).then(res => {
        if (res.ok) {
          state.user.points = res.total;
          state.user.tasks.watchAd = new Date().toDateString();
          showToast(`✅ ${res.points} পয়েন্ট পেয়েছেন!`);
          renderTasks(); renderHome();
        }
      });
    }
  }, 300);
}

async function submitMath() {
  const inp = document.getElementById('math-input');
  const msg = document.getElementById('math-msg');
  if (!inp || !mathQuestion) return;
  const val = parseInt(inp.value);
  if (isNaN(val)) return;
  if (val === mathQuestion.ans) {
    const res = await api.post('/api/tasks/solve-math', { correct: true });
    if (res.ok) {
      state.user.points = res.total;
      state.user.tasks.solveMath = new Date().toDateString();
      showToast(`✅ সঠিক! ${res.points} পয়েন্ট পেয়েছেন!`);
      renderTasks(); renderHome();
    } else {
      if (msg) { msg.textContent = '⚠️ ' + res.msg; msg.style.color = 'var(--accent)'; }
    }
  } else {
    if (msg) { msg.textContent = '❌ ভুল উত্তর! আবার চেষ্টা করুন'; msg.style.color = 'var(--danger)'; }
    inp.value = '';
  }
}
