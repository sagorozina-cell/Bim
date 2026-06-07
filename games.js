// ── Games Screen — 2 games only ───────────────────────────────────────────────
function renderGames() {
  document.getElementById('screen-games').innerHTML = `
    <div class="header">
      <h2>গেম</h2>
      <p>গেম থেকে পয়েন্ট জিতুন</p>
    </div>
    <div class="p16" style="margin-top:-8px;">

      <!-- Game 1: Number Guess -->
      <div class="list-item mb12">
        <div class="list-icon" style="background:linear-gradient(135deg,#6C2FD9,#4A1FA8);font-size:28px;">🔢</div>
        <div class="list-body">
          <p class="list-title">নম্বর ধাঁধা</p>
          <p class="list-sub">সংখ্যা অনুমান করে পয়েন্ট জিতুন</p>
          <span class="badge badge-gold" style="margin-top:4px;">⭐ ১০–৫০ পয়েন্ট</span>
        </div>
        <button class="btn btn-primary" style="font-size:13px;padding:10px 16px;" onclick="openNumberGame()">খেলুন</button>
      </div>

      <!-- Game 2: Spin & Win -->
      <div class="list-item">
        <div class="list-icon" style="background:linear-gradient(135deg,#F59E0B,#D97706);font-size:28px;">🎡</div>
        <div class="list-body">
          <p class="list-title">স্পিন & উইন</p>
          <p class="list-sub">চাকা ঘুরিয়ে পুরস্কার জিতুন</p>
          <span class="badge badge-gold" style="margin-top:4px;">⭐ ৫–১০০ পয়েন্ট</span>
        </div>
        <button class="btn btn-primary" style="font-size:13px;padding:10px 16px;" onclick="openSpinGame()">খেলুন</button>
      </div>

      <div class="alert alert-info mt16">
        💡 প্রতিটি গেম প্রতিদিন খেলা যাবে। পয়েন্ট জমিয়ে USDT উইথড্র করুন!
      </div>
    </div>
  `;
}

// ── Game 1: Number Guess ──────────────────────────────────────────────────────
let numTarget = 0, numAttempts = 0, numWon = false;

function openNumberGame() {
  numTarget   = Math.floor(Math.random() * 100) + 1;
  numAttempts = 0;
  numWon      = false;
  openModal(`
    <h3 style="font-size:18px;font-weight:800;margin-bottom:8px;">🔢 নম্বর ধাঁধা</h3>
    <p style="color:var(--muted);font-size:13px;margin-bottom:16px;">১ থেকে ১০০ এর মধ্যে একটি সংখ্যা অনুমান করুন</p>
    <div style="text-align:center;margin-bottom:12px;">
      <span class="badge badge-purple" id="num-tries">চেষ্টা: 0</span>
    </div>
    <p id="num-msg" style="text-align:center;min-height:22px;font-size:14px;font-weight:600;margin-bottom:12px;"></p>
    <input id="num-input" type="number" placeholder="সংখ্যা লিখুন (১–১০০)" style="text-align:center;font-size:18px;font-weight:700;margin-bottom:12px;"/>
    <button class="btn btn-primary btn-full btn-lg" onclick="guessNumber()">অনুমান করুন</button>
  `);
}

async function guessNumber() {
  if (numWon) return;
  const inp = document.getElementById('num-input');
  const msg = document.getElementById('num-msg');
  const tries = document.getElementById('num-tries');
  if (!inp) return;
  const n = parseInt(inp.value);
  if (isNaN(n) || n < 1 || n > 100) { msg.textContent = '⚠️ ১ থেকে ১০০ এর মধ্যে লিখুন'; msg.style.color = 'var(--accent)'; return; }
  numAttempts++;
  if (tries) tries.textContent = `চেষ্টা: ${numAttempts}`;
  if (n === numTarget) {
    numWon = true;
    const pts = Math.max(50 - numAttempts * 5, 10);
    msg.textContent = `🎉 সঠিক! ${pts} পয়েন্ট পেয়েছেন!`;
    msg.style.color = 'var(--success)';
    const res = await api.post('/api/tasks/game-reward', { points: pts });
    if (res.ok) { state.user.points = res.total; renderHome(); }
    inp.disabled = true;
    setTimeout(closeModal, 2500);
  } else {
    msg.textContent = n < numTarget ? '📈 আরও বড় সংখ্যা চেষ্টা করুন' : '📉 আরও ছোট সংখ্যা চেষ্টা করুন';
    msg.style.color = 'var(--accent)';
    inp.value = '';
  }
}

// ── Game 2: Spin & Win ────────────────────────────────────────────────────────
const SEGS    = [10, 25, 5, 50, 0, 30, 15, 100];
const SEG_CLR = ['#6C2FD9','#F59E0B','#10B981','#EF4444','#8B5CF6','#06B6D4','#EC4899','#84CC16'];
let spinRot = 0, spinDone = false;

function buildWheel() {
  const size = 260, cx = size/2, cy = size/2, r = size/2 - 4;
  const n = SEGS.length, angle = (2*Math.PI)/n;
  let paths = '';
  for (let i=0; i<n; i++) {
    const s = i*angle - Math.PI/2;
    const e = s + angle;
    const x1=cx+r*Math.cos(s), y1=cy+r*Math.sin(s);
    const x2=cx+r*Math.cos(e), y2=cy+r*Math.sin(e);
    const mid = s + angle/2;
    const tx=cx+(r*.65)*Math.cos(mid), ty=cy+(r*.65)*Math.sin(mid);
    const rot = (mid*180/Math.PI)+90;
    paths += `
      <path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}Z" fill="${SEG_CLR[i]}" stroke="#0F0A1E" stroke-width="2"/>
      <text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="13" font-weight="bold"
        transform="rotate(${rot},${tx},${ty})">${SEGS[i]===0?'💀':SEGS[i]}</text>
    `;
  }
  paths += `<circle cx="${cx}" cy="${cy}" r="18" fill="#1A1035" stroke="#6C2FD9" stroke-width="3"/>`;
  return `<svg id="spin-svg" width="${size}" height="${size}" style="transition:transform 3.5s cubic-bezier(.17,.67,.12,.99);">${paths}</svg>`;
}

function openSpinGame() {
  spinDone = false;
  spinRot  = 0;
  openModal(`
    <h3 style="font-size:18px;font-weight:800;margin-bottom:8px;text-align:center;">🎡 স্পিন & উইন</h3>
    <p style="color:var(--muted);font-size:13px;margin-bottom:16px;text-align:center;">একবার স্পিন করুন পুরস্কার জিতুন</p>
    <div class="wheel-wrap" style="display:block;text-align:center;">
      <div class="wheel-pointer">▼</div>
      ${buildWheel()}
    </div>
    <p id="spin-msg" style="text-align:center;min-height:22px;font-size:15px;font-weight:700;margin:12px 0;"></p>
    <button class="btn btn-primary btn-full btn-lg" id="spin-btn" onclick="doSpin()">🎡 স্পিন করুন</button>
    <p style="text-align:center;color:var(--muted);font-size:11px;margin-top:8px;">প্রতিদিন একবার বিনামূল্যে</p>
  `);
}

async function doSpin() {
  if (spinDone) return;
  const btn = document.getElementById('spin-btn');
  const svg = document.getElementById('spin-svg');
  const msg = document.getElementById('spin-msg');
  if (!svg || !btn) return;
  btn.disabled = true; btn.textContent = '⏳ ঘুরছে...';
  const extra = 1440 + Math.floor(Math.random()*360);
  spinRot += extra;
  svg.style.transform = `rotate(${spinRot}deg)`;
  setTimeout(async () => {
    spinDone = true;
    const deg = spinRot % 360;
    const idx = Math.floor(((360 - deg) % 360) / (360 / SEGS.length));
    const pts = SEGS[idx % SEGS.length];
    if (pts > 0) {
      msg.textContent = `🎉 আপনি ${pts} পয়েন্ট জিতেছেন!`;
      msg.style.color = 'var(--success)';
      const res = await api.post('/api/tasks/game-reward', { points: pts });
      if (res.ok) { state.user.points = res.total; renderHome(); }
    } else {
      msg.textContent = '😢 এবার হয়নি! আবার চেষ্টা করুন';
      msg.style.color = 'var(--danger)';
    }
    btn.textContent = 'বন্ধ করুন';
    btn.disabled = false;
    btn.onclick = closeModal;
  }, 3600);
}
