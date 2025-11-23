// main.js – shared site behavior

(function () {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            menu.classList.toggle('open');
        });
    }
})();

// ------------------------------------------------------
// "Order for This Week": show options, then email or SMS
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("orderOptionsToggle");
    const panel = document.getElementById("orderOptionsPanel");

    if (!toggleBtn || !panel) return;

    const template = encodeURIComponent(
        `Hi Lise! This is <your full name>. I’d like to place an order for the following items:

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

    const emailLink = `mailto:blessedbybread@gmail.com?subject=Weekly%20Bread%20Order&body=${template}`;
    const smsLink = `sms:17036772366?&body=${template}`;

    // Toggle the panel open/closed
    toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const isHidden = panel.hasAttribute("hidden");
        if (isHidden) {
            panel.removeAttribute("hidden");
            panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
            panel.setAttribute("hidden", "");
        }
    });

    // Close button inside the panel (the "×")
    const closeBtn = panel.querySelector(".order-options-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            panel.setAttribute("hidden", "");
        });
    }

    // Handle clicks on "Email Lise" and "Text Lise"
    panel.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;

        const method = target.dataset.orderMethod;
        if (!method) return;

        if (method === "email") {
            window.location.href = emailLink;
        } else if (method === "sms") {
            window.location.href = smsLink;
        }
    });
});