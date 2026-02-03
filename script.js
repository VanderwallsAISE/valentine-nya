document.addEventListener("DOMContentLoaded", () => {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn  = document.getElementById("noBtn");
  const resetBtn = document.getElementById("resetBtn");
  const result = document.getElementById("result");

  // Quick sanity check
  console.log("Loaded:", { yesBtn, noBtn, resetBtn, result });

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

  // --- NO button runaway (desktop + mobile) ---
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

  // Touch (mobile)
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButton();
  }, { passive: false });

  noBtn.addEventListener("touchmove", (e) => {
    e.preventDefault();
    moveNoButton();
  }, { passive: false });

  // --- Confetti Hearts (canvas) ---
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  let confetti = [];
  let confettiRunning = false;
  let confettiTimer = null;

  function spawnHearts(count = 70) {
    confetti = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      size: 16 + Math.random() * 18,
      speedY: 2 + Math.random() * 4,
      speedX: -1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI,
      rotSpeed: (-0.05 + Math.random() * 0.1)
    }));
  }

  function drawHeart(x, y, size, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(size / 32, size / 32);

    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.bezierCurveTo(0, -5, -20, -5, -20, 10);
    ctx.bezierCurveTo(-20, 25, 0, 32, 0, 42);
    ctx.bezierCurveTo(0, 32, 20, 25, 20, 10);
    ctx.bezierCurveTo(20, -5, 0, -5, 0, 10);
    ctx.closePath();

    // pink heart fill (no need CSS colors here)
    ctx.fillStyle = "rgba(255, 79, 163, 0.95)";
    ctx.fill();

    ctx.restore();
  }

  function animateConfetti() {
    if (!confettiRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of confetti) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rot += p.rotSpeed;

      drawHeart(p.x, p.y, p.size, p.rot);

      // wrap
      if (p.y > canvas.height + 50) {
        p.y = -30;
        p.x = Math.random() * canvas.width;
      }
    }

    requestAnimationFrame(animateConfetti);
  }

  function startConfetti() {
    confettiRunning = true;
    spawnHearts(90);
    animateConfetti();

    // auto stop after 5s (optional)
    if (confettiTimer) clearTimeout(confettiTimer);
    confettiTimer = setTimeout(() => {
      stopConfetti();
    }, 5000);
  }

  function stopConfetti() {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // --- YES / RESET ---
  yesBtn.addEventListener("click", () => {
    result.classList.remove("hidden");
    resetBtn.classList.remove("hidden");

    typeLines("poem-en", poemEN, 650);
    typeLines("poem-ar", poemAR, 650);
    typeLines("poem-nuer", poemNUER, 650);

    startConfetti();

    yesBtn.disabled = true;
    // noBtn disabled optional, but funny to keep it running:
    // noBtn.disabled = true;
  });

  resetBtn.addEventListener("click", () => {
    result.classList.add("hidden");
    resetBtn.classList.add("hidden");

    document.getElementById("poem-en").innerHTML = "";
    document.getElementById("poem-ar").innerHTML = "";
    document.getElementById("poem-nuer").innerHTML = "";

    yesBtn.disabled = false;
    noBtn.disabled = false;

    // put No back in normal spot
    noBtn.style.position = "relative";
    noBtn.style.left = "";
    noBtn.style.top = "";

    stopConfetti();
  });
});
