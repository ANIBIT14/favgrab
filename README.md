# FavGrab

Extract and download favicons from any website instantly. Export as PNG, WebP, or JPG in sizes from 16px to 256px.

**Live:** [favgrab.boldkit.dev](https://favgrab.boldkit.dev)

---

## Features

- **Any domain** — paste a URL or domain name and grab its favicon in seconds
- **Multiple sizes** — 16 × 16 up to 256 × 256 px
- **Format export** — download as PNG, WebP, or JPG
- **Recent history** — your last 6 lookups are saved in-session
- **No signup** — completely free, no account required

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- Vercel serverless function (CORS proxy for the favicon API)
- Google FaviconV2 API as the favicon source

## Development

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api/favicon` → `t0.gstatic.com/faviconV2` automatically, so no environment variables are needed for local development.

## Deployment

Push to a GitHub repo and connect it to [Vercel](https://vercel.com). Vercel auto-detects Vite and runs `npm run build`. The `vercel.json` handles SPA routing (no blank page on reload) and wires up the serverless API proxy.

```
vercel --prod
```

## How it works

1. User enters a domain or URL
2. The app calls `/api/favicon?url=DOMAIN&size=SIZE` (a Vercel serverless function)
3. The function fetches from Google's FaviconV2 API and proxies it back with proper CORS headers
4. The browser draws the image onto a `<canvas>` to convert it to the chosen format, then triggers a download

---

Made by [Vanikya AI](https://vanikya.ai) · [@vanikyaai](https://x.com/vanikyaai)
