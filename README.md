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
- [BoldKit](https://boldkit.dev) neubrutalism components
- Serverless function as CORS proxy for the favicon API
- Google FaviconV2 API as the favicon source

## Development

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api/favicon` → `t0.gstatic.com/faviconV2` automatically, so no environment variables are needed for local development.

## How it works

1. User enters a domain or URL
2. The app fetches `/api/favicon?url=DOMAIN&size=SIZE` via a serverless proxy
3. The proxy fetches from Google's FaviconV2 API and returns it with proper CORS headers
4. The browser draws the image onto a `<canvas>` to convert it to the chosen format, then triggers a download

---

Made by [ANIBIT14](https://github.com/ANIBIT14) · [@vanikyaai](https://x.com/vanikyaai)
