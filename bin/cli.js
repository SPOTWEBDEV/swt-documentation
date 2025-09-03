#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDir = process.cwd();
const docsDir = path.join(projectDir, "documentation");

// Create the documentation folder if it doesn’t exist
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

// Copy only editable files
const editableFiles = ["global.css", "endpoints.json"];

editableFiles.forEach(file => {
  fs.copyFileSync(
    path.join(__dirname, "../template", file),
    path.join(docsDir, file)
  );
});

console.log("✅ Documentation folder created at:", docsDir);
console.log("👉 Edit endpoints.json to add your API endpoints.");
console.log("👉 Edit global.css to customize styles.");
