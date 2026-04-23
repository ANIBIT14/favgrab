import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, size = '64' } = req.query as { url?: string; size?: string }

  if (!url) {
    return res.status(400).json({ error: 'url parameter is required' })
  }

  const validSize = Math.min(Math.max(parseInt(size) || 64, 16), 256)
  const faviconUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}&size=${validSize}`

  try {
    const upstream = await fetch(faviconUrl, {
      headers: { 'User-Agent': 'FavGrab/0.0.1' },
    })

    if (!upstream.ok) {
      return res.status(404).json({ error: 'Favicon not found' })
    }

    const buffer = await upstream.arrayBuffer()
    const contentType = upstream.headers.get('content-type') || 'image/png'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    return res.status(200).send(Buffer.from(buffer))
  } catch {
    return res.status(500).json({ error: 'Failed to fetch favicon' })
  }
}
