
---

````markdown
# swt-documentation

**swt-documentation** is a modern, user-friendly API documentation generator, similar to Swagger. It allows developers to quickly set up beautiful, interactive documentation for their APIs with minimal configuration. Perfect for teams who want a clean, easy-to-use interface for their endpoints.

## Features

- Easy to set up and integrate with your project
- Dynamic rendering of endpoints, requests, and responses
- Supports **success** and **error responses**
- Sidebar navigation with category filtering
- Searchable API categories
- Optional Authorization display
- Fully responsive and mobile-friendly design
- Smooth scrolling to API sections

## Installation

Install via npm:

```bash
npm install swt-documentation
npx swt-docs
````

## Usage

1. Import the package and include it in your project:

```js
import "swt-documentation";
```

2. Create a `endpoints.json` file in your project root:

```json
{
  "meta": {
    "title": "Documentation By SWT",
    "description": "AI-native, beautiful API documentation made easy."
  },
  "endpoints": [
    {
      "category": "Auth",
      "title": "Login",
      "path": "/auth/login",
      "method": "POST",
      "summary": "Login user",
      "requestBody": "{ email, password }",
      "authorization": false,
      "responseSuccess": "{ \"status\": \"success\", \"token\": \"jwt_token_here\" }",
      "responseError": [
        { "status": "error", "message": "Invalid email" },
        { "status": "error", "message": "Password is required" }
      ]
    },
    {
      "category": "User",
      "title": "Get Profile",
      "path": "/user/profile",
      "method": "GET",
      "summary": "Get user profile",
      "requestBody": "-",
      "authorization": true,
      "responseSuccess": "{ \"id\": 1, \"name\": \"John Doe\", \"email\": \"john@example.com\" }",
      "responseError": [
        { "status": "error", "message": "User not found" }
      ]
    }
  ]
}
```

3. Add the HTML structure in your page:

```html
<h1 class="title"></h1>
<p class="description"></p>

<aside class="sidebar">
  <h2>Documentation</h2>
  <div class="search-box">
    <input type="text" id="search-input" placeholder="Search...">
  </div>
  <ul id="category-list"></ul>
</aside>

<div id="cards-container" class="container"></div>
```

4. Add the JS script:

```html
<script src="path/to/swt-documentation.js"></script>
```

---

## Live Preview

Here’s what your documentation will look like once set up:

![swt-documentation-preview](https://via.placeholder.com/800x400.png?text=swt-documentation+Preview)

* All API endpoints organized by category
* Requests, responses, and authorization info
* Filterable sidebar with search
* Smooth scrolling to selected category

---

## Example

```js
// Example usage in your project
import "swt-documentation";

// endpoints.json contains all your API endpoints
// HTML container structure is automatically populated with cards
```

---





