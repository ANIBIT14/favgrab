# FavGrab

Free browser-based toolkit for web developers. Download favicons from any domain **and** convert images between PNG, JPG, WebP, AVIF, HEIC, TIFF, BMP, and ICO — all 100% in the browser, no uploads.

**Live:** [favgrab.boldkit.dev](https://favgrab.boldkit.dev)

---

## Tools

### Favicon Downloader — [`/`](https://favgrab.boldkit.dev/)

- Paste a URL or domain, grab its favicon in seconds
- Sizes from 16 × 16 up to 256 × 256 px
- Export as PNG, WebP, or JPG
- In-session history of your last 6 lookups

### Image Converter — [`/convert`](https://favgrab.boldkit.dev/convert)

- **Input formats:** PNG, JPG, WebP, AVIF, GIF (first frame), BMP, ICO, **HEIC**, **HEIF**, **TIFF**
- **Output formats:** PNG, JPG, WebP, AVIF, BMP, ICO
- **Quality slider** (1–100) for lossy outputs, default 95
- **Optional resize** with aspect ratio preserved (downscale only)
- **Batch conversion** with streaming ZIP download
- **Native OS Save As dialog** where supported (Chrome, Edge, Opera, Arc)
- **Works offline** after first visit — WASM codecs lazy-loaded and cached
- **Zero uploads** — files never leave your device

## Tech Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) + [BoldKit](https://boldkit.dev) neubrutalism components
- Tiny path-based router (no `react-router-dom`)
- Conversion engine: native `createImageBitmap` + Canvas; lazy WASM codecs for HEIC ([`libheif-js`](https://github.com/catdad-experiments/libheif-js)), TIFF ([`utif2`](https://github.com/twardoch/utif2)), and AVIF encode ([`@jsquash/avif`](https://github.com/jamsinclair/jSquash))
- Streaming ZIP via [`client-zip`](https://github.com/Touffy/client-zip)
- Native OS save picker via the File System Access API (with `<a download>` fallback)
- Serverless function as CORS proxy for the favicon API (Google FaviconV2 upstream)

## Development

```bash
npm install
npm run dev
```

Vite dev server starts on `http://localhost:5173` and proxies `/api/favicon` → Google's FaviconV2 service automatically.

```bash
npm run build   # production build to ./dist
npm run preview # serve the built bundle
```

## SEO

The site ships with a full modern SEO surface:

- Per-route `<title>`, `<meta description>`, canonical, OG, and Twitter tags
- Structured data: `WebApplication`, `SoftwareApplication`, `Organization`, `BreadcrumbList`, `HowTo`, and `FAQPage`
- Visual + structured breadcrumbs on subpages
- [`sitemap.xml`](https://favgrab.boldkit.dev/sitemap.xml) with image entries
- AI-crawler-friendly [`/llms.txt`](https://favgrab.boldkit.dev/llms.txt) and [`/llms-full.txt`](https://favgrab.boldkit.dev/llms-full.txt)
- `robots.txt` explicitly allows GPTBot, ClaudeBot, Google-Extended, PerplexityBot, and CCBot

## How the converter works

1. The user drops one or more files. Each file's format is detected from its magic bytes (with extension fallback).
2. The right decoder is selected: native `createImageBitmap` for common formats, dynamically imported WASM for HEIC/HEIF/TIFF.
3. If resize is enabled and the source exceeds the max side, the bitmap is downscaled on a canvas with `imageSmoothingQuality = 'high'`. Aspect ratio is always preserved.
4. The chosen encoder writes a `Blob`: Canvas `toBlob` for PNG/JPG/WebP, `@jsquash/avif` for AVIF, custom writers for BMP and ICO.
5. Download triggers `window.showSaveFilePicker` where available (native OS Save As); otherwise falls back to `<a download>`.
6. Batch downloads stream through `client-zip` directly into the file system writer, so multi-file archives don't have to fit in memory.

---

Made by [ANIBIT14](https://github.com/ANIBIT14) · [@vanikyaai](https://x.com/vanikyaai) · UI by [BoldKit](https://boldkit.dev)
