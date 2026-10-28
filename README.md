# 👀 ip-logger

A tiny **Node.js** website that tells every visitor exactly one thing:

> this site logs your ip

…and then logs their **IP address, browser and timestamp** to a plain
`visitors.txt` file on the server. No CSS, no JS in the page, no dependencies.

## 🚀 Run it

```bash
node server.js
```

Open **http://localhost:3000**. Every page visit appends one line to
`visitors.txt` next to `server.js` (git-ignored, so logs never get committed).

```
[2026-10-28T14:59:54.565Z] IP: 203.0.113.42 | User-Agent: Mozilla/5.0 ...
```

## 📦 Push to GitHub

```bash
git add .
git commit -m "Simplify: plain notice page, Node server"
git push
```

## ☁️ Hosting notes

- **GitHub Pages will NOT work** — it can't write a `.txt` file. Run this on
  any Node host: [Render](https://render.com), [Railway](https://railway.app),
  Fly.io, a VPS, etc. Start command: `node server.js` (respects `PORT`).
- The real visitor IP arrives in the `X-Forwarded-For` header on those hosts —
  the server already reads it, so it works as-is.

## ⚖️ Legal note

An IP address is personal data in many jurisdictions (e.g. GDPR). The visitor
is told up front that their visit is logged — keep it that way, and check your
local rules before running this publicly.
