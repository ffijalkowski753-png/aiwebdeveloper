const form = document.querySelector("#briefForm");
const briefPreview = document.querySelector("#briefPreview");
const canvas = document.querySelector("#network");
const ctx = canvas.getContext("2d");
const cursorGlow = document.querySelector(".cursor-glow");

function buildPrompt() {
  const data = Object.fromEntries(new FormData(form).entries());
  const services = data.services
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const serviceTags = services.map((service) => `<span>${service}</span>`).join("");
  const mainService = services[0] || "najważniejszą usługę";

  briefPreview.innerHTML = `
    <section class="brief-card hero-brief">
      <span class="mini-label">Rekomendacja</span>
      <h3>${data.company}</h3>
      <p>
        Najlepszy kierunek to profesjonalna strona firmowa nastawiona na ${data.goal}.
        Komunikacja powinna być ${data.style}, a pierwsza rozmowa powinna potwierdzić
        zakres, materiały, termin i realny budżet.
      </p>
    </section>

    <section class="brief-card">
      <span class="mini-label">Priorytety rozmowy</span>
      <ul>
        <li>Ustalić, które usługi mają największą wartość sprzedażową.</li>
        <li>Sprawdzić, czy klient ma logo, zdjęcia, opinie i dostęp do hostingu.</li>
        <li>Potwierdzić termin oraz budżet: ${data.budget}.</li>
        <li>Ustalić, czy strona ma zbierać telefony, formularze czy rezerwacje.</li>
      </ul>
    </section>

    <section class="brief-card">
      <span class="mini-label">Proponowany zakres</span>
      <div class="brief-offer">
        <strong>WordPress + Elementor</strong>
        <p>
          Strona z mocnym nagłówkiem, sekcją usług, argumentami zaufania, formularzem
          kontaktowym i strukturą SEO pod branżę: ${data.industry}.
        </p>
      </div>
      <div class="tag-list">${serviceTags}</div>
    </section>

    <section class="brief-card next-step">
      <span>Następny krok</span>
      <strong>
        Zacznij rozmowę od: “Widzę, że kluczowe jest ${mainService}. Ustalmy, jaki efekt biznesowy
        ma dać strona i jaki zakres będzie najbardziej opłacalny.”
      </strong>
    </section>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  buildPrompt();
  briefPreview.parentElement.classList.add("flash");
  setTimeout(() => briefPreview.parentElement.classList.remove("flash"), 650);
});

form.addEventListener("input", buildPrompt);
buildPrompt();

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.addEventListener("pointermove", (event) => {
  cursorGlow.style.transform = `translate(${event.clientX - 180}px, ${event.clientY - 180}px)`;
  document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--my", `${event.clientY}px`);
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 8}deg) translateY(-6px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
    element.style.transform = `translate(${x}px, ${y}px)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
});

let width = 0;
let height = 0;
let nodes = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth * window.devicePixelRatio;
  height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  nodes = Array.from({ length: Math.min(120, Math.floor(window.innerWidth / 12)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.34 * window.devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.34 * window.devicePixelRatio,
    r: (Math.random() * 1.8 + 0.8) * window.devicePixelRatio
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(width * 0.5, height * 0.1, 0, width * 0.5, height * 0.1, width);
  gradient.addColorStop(0, "rgba(82, 231, 255, 0.12)");
  gradient.addColorStop(1, "rgba(97, 242, 181, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;

    ctx.fillStyle = "rgba(82, 231, 255, 0.78)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 135 * window.devicePixelRatio) {
        ctx.globalAlpha = 1 - distance / (135 * window.devicePixelRatio);
        ctx.strokeStyle = i % 3 === 0 ? "rgba(97, 242, 181, 0.2)" : "rgba(82, 231, 255, 0.18)";
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
