const cursorGlow = document.querySelector(".cursor-glow");

document.addEventListener("pointermove", (event) => {
  if (cursorGlow) {
    cursorGlow.style.transform = `translate(${event.clientX - 210}px, ${event.clientY - 210}px)`;
  }
  document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--my", `${event.clientY}px`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-6px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    element.style.transform = `translate(${x}px, ${y}px)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
});

const form = document.querySelector("#briefForm");
const briefPreview = document.querySelector("#briefPreview");
const claudePrompt = document.querySelector("#claudePrompt");
const copyPrompt = document.querySelector("#copyPrompt");
const downloadPrompt = document.querySelector("#downloadPrompt");

function getBriefData() {
  const data = Object.fromEntries(new FormData(form).entries());
  const services = data.services
    .split(",")
    .map((service) => service.trim())
    .filter(Boolean);

  return { ...data, services };
}

function buildClaudePrompt(data) {
  return `# ZADANIE DLA CLAUDE AI

Jesteś senior web designerem i front-end developerem. Masz stworzyć kompletną, premium stronę demo dla klienta na podstawie briefu. Strona ma wyglądać jak realna realizacja komercyjna, nie jak tani szablon.

## Brief klienta
- Nazwa firmy: ${data.company}
- Branża: ${data.industry}
- Cel strony: ${data.goal}
- Zakładany budżet: ${data.budget}
- Styl wizualny: ${data.style}
- Lokalizacja i ton komunikacji: ${data.tone}
- Najważniejsze usługi / elementy oferty: ${data.services.join(", ")}

## Wymagany efekt
Stwórz gotową stronę demo w HTML, CSS i JavaScript. Ma być nowoczesna, dopracowana wizualnie, responsywna i sprzedażowa. Nie opisuj funkcji strony w treści. Zbuduj prawdziwy landing, który można pokazać klientowi jako kierunek projektu.

## Struktura strony
1. Hero z mocnym nagłówkiem, jasnym CTA i wizualnym pierwszym wrażeniem.
2. Sekcja problem / potrzeba klienta.
3. Sekcja usług lub oferty.
4. Sekcja wyróżników i zaufania.
5. Proces współpracy lub zakupu.
6. Portfolio, realizacje, wizualizacje albo przykładowe elementy oferty.
7. FAQ.
8. Formularz kontaktowy / lead form.

## Wymagania wizualne
- Użyj świeżego, premium kierunku graficznego dopasowanego do branży.
- Strona nie może wyglądać jak domyślny template.
- Dodaj subtelne animacje wejścia przy scrollu i hover efekty.
- Użyj realnych zdjęć z Unsplash lub podobnych źródeł, jeśli pasują do branży.
- Zadbaj o świetny mobile.
- Karty maksymalnie 8px border-radius.
- Bez przesadnego dark tech UI, jeśli branża tego nie wymaga.

## Wymagania techniczne
- Zwróć pełne pliki: index.html, styles.css, script.js.
- Kod ma działać jako statyczna strona.
- Nie używaj frameworków.
- Nie dodawaj backendu.
- Formularz może być statyczny.
- Zachowaj czysty HTML semantyczny i dobre meta title/description.

## Kryterium jakości
To ma wyglądać jak strona, za którą klient może zapłacić. Jeśli pierwszy projekt wygląda zbyt generycznie, popraw go samodzielnie przed oddaniem.`;
}

function buildPromptPanel() {
  const data = getBriefData();
  const serviceTags = data.services.map((service) => `<span>${service}</span>`).join("");

  briefPreview.innerHTML = `
    <section class="brief-card hero-brief">
      <span class="mini-label">Szablon gotowy</span>
      <h3>${data.company}</h3>
      <p>
        Formularz złożył gotowy prompt dla Claude AI. Ten tekst można wkleić do Claude Code,
        a później backend będzie mógł wysyłać go automatycznie.
      </p>
    </section>

    <section class="brief-card">
      <span class="mini-label">Dane wejściowe</span>
      <ul>
        <li>Branża: <strong style="color:var(--text)">${data.industry}</strong>.</li>
        <li>Cel strony: <strong style="color:var(--text)">${data.goal}</strong>.</li>
        <li>Styl: <strong style="color:var(--text)">${data.style}</strong>.</li>
        <li>Budżet: <strong style="color:var(--text)">${data.budget}</strong>.</li>
      </ul>
    </section>

    <section class="brief-card">
      <span class="mini-label">Elementy przekazywane do Claude</span>
      <div class="brief-offer">
        <strong>HTML + CSS + JavaScript</strong>
        <p>Claude ma zwrócić gotowe pliki strony demo, które później można przenieść do WordPressa / Elementora.</p>
      </div>
      <div class="tag-list">${serviceTags}</div>
    </section>
  `;

  claudePrompt.value = buildClaudePrompt(data);
}

copyPrompt.addEventListener("click", async () => {
  await navigator.clipboard.writeText(claudePrompt.value);
  copyPrompt.textContent = "Skopiowano";
  setTimeout(() => {
    copyPrompt.textContent = "Kopiuj prompt";
  }, 1400);
});

downloadPrompt.addEventListener("click", () => {
  const data = getBriefData();
  const slug = data.company
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const blob = new Blob([claudePrompt.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug || "brief"}-claude-prompt.txt`;
  link.click();
  URL.revokeObjectURL(url);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  buildPromptPanel();
  const panel = briefPreview.closest(".preview-panel");
  panel.style.boxShadow = "0 0 0 1px rgba(82,231,255,0.8), 0 0 60px rgba(82,231,255,0.2)";
  setTimeout(() => {
    panel.style.boxShadow = "";
  }, 700);
});

form.addEventListener("input", buildPromptPanel);
buildPromptPanel();

const canvas = document.querySelector("#network");
const ctx = canvas.getContext("2d");
let width;
let height;
let nodes;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  width = canvas.width = window.innerWidth * dpr;
  height = canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  const count = Math.min(100, Math.floor(window.innerWidth / 14));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3 * dpr,
    vy: (Math.random() - 0.5) * 0.3 * dpr,
    r: (Math.random() * 1.8 + 0.7) * dpr
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);

  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;

    ctx.fillStyle = "rgba(82, 231, 255, 0.72)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 135 * (window.devicePixelRatio || 1)) {
        ctx.globalAlpha = 1 - distance / (135 * (window.devicePixelRatio || 1));
        ctx.strokeStyle = "rgba(82, 231, 255, 0.16)";
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawNetwork);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawNetwork();
