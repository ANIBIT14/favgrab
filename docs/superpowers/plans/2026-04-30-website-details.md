# Brand & Website Details Expansion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 keyless data sources (Clearbit Logo, Microlink, RDAP, Cloudflare DNS, HTTP Headers) that fire in parallel when a domain is fetched, displayed as a responsive 3-column card grid with skeleton loaders below the favicon preview.

**Architecture:** Five new Vercel serverless functions proxy external APIs and return JSON. State for each card lives in `App.tsx`, driven by parallel `fetch` calls in a `useEffect`. A single `DetailsGrid.tsx` component renders all 5 cards independently — each showing its own skeleton until data arrives or quietly degrading on error.

**Tech Stack:** React 18 + TypeScript, `@vercel/node` serverless functions, native `fetch`, custom CSS animations matching existing neubrutalism style in `index.css`.

---

### Task 1: Create branch + shared types

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b feature/website-details
```

- [ ] **Step 2: Create `src/types.ts`**

```typescript
export type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error' }

export interface MetadataResult {
  title?: string
  description?: string
  image?: string
  publisher?: string
  author?: string
}

export interface RdapResult {
  registrar?: string
  created?: string
  expires?: string
  nameservers?: string[]
  status?: string[]
}

export interface DnsResult {
  aRecords: string[]
  mxRecords: string[]
  txtRecords: string[]
}

export interface HeadersResult {
  server?: string
  poweredBy?: string
  contentType?: string
  csp: boolean
  hsts: boolean
  xFrameOptions: boolean
  xContentTypeOptions: boolean
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/types.ts
git commit -m "feat: shared TypeScript types for website detail cards"
```

---

### Task 2: `/api/metadata.ts` — Microlink proxy

**Files:**
- Create: `api/metadata.ts`

- [ ] **Step 1: Create `api/metadata.ts`**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { domain } = req.query as { domain?: string }
  if (!domain) return res.status(400).json({ error: 'domain is required' })

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')

  try {
    const upstream = await fetch(
      `https://api.microlink.io/?url=https://${domain}`,
      { headers: { 'User-Agent': 'FavGrab/0.1.0' } }
    )
    if (!upstream.ok) return res.status(200).json({})

    const json = await upstream.json()
    const d = json.data ?? {}

    return res.status(200).json({
      title: d.title || undefined,
      description: d.description || undefined,
      image: d.image?.url || undefined,
      publisher: d.publisher || undefined,
      author: d.author || undefined,
    })
  } catch {
    return res.status(200).json({})
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add api/metadata.ts
git commit -m "feat: /api/metadata serverless function via Microlink"
```

---

### Task 3: `/api/logo.ts` — Clearbit Logo proxy

**Files:**
- Create: `api/logo.ts`

- [ ] **Step 1: Create `api/logo.ts`**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { domain } = req.query as { domain?: string }
  if (!domain) return res.status(400).json({ error: 'domain is required' })

  try {
    const upstream = await fetch(
      `https://logo.clearbit.com/${domain}`,
      { headers: { 'User-Agent': 'FavGrab/0.1.0' } }
    )
    if (!upstream.ok) return res.status(404).json({ error: 'Logo not found' })

    const buffer = await upstream.arrayBuffer()
    const contentType = upstream.headers.get('content-type') || 'image/png'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')

    return res.status(200).send(Buffer.from(buffer))
  } catch {
    return res.status(500).json({ error: 'Failed to fetch logo' })
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add api/logo.ts
git commit -m "feat: /api/logo serverless function via Clearbit"
```

---

### Task 4: `/api/rdap.ts` — RDAP.org proxy

**Files:**
- Create: `api/rdap.ts`

- [ ] **Step 1: Create `api/rdap.ts`**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { domain } = req.query as { domain?: string }
  if (!domain) return res.status(400).json({ error: 'domain is required' })

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')

  try {
    const upstream = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { 'User-Agent': 'FavGrab/0.1.0', Accept: 'application/json' },
    })
    if (!upstream.ok) return res.status(200).json({})

    const json = await upstream.json()

    const nameservers: string[] = (json.nameservers ?? [])
      .map((ns: { ldhName?: string }) => (ns.ldhName ?? '').toLowerCase())
      .filter(Boolean)
      .slice(0, 4)

    const getDate = (type: string): string | undefined =>
      (json.events ?? []).find(
        (e: { eventAction: string }) => e.eventAction === type
      )?.eventDate

    const registrarEntity = (json.entities ?? []).find(
      (e: { roles: string[] }) => e.roles?.includes('registrar')
    )
    const registrar: string | undefined = registrarEntity?.vcardArray?.[1]
      ?.find((v: unknown[]) => Array.isArray(v) && v[0] === 'fn')?.[3]

    return res.status(200).json({
      registrar,
      created: getDate('registration'),
      expires: getDate('expiration'),
      nameservers,
      status: (json.status ?? []).slice(0, 4),
    })
  } catch {
    return res.status(200).json({})
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add api/rdap.ts
git commit -m "feat: /api/rdap serverless function via RDAP.org"
```

---

### Task 5: `/api/dns.ts` — Cloudflare DoH proxy

**Files:**
- Create: `api/dns.ts`

- [ ] **Step 1: Create `api/dns.ts`**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

async function queryDns(name: string, type: string): Promise<string[]> {
  const r = await fetch(
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
    { headers: { Accept: 'application/dns-json', 'User-Agent': 'FavGrab/0.1.0' } }
  )
  if (!r.ok) return []
  const json = await r.json()
  return (json.Answer ?? []).map((a: { data: string }) => a.data)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { domain } = req.query as { domain?: string }
  if (!domain) return res.status(400).json({ error: 'domain is required' })

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')

  try {
    const [aRes, mxRes, txtRes] = await Promise.allSettled([
      queryDns(domain, 'A'),
      queryDns(domain, 'MX'),
      queryDns(domain, 'TXT'),
    ])

    return res.status(200).json({
      aRecords: aRes.status === 'fulfilled' ? aRes.value.slice(0, 4) : [],
      mxRecords: mxRes.status === 'fulfilled' ? mxRes.value.slice(0, 4) : [],
      txtRecords: txtRes.status === 'fulfilled' ? txtRes.value.slice(0, 3) : [],
    })
  } catch {
    return res.status(200).json({ aRecords: [], mxRecords: [], txtRecords: [] })
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add api/dns.ts
git commit -m "feat: /api/dns serverless function via Cloudflare DoH"
```

---

### Task 6: `/api/headers.ts` — HTTP response headers fetcher

**Files:**
- Create: `api/headers.ts`

- [ ] **Step 1: Create `api/headers.ts`**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { domain } = req.query as { domain?: string }
  if (!domain) return res.status(400).json({ error: 'domain is required' })

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')

  try {
    const upstream = await fetch(`https://${domain}`, {
      method: 'HEAD',
      headers: { 'User-Agent': 'FavGrab/0.1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(6000),
    })

    const h = upstream.headers
    return res.status(200).json({
      server: h.get('server') || undefined,
      poweredBy: h.get('x-powered-by') || undefined,
      contentType: h.get('content-type')?.split(';')[0] || undefined,
      csp: h.has('content-security-policy'),
      hsts: h.has('strict-transport-security'),
      xFrameOptions: h.has('x-frame-options'),
      xContentTypeOptions: h.has('x-content-type-options'),
    })
  } catch {
    return res.status(200).json({
      csp: false,
      hsts: false,
      xFrameOptions: false,
      xContentTypeOptions: false,
    })
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add api/headers.ts
git commit -m "feat: /api/headers serverless function via direct HEAD request"
```

---

### Task 7: Card grid + skeleton CSS

**Files:**
- Modify: `src/index.css` (append at end of file)

- [ ] **Step 1: Append to `src/index.css`**

Add at the very end of the file:

```css
/* ============================================================
   DETAILS GRID
   ============================================================ */

.details-section {
  width: 100%;
  max-width: 860px;
  margin: 0 auto 48px;
  padding: 0 24px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 560px) {
  .details-grid { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 860px) {
  .details-grid { grid-template-columns: 1fr 1fr 1fr; }
}

.detail-card {
  border: 2px solid hsl(240,10%,8%);
  box-shadow: 4px 4px 0 hsl(240,10%,8%);
  background: hsl(0,0%,100%);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 140px;
}

.detail-card-title {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: hsl(240,10%,45%);
  padding-bottom: 6px;
  border-bottom: 1.5px solid hsl(240,10%,92%);
}

/* Skeleton */
@keyframes skel-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.skel {
  background: hsl(240,10%,90%);
  animation: skel-pulse 1.4s ease-in-out infinite;
}

.skel-line     { height: 9px; width: 100%; margin-bottom: 6px; }
.skel-line-md  { height: 9px; width: 70%; margin-bottom: 6px; }
.skel-line-sm  { height: 9px; width: 45%; margin-bottom: 6px; }
.skel-block    { height: 56px; width: 56px; }
.skel-rect     { height: 72px; width: 100%; margin-bottom: 6px; }

/* Unavailable */
.detail-unavailable {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: hsl(240,10%,65%);
  text-align: center;
  padding: 20px 0;
}

/* Fields */
.detail-field {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.detail-label {
  font-family: 'Space Mono', monospace;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: hsl(240,10%,55%);
}

.detail-value {
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: hsl(240,10%,8%);
  word-break: break-word;
  line-height: 1.4;
}

.detail-value.mono {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
}

/* Logo card */
.detail-logo-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border: 2px solid hsl(240,10%,8%);
  background: hsl(240,10%,97%);
  padding: 6px;
}

/* Metadata card */
.detail-og-thumb {
  width: 100%;
  height: 68px;
  object-fit: cover;
  border: 2px solid hsl(240,10%,8%);
}

/* Headers card — security badges */
.detail-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.detail-hbadge {
  font-family: 'Space Mono', monospace;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 2px 5px;
  border: 1.5px solid currentColor;
  white-space: nowrap;
}

.detail-hbadge.ok      { color: hsl(142,60%,28%); background: hsl(142,60%,95%); }
.detail-hbadge.missing { color: hsl(0,60%,50%); background: hsl(0,60%,97%); opacity: 0.7; }

/* RDAP status badges */
.detail-status-badge {
  font-family: 'Space Mono', monospace;
  font-size: 8px;
  padding: 2px 5px;
  border: 1.5px solid hsl(240,10%,75%);
  color: hsl(240,10%,45%);
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: exits 0

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: skeleton animation and detail card grid CSS"
```

---

### Task 8: `DetailsGrid.tsx` component

**Files:**
- Create: `src/components/DetailsGrid.tsx`

- [ ] **Step 1: Create `src/components/DetailsGrid.tsx`**

```tsx
import type { LoadState, MetadataResult, RdapResult, DnsResult, HeadersResult } from '../types'

interface Props {
  domain: string
  metadata: LoadState<MetadataResult>
  logo: LoadState<string>
  rdap: LoadState<RdapResult>
  dns: LoadState<DnsResult>
  headers: LoadState<HeadersResult>
}

function fmt(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function LogoCard({ logo, domain }: { logo: LoadState<string>; domain: string }) {
  return (
    <div className="detail-card">
      <div className="detail-card-title">Brand Logo</div>
      {logo.status === 'loading' && (
        <><div className="skel skel-block" /><div className="skel skel-line-md" /></>
      )}
      {logo.status === 'success' && (
        <div className="detail-field">
          <img src={logo.data} alt={`${domain} logo`} className="detail-logo-img" />
          <span className="detail-value" style={{ marginTop: 6, fontSize: 11 }}>{domain}</span>
        </div>
      )}
      {logo.status === 'error' && <div className="detail-unavailable">Logo unavailable</div>}
    </div>
  )
}

function MetadataCard({ metadata }: { metadata: LoadState<MetadataResult> }) {
  return (
    <div className="detail-card">
      <div className="detail-card-title">Metadata</div>
      {metadata.status === 'loading' && (
        <><div className="skel skel-rect" /><div className="skel skel-line" /><div className="skel skel-line-md" /><div className="skel skel-line-sm" /></>
      )}
      {metadata.status === 'success' && (
        <>
          {metadata.data.image && (
            <img src={metadata.data.image} alt="OG" className="detail-og-thumb" />
          )}
          {metadata.data.title && (
            <div className="detail-field">
              <span className="detail-label">Title</span>
              <span className="detail-value">
                {metadata.data.title.length > 60 ? metadata.data.title.slice(0, 60) + '…' : metadata.data.title}
              </span>
            </div>
          )}
          {metadata.data.description && (
            <div className="detail-field">
              <span className="detail-label">Description</span>
              <span className="detail-value" style={{ fontSize: 11 }}>
                {metadata.data.description.length > 100
                  ? metadata.data.description.slice(0, 100) + '…'
                  : metadata.data.description}
              </span>
            </div>
          )}
          {metadata.data.publisher && (
            <div className="detail-field">
              <span className="detail-label">Publisher</span>
              <span className="detail-value">{metadata.data.publisher}</span>
            </div>
          )}
          {!metadata.data.title && !metadata.data.description && (
            <div className="detail-unavailable">No metadata found</div>
          )}
        </>
      )}
      {metadata.status === 'error' && <div className="detail-unavailable">Metadata unavailable</div>}
    </div>
  )
}

function DomainCard({ rdap }: { rdap: LoadState<RdapResult> }) {
  return (
    <div className="detail-card">
      <div className="detail-card-title">Domain Info</div>
      {rdap.status === 'loading' && (
        <><div className="skel skel-line" /><div className="skel skel-line-md" /><div className="skel skel-line" /><div className="skel skel-line-sm" /></>
      )}
      {rdap.status === 'success' && (
        <>
          {rdap.data.registrar && (
            <div className="detail-field">
              <span className="detail-label">Registrar</span>
              <span className="detail-value" style={{ fontSize: 11 }}>{rdap.data.registrar}</span>
            </div>
          )}
          <div className="detail-field">
            <span className="detail-label">Registered</span>
            <span className="detail-value mono">{fmt(rdap.data.created)}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Expires</span>
            <span className="detail-value mono">{fmt(rdap.data.expires)}</span>
          </div>
          {(rdap.data.nameservers ?? []).length > 0 && (
            <div className="detail-field">
              <span className="detail-label">Nameservers</span>
              {rdap.data.nameservers!.map(ns => (
                <span key={ns} className="detail-value mono" style={{ fontSize: 10 }}>{ns}</span>
              ))}
            </div>
          )}
          {(rdap.data.status ?? []).length > 0 && (
            <div className="detail-badges" style={{ marginTop: 4 }}>
              {rdap.data.status!.map(s => (
                <span key={s} className="detail-status-badge">{s}</span>
              ))}
            </div>
          )}
        </>
      )}
      {rdap.status === 'error' && <div className="detail-unavailable">Domain info unavailable</div>}
    </div>
  )
}

function DnsCard({ dns }: { dns: LoadState<DnsResult> }) {
  return (
    <div className="detail-card">
      <div className="detail-card-title">DNS Records</div>
      {dns.status === 'loading' && (
        <><div className="skel skel-line" /><div className="skel skel-line-md" /><div className="skel skel-line" /><div className="skel skel-line-sm" /></>
      )}
      {dns.status === 'success' && (
        <>
          {dns.data.aRecords.length > 0 && (
            <div className="detail-field">
              <span className="detail-label">A Records (IP)</span>
              {dns.data.aRecords.map(ip => (
                <span key={ip} className="detail-value mono">{ip}</span>
              ))}
            </div>
          )}
          {dns.data.mxRecords.length > 0 && (
            <div className="detail-field">
              <span className="detail-label">MX Records</span>
              {dns.data.mxRecords.map(mx => (
                <span key={mx} className="detail-value mono" style={{ fontSize: 9 }}>
                  {mx.length > 35 ? mx.slice(0, 35) + '…' : mx}
                </span>
              ))}
            </div>
          )}
          {dns.data.txtRecords.length > 0 && (
            <div className="detail-field">
              <span className="detail-label">TXT Records</span>
              {dns.data.txtRecords.map((txt, i) => (
                <span key={i} className="detail-value mono" style={{ fontSize: 9 }}>
                  {txt.length > 40 ? txt.slice(0, 40) + '…' : txt}
                </span>
              ))}
            </div>
          )}
          {dns.data.aRecords.length === 0 && dns.data.mxRecords.length === 0 && (
            <div className="detail-unavailable">No DNS records found</div>
          )}
        </>
      )}
      {dns.status === 'error' && <div className="detail-unavailable">DNS lookup unavailable</div>}
    </div>
  )
}

function HeadersCard({ headers }: { headers: LoadState<HeadersResult> }) {
  const SEC: Array<{ key: 'csp' | 'hsts' | 'xFrameOptions' | 'xContentTypeOptions'; label: string }> = [
    { key: 'csp', label: 'CSP' },
    { key: 'hsts', label: 'HSTS' },
    { key: 'xFrameOptions', label: 'X-Frame' },
    { key: 'xContentTypeOptions', label: 'X-Content-Type' },
  ]
  return (
    <div className="detail-card">
      <div className="detail-card-title">HTTP Headers</div>
      {headers.status === 'loading' && (
        <><div className="skel skel-line" /><div className="skel skel-line-md" /><div className="skel skel-line" /><div className="skel skel-line-sm" /></>
      )}
      {headers.status === 'success' && (
        <>
          {headers.data.server && (
            <div className="detail-field">
              <span className="detail-label">Server</span>
              <span className="detail-value mono">{headers.data.server}</span>
            </div>
          )}
          {headers.data.poweredBy && (
            <div className="detail-field">
              <span className="detail-label">Powered by</span>
              <span className="detail-value mono">{headers.data.poweredBy}</span>
            </div>
          )}
          <div className="detail-field">
            <span className="detail-label">Security Headers</span>
            <div className="detail-badges">
              {SEC.map(({ key, label }) => (
                <span key={key} className={`detail-hbadge ${headers.data[key] ? 'ok' : 'missing'}`}>
                  {headers.data[key] ? '✓' : '✗'} {label}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
      {headers.status === 'error' && <div className="detail-unavailable">Headers unavailable</div>}
    </div>
  )
}

export default function DetailsGrid({ domain, metadata, logo, rdap, dns, headers }: Props) {
  return (
    <div className="details-section">
      <div className="details-grid">
        <LogoCard logo={logo} domain={domain} />
        <MetadataCard metadata={metadata} />
        <DomainCard rdap={rdap} />
        <DnsCard dns={dns} />
        <HeadersCard headers={headers} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/DetailsGrid.tsx
git commit -m "feat: DetailsGrid with 5 detail cards and skeleton loaders"
```

---

### Task 9: Wire parallel fetches + DetailsGrid into App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add imports at top of `src/App.tsx`**

The existing first import line is:
```tsx
import { useState, useCallback, useEffect } from 'react'
```

After it, add:
```tsx
import DetailsGrid from '@/components/DetailsGrid'
import type { LoadState, MetadataResult, RdapResult, DnsResult, HeadersResult } from '@/types'
```

- [ ] **Step 2: Add 5 state declarations inside the `App` function**

After the existing `const [history, setHistory] = useState<string[]>([])` line, add:
```tsx
  const [metadata, setMetadata] = useState<LoadState<MetadataResult>>({ status: 'idle' })
  const [logo, setLogo] = useState<LoadState<string>>({ status: 'idle' })
  const [rdap, setRdap] = useState<LoadState<RdapResult>>({ status: 'idle' })
  const [dns, setDns] = useState<LoadState<DnsResult>>({ status: 'idle' })
  const [headers, setHeaders] = useState<LoadState<HeadersResult>>({ status: 'idle' })
```

- [ ] **Step 3: Add parallel-fetch useEffect**

After the closing `}, [])` of the autofill useEffect, add:
```tsx
  useEffect(() => {
    if (!domain) return

    setMetadata({ status: 'loading' })
    setLogo({ status: 'loading' })
    setRdap({ status: 'loading' })
    setDns({ status: 'loading' })
    setHeaders({ status: 'loading' })

    fetch(`/api/metadata?domain=${domain}`)
      .then(r => r.json())
      .then(data =>
        Object.keys(data).length === 0
          ? setMetadata({ status: 'error' })
          : setMetadata({ status: 'success', data })
      )
      .catch(() => setMetadata({ status: 'error' }))

    fetch(`/api/logo?domain=${domain}`)
      .then(r =>
        r.ok
          ? setLogo({ status: 'success', data: `/api/logo?domain=${domain}` })
          : setLogo({ status: 'error' })
      )
      .catch(() => setLogo({ status: 'error' }))

    fetch(`/api/rdap?domain=${domain}`)
      .then(r => r.json())
      .then(data =>
        Object.keys(data).length === 0
          ? setRdap({ status: 'error' })
          : setRdap({ status: 'success', data })
      )
      .catch(() => setRdap({ status: 'error' }))

    fetch(`/api/dns?domain=${domain}`)
      .then(r => r.json())
      .then(data => setDns({ status: 'success', data }))
      .catch(() => setDns({ status: 'error' }))

    fetch(`/api/headers?domain=${domain}`)
      .then(r => r.json())
      .then(data => setHeaders({ status: 'success', data }))
      .catch(() => setHeaders({ status: 'error' }))
  }, [domain])
```

- [ ] **Step 4: Add `<DetailsGrid>` in JSX**

Find this line in the return JSX:
```tsx
        {history.length > 0 && (
```

Insert before it:
```tsx
        {domain && (
          <DetailsGrid
            domain={domain}
            metadata={metadata}
            logo={logo}
            rdap={rdap}
            dns={dns}
            headers={headers}
          />
        )}

```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 6: Verify build**

```bash
npm run build
```
Expected: exits 0

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "feat: parallel website detail fetches wired into App with DetailsGrid"
```

---

### Task 10: Update hero + features copy in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update hero eyebrow, title, subtitle**

Find:
```tsx
          <div className="hero-eyebrow">Favicon Extractor — v0.0.1</div>
          <h1 className="hero-title">
            Grab any<br />
            <span className="hero-title-line2">website's</span><br />
            favicon.
          </h1>
          <p className="hero-sub">
            Extract and download favicons from any domain instantly.<br />
            Export as PNG, WebP, or JPG — any size up to 256px.
          </p>
```

Replace with:
```tsx
          <div className="hero-eyebrow">Website Intelligence Tool — v0.1.0</div>
          <h1 className="hero-title">
            Grab any<br />
            <span className="hero-title-line2">website's</span><br />
            brand.
          </h1>
          <p className="hero-sub">
            Extract favicons, logos, metadata, DNS records and more<br />
            from any domain — instantly, free, no signup.
          </p>
```

- [ ] **Step 2: Update features headline**

Find:
```tsx
            <h2 className="features-title">It's icons.<br /><span className="features-title-muted">Simple, fault tolerant, no bs.</span></h2>
```

Replace with:
```tsx
            <h2 className="features-title">It's brand intel.<br /><span className="features-title-muted">Simple, fault tolerant, no bs.</span></h2>
```

- [ ] **Step 3: Add 2 new feature cards**

Find (end of the third feature card, just before the closing of `features-grid`):
```tsx
              <p className="feature-desc">We're developers too. We know you want to make an app, not work on serving icons. Our system is intentionally the simplest it can be.</p>
            </div>

          </div>
```

Replace with:
```tsx
              <p className="feature-desc">We're developers too. We know you want to make an app, not work on serving icons. Our system is intentionally the simplest it can be.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="2" y="2" width="44" height="44" fill="hsl(38,96%,54%)" stroke="hsl(240,10%,8%)" strokeWidth="3"/>
                  <circle cx="24" cy="21" r="8" stroke="hsl(240,10%,8%)" strokeWidth="2.5" fill="none"/>
                  <path d="M10 38 Q24 28 38 38" stroke="hsl(240,10%,8%)" strokeWidth="2.5" fill="none"/>
                </svg>
              </div>
              <h3 className="feature-title">Full brand kit</h3>
              <p className="feature-desc">Get high-res logos via Clearbit, OG images, title, description and publisher metadata — all in one lookup, no API key needed.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="2" y="2" width="44" height="44" fill="hsl(38,96%,54%)" stroke="hsl(240,10%,8%)" strokeWidth="3"/>
                  <rect x="8" y="8" width="32" height="32" fill="none" stroke="hsl(240,10%,8%)" strokeWidth="2" strokeDasharray="4 2"/>
                  <text x="24" y="29" textAnchor="middle" fontSize="13" fontWeight="700" fill="hsl(240,10%,8%)" fontFamily="monospace">DNS</text>
                </svg>
              </div>
              <h3 className="feature-title">Deep domain intel</h3>
              <p className="feature-desc">Surface DNS records (A, MX, TXT), domain registration and expiry via RDAP, and HTTP security headers — all keyless, all free.</p>
            </div>

          </div>
```

- [ ] **Step 4: Update footer attribution line**

Find:
```tsx
          Uses Google's FaviconV2 API · Free &amp; open source ·{' '}
```

Replace with:
```tsx
          Google FaviconV2 · Microlink · Clearbit · RDAP · Cloudflare DoH · Free &amp; open source ·{' '}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```
Expected: exits 0

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update hero, features section, and footer for expanded capabilities"
```

---

### Task 11: Update `index.html` SEO

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update title, description, keywords**

Find:
```html
    <title>FavGrab — Download Any Website's Favicon Free</title>
    <meta name="description" content="Extract and download favicons from any website instantly. Export as PNG, WebP, or JPG in sizes from 16px to 256px. Free, no signup, no tracking." />
    <meta name="keywords" content="favicon downloader, extract favicon, download favicon, website icon downloader, favicon extractor, favicon converter, PNG favicon, WebP favicon, free favicon tool, get website icon" />
```

Replace with:
```html
    <title>FavGrab — Website Intelligence Tool: Favicons, Logos, Metadata & More</title>
    <meta name="description" content="Extract favicons, brand logos, metadata, DNS records, and HTTP headers from any website instantly. Free, no signup, no API key required." />
    <meta name="keywords" content="favicon downloader, favicon extractor, brand logo extractor, website metadata, DNS lookup tool, HTTP headers checker, website intelligence, Clearbit logo, RDAP domain info, free developer tool" />
```

- [ ] **Step 2: Update OG title + description**

Find:
```html
    <meta property="og:title" content="FavGrab — Download Any Website's Favicon Free" />
    <meta property="og:description" content="Extract and download favicons from any website instantly. Export as PNG, WebP, or JPG in any size. Free and no signup required." />
```

Replace with:
```html
    <meta property="og:title" content="FavGrab — Website Intelligence Tool" />
    <meta property="og:description" content="Extract favicons, logos, metadata, DNS records and HTTP headers from any website. Free, no API key required." />
```

- [ ] **Step 3: Update Twitter Card title + description**

Find:
```html
    <meta name="twitter:title" content="FavGrab — Download Any Website's Favicon Free" />
    <meta name="twitter:description" content="Extract and download favicons from any website instantly. Export as PNG, WebP, or JPG in any size. Free, no signup." />
```

Replace with:
```html
    <meta name="twitter:title" content="FavGrab — Website Intelligence Tool" />
    <meta name="twitter:description" content="Extract favicons, logos, metadata, DNS records and HTTP headers from any website. Free, no signup." />
```

- [ ] **Step 4: Update JSON-LD description and featureList**

Find:
```json
      "description": "Extract and download favicons from any website instantly. Export as PNG, WebP, or JPG in sizes from 16px to 256px.",
```

Replace with:
```json
      "description": "Extract favicons, brand logos, metadata, DNS records, and HTTP security headers from any website instantly. Free, no API key required.",
```

Find:
```json
      "featureList": [
        "Download favicons from any website",
        "Export as PNG, WebP, or JPG",
        "Sizes from 16px to 256px",
        "No signup required",
        "No tracking or cookies"
      ],
```

Replace with:
```json
      "featureList": [
        "Download favicons from any website in PNG, WebP, or JPG (16px–256px)",
        "High-resolution brand logo extraction via Clearbit",
        "Website metadata: title, description, OG image, publisher",
        "Domain registration info via RDAP (registrar, dates, nameservers)",
        "DNS record lookup: A, MX, TXT via Cloudflare DoH",
        "HTTP security headers audit: CSP, HSTS, X-Frame-Options, X-Content-Type-Options",
        "No signup required",
        "No tracking or cookies"
      ],
```

- [ ] **Step 5: Add 2 FAQ entries for new capabilities**

Find:
```json
        {
          "@type": "Question",
          "name": "Is FavGrab free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, FavGrab is completely free with no signup, no cookies, and no tracking."
          }
        }
      ]
```

Replace with:
```json
        {
          "@type": "Question",
          "name": "Is FavGrab free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, FavGrab is completely free with no signup, no cookies, and no tracking."
          }
        },
        {
          "@type": "Question",
          "name": "What website details can FavGrab extract beyond favicons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "FavGrab also extracts high-resolution brand logos (via Clearbit), website metadata (title, description, OG image, publisher via Microlink), domain registration info (registrar, creation and expiry dates, nameservers via RDAP), DNS records (A, MX, TXT via Cloudflare DoH), and HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need an API key to use FavGrab?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No API key is required. FavGrab uses only keyless public APIs and open protocols."
          }
        }
      ]
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```
Expected: exits 0

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "seo: update meta tags, OG, JSON-LD for expanded capabilities"
```

---

### Task 12: Update README + create `llms.txt`

**Files:**
- Modify: `README.md`
- Create: `llms.txt`

- [ ] **Step 1: Replace `README.md` content**

Replace the entire file with:
```markdown
# FavGrab

Website intelligence tool — extract favicons, logos, metadata, DNS records and more from any domain, instantly.

**Live:** [favgrab.boldkit.dev](https://favgrab.boldkit.dev)

---

## Features

- **Favicon extraction** — grab any site's favicon as PNG, WebP, or JPG in 16×16 up to 256×256 px
- **Brand logo** — high-resolution company logo via Clearbit (no API key)
- **Website metadata** — title, description, OG image, publisher via Microlink
- **Domain info** — registrar, registration/expiry dates, nameservers via RDAP
- **DNS records** — A (IP), MX, and TXT records via Cloudflare DNS-over-HTTPS
- **HTTP headers** — server fingerprint and security header audit (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- **Recent history** — last 6 lookups saved in-session
- **No signup** — completely free, no account, no API key required

## API Endpoints

| Endpoint | Returns |
|---|---|
| `GET /api/favicon?url=https://domain&size=64` | Favicon image (binary) |
| `GET /api/logo?domain=domain` | Brand logo image (binary) |
| `GET /api/metadata?domain=domain` | `{ title, description, image, publisher, author }` |
| `GET /api/rdap?domain=domain` | `{ registrar, created, expires, nameservers, status }` |
| `GET /api/dns?domain=domain` | `{ aRecords, mxRecords, txtRecords }` |
| `GET /api/headers?domain=domain` | `{ server, poweredBy, csp, hsts, xFrameOptions, xContentTypeOptions }` |

All endpoints are CORS-enabled and cached for 24 hours. No authentication required.

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [BoldKit](https://boldkit.dev) neubrutalism components
- Vercel serverless functions
- [Microlink](https://microlink.io) · [Clearbit Logo API](https://clearbit.com/logo) · [RDAP.org](https://rdap.org) · [Cloudflare DoH](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/)

## Development

```bash
npm install
npm run dev    # UI dev server (favicon proxied via Vite)
vercel dev     # Full dev with all serverless functions live
```

## How it works

1. User enters a domain or URL
2. Favicon is fetched via `/api/favicon` (Google FaviconV2, CORS-proxied)
3. Five additional API calls fire in parallel:
   - `/api/logo` → Clearbit Logo API (image proxy)
   - `/api/metadata` → Microlink (title, description, OG image, publisher)
   - `/api/rdap` → RDAP.org (registrar, dates, nameservers)
   - `/api/dns` → Cloudflare DoH (A, MX, TXT records)
   - `/api/headers` → Direct HEAD request (server, security headers)
4. Each result card renders independently as its API responds — skeletons fill the gap

---

Made by [ANIBIT14](https://github.com/ANIBIT14) · [@vanikyaai](https://x.com/vanikyaai)
```

- [ ] **Step 2: Create `llms.txt` at repo root**

```
# FavGrab

> Website intelligence tool — extract favicons, logos, metadata, DNS records and HTTP headers from any domain. Free, no signup, no API key required.

FavGrab is a free web application that extracts comprehensive website information from any domain in a single lookup. It uses six keyless public data sources to provide a complete brand and technical profile for any website.

## What FavGrab Extracts

- Favicon — browser tab icon, downloadable as PNG/WebP/JPG in 16–256px
- Brand logo — high-resolution company logo via Clearbit
- Metadata — page title, meta description, Open Graph image, publisher name
- Domain info — registrar, registration date, expiry date, nameservers, RDAP status
- DNS records — A records (IPs), MX records (mail servers), TXT records
- HTTP headers — server software, X-Powered-By, and security header presence (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)

## API Endpoints

All endpoints are public, CORS-enabled, and cached 24 hours. No authentication required.

GET /api/favicon?url=https://example.com&size=64
Returns: image binary

GET /api/logo?domain=example.com
Returns: image binary

GET /api/metadata?domain=example.com
Returns: { "title": "...", "description": "...", "image": "https://...", "publisher": "...", "author": "..." }

GET /api/rdap?domain=example.com
Returns: { "registrar": "...", "created": "ISO date", "expires": "ISO date", "nameservers": [...], "status": [...] }

GET /api/dns?domain=example.com
Returns: { "aRecords": [...], "mxRecords": [...], "txtRecords": [...] }

GET /api/headers?domain=example.com
Returns: { "server": "...", "poweredBy": "...", "csp": true, "hsts": true, "xFrameOptions": false, "xContentTypeOptions": true }

## Data Sources

- Google FaviconV2 API (favicons)
- Clearbit Logo API (brand logos, keyless)
- Microlink (metadata, 50 req/day keyless)
- RDAP.org (domain registration, public IANA protocol)
- Cloudflare DNS-over-HTTPS (DNS records, keyless)
- Direct HTTP HEAD requests (response headers)

## Links

- Live: https://favgrab.boldkit.dev
- GitHub: https://github.com/ANIBIT14/favgrab
- Made by Vanikya AI: https://vanikya.ai
```

- [ ] **Step 3: Final build verify**

```bash
npm run build
```
Expected: exits 0

- [ ] **Step 4: Commit**

```bash
git add README.md llms.txt
git commit -m "docs: update README and add llms.txt for expanded capabilities"
```
