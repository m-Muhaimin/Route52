import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware with increased limits if needed
  app.use(express.json());

  // Proxy route for n8n chat webhook
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId, customWebhookUrl } = req.body;
      
      const n8nUrl = customWebhookUrl || "https://n8n-m1if.muhaimin.dev/webhook/bd-native-agent-chat/chat";
      
      // Create standard payload for n8n AI Chat Trigger
      const payload = {
        action: "sendMessage",
        chatInput: message,
        sessionId: sessionId || "default-session"
      };

      console.log(`[Proxy] Sending message to webhook: "${n8nUrl}"`);
      console.log(`[Proxy] Chat Input: "${message.substring(0, 50)}..."`);

      const response = await fetch(n8nUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error(`[Proxy] n8n responded with error status: ${response.status}`);
        const errorText = await response.text();
        throw new Error(`n8n webhook returned status ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { output: text };
      }

      console.log(`[Proxy] Successfully received response from n8n`);
      res.json(data);
    } catch (error: any) {
      console.error("[Proxy] Error calling n8n webhook:", error);
      res.status(500).json({ error: error.message || "Failed to communicate with n8n" });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
