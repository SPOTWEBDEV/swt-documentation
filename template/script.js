document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("cards-container");
    const categoryList = document.getElementById("category-list");
    const categorySearchInput = document.querySelector(".sidebar #search-input"); // category search
    const requestSearchInput = document.querySelector("main #search-input"); // request search
    const titleEl = document.querySelector(".title");
    const descEl = document.querySelector(".description");

    if (!container) {
        console.error("cards-container not found!");
        return;
    }

    let currentCategory = "All"; // default category
    let endpoints = []; // keep all endpoints
    let requestQuery = ""; // search request query

    fetch("endpoints.json")
        .then(res => res.json())
        .then(data => {
            endpoints = Array.isArray(data.endpoints) ? data.endpoints : [];

            // Set dynamic title and description
            titleEl.textContent = data.meta?.header || "Documentation";
            descEl.textContent = data.meta?.description || "";
            document.title = data.meta?.title || "Documentation";

            // Extract unique categories
            let categories = [...new Set(endpoints.map(api => api.category))];
            categories.unshift("All");

            // Render sidebar categories
            function renderCategories(filteredCategories) {
                categoryList.innerHTML = "";

                filteredCategories.forEach(cat => {
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    a.href = "#";
                    a.textContent = cat;

                    if (cat.toLowerCase() === currentCategory.toLowerCase()) {
                        a.classList.add("active");
                    }

                    a.addEventListener("click", () => {
                        currentCategory = cat;
                        renderCategories(filteredCategories); // update active class
                        renderCards();
                    });

                    li.appendChild(a);
                    categoryList.appendChild(li);
                });
            }

            // Render API cards based on currentCategory + requestQuery
            function renderCards() {
                container.innerHTML = ""; // clear previous cards

                let filteredData =
                    currentCategory.toLowerCase() === "all"
                        ? endpoints
                        : endpoints.filter(api => api.category.toLowerCase() === currentCategory.toLowerCase());

                // filter further by request title query
                if (requestQuery) {
                    filteredData = filteredData.filter(api =>
                        api.title.toLowerCase().includes(requestQuery)
                    );
                }

                if (!Array.isArray(filteredData) || filteredData.length === 0) {
                    container.innerHTML = "<p>No APIs found.</p>";
                    return;
                }

                filteredData.forEach(api => {
                    const card = document.createElement("div");
                    card.classList.add("card");
                    card.setAttribute("data-category", api.category);

                    let errorHtml = "";
                    if (Array.isArray(api.responseError)) {
                        errorHtml = "<ul>";
                        api.responseError.forEach(err => {
                            errorHtml += `<li>${JSON.stringify(err)}</li>`;
                        });
                        errorHtml += "</ul>";
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
                        <button onclick='showCodeModal(${JSON.stringify(api)})'>Code</button>
                    `;
                    container.appendChild(card);
                });
            }

            // Initial render
            renderCategories(categories);
            renderCards();

            // Sidebar category search
            categorySearchInput.addEventListener("input", e => {
                const query = e.target.value.toLowerCase();
                const filtered = categories.filter(cat => cat.toLowerCase().includes(query));

                if (!filtered.some(cat => cat.toLowerCase() === currentCategory.toLowerCase())) {
                    currentCategory = "All";
                }

                renderCategories(filtered);
                renderCards();
            });

            // Request title search
            requestSearchInput.addEventListener("input", e => {
                requestQuery = e.target.value.toLowerCase();
                renderCards();
            });
        })
        .catch(err => console.error("Failed to load endpoints.json:", err));
});





// === Popup Modal Logic ===
const modal = document.getElementById("codeModal");
const closeBtn = document.querySelector(".close-btn");
const codeOutput = document.getElementById("codeOutput");
const codeSelect = document.getElementById("codeSelect");

// Example templates
const codeTemplates = {
    node: (api) => `
const axios = require('axios');

axios.${api.method.toLowerCase()}('{BaseUrl or Backend}${api.path}', ${api.requestBody || "{}"}, {
  headers: {
    ${api.authorization ? "Authorization: 'Bearer YOUR_TOKEN'," : ""}
  }
}).then(res => {
  console.log(res.data);
}).catch(err => {
  console.error(err);
});
  `,

    jquery: (api) => `
$.ajax({
  url: '{BaseUrl or Backend}${api.path}',
  type: '${api.method}',
  data: ${api.requestBody || "{}"},
  headers: {
    ${api.authorization ? "'Authorization': 'Bearer YOUR_TOKEN'" : ""}
  },
  success: function(res) {
    console.log(res);
  },
  error: function(err) {
    console.error(err);
  }
});
  `,

    fetch: (api) => `
fetch('{BaseUrl or Backend}${api.path}', {
  method: '${api.method}',
  headers: {
    'Content-Type': 'application/json',
    ${api.authorization ? "'Authorization': 'Bearer YOUR_TOKEN'," : ""}
  },
  body: JSON.stringify(${api.requestBody || "{}"})
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
  `,

    xhr: (api) => `
const xhr = new XMLHttpRequest();
xhr.open('${api.method}', '{BaseUrl or Backend}${api.path}');
${api.authorization ? "xhr.setRequestHeader('Authorization', 'Bearer YOUR_TOKEN');" : ""}
xhr.onload = function() {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.error(xhr.statusText);
  }
};
xhr.send(${api.requestBody ? `JSON.stringify(${api.requestBody})` : "null"});
  `,

    python: (api) => `
import requests

url = "{BaseUrl or Backend}${api.path}"
headers = {
  "Content-Type": "application/json",
  ${api.authorization ? '"Authorization": "Bearer YOUR_TOKEN",' : ""}
}
data = ${api.requestBody || "{}"}

response = requests.${api.method.toLowerCase()}(url, json=data, headers=headers)
print(response.json())
  `,
};

// Show modal and load code
window.showCodeModal = function (api) {
    modal.style.display = "block";
    const lang = codeSelect.value;
    codeOutput.textContent = codeTemplates[lang](api);

    // update code when user changes language
    codeSelect.onchange = () => {
        codeOutput.textContent = codeTemplates[codeSelect.value](api);
    };
};

// Close modal
closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
    if (e.target == modal) modal.style.display = "none";
};