import { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { convert } from '@/lib/convert/pipeline'
import { detectFormat } from '@/lib/convert/decode'
import { ALL_INPUT_ACCEPT, FORMATS, OUTPUT_FORMATS } from '@/lib/convert/formats'
import type { ConvertResult, InputFormat, OutputFormat } from '@/lib/convert/types'
import { saveBlob } from '@/lib/convert/saveAs'
import { saveAsZip } from '@/lib/convert/zipDownload'
import { Breadcrumbs } from '@/components/Breadcrumbs'

// Internal links to the static SEO landing pages (generated at build time).
const POPULAR_CONVERSIONS = [
  { href: '/convert/heic-to-jpg', label: 'HEIC → JPG' },
  { href: '/convert/heic-to-png', label: 'HEIC → PNG' },
  { href: '/convert/webp-to-png', label: 'WebP → PNG' },
  { href: '/convert/png-to-webp', label: 'PNG → WebP' },
  { href: '/convert/png-to-jpg', label: 'PNG → JPG' },
  { href: '/convert/jpg-to-png', label: 'JPG → PNG' },
  { href: '/convert/jfif-to-jpg', label: 'JFIF → JPG' },
  { href: '/convert/png-to-ico', label: 'PNG → ICO' },
]

interface FileItem {
  id: string
  file: File
  sourceFormat: InputFormat | null
  status: 'idle' | 'converting' | 'done' | 'error'
  result?: ConvertResult
  error?: string
  thumbUrl?: string
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function Convert() {
  const [items, setItems] = useState<FileItem[]>([])
  const [output, setOutput] = useState<OutputFormat>('png')
  const [quality, setQuality] = useState(95)
  const [resizeOn, setResizeOn] = useState(false)
  const [maxSide, setMaxSide] = useState(1024)
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supportsQuality = FORMATS[output].supportsQuality
  const hasResults = items.some(i => i.status === 'done' && i.result)
  const resultCount = items.filter(i => i.status === 'done').length
  const errorCount = items.filter(i => i.status === 'error').length

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files)
    const next: FileItem[] = []
    for (const f of arr) {
      const sourceFormat = await detectFormat(f)
      const item: FileItem = {
        id: uid(),
        file: f,
        sourceFormat,
        status: 'idle',
        thumbUrl: sourceFormat && ['png', 'jpeg', 'webp', 'gif', 'bmp', 'avif'].includes(sourceFormat)
          ? URL.createObjectURL(f) : undefined,
      }
      next.push(item)
    }
    setItems(prev => [...prev, ...next])
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }, [addFiles])

  const removeItem = (id: string) => {
    setItems(prev => {
      const it = prev.find(p => p.id === id)
      if (it?.thumbUrl) URL.revokeObjectURL(it.thumbUrl)
      return prev.filter(p => p.id !== id)
    })
  }

  const clearAll = () => {
    items.forEach(i => i.thumbUrl && URL.revokeObjectURL(i.thumbUrl))
    setItems([])
  }

  const runConvert = useCallback(async () => {
    if (items.length === 0 || busy) return
    setBusy(true)
    // Snapshot current options
    const opts = {
      output,
      quality: supportsQuality ? quality : undefined,
      resize: resizeOn ? { maxSide } : undefined,
    }
    // Reset state for items we will reconvert
    setItems(prev => prev.map(it => ({ ...it, status: 'converting', error: undefined, result: undefined })))

    // Process sequentially; update each item as it finishes
    const snapshot = items.map(i => i)
    for (const it of snapshot) {
      try {
        const result = await convert(it.file, opts)
        setItems(prev => prev.map(p => p.id === it.id
          ? { ...p, status: 'done', result }
          : p))
      } catch (err: any) {
        setItems(prev => prev.map(p => p.id === it.id
          ? { ...p, status: 'error', error: err?.message ?? 'Conversion failed' }
          : p))
      }
    }
    setBusy(false)
  }, [items, busy, output, quality, supportsQuality, resizeOn, maxSide])

  const saveOne = async (item: FileItem) => {
    if (!item.result) return
    await saveBlob(item.result.blob, item.result.filename, output)
  }

  const saveAll = async () => {
    const entries = items
      .filter(i => i.status === 'done' && i.result)
      .map(i => ({ name: i.result!.filename, blob: i.result!.blob }))
    if (entries.length === 0) return
    const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12)
    await saveAsZip(entries, `converted-${stamp}.zip`)
  }

  return (
    <main className="main convert-main">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Image Converter' },
      ]} />
      <section className="hero convert-hero">
        <div className="hero-eyebrow">Image Converter</div>
        <h1 className="hero-title">
          Convert any<br />
          <span className="hero-title-line2">image format,</span><br />
          locally.
        </h1>
        <p className="hero-sub">
          PNG · JPG · JFIF · WebP · AVIF · HEIC · TIFF · BMP · ICO<br />
          100% in your browser. No uploads. Works offline.
        </p>
        <div className="convert-badges">
          <Badge variant="accent">● Local</Badge>
          <Badge variant="accent">● Offline</Badge>
          <Badge variant="accent">● Private</Badge>
        </div>
      </section>

      <div
        className={`dropzone${dragOver ? ' drag' : ''}${items.length ? ' has-files' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALL_INPUT_ACCEPT}
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = '' }}
        />
        <div className="dropzone-inner">
          <div className="dropzone-icon" aria-hidden="true">
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
              <rect x="2" y="2" width="44" height="44" fill="hsl(38,96%,54%)" stroke="hsl(240,10%,8%)" strokeWidth="3"/>
              <path d="M24 12V32M24 32L16 24M24 32L32 24" stroke="hsl(240,10%,8%)" strokeWidth="3" strokeLinecap="square"/>
              <line x1="10" y1="38" x2="38" y2="38" stroke="hsl(240,10%,8%)" strokeWidth="3"/>
            </svg>
          </div>
          <div className="dropzone-text">
            <strong>Drop images here</strong>
            <span> or click to browse</span>
          </div>
          <div className="dropzone-hint">PNG · JPG · JFIF · WebP · AVIF · GIF · BMP · ICO · HEIC · HEIF · TIFF</div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="convert-grid">
          <div className="file-panel">
            <div className="panel-header">
              <span className="panel-title">Files ({items.length})</span>
              <button className="panel-link" onClick={clearAll}>Clear all</button>
            </div>
            <ul className="file-list">
              {items.map(it => (
                <li key={it.id} className={`file-row status-${it.status}`}>
                  <div className="file-thumb">
                    {it.thumbUrl
                      ? <img src={it.thumbUrl} alt="" />
                      : <span className="file-thumb-fallback">{(it.sourceFormat || '?').toUpperCase()}</span>
                    }
                  </div>
                  <div className="file-meta">
                    <div className="file-name" title={it.file.name}>{it.file.name}</div>
                    <div className="file-sub">
                      {it.sourceFormat ? FORMATS[it.sourceFormat].label : 'unknown'} · {fmtSize(it.file.size)}
                      {it.result && <> → <strong>{FORMATS[output].label} · {fmtSize(it.result.blob.size)}</strong></>}
                    </div>
                    {it.status === 'error' && <div className="file-error">⚠ {it.error}</div>}
                  </div>
                  <div className="file-actions">
                    {it.status === 'converting' && <span className="spinner" aria-label="Converting" />}
                    {it.status === 'done' && it.result && (
                      <Button size="sm" className="conv-btn-pad" onClick={() => saveOne(it)}>Download</Button>
                    )}
                    <button className="file-x" onClick={() => removeItem(it.id)} aria-label="Remove">×</button>
                  </div>
                </li>
              ))}
            </ul>
            {hasResults && (
              <div className="results-foot">
                <div className="results-summary">
                  {resultCount} converted{errorCount ? `, ${errorCount} failed` : ''}
                </div>
                {resultCount >= 2 && (
                  <Button variant="secondary" className="conv-btn-pad" onClick={saveAll}>↓ Download all as ZIP</Button>
                )}
              </div>
            )}
          </div>

          <aside className="settings-panel">
            <div className="panel-header">
              <span className="panel-title">Output Settings</span>
            </div>

            <div className="setting-group">
              <div className="setting-label">Format</div>
              <div className="format-grid" role="radiogroup" aria-label="Output format">
                {OUTPUT_FORMATS.map(f => (
                  <button
                    key={f}
                    role="radio"
                    aria-checked={output === f}
                    className={`format-tile${output === f ? ' active' : ''}`}
                    onClick={() => setOutput(f)}
                  >
                    {FORMATS[f].label}
                  </button>
                ))}
              </div>
            </div>

            {supportsQuality && (
              <div className="setting-group">
                <div className="setting-label">
                  Quality <span className="setting-value">{quality}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={e => setQuality(parseInt(e.target.value, 10))}
                  className="quality-slider"
                  aria-label="Quality"
                />
                <div className="setting-hint">Higher quality = larger file</div>
              </div>
            )}

            <div className="setting-group">
              <label className="setting-row">
                <input
                  type="checkbox"
                  checked={resizeOn}
                  onChange={e => setResizeOn(e.target.checked)}
                />
                <span className="setting-label-inline">Resize</span>
              </label>
              {resizeOn && (
                <>
                  <div className="resize-input-row">
                    <Input
                      type="number"
                      value={maxSide}
                      min={16}
                      max={8192}
                      onChange={e => setMaxSide(Math.max(16, parseInt(e.target.value || '0', 10) || 0))}
                      className="resize-input"
                    />
                    <span className="resize-unit">px</span>
                  </div>
                  <div className="setting-hint">Max side · aspect preserved · only downscales</div>
                </>
              )}
            </div>

            <Button
              size="lg"
              className="convert-btn"
              onClick={runConvert}
              disabled={busy || items.length === 0}
            >
              {busy ? 'Converting…' : `↻ Convert ${items.length} file${items.length === 1 ? '' : 's'}`}
            </Button>

          </aside>
        </div>
      )}

      <section className="convert-info">
        <div className="info-card">
          <h3>How it works</h3>
          <p>Files never leave your device. All decoding and encoding happens in your browser using Canvas APIs and WebAssembly codecs. HEIC, TIFF, and AVIF codecs are lazy-loaded only when needed, then cached for offline use.</p>
        </div>
        <div className="info-card">
          <h3>Why local?</h3>
          <p>No upload means no waiting on slow connections, no privacy risk, and no server costs. Drop a 50MB photo and the conversion runs at your CPU's full speed — instantly, even on a plane.</p>
        </div>
      </section>

      <section className="popular-conv">
        <h2 className="popular-conv-title">Popular conversions</h2>
        <div className="popular-conv-grid">
          {POPULAR_CONVERSIONS.map(c => (
            // Plain anchors: these are static SEO pages outside the SPA router,
            // so a full navigation is intentional.
            <a key={c.href} href={c.href} className="popular-conv-link">
              {c.label}
            </a>
          ))}
          <a href="/image-converter" className="popular-conv-link popular-conv-all">
            All converters →
          </a>
        </div>
      </section>
    </main>
  )
}
