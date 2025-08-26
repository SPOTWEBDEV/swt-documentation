 document.addEventListener("DOMContentLoaded", () => {
            const container = document.getElementById("cards-container");
            const categoryList = document.getElementById("category-list");
            const searchInput = document.getElementById("search-input");
            const titleEl = document.querySelector(".title");
            const descEl = document.querySelector(".description");

            if (!container) {
                console.error("cards-container not found!");
                return;
            }

            let currentCategory = "All"; // default category

            fetch("endpoints.json")
                .then(res => res.json())
                .then(data => {
                    const endpoints = Array.isArray(data.endpoints) ? data.endpoints : [];

                    console.log(data.meta.title)

                    // Set dynamic title and description
                    titleEl.textContent = data.meta?.title || "Documentation";
                    descEl.textContent = data.meta?.description || "";

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

                                // Smooth scroll to first card
                                const firstCard = document.querySelector(`.card[data-category='${cat}']`);
                                if (firstCard) firstCard.scrollIntoView({ behavior: "smooth" });
                            });

                            li.appendChild(a);
                            categoryList.appendChild(li);
                        });
                    }

                    // Render API cards based on currentCategory
                    function renderCards() {
                        container.innerHTML = ""; // clear previous cards

                        const filteredData =
                            currentCategory.toLowerCase() === "all"
                                ? endpoints
                                : endpoints.filter(api => api.category.toLowerCase() === currentCategory.toLowerCase());

                        if (!Array.isArray(filteredData) || filteredData.length === 0) {
                            container.innerHTML = "<p>No APIs found in this category.</p>";
                            return;
                        }

                        filteredData.forEach(api => {
                            const card = document.createElement("div");
                            card.classList.add("card");
                            card.setAttribute("data-category", api.category);

                            // Handle multiple error responses
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

            <button>Code</button>
          `;

                            container.appendChild(card);
                        });
                    }

                    // Initial render
                    renderCategories(categories);
                    renderCards();

                    // Search input filtering
                    searchInput.addEventListener("input", e => {
                        const query = e.target.value.toLowerCase();
                        const filtered = categories.filter(cat => cat.toLowerCase().includes(query));

                        // Reset currentCategory if it no longer exists
                        if (!filtered.some(cat => cat.toLowerCase() === currentCategory.toLowerCase())) {
                            currentCategory = "All";
                        }

                        renderCategories(filtered);
                        renderCards();
                    });
                })
                .catch(err => console.error("Failed to load endpoints.json:", err));
        });