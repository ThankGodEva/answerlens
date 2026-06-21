import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add body parsers with generous limits for high-resolution base64 images
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API proxy route to bypass all browser-side CORS blocks
  app.post("/api/solve-question", async (req, res) => {
    try {
      console.log("[Proxy] Forwarding solve-question request to n8n...");
      const targetUrl = 'https://n8n.srv1108528.hstgr.cloud/webhook/solve-question';

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(req.body)
      });

      console.log(`[Proxy] n8n responded with status ${response.status}`);
      const text = await response.text();
      
      // Relay the exact response and status code
      res.status(response.status).send(text);
    } catch (err: any) {
      console.error("[Proxy Error] failed to reach n8n webhook:", err);
      res.status(502).json({
        error: "Bad Gateway",
        message: "The backend proxy server was unable to contact the n8n webhook. Please confirm the n8n service is running and CORS/public routes are allowed.",
        details: err?.message || String(err)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
