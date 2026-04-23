import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const SIZES = [16, 32, 48, 64, 128, 256] as const
type SizeOption = typeof SIZES[number]
type Format = 'png' | 'webp' | 'jpeg'

const FORMATS: { value: Format; label: string }[] = [
  { value: 'png', label: '.PNG' },
  { value: 'webp', label: '.WEBP' },
  { value: 'jpeg', label: '.JPG' },
]

const SOCIALS = [
  { label: 'Twitter', href: 'https://x.com/vanikyaai', icon: '𝕏' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Vanikya', icon: '▶' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/vanikya-ai', icon: 'in' },
]

function parseDomain(input: string): string {
  try {
    let url = input.trim()
    if (!url.startsWith('http')) url = 'https://' + url
    return new URL(url).hostname
  } catch {
    return input.trim().replace(/^https?:\/\//, '').split('/')[0].split('?')[0]
  }
}

function getFaviconUrl(domain: string, size: number): string {
  return `/api/favicon?url=https://${domain}&size=${size}`
}

function downloadImage(
  imgSrc: string,
  filename: string,
  format: Format,
  size: number,
  onError: () => void
) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, size, size)
    const mime = format === 'jpeg' ? 'image/jpeg' : `image/${format}`
    canvas.toBlob(
      (blob) => {
        if (!blob) { onError(); return }
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = filename
        a.click()
        URL.revokeObjectURL(a.href)
      },
      mime,
      0.95
    )
  }
  img.onerror = onError
  img.src = imgSrc
}

export default function App() {
  const [input, setInput] = useState('')
  const [domain, setDomain] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<SizeOption>(64)
  const [selectedFormat, setSelectedFormat] = useState<Format>('png')
  const [error, setError] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  // Autofill from ?domain= query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const domainParam = params.get('domain')
    if (domainParam) {
      const d = parseDomain(domainParam)
      if (d) {
        setInput(d)
        setDomain(d)
        setHistory([d])
      }
    }
  }, [])

  const handleFetch = useCallback(() => {
    const raw = input.trim()
    if (!raw) return
    setError(null)
    setImgError(false)
    const d = parseDomain(raw)
    if (!d) { setError('Enter a valid domain or URL'); return }
    setDomain(d)
    // Update URL without reload
    const url = new URL(window.location.href)
    url.searchParams.set('domain', d)
    window.history.replaceState({}, '', url.toString())
    setHistory(prev => [d, ...prev.filter(x => x !== d)].slice(0, 6))
  }, [input])

  const handleDownload = useCallback(
    (format: Format = selectedFormat, size: SizeOption = selectedSize) => {
      if (!domain) return
      const ext = format === 'jpeg' ? 'jpg' : format
      downloadImage(
        getFaviconUrl(domain, size),
        `${domain}-${size}x${size}.${ext}`,
        format,
        size,
        () => setError('Download failed — try a different format or size')
      )
    },
    [domain, selectedFormat, selectedSize]
  )

  const loadDomain = (d: string) => {
    setInput(d)
    setDomain(d)
    setError(null)
    setImgError(false)
    const url = new URL(window.location.href)
    url.searchParams.set('domain', d)
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <>
      <div className="grid-bg" aria-hidden="true" />

      <header className="header">
        <div className="logo">
          <svg className="logo-mark" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <polygon points="12,2 22,12 12,22 2,12" fill="hsl(38,96%,54%)" stroke="hsl(240,10%,8%)" strokeWidth="1.5" strokeLinejoin="round"/>
            <polygon points="12,7 17,12 12,17 7,12" fill="none" stroke="hsl(240,10%,8%)" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="2" fill="hsl(240,10%,8%)"/>
          </svg>
          <span className="logo-name">FavGrab</span>
        </div>
        <div className="header-actions">
          <a
            href="https://github.com/ANIBIT14/favgrab"
            className="star-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="star-icon">★</span>
            Star
          </a>
          <a
            href="https://github.com/ANIBIT14/favgrab"
            className="header-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            github ↗
          </a>
        </div>
      </header>

      <main className="main">
        <section className="hero">
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
        </section>

        <div className="input-row">
          <div className="input-wrap">
            <span className="input-prefix">https://</span>
            <Input
              className="url-input-field"
              placeholder="google.com"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFetch()}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
            <Button className="fetch-btn-wrap" onClick={handleFetch}>
              Fetch →
            </Button>
          </div>
          {error && <div className="input-error">⚠ {error}</div>}
        </div>

        {domain && !imgError && (
          <div className="result-wrap" key={domain}>
            <div className="result-card">
              <div className="result-header">
                <span className="result-domain">{domain}</span>
                <Badge variant="accent">● Live</Badge>
              </div>

              <div className="result-body">
                <div className="preview-col">
                  <div className="preview-frame">
                    <img
                      src={getFaviconUrl(domain, 256)}
                      alt={`${domain} favicon`}
                      className="preview-img"
                      onError={() => setImgError(true)}
                    />
                  </div>
                  <div className="preview-domain">{domain}</div>
                </div>

                <div className="controls-col">
                  <div>
                    <div className="control-label">Select Size</div>
                    <div className="size-grid">
                      {SIZES.map(size => (
                        <button
                          key={size}
                          className={`size-chip${selectedSize === size ? ' active' : ''}`}
                          onClick={() => setSelectedSize(size)}
                          aria-pressed={selectedSize === size}
                        >
                          <div className="size-thumb">
                            <img
                              src={getFaviconUrl(domain, Math.min(size, 64))}
                              alt=""
                              width={Math.min(size, 32)}
                              height={Math.min(size, 32)}
                            />
                          </div>
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="control-label">Format</div>
                    <div className="format-row">
                      {FORMATS.map(f => (
                        <Button
                          key={f.value}
                          variant="outline"
                          className={`format-btn${selectedFormat === f.value ? ' active' : ''}`}
                          onClick={() => setSelectedFormat(f.value)}
                          aria-pressed={selectedFormat === f.value}
                        >
                          {f.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button className="download-btn" size="lg" onClick={() => handleDownload()}>
                    ↓ Download {selectedSize}×{selectedSize}{' '}
                    {selectedFormat === 'jpeg' ? 'JPG' : selectedFormat.toUpperCase()}
                  </Button>

                  <div className="quick-downloads">
                    <span className="quick-label">Quick export:</span>
                    {FORMATS.map(f => (
                      <button
                        key={f.value}
                        className="quick-btn"
                        onClick={() => handleDownload(f.value, selectedSize)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {imgError && domain && (
          <div className="no-favicon">
            <span className="no-favicon-icon">◌</span>
            <p>
              No favicon found for <strong>{domain}</strong>
            </p>
            <p style={{ fontSize: 12, marginTop: 6, color: 'hsl(var(--muted-foreground))' }}>
              Try a different domain or check the URL.
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div className="history">
            <div className="history-label">Recent</div>
            <div className="history-list">
              {history.map(d => (
                <button
                  key={d}
                  className={`history-item${domain === d ? ' active' : ''}`}
                  onClick={() => loadDomain(d)}
                >
                  <img src={getFaviconUrl(d, 32)} alt="" width={14} height={14} />
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* USE CASES */}
      <section className="use-cases-section">
        <div className="section-inner">
          <div className="section-eyebrow">USE CASES</div>
          <h2 className="section-title">So how would I use this?</h2>
          <p className="section-sub">
            There's lots of things you'd want to use FavGrab for — here's a few common use cases to get you started.
          </p>
          <div className="use-cases-grid">

            {/* Card 1 */}
            <div className="use-case-card">
              <div className="use-case-illustration">
                <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect width="280" height="160" fill="#111"/>
                  {/* Browser bar */}
                  <rect x="12" y="12" width="256" height="136" rx="0" fill="#1a1a1a" stroke="#333" strokeWidth="1.5"/>
                  <rect x="12" y="12" width="256" height="28" fill="#222" stroke="#333" strokeWidth="1.5"/>
                  <circle cx="28" cy="26" r="5" fill="#ff5f57"/>
                  <circle cx="44" cy="26" r="5" fill="#ffbd2e"/>
                  <circle cx="60" cy="26" r="5" fill="#28c840"/>
                  <rect x="76" y="19" width="140" height="14" rx="2" fill="#333"/>
                  {/* Row 1 */}
                  <rect x="24" y="52" width="20" height="20" fill="#f5a623" stroke="#f5a623"/>
                  <text x="34" y="66" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#111">G</text>
                  <rect x="52" y="57" width="110" height="9" rx="1" fill="#444"/>
                  <text x="250" y="66" textAnchor="middle" fontSize="12" fill="#666">↗</text>
                  <rect x="24" y="72" width="232" height="1" fill="#2a2a2a"/>
                  {/* Row 2 */}
                  <rect x="24" y="82" width="20" height="20" fill="#4a9eff" stroke="#4a9eff"/>
                  <text x="34" y="96" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fff">gh</text>
                  <rect x="52" y="87" width="85" height="9" rx="1" fill="#444"/>
                  <text x="250" y="96" textAnchor="middle" fontSize="12" fill="#666">↗</text>
                  <rect x="24" y="102" width="232" height="1" fill="#2a2a2a"/>
                  {/* Row 3 */}
                  <rect x="24" y="112" width="20" height="20" fill="#1d9bf0" stroke="#1d9bf0"/>
                  <text x="34" y="126" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fff">𝕏</text>
                  <rect x="52" y="117" width="95" height="9" rx="1" fill="#444"/>
                  <text x="250" y="126" textAnchor="middle" fontSize="12" fill="#666">↗</text>
                </svg>
              </div>
              <div className="use-case-content">
                <h3 className="use-case-title">Gorgeous styled links</h3>
                <p className="use-case-desc">Give your users a visual cue of where a link will take them by showing an icon next to it.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="use-case-card">
              <div className="use-case-illustration">
                <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect width="280" height="160" fill="#111"/>
                  {/* Dashboard frame */}
                  <rect x="12" y="12" width="256" height="136" fill="#1a1a1a" stroke="#333" strokeWidth="1.5"/>
                  {/* Header */}
                  <rect x="12" y="12" width="256" height="24" fill="#222" stroke="#333" strokeWidth="1.5"/>
                  <text x="24" y="28" fontSize="10" fontWeight="bold" fill="#888" letterSpacing="1">TRAFFIC SOURCES</text>
                  <rect x="222" y="18" width="38" height="12" rx="1" fill="#f5a623"/>
                  <text x="241" y="27" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#111">EXPORT</text>
                  {/* Table header */}
                  <text x="24" y="52" fontSize="8" fill="#555" letterSpacing="0.5">SITE</text>
                  <text x="180" y="52" fontSize="8" fill="#555" letterSpacing="0.5">VISITS</text>
                  <text x="234" y="52" fontSize="8" fill="#555" letterSpacing="0.5">SHARE</text>
                  <rect x="12" y="55" width="256" height="1" fill="#2a2a2a"/>
                  {/* Row 1 */}
                  <rect x="24" y="62" width="14" height="14" fill="#f5a623"/>
                  <text x="31" y="73" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#111">G</text>
                  <rect x="44" y="66" width="70" height="7" rx="1" fill="#333"/>
                  <text x="185" y="74" fontSize="9" fill="#ddd" fontWeight="bold">24.1k</text>
                  <rect x="234" y="66" width="30" height="7" rx="1" fill="#f5a623" opacity="0.8"/>
                  {/* Row 2 */}
                  <rect x="24" y="84" width="14" height="14" fill="#4a9eff"/>
                  <text x="31" y="95" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">gh</text>
                  <rect x="44" y="88" width="55" height="7" rx="1" fill="#333"/>
                  <text x="185" y="96" fontSize="9" fill="#ddd" fontWeight="bold">18.5k</text>
                  <rect x="234" y="88" width="22" height="7" rx="1" fill="#4a9eff" opacity="0.8"/>
                  {/* Row 3 */}
                  <rect x="24" y="106" width="14" height="14" fill="#ff4500"/>
                  <text x="31" y="117" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">r/</text>
                  <rect x="44" y="110" width="80" height="7" rx="1" fill="#333"/>
                  <text x="185" y="118" fontSize="9" fill="#ddd" fontWeight="bold">9.2k</text>
                  <rect x="234" y="110" width="16" height="7" rx="1" fill="#ff4500" opacity="0.8"/>
                  {/* Row 4 */}
                  <rect x="24" y="128" width="14" height="14" fill="#1d9bf0"/>
                  <text x="31" y="139" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">𝕏</text>
                  <rect x="44" y="132" width="62" height="7" rx="1" fill="#333"/>
                  <text x="185" y="140" fontSize="9" fill="#ddd" fontWeight="bold">6.8k</text>
                  <rect x="234" y="132" width="12" height="7" rx="1" fill="#1d9bf0" opacity="0.8"/>
                </svg>
              </div>
              <div className="use-case-content">
                <h3 className="use-case-title">Dashboards</h3>
                <p className="use-case-desc">Take your dashboard displays to the next level by showing icons for each website the user sees.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="use-case-card">
              <div className="use-case-illustration">
                <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect width="280" height="160" fill="#111"/>
                  {/* Three user cards */}
                  {/* Card 1 */}
                  <rect x="20" y="24" width="74" height="112" fill="#1a1a1a" stroke="#333" strokeWidth="1.5"/>
                  <rect x="33" y="38" width="48" height="48" rx="24" fill="#f5a623"/>
                  <text x="57" y="68" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#111">G</text>
                  <rect x="30" y="96" width="54" height="8" rx="1" fill="#333"/>
                  <rect x="35" y="110" width="44" height="7" rx="1" fill="#2a2a2a"/>
                  <rect x="30" y="122" width="54" height="7" rx="1" fill="#2a2a2a"/>
                  {/* Card 2 — highlighted */}
                  <rect x="103" y="16" width="74" height="128" fill="#1a1a1a" stroke="#f5a623" strokeWidth="2"/>
                  <rect x="103" y="16" width="74" height="4" fill="#f5a623"/>
                  <rect x="116" y="32" width="48" height="48" rx="24" fill="#4a9eff"/>
                  <text x="140" y="62" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#fff">gh</text>
                  <rect x="113" y="90" width="54" height="8" rx="1" fill="#333"/>
                  <rect x="118" y="104" width="44" height="7" rx="1" fill="#2a2a2a"/>
                  <rect x="113" y="116" width="54" height="7" rx="1" fill="#2a2a2a"/>
                  <rect x="118" y="128" width="44" height="10" rx="1" fill="#f5a623"/>
                  {/* Card 3 */}
                  <rect x="186" y="24" width="74" height="112" fill="#1a1a1a" stroke="#333" strokeWidth="1.5"/>
                  <rect x="199" y="38" width="48" height="48" rx="24" fill="#1d9bf0"/>
                  <text x="223" y="68" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff">𝕏</text>
                  <rect x="196" y="96" width="54" height="8" rx="1" fill="#333"/>
                  <rect x="201" y="110" width="44" height="7" rx="1" fill="#2a2a2a"/>
                  <rect x="196" y="122" width="54" height="7" rx="1" fill="#2a2a2a"/>
                </svg>
              </div>
              <div className="use-case-content">
                <h3 className="use-case-title">Default avatars</h3>
                <p className="use-case-desc">Display icons for users based on the @domain.com of their email address.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-inner">
          <div className="features-headline">
            <h2 className="features-title">It's icons.<br /><span className="features-title-muted">Simple, fault tolerant, no bs.</span></h2>
          </div>
          <div className="features-grid">

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="2" y="2" width="44" height="44" fill="hsl(38,96%,54%)" stroke="hsl(240,10%,8%)" strokeWidth="3"/>
                  <path d="M24 14C17 14 11 19 8 24C11 29 17 34 24 34C31 34 37 29 40 24C37 19 31 14 24 14Z" stroke="hsl(240,10%,8%)" strokeWidth="2.5" fill="none"/>
                  <circle cx="24" cy="24" r="5" fill="hsl(240,10%,8%)"/>
                  <line x1="10" y1="10" x2="38" y2="38" stroke="hsl(240,10%,8%)" strokeWidth="3" strokeLinecap="square"/>
                </svg>
              </div>
              <h3 className="feature-title">Privacy matters</h3>
              <p className="feature-desc">No cookies &amp; no tracking involved. We just want to serve you icons, not collect your data or that of your users.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="2" y="2" width="44" height="44" fill="hsl(38,96%,54%)" stroke="hsl(240,10%,8%)" strokeWidth="3"/>
                  <rect x="9" y="12" width="30" height="22" fill="none" stroke="hsl(240,10%,8%)" strokeWidth="2.5"/>
                  <path d="M9 28L18 20L24 26L30 19L39 28" stroke="hsl(240,10%,8%)" strokeWidth="2.5" fill="none"/>
                  <circle cx="16" cy="18" r="3" fill="hsl(240,10%,8%)"/>
                  <path d="M28 36L32 40L40 30" stroke="hsl(240,10%,8%)" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
              </div>
              <h3 className="feature-title">No broken images</h3>
              <p className="feature-desc">With our fallback icon system, you will never end up with a broken image — even if the website doesn't exist or can't be reached.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="2" y="2" width="44" height="44" fill="hsl(38,96%,54%)" stroke="hsl(240,10%,8%)" strokeWidth="3"/>
                  <rect x="8" y="10" width="32" height="28" fill="hsl(240,10%,8%)"/>
                  <rect x="11" y="13" width="26" height="4" fill="hsl(38,96%,54%)" opacity="0.3"/>
                  <text x="24" y="31" textAnchor="middle" fontSize="13" fontWeight="900" fill="hsl(38,96%,54%)" fontFamily="monospace">&lt;/&gt;</text>
                  <rect x="8" y="36" width="10" height="3" fill="hsl(240,10%,8%)"/>
                  <rect x="30" y="36" width="10" height="3" fill="hsl(240,10%,8%)"/>
                  <rect x="13" y="39" width="22" height="3" fill="hsl(240,10%,8%)"/>
                </svg>
              </div>
              <h3 className="feature-title">By developers, for developers</h3>
              <p className="feature-desc">We're developers too. We know you want to make an app, not work on serving icons. Our system is intentionally the simplest it can be.</p>
            </div>

          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <a
            href="https://vanikya.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-vanikya"
          >
            vanikya.ai
          </a>
          <div className="footer-socials">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          Uses Google's FaviconV2 API · Free &amp; open source ·{' '}
          <a
            href="https://boldkit.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-boldkit"
          >
            UI by BoldKit
          </a>
        </div>
      </footer>
    </>
  )
}
