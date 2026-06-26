export type InputFormat =
  | 'png' | 'jpeg' | 'jfif' | 'webp' | 'avif' | 'gif' | 'bmp' | 'ico'
  | 'heic' | 'heif' | 'tiff'

export type OutputFormat =
  | 'png' | 'jpeg' | 'jfif' | 'webp' | 'avif' | 'bmp' | 'ico'

export interface ResizeOptions {
  maxSide: number
}

export interface ConvertOptions {
  output: OutputFormat
  quality?: number
  resize?: ResizeOptions
}

export interface ConvertResult {
  blob: Blob
  filename: string
  width: number
  height: number
  sourceFormat: InputFormat
}

export class ConvertError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'ConvertError'
  }
}
