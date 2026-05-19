import { FORMATS } from './formats'
import type { OutputFormat } from './types'

// File System Access API minimal types (not in all TS lib targets)
interface FilePickerAcceptType {
  description?: string
  accept: Record<string, string[]>
}
interface SaveFilePickerOptions {
  suggestedName?: string
  types?: FilePickerAcceptType[]
}
interface FileSystemWritableFileStream {
  write(data: Blob | BufferSource | string): Promise<void>
  close(): Promise<void>
}
interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>
}

declare global {
  interface Window {
    showSaveFilePicker?: (opts?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>
  }
}

export function supportsSavePicker(): boolean {
  return typeof window !== 'undefined' && typeof window.showSaveFilePicker === 'function'
}

export interface SaveResult {
  ok: boolean
  cancelled?: boolean
  usedPicker: boolean
}

export async function saveBlob(
  blob: Blob,
  suggestedName: string,
  format?: OutputFormat
): Promise<SaveResult> {
  if (supportsSavePicker()) {
    try {
      const types: FilePickerAcceptType[] = format
        ? [{
            description: `${FORMATS[format].label} image`,
            accept: { [FORMATS[format].mime]: ['.' + FORMATS[format].ext] },
          }]
        : []
      const handle = await window.showSaveFilePicker!({ suggestedName, types })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return { ok: true, usedPicker: true }
    } catch (err: any) {
      if (err?.name === 'AbortError') return { ok: false, cancelled: true, usedPicker: true }
      // Permission or other error — fall through to <a download>
    }
  }
  fallbackDownload(blob, suggestedName)
  return { ok: true, usedPicker: false }
}

export async function saveStream(
  stream: ReadableStream<Uint8Array>,
  suggestedName: string
): Promise<SaveResult> {
  if (supportsSavePicker()) {
    try {
      const handle = await window.showSaveFilePicker!({
        suggestedName,
        types: [{ description: 'ZIP archive', accept: { 'application/zip': ['.zip'] } }],
      })
      const writable = await handle.createWritable()
      const reader = stream.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) await writable.write(value as unknown as BufferSource)
      }
      await writable.close()
      return { ok: true, usedPicker: true }
    } catch (err: any) {
      if (err?.name === 'AbortError') return { ok: false, cancelled: true, usedPicker: true }
    }
  }
  // Fallback: materialize stream into a blob
  const res = new Response(stream)
  const blob = await res.blob()
  fallbackDownload(blob, suggestedName)
  return { ok: true, usedPicker: false }
}

function fallbackDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
