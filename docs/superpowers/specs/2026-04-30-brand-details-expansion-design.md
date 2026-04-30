# Brand & Website Details Expansion — Design Spec
**Date:** 2026-04-30  
**Status:** Approved

---

## Overview

Expand FavGrab from a favicon-only tool into a full website intelligence panel. When a user enters a domain, 5 additional keyless API calls fire in parallel alongside the favicon fetch. Each result surfaces in its own card in a responsive grid below the existing favicon preview.

---

## Architecture

### New Serverless Functions (`/api/`)

| File | Source | Returns |
|---|---|---|
| `metadata.ts` | Microlink (`api.microlink.io`) | title, description, OG image, theme color, publisher |
| `logo.ts` | Clearbit (`logo.clearbit.com`) | High-res company logo image (proxied) |
| `rdap.ts` | RDAP.org (`rdap.org/domain/`) | Registrar, created/expiry dates, nameservers, status |
| `dns.ts` | Cloudflare DoH (`cloudflare-dns.com`) | A records (IPs), MX records, TXT records |
| `headers.ts` | Direct HTTP HEAD fetch | Server, X-Powered-By, CSP, HSTS, X-Frame-Options |

All functions:
- Return JSON (not binary)
- Set `Access-Control-Allow-Origin: *`
- Set `Cache-Control: public, max-age=86400, stale-while-revalidate=3600`
- Return a typed error shape `{ error: string }` on failure — never throw 500 to the client

### Frontend Data Flow

1. User submits domain → existing favicon fetch fires
2. Simultaneously, `Promise.allSettled([metadata, logo, rdap, dns, headers])` fires — all 5 calls independent
3. Each card mounts immediately in skeleton state
4. As each promise settles, its card transitions from skeleton → data (or → unavailable on error)
5. No card blocks any other card

---

## Card Grid UI

**Layout:** 2-column on mobile, 3-column on desktop (CSS grid, responsive)  
**Position:** Below the existing favicon preview + download controls  
**Aesthetic:** Matches existing neubrutalism design — bold borders, flat shadows, same color tokens

### Cards

**Logo Card**  
- Shows high-res Clearbit logo image  
- Falls back to "Logo unavailable" state if Clearbit returns 404  
- Displays domain name as label

**Metadata Card**  
- Title (truncated at 60 chars)  
- Description (truncated at 120 chars)  
- OG image thumbnail (if present)  
- Theme color as a color swatch + hex value  
- Publisher name

**Domain Info Card**  
- Registrar name  
- Registered date (formatted: "Jan 12, 2012")  
- Expiry date  
- Nameservers list (up to 4)  
- Status badges (e.g., "clientTransferProhibited")

**DNS Records Card**  
- A records: list of IPs  
- MX records: mail server hostnames  
- TXT records: truncated, shown in monospace  
- Each record type as a labeled section

**HTTP Headers Card**  
- Server + X-Powered-By as text values  
- Security headers shown as present ✓ / absent ✗ badges: CSP, HSTS, X-Frame-Options, X-Content-Type-Options

### Skeleton Loaders

- Each card has a pulse-animated skeleton matching its content shape
- Skeletons use the existing TailwindCSS `animate-pulse` utility
- Cards transition individually as their data arrives — no global loading state

### Error States

- Each card independently shows a subtle "unavailable" label if its API call fails
- No error propagates to other cards
- No toast/alert — inline quiet degradation only

---

## Content Updates

### Landing Page (`src/App.tsx`)
- Features/use-cases section updated to mention: metadata extraction, brand logos, domain info, DNS lookup, HTTP headers
- Tagline or subtitle updated to reflect expanded scope (e.g., "Grab favicons, logos, metadata and more")

### README
- Updated feature list
- Updated "How it works" section
- New section listing all data sources and what each returns

### SEO (`index.html`)
- `<title>` and `<meta description>` updated to reflect expanded capabilities
- OpenGraph title/description updated
- JSON-LD `description` field updated

### `llms.txt` (new file at repo root)
- Standard LLMs.txt format describing the product, its capabilities, and usage

---

## Constraints

- No API keys — all 5 sources are keyless/free-tier-without-auth
- No new npm dependencies for the API calls (use native `fetch`)
- Implemented on a separate git branch (not `main`)
- No Claude co-authorship in commits
