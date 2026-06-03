// Generates the static SEO landing pages into dist/ and rewrites the sitemap.
// Runs AFTER `vite build` (see package.json), so dist/ already exists and is
// populated. Also refreshes public/sitemap.xml so the committed source stays in
// sync with the generated output.

import { writeFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE, allPages } from './pages.mjs'
import { render } from './render.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')
const DIST = resolve(ROOT, 'dist')
const PUBLIC = resolve(ROOT, 'public')

// Static SPA routes that aren't generated here but belong in the sitemap.
const BASE_ROUTES = [
  { loc: '/', priority: '1.0', changefreq: 'monthly', images: [
    { loc: SITE.ogImage, title: "FavGrab — Download Any Website's Favicon" },
    { loc: `${SITE.baseUrl}/favicon.svg`, title: 'FavGrab Logo' },
  ] },
  { loc: '/convert', priority: '0.9', changefreq: 'monthly', images: [
    { loc: SITE.ogImage, title: 'FavGrab Image Converter — Local & Offline' },
  ] },
]

const xmlEsc = s =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function sitemapEntry({ loc, priority, changefreq, images }) {
  const img = (images || [])
    .map(
      i =>
        `\n    <image:image>\n      <image:loc>${xmlEsc(i.loc)}</image:loc>\n      <image:title>${xmlEsc(i.title)}</image:title>\n    </image:image>`
    )
    .join('')
  return `  <url>
    <loc>${xmlEsc(SITE.baseUrl + (loc === '/' ? '/' : loc))}</loc>
    <lastmod>${SITE.lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${img}
  </url>`
}

function buildSitemap() {
  const entries = [
    ...BASE_ROUTES.map(sitemapEntry),
    // hub
    sitemapEntry({ loc: '/image-converter', priority: '0.9', changefreq: 'monthly' }),
    // pair pages
    ...allPages
      .filter(p => p.kind === 'pair')
      .map(p => sitemapEntry({ loc: p.url, priority: '0.8', changefreq: 'monthly' })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${entries.join('\n')}
</urlset>
`
}

async function writePage(baseDir, page) {
  const out = resolve(baseDir, page.file)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, render(page), 'utf8')
  return page.file
}

async function main() {
  const written = []
  for (const page of allPages) {
    written.push(await writePage(DIST, page))
  }

  // The SEO pair pages turn dist/convert/ into a real directory. Vercel serves
  // a directory by looking for index.html inside it and 404s when absent —
  // *before* the catch-all rewrite to /index.html runs. So reloading the
  // /convert SPA route would 404. Emit the SPA shell as dist/convert/index.html
  // so a direct hit on /convert serves the app, which then renders <Convert />.
  const shell = await readFile(resolve(DIST, 'index.html'), 'utf8')
  await writeFile(resolve(DIST, 'convert', 'index.html'), shell, 'utf8')
  written.push('convert/index.html (SPA shell)')

  const sitemap = buildSitemap()
  await writeFile(resolve(DIST, 'sitemap.xml'), sitemap, 'utf8')
  await writeFile(resolve(PUBLIC, 'sitemap.xml'), sitemap, 'utf8')

  console.log(`[seo] generated ${written.length} static pages:`)
  for (const f of written) console.log(`        dist/${f}`)
  console.log('[seo] sitemap.xml updated (dist + public)')
}

main().catch(err => {
  console.error('[seo] build failed:', err)
  process.exit(1)
})
