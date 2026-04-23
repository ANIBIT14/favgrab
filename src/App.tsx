import { useState, useCallback } from 'react'

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
  { label: 'YouTube', href: 'https://youtube.com/@vanikyaai', icon: '▶' },
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

function downloadImage(imgSrc: string, filename: string, format: Format, size: number, onError: () => void) {
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

  const handleFetch = useCallback(() => {
    const raw = input.trim()
    if (!raw) return
    setError(null)
    setImgError(false)
    const d = parseDomain(raw)
    if (!d) { setError('Enter a valid domain or URL'); return }
    setDomain(d)
    setHistory(prev => [d, ...prev.filter(x => x !== d)].slice(0, 6))
  }, [input])

  const handleDownload = useCallback((format: Format = selectedFormat, size: SizeOption = selectedSize) => {
    if (!domain) return
    const ext = format === 'jpeg' ? 'jpg' : format
    const filename = `${domain}-${size}x${size}.${ext}`
    downloadImage(
      getFaviconUrl(domain, size),
      filename,
      format,
      size,
      () => setError('Download failed — try a different format or size')
    )
  }, [domain, selectedFormat, selectedSize])

  const loadDomain = (d: string) => {
    setInput(d)
    setDomain(d)
    setError(null)
    setImgError(false)
  }

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />

      <header className="header">
        <div className="logo">
          <span className="logo-mark">◈</span>
          <span className="logo-name">favgrab</span>
        </div>
        <a
          href="https://github.com/anibit14/favgrab"
          className="header-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          github ↗
        </a>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-eyebrow">— FAVICON EXTRACTOR v0.0.1</div>
          <h1 className="hero-title">
            Grab any<br />
            <em>website's</em><br />
            favicon.
          </h1>
          <p className="hero-sub">
            Extract and download favicons from any domain instantly.<br />
            Export as PNG, WebP, or JPG — any size up to 256px.
          </p>
        </section>

        <div className="input-row">
          <div className="input-box">
            <span className="input-prefix">https://</span>
            <input
              type="text"
              className="url-input"
              placeholder="google.com"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFetch()}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
            <button className="fetch-btn" onClick={handleFetch}>
              <span>Fetch</span>
              <span className="fetch-arrow">→</span>
            </button>
          </div>
          {error && <div className="input-error">⚠ {error}</div>}
        </div>

        {domain && !imgError && (
          <section className="result" key={domain}>
            <div className="result-meta">
              <span className="result-domain">{domain}</span>
              <span className="result-tag">● LIVE</span>
            </div>

            <div className="result-body">
              <div className="preview-col">
                <div className="main-preview">
                  <img
                    src={getFaviconUrl(domain, 256)}
                    alt={`${domain} favicon`}
                    className="main-preview-img"
                    onError={() => setImgError(true)}
                  />
                </div>
                <div className="preview-sub">{domain}</div>
              </div>

              <div className="controls-col">
                <div className="control-group">
                  <div className="control-label">SELECT SIZE</div>
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
                        <span className="size-label">{size}px</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <div className="control-label">FORMAT</div>
                  <div className="format-row">
                    {FORMATS.map(f => (
                      <button
                        key={f.value}
                        className={`format-btn${selectedFormat === f.value ? ' active' : ''}`}
                        onClick={() => setSelectedFormat(f.value)}
                        aria-pressed={selectedFormat === f.value}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="download-btn" onClick={() => handleDownload()}>
                  <span className="download-icon">↓</span>
                  Download {selectedSize}×{selectedSize} {selectedFormat === 'jpeg' ? 'JPG' : selectedFormat.toUpperCase()}
                </button>

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
          </section>
        )}

        {imgError && domain && (
          <div className="no-favicon">
            <span className="no-favicon-icon">◌</span>
            <p>No favicon found for <strong>{domain}</strong></p>
            <p className="no-favicon-sub">Try a different domain or check the URL.</p>
          </div>
        )}

        {history.length > 0 && (
          <div className="history">
            <div className="history-label">RECENT</div>
            <div className="history-list">
              {history.map(d => (
                <button
                  key={d}
                  className={`history-item${domain === d ? ' active' : ''}`}
                  onClick={() => loadDomain(d)}
                >
                  <img src={getFaviconUrl(d, 32)} alt="" width={14} height={14} />
                  <span>{d}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-top">
          <span className="footer-brand">
            Powered by{' '}
            <a href="https://vanikya.ai" target="_blank" rel="noopener noreferrer" className="footer-vanikya">
              Vanikya AI
            </a>
          </span>
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
          Uses Google's FaviconV2 API · Free & open source
        </div>
      </footer>
    </>
  )
}
