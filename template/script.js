fetch("endpoints.json")
  .then(res => res.json())
  .then(data => {
    const endpoints = Array.isArray(data.endpoints) ? data.endpoints : [];

    // ... then use `endpoints` everywhere
    let currentCategory = "All";

    const categoryList = document.getElementById("category-list");
    const container = document.getElementById("cards-container");
    const searchInput = document.getElementById("search-input");
    const titleEl = document.querySelector(".title");
    const descEl = document.querySelector(".description");

    // Set meta dynamically
    titleEl.textContent = data.meta?.title || "Documentation";
    descEl.textContent = data.meta?.description || "";

    // Extract unique categories
    let categories = [...new Set(endpoints.map(api => api.category))];
    categories.unshift("All");

    function renderCards() {
      container.innerHTML = "";
      const filteredData = currentCategory === "All"
        ? endpoints
        : endpoints.filter(api => api.category === currentCategory);

      if (!Array.isArray(filteredData) || filteredData.length === 0) {
        container.innerHTML = "<p>No APIs found in this category.</p>";
        return;
      }

      filteredData.forEach(api => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-category", api.category);

        // Handle multiple error responses
        let errorHtml = '';
        if (Array.isArray(api.responseError)) {
          errorHtml = '<ul>';
          api.responseError.forEach(err => {
            errorHtml += `<li>${JSON.stringify(err)}</li>`;
          });
          errorHtml += '</ul>';
        } else {
          errorHtml = api.responseError;
        }

        card.innerHTML = `
          <h3>${api.title}</h3>
          <p class="description">${api.summary}</p>
          <span class="api-method">${api.method}</span>
          <div class="api-path">${api.path}</div>
          ${api.requestBody && api.requestBody !== '-' ? `<div class="request"><strong>Request:</strong><br>${api.requestBody}</div>` : ''}
          ${api.authorization ? `<div class="authorization"><strong>Authorization:</strong><br>Bearer token</div>` : ''}
          <div class="response success"><strong>Response (Success):</strong><br>${api.responseSuccess}</div>
          <div class="response error"><strong>Response (Error):</strong><br>${errorHtml}</div>
          <button>Code</button>
        `;
        container.appendChild(card);
      });
    }

    // Continue with renderCategories, search, etc...
  })
  .catch(err => console.error("Failed to load endpoints.json:", err));
