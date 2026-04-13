// Replace this once with your real itch.io page URL and every CTA on the landing site will update.
const ITCH_PAGE_URL = "https://YOUR-ITCH-PAGE.itch.io/cyber-hax-v5";

document.querySelectorAll("[data-itch-link]").forEach((link) => {
  link.setAttribute("href", ITCH_PAGE_URL);
});

const yearNode = document.getElementById("footerYear");
if (yearNode) {
  yearNode.textContent = `© ${new Date().getFullYear()} Cyber Hax v5`;
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
