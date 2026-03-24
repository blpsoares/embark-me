import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const DIST = join(import.meta.dirname, "dist");
const PORT = Number(process.env.PORT) || 8080;

const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
};

function serveFile(filePath: string): Response | null {
  if (!existsSync(filePath)) return null;
  const content = readFileSync(filePath);
  const ext = extname(filePath);
  const mime = mimeTypes[ext] ?? "application/octet-stream";
  return new Response(content, {
    headers: { "Content-Type": mime, "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable" },
  });
}

Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Try serving the exact file
    const exactPath = join(DIST, pathname);
    const exact = serveFile(exactPath);
    if (exact) return exact;

    // SPA fallback — serve index.html for all non-file routes
    const indexHtml = readFileSync(join(DIST, "index.html"));
    return new Response(indexHtml, {
      headers: { "Content-Type": "text/html", "Cache-Control": "no-cache" },
    });
  },
});

console.log(`Serving on http://0.0.0.0:${PORT}`);
