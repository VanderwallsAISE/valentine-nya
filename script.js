const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const resetBtn = document.getElementById("resetBtn");

const result = document.getElementById("result");

const titleHey = document.getElementById("titleHey");
const titleLove = document.getElementById("titleLove");
const subtitleTop = document.getElementById("subtitleTop");

const yesSound = document.getElementById("yesSound");

// --- Poems ---
const poemEN = [
  "My love, thou art the fire in my veins,",
  "The whispered dream that softens all my pains.",
  "When thou art near, the stars forget to shine,",
  "For all their light is pale compared to thine.",
  "Thy smile commands my restless, roaming heart,",
  "And bids all lonely thoughts from me depart.",
  "If love be sin, then gladly I shall fall,",
  "For in thy arms, I’ve found my heaven’s call.",
  "Come, be my Valentine, my sweetest flame,",
  "And let the world forever know thy name. 💖"
];

const poemAR = [
  "يا نيا، يا ضوء قلبي ونبضي،",
  "في عينيكِ أجد السلام بعد حزني.",
  "حين تبتسمين، ينسى الكون صوته،",
  "وكأن النجوم خجلت من نوركِ.",
  "أنتِ الحلم الذي لا أريد أن أصحو منه،",
  "وأنتِ الحقيقة التي تفوق كل خيال.",
  "كوني حبيبتي، كوني قدري الجميل،",
  "فأنا اخترتكِ من بين كل النساء. 💕"
];

const poemNUER = [
  "Nya, ci wä̈l nhom miɛth,",
  "Yin duɔ̈ɔ̈r kuɔth mi lɔɔr.",
  "Kɛ ci la yïn, cäŋ kɛ wɛ̈n,",
  "Gɔ̈k kuɔth nɔ̈ŋ bɔ̈ɔ̈l.",
  "Yin nhial mi, yin piny mi,",
  "Yin mi raan miɛth.",
  "Kɔ̈c yïn Valentine mi,",
  "Yin mi kɛ wä̈l cien. ❤️"
];

// --- Helpers ---
function typeLines(containerId, lines, delayMs = 650) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  let i = 0;

  const timer = setInterval(() => {
    if (i >= lines.length) {
      clearInterval(timer);
      return;
    }
    const div = document.createElement("div");
    div.className = "line";
    div.textContent = lines[i];
    container.appendChild(div);
    i++;
  }, delayMs);
}

function vibrateLove() {
  // Works only on supported devices
  if (navigator.vibrate) {
    navigator.vibrate([120, 60, 120, 60, 180]); // cute little pattern
  }
}

function playYesSound() {
  // Some browsers block sound unless user has interacted—this is a click, so usually OK.
  // We'll attempt play; if blocked, no crash.
  try {
    yesSound.currentTime = 0;
    const p = yesSound.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch (e) {}
}

// --- No button run away (desktop + mobile) ---
function moveNoButton() {
  const padding = 20;

  const maxX = window.innerWidth - noBtn.offsetWidth - padding;
  const maxY = window.innerHeight - noBtn.offsetHeight - padding;

  const x = Math.floor(Math.random() * Math.max(maxX, 1));
  const y = Math.floor(Math.random() * Math.max(maxY, 1));

  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("mouseover", moveNoButton);

noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("touchmove", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoButton();
});

// --- Confetti Hearts ---
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let confettiRunning = false;
let confettiTimer = null;

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function rand(min, max){ return Math.random() * (max - min) + min; }

function makeHeartPiece() {
  return {
    x: rand(0, window.innerWidth),
    y: rand(-80, -10),
    vy: rand(2, 6),
    vx: rand(-1.5, 1.5),
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.08, 0.08),
    size: rand(10, 22),
    alpha: rand(0.75, 1)
  };
}

function drawHeart(x, y, size, rot, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;

  // heart path
  ctx.beginPath();
  const s = size;
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3);
  ctx.bezierCurveTo(-s * 0.5, s * 0.7, 0, s * 0.9, 0, s);
  ctx.bezierCurveTo(0, s * 0.9, s * 0.5, s * 0.7, s * 0.5, s * 0.3);
  ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.3);
  ctx.closePath();

  // gradient-ish effect (simple)
  ctx.fillStyle = "rgba(255,79,163,0.95)";
  ctx.fill();

  ctx.restore();
}

function confettiStep() {
  if (!confettiRunning) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiPieces.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    // wrap horizontally
    if (p.x < -50) p.x = window.innerWidth + 50;
    if (p.x > window.innerWidth + 50) p.x = -50;

    drawHeart(p.x, p.y, p.size, p.rot, p.alpha);
  });

  // remove pieces that fell off screen
  confettiPieces = confettiPieces.filter(p => p.y < window.innerHeight + 60);

  // keep spawning a little while running
  if (confettiPieces.length < 120) {
    for (let i = 0; i < 4; i++) confettiPieces.push(makeHeartPiece());
  }

  requestAnimationFrame(confettiStep);
}

function startConfetti(durationMs = 4500) {
  confettiPieces = [];
  for (let i = 0; i < 80; i++) confettiPieces.push(makeHeartPiece());

  confettiRunning = true;
  confettiStep();

  // stop after duration
  clearTimeout(confettiTimer);
  confettiTimer = setTimeout(() => stopConfetti(), durationMs);
}

function stopConfetti() {
  confettiRunning = false;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  confettiPieces = [];
  clearTimeout(confettiTimer);
  confettiTimer = null;
}

// --- YES click ---
yesBtn.addEventListener("click", () => {
  // Sound + vibration
  playYesSound();
  vibrateLove();

  // Titles swap
  titleHey.classList.add("hidden");
  subtitleTop.classList.add("hidden");
  titleLove.classList.remove("hidden");

  // Show result + poems
  result.classList.remove("hidden");
  typeLines("poem-en", poemEN, 650);
  typeLines("poem-ar", poemAR, 650);
  typeLines("poem-nuer", poemNUER, 650);

  // Confetti
  startConfetti();

  // Hide buttons except reset (reset appears)
  yesBtn.classList.add("hidden");
  noBtn.classList.add("hidden");
  resetBtn.classList.remove("hidden");
});

// --- RESET click ---
resetBtn.addEventListener("click", () => {
  stopConfetti();

  // Back to original titles
  titleLove.classList.add("hidden");
  titleHey.classList.remove("hidden");
  subtitleTop.classList.remove("hidden");

  // Hide result
  result.classList.add("hidden");

  // Clear poems
  document.getElementById("poem-en").innerHTML = "";
  document.getElementById("poem-ar").innerHTML = "";
  document.getElementById("poem-nuer").innerHTML = "";

  // Bring buttons back
  yesBtn.classList.remove("hidden");
  noBtn.classList.remove("hidden");
  resetBtn.classList.add("hidden");

  // Put NO button back in normal spot
  noBtn.style.position = "relative";
  noBtn.style.left = "";
  noBtn.style.top = "";
});
