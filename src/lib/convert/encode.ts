import type { OutputFormat } from './types'
import { ConvertError } from './types'
import { encodeBmp24 } from './encoders/bmp'
import { encodeIco } from './encoders/ico'

export async function encode(
  bitmap: ImageBitmap,
  format: OutputFormat,
  quality: number = 95
): Promise<Blob> {
  const q01 = Math.max(1, Math.min(100, quality)) / 100

  if (format === 'png') {
    // PNG is lossless — quality arg is ignored by Canvas.
    return canvasToBlob(bitmap, 'image/png', 1)
  }
  if (format === 'jpeg' || format === 'webp') {
    return canvasToBlob(bitmap, `image/${format}`, q01)
  }

  if (format === 'avif') {
    return encodeAvif(bitmap, quality)
  }

  if (format === 'bmp') {
    const rgba = getRgba(bitmap)
    return encodeBmp24(rgba, bitmap.width, bitmap.height)
  }

  if (format === 'ico') {
    // ICO max edge is 256.
    if (bitmap.width > 256 || bitmap.height > 256) {
      const scale = 256 / Math.max(bitmap.width, bitmap.height)
      const w = Math.round(bitmap.width * scale)
      const h = Math.round(bitmap.height * scale)
      const scaled = await scaleBitmap(bitmap, w, h)
      const png = await canvasToBlob(scaled, 'image/png', 1)
      return encodeIco(png, w, h)
    }
    const png = await canvasToBlob(bitmap, 'image/png', 1)
    return encodeIco(png, bitmap.width, bitmap.height)
  }

  throw new ConvertError(`Unsupported output format: ${format}`, 'unsupported_output')
}

function canvasToBlob(bitmap: ImageBitmap, mime: string, quality: number): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new ConvertError('Canvas context unavailable', 'canvas_unavailable')
  // Identity blit — disable smoothing to guarantee pixel-perfect 1:1 copy.
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(bitmap, 0, 0)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) reject(new ConvertError(`Failed to encode as ${mime}`, 'encode_failed'))
        else resolve(blob)
      },
      mime,
      quality
    )
  })
}

function getRgba(bitmap: ImageBitmap): Uint8ClampedArray {
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new ConvertError('Canvas context unavailable', 'canvas_unavailable')
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(bitmap, 0, 0)
  return ctx.getImageData(0, 0, bitmap.width, bitmap.height).data
}

async function scaleBitmap(bitmap: ImageBitmap, w: number, h: number): Promise<ImageBitmap> {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new ConvertError('Canvas context unavailable', 'canvas_unavailable')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, w, h)
  return await createImageBitmap(canvas)
}

async function encodeAvif(bitmap: ImageBitmap, quality: number): Promise<Blob> {
  const mod: any = await import('@jsquash/avif')
  const encodeFn = mod.encode || mod.default?.encode || mod.default
  const rgba = getRgba(bitmap)
  const imageData = { data: rgba, width: bitmap.width, height: bitmap.height }
  const buf: ArrayBuffer = await encodeFn(imageData, {
    quality: Math.round(quality),
  })
  return new Blob([buf], { type: 'image/avif' })
}
