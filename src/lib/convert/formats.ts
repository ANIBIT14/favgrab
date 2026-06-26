import type { InputFormat, OutputFormat } from './types'

export interface FormatInfo {
  id: InputFormat
  label: string
  ext: string
  mime: string
  inputExts: string[]
  inputMimes: string[]
  supportsQuality: boolean
  canOutput: boolean
}

export const FORMATS: Record<InputFormat, FormatInfo> = {
  png: {
    id: 'png', label: 'PNG', ext: 'png', mime: 'image/png',
    inputExts: ['png'], inputMimes: ['image/png'],
    supportsQuality: false, canOutput: true,
  },
  jpeg: {
    id: 'jpeg', label: 'JPG', ext: 'jpg', mime: 'image/jpeg',
    inputExts: ['jpg', 'jpeg'], inputMimes: ['image/jpeg'],
    supportsQuality: true, canOutput: true,
  },
  // JFIF is the standard JPEG container — same bytes, different extension.
  // It decodes through the native JPEG path and encodes as image/jpeg; we keep
  // it as a distinct format so users can save .jfif and so it gets its own SEO
  // pages. No inputMime is claimed (image/jpeg already maps to jpeg, and JFIF
  // files are detected by their FF D8 FF magic as jpeg anyway).
  jfif: {
    id: 'jfif', label: 'JFIF', ext: 'jfif', mime: 'image/jpeg',
    inputExts: ['jfif'], inputMimes: [],
    supportsQuality: true, canOutput: true,
  },
  webp: {
    id: 'webp', label: 'WebP', ext: 'webp', mime: 'image/webp',
    inputExts: ['webp'], inputMimes: ['image/webp'],
    supportsQuality: true, canOutput: true,
  },
  avif: {
    id: 'avif', label: 'AVIF', ext: 'avif', mime: 'image/avif',
    inputExts: ['avif'], inputMimes: ['image/avif'],
    supportsQuality: true, canOutput: true,
  },
  gif: {
    id: 'gif', label: 'GIF', ext: 'gif', mime: 'image/gif',
    inputExts: ['gif'], inputMimes: ['image/gif'],
    supportsQuality: false, canOutput: false,
  },
  bmp: {
    id: 'bmp', label: 'BMP', ext: 'bmp', mime: 'image/bmp',
    inputExts: ['bmp'], inputMimes: ['image/bmp', 'image/x-ms-bmp'],
    supportsQuality: false, canOutput: true,
  },
  ico: {
    id: 'ico', label: 'ICO', ext: 'ico', mime: 'image/x-icon',
    inputExts: ['ico'], inputMimes: ['image/x-icon', 'image/vnd.microsoft.icon'],
    supportsQuality: false, canOutput: true,
  },
  heic: {
    id: 'heic', label: 'HEIC', ext: 'heic', mime: 'image/heic',
    inputExts: ['heic'], inputMimes: ['image/heic'],
    supportsQuality: false, canOutput: false,
  },
  heif: {
    id: 'heif', label: 'HEIF', ext: 'heif', mime: 'image/heif',
    inputExts: ['heif'], inputMimes: ['image/heif'],
    supportsQuality: false, canOutput: false,
  },
  tiff: {
    id: 'tiff', label: 'TIFF', ext: 'tiff', mime: 'image/tiff',
    inputExts: ['tif', 'tiff'], inputMimes: ['image/tiff'],
    supportsQuality: false, canOutput: false,
  },
}

export const OUTPUT_FORMATS: OutputFormat[] = ['png', 'jpeg', 'jfif', 'webp', 'avif', 'bmp', 'ico']

export const ALL_INPUT_ACCEPT = (() => {
  const exts = new Set<string>()
  const mimes = new Set<string>()
  for (const f of Object.values(FORMATS)) {
    f.inputExts.forEach(e => exts.add('.' + e))
    f.inputMimes.forEach(m => mimes.add(m))
  }
  return [...mimes, ...exts].join(',')
})()

const EXT_TO_FORMAT: Record<string, InputFormat> = (() => {
  const map: Record<string, InputFormat> = {}
  for (const f of Object.values(FORMATS)) {
    f.inputExts.forEach(e => { map[e] = f.id })
  }
  return map
})()

const MIME_TO_FORMAT: Record<string, InputFormat> = (() => {
  const map: Record<string, InputFormat> = {}
  for (const f of Object.values(FORMATS)) {
    f.inputMimes.forEach(m => { map[m] = f.id })
  }
  return map
})()

export function detectFormatFromName(name: string, mime?: string): InputFormat | null {
  if (mime && MIME_TO_FORMAT[mime]) return MIME_TO_FORMAT[mime]
  const ext = name.toLowerCase().split('.').pop()
  if (ext && EXT_TO_FORMAT[ext]) return EXT_TO_FORMAT[ext]
  return null
}

export async function detectFormatFromBytes(file: File): Promise<InputFormat | null> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  // PNG: 89 50 4E 47
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) return 'png'
  // JPEG: FF D8 FF
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpeg'
  // GIF: 47 49 46 38
  if (head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46) return 'gif'
  // BMP: 42 4D
  if (head[0] === 0x42 && head[1] === 0x4d) return 'bmp'
  // ICO: 00 00 01 00
  if (head[0] === 0x00 && head[1] === 0x00 && head[2] === 0x01 && head[3] === 0x00) return 'ico'
  // TIFF: 49 49 2A 00 (LE) or 4D 4D 00 2A (BE)
  if ((head[0] === 0x49 && head[1] === 0x49 && head[2] === 0x2a) ||
      (head[0] === 0x4d && head[1] === 0x4d && head[3] === 0x2a)) return 'tiff'
  // RIFF (WebP): "RIFF"...."WEBP"
  if (head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46 &&
      head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50) return 'webp'
  // ISO BMFF (HEIC/HEIF/AVIF): bytes 4..7 = "ftyp", bytes 8..11 = brand
  if (head[4] === 0x66 && head[5] === 0x74 && head[6] === 0x79 && head[7] === 0x70) {
    const brand = String.fromCharCode(head[8], head[9], head[10], head[11])
    if (brand === 'avif' || brand === 'avis') return 'avif'
    if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(brand)) return 'heic'
    if (brand === 'heif') return 'heif'
  }
  return null
}
