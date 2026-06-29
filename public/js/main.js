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

  /* Gallery folder tabs */
  const galleryFolders = document.getElementById("gallery-folders");
  const galleryGrid = document.getElementById("gallery-grid");
  if (galleryFolders && galleryGrid) {
    const items = galleryGrid.querySelectorAll("[data-folder]");
    galleryFolders.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery-folder");
      if (!btn) return;
      const folder = btn.getAttribute("data-folder");
      galleryFolders.querySelectorAll(".gallery-folder").forEach((b) => b.classList.remove("gallery-folder--active"));
      btn.classList.add("gallery-folder--active");
      items.forEach((item) => {
        if (folder === "all" || item.getAttribute("data-folder") === folder) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
    /* Reset folder items on page load */
    items.forEach((item) => item.style.display = "");
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

/* Lightbox functions */
function openLightbox(imageSrc, caption) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox__image");
  const lightboxCaption = document.getElementById("lightbox__caption");
  
  lightboxImg.src = imageSrc;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox(event) {
  if (event && event.target.id !== "lightbox") return;
  
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

/* Member Modal functions */
function openMemberModal(name, role, avatar, contact) {
  const modal = document.getElementById("member-modal");
  const avatarEl = document.getElementById("member-modal-avatar");
  const nameEl = document.getElementById("member-modal-name");
  const roleEl = document.getElementById("member-modal-role");
  const contactEl = document.getElementById("member-modal-contact");
  
  avatarEl.textContent = avatar;
  nameEl.textContent = name;
  roleEl.textContent = role;
  contactEl.textContent = "Contact: " + contact;
  
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMemberModal(event) {
  if (event && event.target.id !== "member-modal") return;
  
  const modal = document.getElementById("member-modal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

/* Attach click handlers to member cards */
document.addEventListener("DOMContentLoaded", () => {
  const memberCards = document.querySelectorAll(".member--clickable");
  memberCards.forEach((card) => {
    card.addEventListener("click", () => {
      const name = card.getAttribute("data-name");
      const role = card.getAttribute("data-role");
      const avatar = card.getAttribute("data-avatar");
      const contact = card.getAttribute("data-contact");
      openMemberModal(name, role, avatar, contact);
    });
  });
});
