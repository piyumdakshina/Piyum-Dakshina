const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function makePng(size) {
  const raw = Buffer.alloc(size * (1 + size * 4))
  const cx = size / 2
  const cy = size / 2
  const rCore = size * 0.3
  const rInner = size * 0.22
  const bg = [3, 19, 28, 255]
  const cyan = [24, 160, 192, 255]
  const ring = [114, 229, 248, 255]
  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 4)
    raw[row] = 0
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx, y - cy)
      let c = bg
      if (d <= rInner) c = cyan
      else if (d <= rCore) c = ring
      else if (d <= rCore + size * 0.05 && d >= rCore - size * 0.012) c = ring
      const o = row + 1 + x * 4
      raw[o] = c[0]
      raw[o + 1] = c[1]
      raw[o + 2] = c[2]
      raw[o + 3] = c[3]
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const idat = zlib.deflateSync(raw, { level: 9 })

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const outDir = path.join(__dirname, '..', 'public')
fs.writeFileSync(path.join(outDir, 'icon-192.png'), makePng(192))
fs.writeFileSync(path.join(outDir, 'icon-512.png'), makePng(512))
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), makePng(180))
console.log('icons written:', fs.readdirSync(outDir).filter((f) => /icon|apple/.test(f)).join(', '))
