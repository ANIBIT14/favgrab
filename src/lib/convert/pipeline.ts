import { decode } from './decode'
import { encode } from './encode'
import { FORMATS } from './formats'
import type { ConvertOptions, ConvertResult } from './types'
import { ConvertError } from './types'

export async function convert(file: File, opts: ConvertOptions): Promise<ConvertResult> {
  const decoded = await decode(file)
  let bitmap = decoded.bitmap

  if (opts.resize?.maxSide) {
    const max = Math.max(bitmap.width, bitmap.height)
    if (max > opts.resize.maxSide) {
      const scale = opts.resize.maxSide / max
      const w = Math.round(bitmap.width * scale)
      const h = Math.round(bitmap.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new ConvertError('Canvas context unavailable', 'canvas_unavailable')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(bitmap, 0, 0, w, h)
      bitmap = await createImageBitmap(canvas)
    }
  }

  const blob = await encode(bitmap, opts.output, opts.quality)
  const filename = swapExtension(file.name, FORMATS[opts.output].ext)

  return {
    blob,
    filename,
    width: bitmap.width,
    height: bitmap.height,
    sourceFormat: decoded.sourceFormat,
  }
}

function swapExtension(name: string, newExt: string): string {
  const dot = name.lastIndexOf('.')
  const base = dot > 0 ? name.slice(0, dot) : name
  return `${base}.${newExt}`
}
