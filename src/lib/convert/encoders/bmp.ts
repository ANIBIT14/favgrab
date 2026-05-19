// Minimal BMP24 encoder. Writes a 24-bit uncompressed BMP from RGBA pixels.
export function encodeBmp24(rgba: Uint8ClampedArray, width: number, height: number): Blob {
  const rowSize = Math.floor((24 * width + 31) / 32) * 4
  const pixelArraySize = rowSize * height
  const fileSize = 54 + pixelArraySize
  const buf = new ArrayBuffer(fileSize)
  const view = new DataView(buf)
  const u8 = new Uint8Array(buf)

  // File header (14 bytes)
  view.setUint8(0, 0x42); view.setUint8(1, 0x4d) // "BM"
  view.setUint32(2, fileSize, true)
  view.setUint32(6, 0, true)
  view.setUint32(10, 54, true) // pixel data offset

  // DIB header (BITMAPINFOHEADER, 40 bytes)
  view.setUint32(14, 40, true)
  view.setInt32(18, width, true)
  view.setInt32(22, height, true) // positive => bottom-up
  view.setUint16(26, 1, true)     // planes
  view.setUint16(28, 24, true)    // bits per pixel
  view.setUint32(30, 0, true)     // BI_RGB
  view.setUint32(34, pixelArraySize, true)
  view.setUint32(38, 2835, true)  // 72 DPI
  view.setUint32(42, 2835, true)
  view.setUint32(46, 0, true)
  view.setUint32(50, 0, true)

  // Pixel data, bottom-up, BGR, row-padded
  for (let y = 0; y < height; y++) {
    const srcRow = (height - 1 - y) * width * 4
    const dstRow = 54 + y * rowSize
    for (let x = 0; x < width; x++) {
      const s = srcRow + x * 4
      const d = dstRow + x * 3
      // BMP doesn't have alpha — composite over white for visual sanity
      const a = rgba[s + 3] / 255
      u8[d] = Math.round(rgba[s + 2] * a + 255 * (1 - a))     // B
      u8[d + 1] = Math.round(rgba[s + 1] * a + 255 * (1 - a)) // G
      u8[d + 2] = Math.round(rgba[s] * a + 255 * (1 - a))     // R
    }
  }
  return new Blob([buf], { type: 'image/bmp' })
}
