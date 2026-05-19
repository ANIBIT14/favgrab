import { downloadZip } from 'client-zip'
import { saveStream } from './saveAs'
import type { SaveResult } from './saveAs'

export interface ZipEntry {
  name: string
  blob: Blob
}

export async function saveAsZip(entries: ZipEntry[], suggestedName: string): Promise<SaveResult> {
  const inputs = entries.map(e => ({
    name: dedupeName(e.name, entries),
    input: e.blob,
    lastModified: new Date(),
  }))
  const res = downloadZip(inputs)
  if (!res.body) {
    // Should not happen in modern browsers
    const blob = await res.blob()
    const stream = new Response(blob).body!
    return saveStream(stream, suggestedName)
  }
  return saveStream(res.body, suggestedName)
}

function dedupeName(name: string, all: ZipEntry[]): string {
  const seen = new Map<string, number>()
  for (const e of all) {
    seen.set(e.name, (seen.get(e.name) ?? 0) + 1)
  }
  if ((seen.get(name) ?? 0) <= 1) return name
  // Add an index to duplicates. Caller's responsibility ideally, but be safe.
  const dot = name.lastIndexOf('.')
  const base = dot > 0 ? name.slice(0, dot) : name
  const ext = dot > 0 ? name.slice(dot) : ''
  return `${base}-${Math.random().toString(36).slice(2, 6)}${ext}`
}
