/*
  Romantic question flow. Edit the text below freely to personalize the story.
  To add music, put an MP3 next to this file and set MUSIC_SOURCE to its name.
*/
const MUSIC_SOURCE = ""; // Example: "our-song.mp3"

const questions = [
  { icon: "💌", title: "Руслано, я хочу запросити тебе на побачення", text: "Без поспіху й зайвого пафосу — просто на один гарний вечір.", yes: "Слухаю 😊" },
  { icon: "🌆", title: "Я подумав про вечірній Краків", text: "Коли місто трохи стихає, а вулиці світяться теплим світлом.", yes: "Звучить гарно" },
  { icon: "🚶", title: "Хотів би прогулятися там разом із тобою", text: "Просто не поспішаючи: пройтися, поговорити й подивитися на місто.", yes: "Я люблю гуляти" },
  { icon: "☕", title: "А потім зайти на каву", text: "Обрати затишне місце, зігрітися й продовжити нашу розмову.", yes: "Кава — це добре" },
  { icon: "✨", title: "Без складного плану", text: "Нехай вечір складеться легко й природно — так, як буває в хорошій компанії.", yes: "Домовились" },
  { icon: "🌙", title: "Є лише одне важливе питання", text: "Чи маєш сьогодні ввечері трохи часу для такої маленької пригоди?", yes: "Можливо" },
  { icon: "🌷", title: "Обіцяю бути хорошою компанією", text: "І подбати про каву. Решту можна залишити настрою та самому Кракову.", yes: "Це чесно" },
  { icon: "🤍", title: "Тож залишилося зовсім трохи", text: "Без тиску — лише щире запрошення від мене до тебе.", yes: "Добре" },
  { icon: "❤️", title: "Чи підеш ти зі мною на побачення?", text: "Сьогодні ввечері: трохи Кракова, трохи кави й просто хороший час удвох.", yes: "Так! ❤️" },
  { icon: "🕰️", title: "На яку годину тобі було б зручно вийти?", text: "Напиши мені, коли тобі комфортно — і я підлаштуюсь. Буду чекати на твоє повідомлення.", yes: "Напишу тобі ✉️", final: true }
];

const $ = (selector) => document.querySelector(selector);
const questionTitle = $("#questionTitle");
const questionText = $("#questionText");
const questionIcon = $("#questionIcon");
const yesButton = $("#yesButton");
const noButton = $("#noButton");
const answers = $("#answers");
const progressFill = $("#progressFill");
const stepCounter = $("#stepCounter");
const questionView = $("#questionView");
const celebrationView = $("#celebrationView");
const music = $("#backgroundMusic");
let currentQuestion = 0;
let noEscapes = 0;

function renderQuestion() {
  const item = questions[currentQuestion];
  questionView.classList.remove("view--active");
  void questionView.offsetWidth; // Restarts the entrance animation.
  questionView.classList.add("view--active");
  questionIcon.textContent = item.icon;
  questionTitle.textContent = item.title;
  questionText.textContent = item.text;
  yesButton.textContent = item.yes;
  stepCounter.textContent = `${currentQuestion + 1} / ${questions.length}`;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  resetNoButton();
}

function advance() {
  if (currentQuestion === questions.length - 1) return celebrate();
  currentQuestion += 1;
  renderQuestion();
}

// After each press, the No button moves to a safe random spot on the whole screen.
function escapeNoButton() {
  const button = noButton.getBoundingClientRect();
  const padding = 14;
  const maxX = Math.max(padding, window.innerWidth - button.width - padding);
  const maxY = Math.max(padding, window.innerHeight - button.height - padding);
  const yesBounds = yesButton.getBoundingClientRect();
  let x = padding;
  let y = padding;

  // Try a few positions until the No button does not cover the Yes button.
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const candidateX = padding + Math.random() * (maxX - padding);
    const candidateY = padding + Math.random() * (maxY - padding);
    const overlapsYes = candidateX < yesBounds.right + padding
      && candidateX + button.width > yesBounds.left - padding
      && candidateY < yesBounds.bottom + padding
      && candidateY + button.height > yesBounds.top - padding;
    if (!overlapsYes) { x = candidateX; y = candidateY; break; }
  }
  noButton.style.position = "fixed";
  noButton.style.zIndex = "10";
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
  noButton.style.transform = `rotate(${(Math.random() - .5) * 12}deg)`;
  noEscapes += 1;
  if (noEscapes === 3) $("#hint").textContent = "Здається, ця кнопка трохи соромиться 🙈";
}

function resetNoButton() {
  noButton.removeAttribute("style");
  noEscapes = 0;
  $("#hint").textContent = "Обирай серцем ✨";
}

function celebrate() {
  questionView.hidden = true;
  celebrationView.hidden = false;
  progressFill.style.width = "100%";
  stepCounter.textContent = "Відповідь знайдено!";
  launchConfetti();
  createHeartBurst();
}

function replay() {
  currentQuestion = 0;
  celebrationView.hidden = true;
  questionView.hidden = false;
  renderQuestion();
}

function createFloatingDecor() {
  const heartBox = $("#hearts"), particleBox = $("#particles");
  for (let i = 0; i < 16; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = ["♥", "♡", "❤"][i % 3];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 20}px`;
    heart.style.animationDuration = `${8 + Math.random() * 10}s`;
    heart.style.animationDelay = `${-Math.random() * 16}s`;
    heart.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
    heartBox.append(heart);
  }
  for (let i = 0; i < 20; i += 1) {
    const dot = document.createElement("span");
    dot.className = "particle";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.animationDuration = `${7 + Math.random() * 11}s`;
    dot.style.animationDelay = `${-Math.random() * 15}s`;
    dot.style.setProperty("--drift", `${-50 + Math.random() * 100}px`);
    particleBox.append(dot);
  }
}

function createHeartBurst() {
  const box = $("#hearts");
  for (let i = 0; i < 22; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "❤";
    heart.style.left = `${35 + Math.random() * 30}%`;
    heart.style.bottom = "35%";
    heart.style.fontSize = `${16 + Math.random() * 25}px`;
    heart.style.animationDuration = `${2 + Math.random() * 2}s`;
    heart.style.setProperty("--drift", `${-220 + Math.random() * 440}px`);
    box.append(heart);
    setTimeout(() => heart.remove(), 4200);
  }
}

function launchConfetti() {
  const canvas = $("#confetti"), ctx = canvas.getContext("2d");
  canvas.width = innerWidth; canvas.height = innerHeight;
  const colors = ["#ff5c8a", "#ffd166", "#8ed1c5", "#ffffff", "#b77aff"];
  const pieces = Array.from({ length: 170 }, () => ({ x: innerWidth / 2, y: innerHeight * .35, vx: (Math.random() - .5) * 16, vy: -3 - Math.random() * 13, size: 5 + Math.random() * 7, color: colors[Math.floor(Math.random() * colors.length)], tilt: Math.random() * 6 }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .22; p.tilt += .17; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.tilt); ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * .66); ctx.restore(); });
    if (frame++ < 160) requestAnimationFrame(draw); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

yesButton.addEventListener("click", advance);
noButton.addEventListener("click", escapeNoButton);
$("#replayButton").addEventListener("click", replay);
$("#musicButton").addEventListener("click", async (event) => {
  if (!MUSIC_SOURCE) { $(".music-label").textContent = "Додай MP3"; return; }
  if (!music.src) music.src = MUSIC_SOURCE;
  if (music.paused) { await music.play(); event.currentTarget.classList.add("is-playing"); event.currentTarget.setAttribute("aria-pressed", "true"); }
  else { music.pause(); event.currentTarget.classList.remove("is-playing"); event.currentTarget.setAttribute("aria-pressed", "false"); }
});
addEventListener("resize", () => { const canvas = $("#confetti"); canvas.width = innerWidth; canvas.height = innerHeight; });
createFloatingDecor();
renderQuestion();
