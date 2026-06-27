(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");
  const navAnchors = document.querySelectorAll(".nav__links a");
  const contactForm = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sticky header shadow */
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
  }

  /* Mobile menu */
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
    navAnchors.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* Active nav link on scroll (home only) */
  const sections = document.querySelectorAll("section[id]");
  const path = window.location.pathname;
  const isHomePage = path.endsWith("/site.html") || path === "/" || path.endsWith("/");
  if (sections.length && isHomePage) {
    const observerNav = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navAnchors.forEach((link) => {
            const href = link.getAttribute("href") || "";
            link.classList.toggle("active", href === `#${id}`);
          });
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    sections.forEach((section) => observerNav.observe(section));
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(
    ".section__header, .card, .timeline__item, .member, .gallery__item, .about__grid > *, .complaint-cta, .events-preview__block"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));
  const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => observerReveal.observe(el));

  /* Counters */
  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObserver.observe(c));

  /* Contact form */
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formNote.hidden = false;
      contactForm.reset();
      setTimeout(() => { formNote.hidden = true; }, 5000);
    });
  }

  /* Committee show more */
  const committeeToggle = document.getElementById("committee-toggle");
  const committeeGrid = document.getElementById("committee-grid");
  if (committeeToggle && committeeGrid) {
    committeeToggle.addEventListener("click", () => {
      const expanded = committeeToggle.getAttribute("data-expanded") === "true";
      const next = !expanded;
      committeeGrid.classList.toggle("committee--expanded", next);
      committeeToggle.setAttribute("data-expanded", String(next));
      committeeToggle.textContent = next ? "Show less ↑" : "Show more →";
    });
  }

})();
