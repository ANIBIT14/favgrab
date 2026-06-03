// Renders a page definition (from pages.mjs) into a complete, standalone HTML
// document. Pure string templating — no framework, no client JS. Each page emits
// exactly ONE FAQPage block to stay clear of Search Console "duplicate FAQ" flags.

import { SITE } from './pages.mjs'
import { CSS } from './styles.mjs'

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = s => esc(s).replace(/"/g, '&quot;')

// Escape, then allow a tiny markup subset: `code` and **bold**.
const inline = s =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

const abs = path => `${SITE.baseUrl}${path}`

// Strip authored markup down to plain text for use inside JSON-LD strings.
const plain = s =>
  String(s).replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1')

function jsonLd(obj) {
  // Escape '<' so a stray "</script>" in data can't break out of the tag.
  const json = JSON.stringify(obj, null, 0).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}

function breadcrumbLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: abs(c.href),
    })),
  }
}

function faqLd(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(f => ({
      '@type': 'Question',
      name: plain(f.q),
      acceptedAnswer: { '@type': 'Answer', text: f.a.map(plain).join(' ') },
    })),
  }
}

function howToLd(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to convert ${page.from} to ${page.to} in your browser`,
    description: plain(page.lead),
    totalTime: 'PT30S',
    tool: [{ '@type': 'HowToTool', name: 'A modern web browser' }],
    step: page.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: plain(s.b),
      text: plain(s.text),
    })),
  }
}

function header(activeConvert) {
  return `<header class="header">
  <a class="logo" href="/" aria-label="FavGrab home">
    <svg class="logo-mark" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon points="12,2 22,12 12,22 2,12" fill="hsl(38,96%,54%)" stroke="hsl(240,10%,8%)" stroke-width="1.5" stroke-linejoin="round"/>
      <polygon points="12,7 17,12 12,17 7,12" fill="none" stroke="hsl(240,10%,8%)" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="2" fill="hsl(240,10%,8%)"/>
    </svg>
    <span class="logo-name">FavGrab</span>
  </a>
  <nav class="header-nav">
    <a class="nav-link" href="/">Favicon</a>
    <a class="nav-link${activeConvert ? ' active' : ''}" href="/convert">Image Converter</a>
  </nav>
  <div class="header-actions">
    <a class="star-btn" href="${SITE.github}" target="_blank" rel="noopener noreferrer" aria-label="Star FavGrab on GitHub">
      <span class="star-icon" aria-hidden="true">&#9733;</span>Star
    </a>
    <a class="header-link" href="${SITE.github}" target="_blank" rel="noopener noreferrer">github &#8599;</a>
  </div>
</header>`
}

function footer() {
  return `<footer class="footer">
  <div class="footer-row">
    <span class="muted">FavGrab &middot; free &amp; open-source image tools by <a href="${SITE.orgUrl}" target="_blank" rel="noopener noreferrer">${SITE.org}</a></span>
    <span class="links">
      <a href="/">Favicon Downloader</a>
      <a href="/convert">Image Converter</a>
      <a href="/image-converter">All converters</a>
      <a href="${SITE.github}" target="_blank" rel="noopener noreferrer">GitHub &#8599;</a>
    </span>
  </div>
</footer>`
}

function crumbsHtml(crumbs) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol style="list-style:none;display:flex;flex-wrap:wrap;align-items:center">${crumbs
    .map((c, i) => {
      const last = i === crumbs.length - 1
      const inner = last
        ? `<span class="current" aria-current="page">${esc(c.label)}</span>`
        : `<a href="${escAttr(c.href)}">${esc(c.label)}</a>`
      return `<li>${inner}${last ? '' : '<span class="sep" aria-hidden="true">/</span>'}</li>`
    })
    .join('')}</ol></nav>`
}

function badges(list) {
  if (!list?.length) return ''
  return `<div class="badges">${list.map(b => `<span class="badge">${esc(b)}</span>`).join('')}</div>`
}

function cta(text) {
  return `<a class="cta" href="/convert">${esc(text)} &rarr;</a>`
}

function stepsHtml(steps) {
  return `<ol class="steps">${steps
    .map(s => `<li><b>${inline(s.b)}</b>${inline(s.text)}</li>`)
    .join('')}</ol>`
}

function compareHtml(left, right) {
  const col = f =>
    `<div class="col"><h3>${esc(f.name)}</h3><dl>${f.rows
      .map(([dt, dd]) => `<dt>${inline(dt)}</dt><dd>${inline(dd)}</dd>`)
      .join('')}</dl></div>`
  return `<div class="compare">${col(left)}${col(right)}</div>`
}

function cardsHtml(cards) {
  return `<div class="cards">${cards
    .map(c => `<div class="icard"><h3>${inline(c.h)}</h3><p>${inline(c.p)}</p></div>`)
    .join('')}</div>`
}

function ticksHtml(items) {
  return `<ul class="ticks">${items.map(i => `<li>${inline(i)}</li>`).join('')}</ul>`
}

function faqHtml(faq) {
  return `<div class="faq">${faq
    .map(
      f =>
        `<details><summary>${inline(f.q)}</summary><div class="answer">${f.a
          .map(p => `<p>${inline(p)}</p>`)
          .join('')}</div></details>`
    )
    .join('')}</div>`
}

function relatedHtml(urls, linkLabel) {
  return `<div class="related">${urls
    .map(u => `<a href="${escAttr(u)}">${esc(linkLabel(u))}</a>`)
    .join('')}</div>`
}

function ctaBand(title, text) {
  return `<div class="cta-band"><h2>${inline(title)}</h2><p>${inline(text)}</p>${cta('Open the converter')}</div>`
}

// Human label for a related-link URL, derived from its slug.
export function labelForUrl(u) {
  if (u === '/image-converter') return 'All Converters'
  if (u === '/convert') return 'Image Converter'
  const slug = u.split('/').pop() || ''
  return slug
    .split('-to-')
    .map(s => s.toUpperCase())
    .join(' → ')
}

function head(page, jsonLdBlocks) {
  const canonical = abs(page.url)
  return `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(page.title)}</title>
  <meta name="description" content="${escAttr(page.description)}" />
  <meta name="keywords" content="${escAttr(page.keywords)}" />
  <meta name="author" content="${escAttr(SITE.org)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="canonical" href="${canonical}" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${escAttr(page.title)}" />
  <meta property="og:description" content="${escAttr(page.description)}" />
  <meta property="og:image" content="${SITE.ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="${escAttr(SITE.name)}" />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@vanikyaai" />
  <meta name="twitter:title" content="${escAttr(page.title)}" />
  <meta name="twitter:description" content="${escAttr(page.description)}" />
  <meta name="twitter:image" content="${SITE.ogImage}" />

  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/favicon.svg" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#f5a623" />
  <meta name="color-scheme" content="light" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
  <style>${CSS}</style>
  ${jsonLdBlocks.join('\n  ')}
</head>`
}

function shell(page, bodyInner, jsonLdBlocks) {
  return `<!doctype html>
<html lang="en">
${head(page, jsonLdBlocks)}
<body>
  <div class="grid-bg" aria-hidden="true"></div>
  ${header(true)}
  <main class="wrap">
${bodyInner}
  </main>
  ${footer()}
</body>
</html>`
}

// ── Pair page ────────────────────────────────────────────────────────────────
function renderPair(page) {
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Image Converter', href: '/convert' },
    { label: `${page.from} to ${page.to}`, href: page.url },
  ]
  const jsonLdBlocks = [
    jsonLd(breadcrumbLd(crumbs)),
    jsonLd(howToLd(page)),
    jsonLd(faqLd(page.faq)),
  ]

  const body = `${crumbsHtml(crumbs)}
    <div class="eyebrow">${esc(page.eyebrow)}</div>
    <h1 class="hero-title">${page.h1}</h1>
    <p class="lead">${inline(page.lead)}</p>
    ${badges(['Local', 'No upload', 'Offline', 'Free'])}
    <p>${cta('Open the converter')}</p>

    <section class="block prose">
      <h2>${esc(page.from)} vs ${esc(page.to)}: what changes</h2>
      ${page.intro.map(p => `<p>${inline(p)}</p>`).join('\n      ')}
    </section>

    <section class="block">
      <h2>How to convert ${esc(page.from)} to ${esc(page.to)}</h2>
      ${stepsHtml(page.steps)}
    </section>

    <section class="block">
      <h2>${esc(page.from)} vs ${esc(page.to)} at a glance</h2>
      ${compareHtml(page.compareLeft, page.compareRight)}
    </section>

    <section class="block">
      <h2>When to convert ${esc(page.from)} to ${esc(page.to)}</h2>
      ${ticksHtml(page.useCases)}
    </section>

    <section class="block">
      <h2>Why convert in your browser</h2>
      ${cardsHtml(page.whyCards)}
    </section>

    <section class="block">
      <h2>Frequently asked questions</h2>
      ${faqHtml(page.faq)}
    </section>

    <section class="block">
      <h2>Related converters</h2>
      ${relatedHtml(page.related, labelForUrl)}
    </section>

    ${ctaBand(page.ctaTitle, page.ctaText)}`

  return shell(page, body, jsonLdBlocks)
}

// ── Hub page ─────────────────────────────────────────────────────────────────
function renderHub(page) {
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Image Converter', href: page.url },
  ]
  const jsonLdBlocks = [jsonLd(breadcrumbLd(crumbs)), jsonLd(faqLd(page.faq))]

  const matrix = `<div class="cards">
      <div class="icard"><h3>Open these formats</h3><p>${page.formatsIn
        .map(f => `<code>${esc(f)}</code>`)
        .join(' ')}</p></div>
      <div class="icard"><h3>Save as</h3><p>${page.formatsOut
        .map(f => `<code>${esc(f)}</code>`)
        .join(' ')}</p></div>
    </div>`

  const features = `<div class="cards">${page.features
    .map(([h, p]) => `<div class="icard"><h3>${inline(h)}</h3><p>${inline(p)}</p></div>`)
    .join('')}</div>`

  const body = `${crumbsHtml(crumbs)}
    <div class="eyebrow">${esc(page.eyebrow)}</div>
    <h1 class="hero-title">${page.h1}</h1>
    <p class="lead">${inline(page.lead)}</p>
    ${badges(['100% local', 'No signup', 'Batch + ZIP', 'Offline'])}
    <p>${cta('Open the converter')}</p>

    <section class="block prose">
      <h2>A converter that respects your files</h2>
      ${page.intro.map(p => `<p>${inline(p)}</p>`).join('\n      ')}
    </section>

    <section class="block">
      <h2>Every format, both directions</h2>
      ${matrix}
    </section>

    <section class="block">
      <h2>Popular conversions</h2>
      ${relatedHtml(page.popular, labelForUrl)}
    </section>

    <section class="block">
      <h2>What you get</h2>
      ${features}
    </section>

    <section class="block">
      <h2>Frequently asked questions</h2>
      ${faqHtml(page.faq)}
    </section>

    ${ctaBand(page.ctaTitle, page.ctaText)}`

  return shell(page, body, jsonLdBlocks)
}

export function render(page) {
  return page.kind === 'hub' ? renderHub(page) : renderPair(page)
}
