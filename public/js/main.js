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

  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
  }

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

  const revealEls = document.querySelectorAll(
    ".section__header, .card, .timeline__item, .member, .gallery__item, .about__grid > *, .events-preview__block"
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

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formNote.hidden = false;
      contactForm.reset();
      setTimeout(() => { formNote.hidden = true; }, 5000);
    });
  }

  /* ---- Modals (logo lightbox + executive members) ---- */
  const openModal = (modal) => {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  };
  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => { modal.hidden = true; }, 200);
  };

  const logoModal = document.getElementById("logo-modal");
  const brandLogo = document.getElementById("brand-logo");
  if (brandLogo && logoModal) {
    const trigger = (e) => { e.preventDefault(); e.stopPropagation(); openModal(logoModal); };
    brandLogo.addEventListener("click", trigger);
    brandLogo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") trigger(e);
    });
    // Prevent the parent <a> from navigating when logo is clicked
    brandLogo.closest("a")?.addEventListener("click", (e) => {
      if (e.target === brandLogo) e.preventDefault();
    });
  }

  const execModal = document.getElementById("executive-modal");
  const execBtn = document.getElementById("show-executive-btn");
  if (execBtn && execModal) {
    execBtn.addEventListener("click", () => openModal(execModal));
  }

  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", () => closeModal(el.closest(".modal")));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.is-open").forEach(closeModal);
    }
  });
})();
