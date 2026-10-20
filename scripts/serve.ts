import { resolve, extname, sep } from "node:path";

const root = resolve(import.meta.dir, "..", Bun.argv.includes("--dist") ? "dist" : "public");
const port = Number(process.env.PORT || 4174);
const mime: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const server = Bun.serve({
  hostname: "127.0.0.1",
  port,
  async fetch(request) {
    let pathname: string;
    try {
      pathname = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response("Bad request", { status: 400 });
    }
    const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const filePath = resolve(root, relative);
    if (!filePath.startsWith(root + sep)) return new Response("Forbidden", { status: 403 });
    const file = Bun.file(filePath);
    if (!await file.exists()) return new Response("Not found", { status: 404 });
    return new Response(file, {
      headers: {
        "content-type": mime[extname(filePath)] || "application/octet-stream",
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });
  },
});
console.log(`magenta preview: ${server.url}`);
