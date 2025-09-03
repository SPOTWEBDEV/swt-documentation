import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveDocs(app, route = "/docs") {
  const projectRoot = process.cwd();
  const userDocsDir = path.join(projectRoot, "documentation");
  const templateDir = path.join(__dirname, "../template");

  const router = express.Router();

  // --- 1. Serve global.css (prefer user's version) ---
  router.get("/global.css", (req, res) => {
    const userCss = path.join(userDocsDir, "global.css");
    if (fs.existsSync(userCss)) {
      return res.sendFile(userCss);
    }
    res.sendFile(path.join(templateDir, "global.css"));
  });

  // --- 2. Serve endpoints.json (prefer user's version) ---
  router.get("/endpoints.json", (req, res) => {
    const userEndpoint = path.join(userDocsDir, "endpoints.json");
    if (fs.existsSync(userEndpoint)) {
      return res.sendFile(userEndpoint);
    }
    res.sendFile(path.join(templateDir, "endpoints.json"));
  });

  // --- 3. Serve other static assets from template ---
  router.use(express.static(templateDir));

  // --- 4. Live reload (Server-Sent Events) ---
  const clients = [];
  router.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    clients.push(res);

    req.on("close", () => {
      const idx = clients.indexOf(res);
      if (idx !== -1) clients.splice(idx, 1);
    });
  });

  function notifyClients(triggerFile) {
    console.log(`[swt-docs] Change detected in ${triggerFile}, reloading docs...`);
    for (const client of clients) {
      client.write("data: reload\n\n");
    }
  }

  // --- 5. Watch endpoints.json & global.css ---
  if (fs.existsSync(userDocsDir)) {
    let reloadTimeout;
    function scheduleReload(triggerFile) {
      clearTimeout(reloadTimeout);
      reloadTimeout = setTimeout(() => notifyClients(triggerFile), 300);
    }

    fs.watch(userDocsDir, (eventType, filename) => {
      if (!filename) return;
      if (["endpoints.json", "global.css"].includes(filename)) {
        scheduleReload(filename);
      }
    });

    console.log("[swt-docs] Watching documentation folder for changes...");
  } else {
    console.log("[swt-docs] No documentation folder found. Skipping watch.");
  }

  // --- 6. Serve index.html with auto-reload script injected ---
  router.get("/", (req, res) => {
    const indexPath = path.join(templateDir, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");

    const reloadScript = `
      <script>
        const evtSource = new EventSource("${route}/events");
        evtSource.onmessage = function(e) {
          if (e.data === "reload") {
            console.log("[swt-docs] Reloading docs in browser...");
            window.location.reload();
          }
        };
      </script>
    `;

    html = html.replace("</body>", `${reloadScript}</body>`);
    res.send(html);
  });

  // --- 7. Mount router on provided route ---
  app.use(route, router);
}
