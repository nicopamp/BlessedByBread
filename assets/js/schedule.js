(function () {
    // TODO: paste your Apps Script Web App URL here:
    const SCHEDULE_URL = "https://script.google.com/macros/s/AKfycbz97bzakTy7J3PmSSoPTHKbWkd2k1sSI2bfE6BG3wzjF3CLyMBTgRCa30Lvk3qWuPsY/exec";

    const monthTitleEl = document.getElementById("schedule-month-title");
    const listEl = document.getElementById("schedule-list");
    const closureEl = document.getElementById("schedule-closure");

    if (!monthTitleEl || !listEl || !closureEl) return;

    function formatDate(iso) {
        // iso: yyyy-mm-dd
        const [y, m, d] = iso.split("-").map(Number);
        const dt = new Date(y, m - 1, d);
        return dt.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    }

    function escapeHtml(s) {
        return String(s)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    async function loadSchedule() {
        try {
            const res = await fetch(SCHEDULE_URL, { cache: "no-store" });
            if (!res.ok) throw new Error(`Schedule fetch failed: ${res.status}`);
            const data = await res.json();

            // Title
            const label = (data.monthLabel || "").trim();
            if (label) {
                monthTitleEl.textContent = label;
            }
            // Items
            const items = Array.isArray(data.items) ? data.items : [];
            const dateItems = items.filter(i => i.date);
            const messageItems = items.filter(i => !i.date && (i.note || i.label));

            if (dateItems.length === 0 && messageItems.length === 0) {
                listEl.innerHTML = "<li>Schedule unavailable.</li>";
                return;
            }

            // Build date list
            listEl.innerHTML = dateItems.map(i => {
                const dateText = formatDate(i.date);
                const note = i.note ? ` <em>(${escapeHtml(i.note)})</em>` : "";
                return `<li>${escapeHtml(dateText)}${note}</li>`;
            }).join("");

            // Closure / special message (first message item)
            const msg = messageItems[0];
            if (msg && (msg.note || msg.label)) {
                const text = msg.note || msg.label;
                closureEl.innerHTML = `<strong>${escapeHtml(text)}</strong>`;
                closureEl.style.display = "";
            } else {
                closureEl.style.display = "none";
            }
        } catch (err) {
            // Fail gracefully: show a friendly fallback
            listEl.innerHTML = "<li>Schedule unavailable right now — please check back soon.</li>";
            closureEl.style.display = "none";
            // Optional: console log for debugging
            console.warn(err);
        }
    }

    loadSchedule();
})();