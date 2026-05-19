// Wraps a PNG payload in an ICO container (single image).
// ICO supports widths/heights up to 256 (encoded as 0 for 256).
export async function encodeIco(pngBlob: Blob, width: number, height: number): Promise<Blob> {
  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer())
  const headerSize = 6 + 16
  const total = headerSize + pngBytes.length
  const buf = new ArrayBuffer(total)
  const view = new DataView(buf)
  const u8 = new Uint8Array(buf)

  // ICONDIR
  view.setUint16(0, 0, true)       // reserved
  view.setUint16(2, 1, true)       // type 1 = icon
  view.setUint16(4, 1, true)       // # images

  // ICONDIRENTRY
  u8[6] = width >= 256 ? 0 : width
  u8[7] = height >= 256 ? 0 : height
  u8[8] = 0                         // palette
  u8[9] = 0                         // reserved
  view.setUint16(10, 1, true)       // planes
  view.setUint16(12, 32, true)      // bit count
  view.setUint32(14, pngBytes.length, true)
  view.setUint32(18, headerSize, true)

  u8.set(pngBytes, headerSize)
  return new Blob([buf], { type: 'image/x-icon' })
}
