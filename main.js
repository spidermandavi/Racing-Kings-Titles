document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");
  const header = document.querySelector(".site-header");
  const chips = document.querySelectorAll(".nav-chip");

  const setActiveChip = () => {
    const sections = [...document.querySelectorAll("section[id]")];
    const offset = 140;
    let current = sections[0]?.id;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top - offset <= 0) {
        current = section.id;
      }
    }

    chips.forEach((chip) => {
      const href = chip.getAttribute("href") || "";
      const match = href.startsWith("#") ? href.slice(1) : "";
      chip.classList.toggle("active", match === current);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, { threshold: 0.14 });

  revealElements.forEach((el) => observer.observe(el));

  if (header) {
    observer.observe(header);
  }

  window.addEventListener("scroll", setActiveChip, { passive: true });
  window.addEventListener("resize", setActiveChip);
  setActiveChip();
});
