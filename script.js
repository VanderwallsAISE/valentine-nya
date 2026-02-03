const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const poem = document.getElementById("poem");

yesBtn.addEventListener("click", () => {
  poem.classList.remove("hidden");
  yesBtn.style.display = "none";
  noBtn.style.display = "none";
});

noBtn.addEventListener("mouseover", () => {
  noBtn.style.position = "absolute";
  noBtn.style.left = Math.random() * 80 + "%";
  noBtn.style.top = Math.random() * 80 + "%";
});
