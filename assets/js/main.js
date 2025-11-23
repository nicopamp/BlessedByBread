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
     Order For This Week — panel
  ----------------------------- */
  const orderBtn = document.getElementById("order-for-week-btn");
  const panel = document.getElementById("order-choice-panel");
  const closeBtn = document.getElementById("order-choice-close");
  const emailBtn = document.getElementById("order-email-btn");
  const textBtn = document.getElementById("order-text-btn");

  if (orderBtn && panel && closeBtn && emailBtn && textBtn) {
    const ORDER_TEMPLATE = encodeURIComponent(
`Hi Lise! This is <your full name>. I'd like to place an order for the following items:

👉 Artisan White
Quantity:

👉 Artisan White/Wheat
Quantity:

👉 Focaccia
Quantity / Flavor:

👉 Cinnamon Rolls
Quantity (half dozen / full dozen):

👉 Rosemary Olive Oil Bread
Quantity:

👉 Sandwich Loaf
White or Wheat?
Quantity:

👉 Seeded Sandwich Loaf
Quantity:

👉 Bread of the Month
Quantity:

Pickup/Delivery Date Requested:

Any Notes or Special Requests:

Thank you!`
    );

    const MAILTO = `mailto:blessedbybread@gmail.com?subject=Weekly%20Bread%20Order&body=${ORDER_TEMPLATE}`;
    const SMS = `sms:17036772366?&body=${ORDER_TEMPLATE}`;

    function openPanel() {
      panel.classList.add("open");
      panel.removeAttribute("hidden");
      panel.setAttribute("aria-hidden", "false");
    }

    function closePanel() {
      panel.classList.remove("open");
      panel.setAttribute("hidden", "");
      panel.setAttribute("aria-hidden", "true");
    }

    orderBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isHidden = panel.hasAttribute("hidden");
      if (isHidden) {
        openPanel();
      } else {
        closePanel();
      }
    });

    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closePanel();
    });

    emailBtn.addEventListener("click", () => {
      window.location.href = MAILTO;
      closePanel();
    });

    textBtn.addEventListener("click", () => {
      window.location.href = SMS;
      closePanel();
    });
  }
});