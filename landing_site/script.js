const PUBLIC_GAME_URL = "https://cyber-hax-server.onrender.com";

document.querySelectorAll("[data-render-link]").forEach((link) => {
  link.setAttribute("href", PUBLIC_GAME_URL);
});

const yearNode = document.getElementById("footerYear");
if (yearNode) {
  yearNode.textContent = `(c) ${new Date().getFullYear()} Cyber Hax v5`;
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  {
    threshold: 0.15,
  },
);

document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
