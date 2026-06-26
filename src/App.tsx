import { useEffect } from 'react'
import { useRoute } from '@/lib/router'
import { Layout } from '@/components/Layout'
import Home from '@/pages/Home'
import Convert from '@/pages/Convert'

// Title length kept ≤60 chars, description ≤160 chars (Google snippet limits).
const TITLES: Record<string, string> = {
  '/': "FavGrab — Free Favicon Downloader for Any Website",          // 49
  '/convert': "Image Converter — PNG, JPG, WebP, AVIF, HEIC · FavGrab", // 54
}

const DESCRIPTIONS: Record<string, string> = {
  '/':        "Download favicons from any website in PNG, WebP, or JPG at sizes 16px–256px. Free, no signup, no tracking — works in your browser.",      // 137
  '/convert': "Convert images between PNG, JPG, JFIF, WebP, AVIF, HEIC, TIFF, BMP, and ICO — 100% in your browser. No uploads, works offline, free.",    // 141
}

const CANONICAL_BASE = 'https://favgrab.boldkit.dev'

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setMetaProp(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(id: string, data: object | null) {
  const existing = document.getElementById(id)
  if (existing) existing.remove()
  if (!data) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

const BREADCRUMBS: Record<string, { label: string; href: string }[]> = {
  '/': [
    { label: 'Home', href: '/' },
  ],
  '/convert': [
    { label: 'Home', href: '/' },
    { label: 'Image Converter', href: '/convert' },
  ],
}

function buildBreadcrumbLd(path: string) {
  const crumbs = BREADCRUMBS[path] ?? BREADCRUMBS['/']
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: `${CANONICAL_BASE}${c.href === '/' ? '/' : c.href}`,
    })),
  }
}

export default function App() {
  const path = useRoute()

  useEffect(() => {
    const title = TITLES[path] ?? TITLES['/']
    const desc = DESCRIPTIONS[path] ?? DESCRIPTIONS['/']
    document.title = title
    setMeta('description', desc)
    setMetaProp('og:title', title)
    setMetaProp('og:description', desc)
    setMeta('twitter:title', title)
    setMeta('twitter:description', desc)
    setCanonical(`${CANONICAL_BASE}${path === '/' ? '/' : path}`)
    setMetaProp('og:url', `${CANONICAL_BASE}${path === '/' ? '/' : path}`)
    setJsonLd('ld-breadcrumbs', buildBreadcrumbLd(path))
  }, [path])

  return (
    <Layout>
      {path === '/convert' ? <Convert /> : <Home />}
    </Layout>
  )
}
