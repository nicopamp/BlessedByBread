// main.js — Blessed by Bread

document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------
     Footer year
  ----------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -----------------------------
     Mobile Navigation
  ----------------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close nav when a link is tapped
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -----------------------------
     Data Saver placeholders
  ----------------------------- */
  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (connection && connection.saveData) {
    document.querySelectorAll("img[data-low-src]").forEach((img) => {
      const lowSrc = img.getAttribute("data-low-src");
      if (!lowSrc) return;

      img.dataset.fullSrc = img.src;
      img.src = lowSrc;
      img.removeAttribute("srcset");
    });
  }

});
