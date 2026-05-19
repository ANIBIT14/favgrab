import type { InputFormat } from './types'
import { ConvertError } from './types'
import { detectFormatFromBytes, detectFormatFromName } from './formats'

export interface DecodedImage {
  bitmap: ImageBitmap
  sourceFormat: InputFormat
  width: number
  height: number
}

export async function detectFormat(file: File): Promise<InputFormat | null> {
  return (await detectFormatFromBytes(file)) ?? detectFormatFromName(file.name, file.type)
}

export async function decode(file: File): Promise<DecodedImage> {
  const sourceFormat = await detectFormat(file)
  if (!sourceFormat) {
    throw new ConvertError(`Unrecognized format: ${file.name}`, 'unknown_format')
  }

  if (sourceFormat === 'heic' || sourceFormat === 'heif') {
    return decodeHeic(file, sourceFormat)
  }
  if (sourceFormat === 'tiff') {
    return decodeTiff(file)
  }
  // Native path
  try {
    const bitmap = await createImageBitmap(file)
    return { bitmap, sourceFormat, width: bitmap.width, height: bitmap.height }
  } catch {
    // Fallback: <img> + canvas
    const bitmap = await decodeViaImgTag(file)
    return { bitmap, sourceFormat, width: bitmap.width, height: bitmap.height }
  }
}

async function decodeViaImgTag(file: File): Promise<ImageBitmap> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    await new Promise<void>((res, rej) => {
      img.onload = () => res()
      img.onerror = () => rej(new ConvertError('Failed to decode image', 'decode_failed'))
      img.src = url
    })
    return await createImageBitmap(img)
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function decodeHeic(file: File, sourceFormat: InputFormat): Promise<DecodedImage> {
  // libheif-js ships a bundled wasm decoder
  const libheifMod: any = await import('libheif-js/wasm-bundle')
  const libheif = libheifMod.default || libheifMod
  const decoder = new libheif.HeifDecoder()
  const buf = await file.arrayBuffer()
  const images = decoder.decode(buf)
  if (!images || images.length === 0) {
    throw new ConvertError('No images found in HEIC file', 'decode_failed')
  }
  const image = images[0]
  const w = image.get_width()
  const h = image.get_height()
  const rgba = new Uint8ClampedArray(w * h * 4)
  await new Promise<void>((resolve, reject) => {
    image.display({ data: rgba, width: w, height: h }, (out: any) => {
      if (!out) reject(new ConvertError('HEIC display failed', 'decode_failed'))
      else resolve()
    })
  })
  const imageData = new ImageData(rgba, w, h)
  const bitmap = await createImageBitmap(imageData)
  return { bitmap, sourceFormat, width: w, height: h }
}

async function decodeTiff(file: File): Promise<DecodedImage> {
  const utifMod: any = await import('utif2')
  const UTIF = utifMod.default || utifMod
  const buf = await file.arrayBuffer()
  const ifds = UTIF.decode(buf)
  if (!ifds || ifds.length === 0) {
    throw new ConvertError('No images found in TIFF file', 'decode_failed')
  }
  UTIF.decodeImage(buf, ifds[0])
  const rgba = UTIF.toRGBA8(ifds[0])
  const w = ifds[0].width
  const h = ifds[0].height
  const imageData = new ImageData(new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, rgba.byteLength), w, h)
  const bitmap = await createImageBitmap(imageData)
  return { bitmap, sourceFormat: 'tiff', width: w, height: h }
}
