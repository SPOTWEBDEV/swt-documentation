import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveDocs(app, route = "/docs") {
  const templateDir = path.join(__dirname, "../template");
  const router = express.Router();

  // Serve static files (CSS, JS)
  router.use(express.static(templateDir));

  // Serve index.html
  router.get("/", (req, res) => {
    res.sendFile(path.join(templateDir, "index.html"));
  });

  app.use(route, router);
}
