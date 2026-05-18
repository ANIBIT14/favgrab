# Image Converter — Design Spec

**Date:** 2026-05-18
**Status:** Approved (brainstorm)
**Scope:** Add a fully client-side image format converter as a second tool on favicon-grab, served at `/convert`.

---

## 1. Goals

- Add an **Image Converter** tool to favicon-grab that runs **entirely in the browser** (no server upload, works offline once cached).
- Support a wide range of input formats (incl. Apple HEIC and TIFF) and the most common web output formats.
- Provide quality control, optional resize, and batch conversion with ZIP download.
- On download, trigger the **OS native "Save As" dialog** where browser APIs allow.
- Visually cohesive with the existing favicon-grab brand.

## 2. Non-Goals

- No HEIC or TIFF **output** (no viable client-side encoders worth shipping).
- No animated GIF/WebP/APNG re-encoding (static first frame only on decode).
- No PDF or SVG handling in v1.
- No account, no history persistence beyond the in-memory session.
- No server-side fallback — strictly client-side.

## 3. User Stories

1. As a user I drop one or more images into the page, pick an output format, and download converted files without any upload occurring.
2. As a user with `.heic` photos from my iPhone, I convert them to `.jpg` or `.png` in the browser.
3. As a user with a 4000px photo, I resize the max side to 1024px while converting to WebP at quality 80.
4. As a user converting 20 files at once, I click "Download all" and get a single `.zip`.
5. As a user, when I click download, my OS Save As dialog appears so I can choose the destination (where supported).
6. As a user offline, the converter still works (no network requests required after first load).

## 4. Information Architecture & Routing

The app currently has one page in `src/App.tsx`. We restructure as:

```
src/
  App.tsx                    # routing shell (~30 LOC)
  pages/
    Home.tsx                 # existing favicon tool content (moved out of App.tsx)
    Convert.tsx              # new image converter page
  components/
    Layout.tsx               # shared header + footer
    ui/                      # existing primitives
  lib/
    convert/
      decode.ts
      encode.ts
      pipeline.ts
      types.ts
      formats.ts
      encoders/
        ico.ts
        bmp.ts
      saveAs.ts
      zipDownload.ts
```

**Routing approach:** path-based switch in `App.tsx` using `window.location.pathname` and a `popstate` listener. A small `navigate(path)` helper does `history.pushState` + dispatches an internal event so links update without a reload. No `react-router-dom` dependency.

Routes:
- `/` → `Home`
- `/convert` → `Convert`
- anything else → `Home` (treat as 404-soft, no separate page in v1)

`vercel.json` already SPA-rewrites all paths to `index.html` — verify and adjust if needed so `/convert` deep links work in production.

## 5. Conversion Engine

All conversion logic lives under `src/lib/convert/` as pure, testable functions. UI never touches Canvas or WASM directly.

### 5.1 Types (`types.ts`)

```ts
export type InputFormat =
  | 'png' | 'jpeg' | 'webp' | 'avif' | 'gif' | 'bmp' | 'ico'
  | 'heic' | 'heif' | 'tiff';

export type OutputFormat =
  | 'png' | 'jpeg' | 'webp' | 'avif' | 'bmp' | 'ico';

export interface ConvertOptions {
  output: OutputFormat;
  quality?: number;          // 1–100, only used for lossy outputs
  resize?: {
    maxSide: number;         // pixels; preserves aspect ratio
  };
}

export interface ConvertResult {
  blob: Blob;
  filename: string;          // suggested filename with new extension
  width: number;
  height: number;
}
```

### 5.2 Decode (`decode.ts`)

Input: `File`. Output: `{ bitmap: ImageBitmap, sourceFormat: InputFormat }`.

Detection: first try MIME type; if empty/wrong, sniff magic bytes (first 12 bytes) to identify the real format. Then:

| Format | Decoder |
|---|---|
| png, jpeg, webp, avif, gif, bmp, ico | `createImageBitmap(file)` — native |
| heic, heif | `libheif-js` (dynamic import) |
| tiff | `utif2` (dynamic import) |

Dynamic imports keep these out of the initial bundle; they load only when a user drops that file type. Decoded pixels are normalized to an `ImageBitmap` so downstream code is format-agnostic.

For multi-frame inputs (GIF, animated WebP, multi-page TIFF, HEIC bursts) we use the **first frame only** in v1 and surface a small "first frame only" notice in the UI.

### 5.3 Encode (`encode.ts`)

Input: `ImageBitmap` + `ConvertOptions`. Output: `Blob`.

| Format | Encoder |
|---|---|
| png | Canvas `toBlob('image/png')` |
| jpeg | Canvas `toBlob('image/jpeg', quality)` |
| webp | Canvas `toBlob('image/webp', quality)` |
| avif | `@jsquash/avif` (dynamic import) — Canvas `toBlob('image/avif')` is unreliable across browsers |
| bmp | Custom encoder in `encoders/bmp.ts` (BMP24 from ImageData, ~60 LOC) |
| ico | Custom encoder in `encoders/ico.ts` — wraps a PNG payload in an `.ico` container (single image, ~50 LOC) |

Quality slider applies only to `jpeg`, `webp`, `avif`; UI hides it for others.

### 5.4 Pipeline (`pipeline.ts`)

```ts
export async function convert(file: File, opts: ConvertOptions): Promise<ConvertResult>
```

Steps:
1. Decode → `ImageBitmap`.
2. If `opts.resize.maxSide` is set and either dimension exceeds it, scale on an offscreen canvas, preserving aspect ratio.
3. Encode → `Blob`.
4. Build a suggested filename: original basename + new extension.

All steps are pure; errors throw typed `ConvertError` instances surfaced to the UI.

### 5.5 Format support matrix (`formats.ts`)

Single source of truth describing each format's display name, MIME, extension, whether it supports quality, and whether it's available as input/output. The UI reads from this so adding a format later is one edit.

## 6. Save As Behavior (`saveAs.ts`)

Goal: trigger the **native OS Save dialog** so users can choose the destination.

- **Primary:** `window.showSaveFilePicker({ suggestedName, types: [...] })` — File System Access API. Works in Chrome, Edge, Opera, Arc on desktop. Returns a writable stream; we pipe the blob in.
- **Fallback:** classic `<a download>` click for Safari, Firefox, all mobile browsers. In these browsers the OS dialog only appears if the user has enabled the browser's "ask where to save each file" setting; we show a small one-time tooltip explaining this on first download in those browsers.
- **Cancellation:** if the user dismisses the picker (`AbortError`), we silently no-op (no error toast).

Same logic is used for the ZIP batch download.

## 7. Batch Conversion + ZIP (`zipDownload.ts`)

- Multiple files convert sequentially in a `for await` loop with a per-file progress callback (keeps memory predictable; we can parallelize later if needed).
- For ZIP we use **`client-zip`** (~2KB, streaming, MIT). It returns a `ReadableStream` we can pipe directly into the File System Access writable, so the browser doesn't have to hold the whole archive in memory.
- ZIP filename: `converted-YYYYMMDD-HHmm.zip`.

## 8. UI Design

Reuses the existing component primitives (`Button`, `Input`, `Card`, `Badge`) and the current typography/color tokens — no new design system. The page lives at `/convert` and shares the header/footer with `/`.

### 8.1 Layout (top to bottom)

1. **Header** — same as home, plus active-state styling on the "Image Converter" link.
2. **Hero**
   - Title: "Image Converter"
   - Subtitle: "Convert between PNG, JPG, WebP, AVIF, HEIC, TIFF, BMP, and ICO — 100% in your browser. No uploads, works offline."
   - Small badges: `Local` · `Offline` · `Private`
3. **Dropzone**
   - Dashed border card. Drag-over state changes border + background.
   - Click to open native file picker (multi-select). `accept` includes all input MIME types + extensions for HEIC/TIFF.
4. **File list** (appears once files are added)
   - Per file: thumbnail (from decoded bitmap, lazy), filename, detected source format badge, size in KB, remove (×) button.
   - "Clear all" link in the corner.
5. **Settings panel** (sticky on desktop, inline on mobile)
   - Output format: segmented button group (PNG · JPG · WebP · AVIF · BMP · ICO).
   - Quality slider (1–100, default 90) — visible only for JPG/WebP/AVIF.
   - Resize: toggle + numeric input for max side (px). Aspect ratio always preserved.
6. **Convert button** — primary CTA. Disabled while a conversion is running.
7. **Results section** — appears after conversion completes.
   - Per file: thumbnail, new size, "Save as…" button, "Replace original" copy hint.
   - Sticky "Download all as ZIP" button when ≥ 2 files.
8. **Footer** — same as home.

### 8.2 States to handle explicitly

- Empty (no files yet)
- Files added, not yet converted
- Converting (per-file spinner + overall progress)
- Done, all succeeded
- Done, some failed (per-file error message; others still downloadable)
- Decoder load failure (e.g., HEIC WASM couldn't fetch) → inline error with retry
- Save dialog cancelled → silent
- `showSaveFilePicker` unsupported → fallback `<a download>` + tooltip

### 8.3 Accessibility

- Dropzone is keyboard-focusable; Enter/Space opens file picker.
- Format buttons are a `role="radiogroup"` with arrow-key navigation.
- All interactive elements have visible focus rings (already in current design tokens).
- Sliders have labelled value, `aria-valuemin`/`max`/`now`.
- Live region announces conversion progress and completion.

## 9. Offline Support

Goal: once visited, the page works with no network.

- Vite already produces a static SPA. We add a minimal **service worker** that precaches the app shell (HTML, JS chunks, CSS) and **lazily** caches the WASM codec chunks on first use so subsequent offline visits can convert HEIC/TIFF/AVIF.
- Service worker registered only in production builds.
- Update strategy: stale-while-revalidate for app shell; cache-first for codec chunks (immutable, content-hashed).
- Add a "Works offline" badge on the converter page.

## 10. SEO & Discoverability

- Update `index.html` to set `<title>` and `<meta description>` dynamically per route (small helper in `App.tsx`).
- Add `/convert` entry to `public/sitemap.xml` with an image entry pointing at the OG image.
- New OG image specifically for the converter page (`public/og-convert.png`).
- Add a "Use cases" / "Features" card on the homepage that links to `/convert`.
- Update `site.webmanifest` to include a shortcut for "Image Converter".

## 11. Dependencies to Add

| Package | Size (gzip) | Purpose | Load |
|---|---|---|---|
| `libheif-js` | ~400KB wasm | HEIC/HEIF decode | dynamic on `.heic` input |
| `utif2` | ~30KB | TIFF decode | dynamic on `.tif` input |
| `@jsquash/avif` | ~200KB wasm | AVIF encode | dynamic on AVIF output |
| `client-zip` | ~2KB | Streaming ZIP | static (small) |

Initial bundle delta target: **< 10KB gzipped** for the converter UI itself; WASM only on demand.

## 12. Testing

- Unit tests for `pipeline.ts`, `encoders/ico.ts`, `encoders/bmp.ts`, filename derivation, and format detection from magic bytes. Use Vitest + `@vitest/browser` since we need real Canvas/`createImageBitmap`.
- Fixture images committed under `src/lib/convert/__fixtures__/` (small sample of each input format).
- Manual QA checklist included with the implementation plan: HEIC photo → JPG, multi-file ZIP, resize math, Save As cancel, offline reload.

## 13. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `libheif-js` is large (400KB wasm) | Lazy-load only when HEIC is dropped; cache via SW for subsequent offline use. |
| AVIF encode is CPU-heavy on big images | Show a clear progress indicator; warn for images > 8MP. |
| `showSaveFilePicker` not supported on Safari/Firefox | Documented `<a download>` fallback with one-time hint. |
| Mobile Safari `createImageBitmap` quirks | Wrap decode in a try/catch and fall back to `<img>` + canvas draw. |
| SPA deep-link `/convert` 404 in prod | Confirm `vercel.json` rewrites all paths to `index.html`. |

## 14. Out of Scope (Future)

- Animated GIF / WebP / APNG re-encoding.
- PDF export and SVG ↔ raster.
- EXIF preservation / stripping toggle.
- Web Worker offloading (single-thread is fine for v1; revisit if profiling shows jank).
- A `/tools` index page.
