#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDir = process.cwd();
const docsDir = path.join(projectDir, "documentation");

// Create the documentation folder if it doesn’t exist
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

// Copy index.html
fs.copyFileSync(
  path.join(__dirname, "../template/index.html"),
  path.join(docsDir, "index.html")
);

// Copy only global.css (editable by user)
fs.copyFileSync(
  path.join(__dirname, "../template/global.css"),
  path.join(docsDir, "global.css")
);

// Copy endpoints.json (editable by user if needed)
fs.copyFileSync(
  path.join(__dirname, "../template/endpoints.json"),
  path.join(docsDir, "endpoints.json")
);

console.log("✅ Documentation folder created at:", docsDir);
console.log("👉 Edit endpoints.json to add your API endpoints.");