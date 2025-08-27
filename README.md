# swt-documentation

**swt-documentation** is a modern, user-friendly API documentation generator, inspired by Swagger. It allows developers to quickly set up beautiful, interactive documentation for their APIs with minimal configuration. Perfect for teams who want a clean, easy-to-use interface for their endpoints.

---

## Features

- Easy to set up using a CLI
- Dynamic rendering of API endpoints, requests, and responses
- Supports **success** and **error responses**
- Sidebar navigation with category filtering
- Searchable API categories and requests
- Optional Authorization display
- Fully responsive and mobile-friendly design
- Smooth scrolling to selected API sections
- Internal locked CSS and JS (users can edit `global.css` and `endpoints.json`)

---

## Installation

Install via npm:

```bash
npm install swt-documentation
npx swt-docs
```

This will create a `documentation` folder in your project containing:

* `global.css` → editable CSS for customizing styles
* `endpoints.json` → editable file for your API endpoints

---

## Usage

### 1. Serve your docs in a Node.js project

```js
#!/usr/bin/env node
import express from "express";
import { serveDocs } from "swt-documentation";

const app = express();

// Serve documentation at /docs
serveDocs(app, "/docs");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Documentation available at http://localhost:${PORT}/docs`);
});
```

> `serveDocs(app, "/docs")` serves the documentation at the route `/docs`. You can change the route if needed.

---

### 2. Configure `endpoints.json`

This is where you define your API endpoints. Example:

```json
{
  "meta": {
    "title": "Documentation By SWT",
    "header": "Backend API Documentation By SWT",
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

> Update this file to reflect your API endpoints.

---

### 3. Customize `global.css` (optional)

Edit the `global.css` file in the `documentation` folder to change styles, colors, or fonts.

---

### 4. View your documentation

Start your Node.js app and open in a browser:

```
http://localhost:5000/docs
```

* Sidebar shows categories (filterable)
* Search API requests by title
* Click an endpoint to see details: request, response, and optional authorization
* Popup modal for code examples in Node.js, jQuery, Fetch, XMLHttpRequest, Python, etc.

---

### 5. Example Code Popup

Each endpoint has a **Code** button that opens a modal. Users can select from multiple languages:

- Node.js (Axios)
- jQuery AJAX
- JavaScript Fetch
- XMLHttpRequest
- Python (requests)

The popup automatically renders the corresponding code snippet for the selected language.

---

## Versions

### [1.2.0] - 2025-08-27
- Added popup code examples for multiple languages
- Refactored `serveDocs` to fix static file issues
- Improved sidebar search for categories and endpoints

### [1.1.0] - 2025-08-27
- Initial release supporting CLI and `serveDocs` integration

---

## Screenshots

Here’s what your documentation will look like once set up:

![swt-documentation-preview](https://via.placeholder.com/800x400.png?text=swt-documentation+Preview)
