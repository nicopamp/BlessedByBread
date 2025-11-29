document.addEventListener("DOMContentLoaded", function () {
  // Your published Google Sheets CSV URL
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGr4Pzhf4aAwVjw2yTxJZ0uKjHxH32C_TgxmT5ZhBTmKSLnF_VOYXkElnm8ZdwPhJQmz2Jc3OloTdN/pub?output=csv";

  // Minimal CSV parser that handles quoted fields with commas
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
          // Escaped quote ("")
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
      rows.push(row);
    }

    return rows.filter(r => r.length > 0 && r.join("").trim() !== "");
  }

  function setBomField(field, value) {
    const el = document.querySelector(`[data-bom="${field}"]`);
    if (el && value && value.trim() !== "") {
      el.textContent = value;
    }
  }

  function setBomImage(url, alt) {
    if (!url || !url.trim()) {
      // No image URL provided -> keep the default HTML image
      return;
    }

    const img = document.querySelector("[data-bom-image]");
    if (!img) return;

    // Use the provided URL
    img.src = url.trim();

    // Remove any srcset/sizes so the browser doesn't override src
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");

    if (alt && alt.trim()) {
      img.alt = alt.trim();
    }
  }

  fetch(CSV_URL, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load Bread of the Month data");
      }
      return response.text();
    })
    .then(function (csvText) {
      const rows = parseCSV(csvText);

      if (rows.length < 2) {
        throw new Error("No data rows found for Bread of the Month");
      }

      const headers = rows[0].map(h => h.trim().toLowerCase());
      const values = rows[1];

      const data = {};
      headers.forEach(function (header, idx) {
        data[header] = (values[idx] || "").trim();
      });

      // Expected headers:
      // month, name, description, price, order_note, image_url, image_alt
      setBomField("name", data.name);
      setBomField("description", data.description);
      setBomField("price", data.price);
      setBomField("order_note", data.order_note);
      setBomField("month", data.month);

      setBomImage(data.image_url, data.image_alt);
    })
    .catch(function (error) {
      console.warn("[Bread of the Month] Could not update from sheet:", error);
      // Fallback: static HTML stays visible
    });
});