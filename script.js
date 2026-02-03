const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const result = document.getElementById("result");

/* =========================
   POEMS (3 LANGUAGES)
========================= */

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

/* =========================
   MOVE "NO" BUTTON
========================= */

function moveNoButton() {
  const parent = noBtn.parentElement;
  const padding = 8;

  const parentRect = parent.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = parentRect.width - btnRect.width - padding;
  const maxY = parentRect.height - btnRect.height - padding;

  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

/* =========================
   TYPE POEM LINE BY LINE
========================= */

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

/* =========================
   NO BUTTON EVENTS
========================= */

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

// Modern pointer
noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoButton();
});

/* =========================
   EXTRA FUN: FINGER PROXIMITY
========================= */

document.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  const btnRect = noBtn.getBoundingClientRect();

  const btnCenterX = btnRect.left + btnRect.width / 2;
  const btnCenterY = btnRect.top + btnRect.height / 2;

  const dx = t.clientX - btnCenterX;
  const dy = t.clientY - btnCenterY;

  const distance = Math.hypot(dx, dy);

  if (distance < 80) moveNoButton();
}, { passive: true });

/* =========================
   YES BUTTON
========================= */

yesBtn.addEventListener("click", () => {
  result.classList.remove("hidden");

  typeLines("poem-en", poemEN, 650);
  typeLines("poem-ar", poemAR, 650);
  typeLines("poem-nuer", poemNUER, 650);

  yesBtn.disabled = true;
  noBtn.disabled = true;
});

