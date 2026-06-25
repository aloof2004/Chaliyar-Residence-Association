(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");
  const navAnchors = document.querySelectorAll(".nav__links a");
  const contactForm = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");
  const complaintForm = document.getElementById("complaint-form");
  const complaintAnonymous = document.getElementById("complaint-anonymous");
  const complaintName = document.getElementById("complaint-name");
  const complaintSuccess = document.getElementById("complaint-success");
  const complaintRef = document.getElementById("complaint-ref");
  const complaintModal = document.getElementById("complaint-modal");
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

  /* ---- Complaint Modal ---- */
  const openComplaintModal = () => {
    if (!complaintModal) return;
    complaintModal.hidden = false;
    complaintModal.classList.add("is-open");
    document.body.classList.add("modal-open");
    const firstField = complaintModal.querySelector("select, input, textarea");
    if (firstField) setTimeout(() => firstField.focus(), 50);
  };
  const closeComplaintModal = () => {
    if (!complaintModal) return;
    complaintModal.classList.remove("is-open");
    complaintModal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll("[data-complaint-open]").forEach((el) => {
    el.addEventListener("click", (e) => {
      // For anchor links, still allow scroll to #complaints section but open modal
      if (complaintModal) {
        e.preventDefault();
        openComplaintModal();
      }
    });
  });
  document.querySelectorAll("[data-complaint-close]").forEach((el) => {
    el.addEventListener("click", closeComplaintModal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && complaintModal && complaintModal.classList.contains("is-open")) {
      closeComplaintModal();
    }
  });

  /* Open via ?complaint=open (e.g. from activities page nav) */
  if (complaintModal) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("complaint") === "open") {
      setTimeout(openComplaintModal, 300);
    }
  }

  /* Complaint form behaviour */
  if (complaintForm && complaintAnonymous) {
    const setAnonymousMode = (anonymous) => {
      complaintForm.classList.toggle("is-anonymous", anonymous);
      complaintName.required = !anonymous;
    };
    complaintAnonymous.addEventListener("change", () => {
      setAnonymousMode(complaintAnonymous.checked);
      if (complaintAnonymous.checked) {
        complaintName.value = "";
        const phone = document.getElementById("complaint-phone");
        if (phone) phone.value = "";
      }
    });

    const generateRef = () => {
      const d = new Date();
      const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      const rand = Math.floor(1000 + Math.random() * 9000);
      return `CRA-${ymd}-${rand}`;
    };

    complaintForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ref = generateRef();
      complaintRef.textContent = ref;
      complaintSuccess.hidden = false;
      complaintForm.reset();
      setAnonymousMode(false);
      complaintSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
})();
