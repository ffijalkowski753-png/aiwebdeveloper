const form = document.querySelector("#briefForm");
const briefPreview = document.querySelector("#briefPreview");

function buildBriefPreview() {
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
        Najmocniejszy kierunek to strona nastawiona na ${data.goal}. Styl powinien być
        ${data.style}, a komunikacja musi od razu pokazywać konkretną wartość dla klienta.
      </p>
    </section>

    <section class="brief-card">
      <span class="mini-label">Co ustalić przez telefon</span>
      <ul>
        <li>Jaki efekt ma dać strona: leady, telefony, rezerwacje czy wizerunek.</li>
        <li>Czy firma ma zdjęcia, logo, opinie, realizacje i dostęp do hostingu.</li>
        <li>Jaki zakres jest realny przy budżecie: ${data.budget}.</li>
        <li>Które elementy oferty mają być najmocniej widoczne na stronie.</li>
      </ul>
    </section>

    <section class="brief-card">
      <span class="mini-label">Proponowany zakres strony</span>
      <div class="brief-offer">
        <strong>One-page premium + WordPress</strong>
        <p>
          Hero z mocnym CTA, sekcje sprzedażowe, usługi, argumenty zaufania, realizacje lub wizualizacje,
          FAQ, formularz kontaktowy i struktura SEO dla branży: ${data.industry}.
        </p>
      </div>
      <div class="tag-list">${serviceTags}</div>
    </section>

    <section class="brief-card next-step">
      <span>Następny krok</span>
      <strong>
        Zacznij od: “Widzę, że kluczowe jest ${mainService}. Ustalmy, jaki efekt biznesowy ma dać strona
        i czy robimy prostą wizytówkę, czy wersję premium pod sprzedaż.”
      </strong>
    </section>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  buildBriefPreview();
});

form.addEventListener("input", buildBriefPreview);
buildBriefPreview();

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
  document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--my", `${event.clientY}px`);
});

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
    element.style.transform = `translate(${x}px, ${y}px)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
});
