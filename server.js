// Tiny zero-dependency Node IP logger.
// - GET /         -> serves public/index.html, logs the visit
// - Any request   -> every page visit appends one line to ./visitors.txt
//
// Run:  node server.js   ->  http://localhost:3000

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const LOG_FILE = path.join(__dirname, "visitors.txt");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function clientIP(req) {
  // Behind hosts like Render/Railway the real IP arrives in this header:
  const fwd = req.headers["x-forwarded-for"];
  let ip = fwd ? fwd.split(",")[0].trim() : req.socket.remoteAddress || "unknown";
  if (ip.startsWith("::ffff:")) ip = ip.slice(7); // IPv4-mapped IPv6 -> plain IPv4
  return ip;
}

function logVisit(req) {
  const ip = clientIP(req);
  const ua = (req.headers["user-agent"] || "unknown").replace(/\s+/g, " ").trim();
  const time = new Date().toISOString();
  const line = `[${time}] IP: ${ip} | User-Agent: ${ua}`;
  fs.appendFile(LOG_FILE, line + "\n", (err) => {
    if (err) console.error("Could not write to visitors.txt:", err.message);
  });
  console.log("✅ logged -> " + line);
}

function serveFile(res, filePath) {
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  // Opening the page = one logged visit
  if (url.pathname === "/" || url.pathname === "/index.html") logVisit(req);

  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
  serveFile(res, path.join(PUBLIC_DIR, path.normalize(rel)));
});

server.listen(PORT, () => {
  console.log(`✅ IP logger running -> http://localhost:${PORT}`);
  console.log(`   Every visit is appended to: ${LOG_FILE}`);
});
