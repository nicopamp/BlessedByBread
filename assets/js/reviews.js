document.addEventListener("DOMContentLoaded", function () {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGr4Pzhf4aAwVjw2yTxJZ0uKjHxH32C_TgxmT5ZhBTmKSLnF_VOYXkElnm8ZdwPhJQmz2Jc3OloTdN/pub?gid=885676157&single=true&output=csv";
  const grid = document.querySelector("[data-reviews-grid]");

  if (!grid) return;

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(cur);
        cur = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (cur !== "" || row.length > 0) {
          row.push(cur);
          rows.push(row);
          row = [];
          cur = "";
        }
      } else {
        cur += char;
      }
    }

    if (cur !== "" || row.length > 0) {
      row.push(cur);
    }

    if (row.length > 0) {
      rows.push(row);
    }

    return rows.filter(function (r) {
      return r.length > 0 && r.join("").trim() !== "";
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeQuote(value) {
    return String(value || "")
      .trim()
      .replace(/^["“”]+/, "")
      .replace(/["“”]+$/, "");
  }

  function isVisible(value) {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized !== "false" && normalized !== "no" && normalized !== "0";
  }

  function renderReview(review) {
    const quote = escapeHtml(normalizeQuote(review.quote));
    const name = escapeHtml(String(review.name || "").trim());
    const nameLine = name ? `<p class="testimonial-name">&ndash; ${name}</p>` : "";

    return `
      <article class="testimonial-card">
        <p>&ldquo;${quote}&rdquo;</p>
        ${nameLine}
      </article>
    `;
  }

  fetch(CSV_URL, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load reviews data");
      }
      return response.text();
    })
    .then(function (csvText) {
      const rows = parseCSV(csvText);

      if (rows.length < 2) {
        return;
      }

      const headers = rows[0].map(function (header) {
        return header.trim().toLowerCase();
      });

      const reviews = rows.slice(1)
        .map(function (values) {
          const review = {};
          headers.forEach(function (header, idx) {
            review[header] = (values[idx] || "").trim();
          });
          return review;
        })
        .filter(function (review) {
          return review.quote && isVisible(review.visible);
        });

      if (reviews.length === 0) {
        return;
      }

      grid.innerHTML = reviews.map(renderReview).join("");
    })
    .catch(function (error) {
      console.warn("[Reviews] Could not update from sheet:", error);
    });
});
