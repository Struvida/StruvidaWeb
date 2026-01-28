// Mobile menu, active link on scroll, stats counter, simple form handling
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const menu = document.querySelector(".nav-menu");
  const links = document.querySelectorAll(".nav-link");
  const year = document.getElementById("year");
  const statNumbers = document.querySelectorAll(".stat-number");

  // set year
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu toggle
  toggle &&
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.classList.toggle("active");
      menu.classList.toggle("active");
      if (!expanded) menu.querySelector("a")?.focus();
    });

  // Close menu on link click
  links.forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.remove("active");
      toggle?.classList.remove("active");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Update active nav link on scroll
  const sections = Array.from(
    document.querySelectorAll("main section, main header"),
  );
  const obsOptions = { root: null, threshold: 0.5 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const id = e.target.id;
      if (e.isIntersecting && id) {
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + id),
        );
      }
    });
  }, obsOptions);
  sections.forEach((s) => observer.observe(s));

  // Animate stats when visible
  if (statNumbers.length) {
    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statNumbers.forEach((el) => {
              const target = +el.getAttribute("data-target") || 0;
              const duration = 1400;
              const start = performance.now();
              const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                el.textContent = Math.floor(progress * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target;
              };
              requestAnimationFrame(step);
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    statsObserver.observe(document.querySelector(".stats"));
  }

  // Simple contact form handling (demo)
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // basic validation
      const required = Array.from(form.querySelectorAll("[required]"));
      const invalid = required.filter((f) => !f.value.trim());
      if (invalid.length) {
        status.textContent = "Please complete all required fields.";
        status.style.color = "crimson";
        invalid[0].focus();
        return;
      }
      // simulate send
      status.style.color = "";
      status.textContent = "Sending...";
      setTimeout(() => {
        form.reset();
        status.style.color = "var(--primary-green)";
        status.textContent =
          "Thanks — your message has been received. We will respond within 2 business days.";
      }, 800);
    });
  }
});
