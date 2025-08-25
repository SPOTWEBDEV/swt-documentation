document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("docs-container");

  if (!container) {
    console.error("docs-container not found!");
    return;
  }

  // Load endpoints.json
  fetch("./endpoints.json")
    .then((res) => res.json())
    .then((endpoints) => {
      renderDocs(endpoints, container);
    })
    .catch((err) => console.error("Error loading endpoints:", err));
});

/**
 * Renders endpoints grouped by category
 * @param {Array} endpoints - Array of endpoint objects
 * @param {HTMLElement} container - DOM container to render into
 */
function renderDocs(endpoints, container) {
  container.innerHTML = "";

  const grouped = endpoints.reduce((acc, ep) => {
    const category = ep.category || "Default";
    if (!acc[category]) acc[category] = [];
    acc[category].push(ep);
    return acc;
  }, {});

  for (const [category, eps] of Object.entries(grouped)) {
    const categoryEl = document.createElement("div");
    categoryEl.className = "category";

    const title = document.createElement("h2");
    title.textContent = category;
    categoryEl.appendChild(title);

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "cards-container";

    eps.forEach((ep) => {
      const card = document.createElement("div");
      card.className = "endpoint-card";

      card.innerHTML = `
        <span class="method">${ep.method.toUpperCase()}</span>
        <h3 class="path">${ep.path}</h3>
        <p class="summary">${ep.summary || "-"}</p>
      `;

      cardsContainer.appendChild(card);
    });

    categoryEl.appendChild(cardsContainer);
    container.appendChild(categoryEl);
  }
}

