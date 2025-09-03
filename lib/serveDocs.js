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

  // --- 2. Serve endpoint.json (prefer user's version) ---
  router.get("/endpoint.json", (req, res) => {
    const userEndpoint = path.join(userDocsDir, "endpoint.json");
    if (fs.existsSync(userEndpoint)) {
      return res.sendFile(userEndpoint);
    }
    res.sendFile(path.join(templateDir, "endpoint.json"));
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

  function notifyClients() {
    for (const client of clients) {
      client.write("data: reload\n\n");
    }
  }

  // Watch only endpoint.json and global.css in documentation/
  if (fs.existsSync(userDocsDir)) {
    fs.watch(userDocsDir, (eventType, filename) => {
      if (["endpoint.json", "global.css"].includes(filename)) {
        notifyClients();
      }
    });
  }

  // --- 5. Serve index.html with reload script injected ---
  router.get("/", (req, res) => {
    const indexPath = path.join(templateDir, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");

    // Inject auto-reload script before </body>
    const reloadScript = `
      <script>
        const evtSource = new EventSource("${route}/events");
        evtSource.onmessage = function(e) {
          if (e.data === "reload") {
            window.location.reload();
          }
        };
      </script>
    `;

    html = html.replace("</body>", `${reloadScript}</body>`);
    res.send(html);
  });

  app.use(route, router);
}
