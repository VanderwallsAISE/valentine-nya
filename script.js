const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const resetBtn = document.getElementById("resetBtn");
const result = document.getElementById("result");

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

/* ---------------------------
   NO button: run away (mobile + desktop)
----------------------------*/
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

// Desktop
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("mouseover", moveNoButton);

// Mobile touch
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("touchmove", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

// Pointer events (nice modern support)
noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoButton();
});

/* ---------------------------
   Poem typing animation
----------------------------*/
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

  return timer;
}

let timers = [];

/* ---------------------------
   Heart confetti 🎉💖 (canvas)
----------------------------*/
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let confettiPieces = [];
let confettiRunning = false;
let confettiRAF = null;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function makeHeartPath(x, y, size) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
  ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
}

function startConfettiHearts(durationMs = 2200) {
  confettiPieces = [];
  confettiRunning = true;

  const colors = ["#ff4fa3", "#ffd1e8", "#d4af37", "#ff79c2", "#ffffff"];

  // Create pieces
  for (let i = 0; i < 120; i++) {
    confettiPieces.push({
      x: random(0, window.innerWidth),
      y: random(-window.innerHeight, 0),
      size: random(8, 18),
      vy: random(1.5, 4),
      vx: random(-1.2, 1.2),
      rot: random(0, Math.PI * 2),
      vr: random(-0.08, 0.08),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1
    });
  }

  const start = performance.now();

  function draw(now) {
    if (!confettiRunning) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const elapsed = now - start;
    const fadeStart = durationMs * 0.65;

    for (const p of confettiPieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      // wrap
      if (p.y > window.innerHeight + 40) p.y = -40;
      if (p.x < -40) p.x = window.innerWidth + 40;
      if (p.x > window.innerWidth + 40) p.x = -40;

      // fade near end
      if (elapsed > fadeStart) {
        const t = (elapsed - fadeStart) / (durationMs - fadeStart);
        p.alpha = Math.max(0, 1 - t);
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;

      makeHeartPath(0, 0, p.size);
      ctx.fill();

      ctx.restore();
    }

    if (elapsed < durationMs) {
      confettiRAF = requestAnimationFrame(draw);
    } else {
      stopConfetti();
    }
  }

  confettiRAF = requestAnimationFrame(draw);
}

function stopConfetti() {
  confettiRunning = false;
  if (confettiRAF) cancelAnimationFrame(confettiRAF);
  confettiRAF = null;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

/* ---------------------------
   YES button behavior
----------------------------*/
yesBtn.addEventListener("click", () => {
  result.classList.remove("hidden");

  // Start poems together
  timers.push(typeLines("poem-en", poemEN, 650));
  timers.push(typeLines("poem-ar", poemAR, 650));
  timers.push(typeLines("poem-nuer", poemNUER, 650));

  // Confetti hearts
  startConfettiHearts(2400);

  // Disable yes/no & show reset
  yesBtn.disabled = true;
  noBtn.disabled = true;
  resetBtn.classList.remove("hidden");
});

/* ---------------------------
   RESET button behavior
----------------------------*/
resetBtn.addEventListener("click", () => {
  // stop any running poem timers
  timers.forEach(t => clearInterval(t));
  timers = [];

  // hide result again
  result.classList.add("hidden");

  // clear poem containers (so it doesn't keep old lines)
  const ids = ["poem-en", "poem-ar", "poem-nuer"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });

  // stop confetti
  stopConfetti();

  // re-enable buttons
  yesBtn.disabled = false;
  noBtn.disabled = false;

  // put NO button back to normal spot
  noBtn.style.position = "relative";
  noBtn.style.left = "";
  noBtn.style.top = "";

  // hide reset button
  resetBtn.classList.add("hidden");
});
