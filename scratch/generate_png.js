const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Lightweight PNG generator in pure Node.js (no external C++ binaries required)
function createPNG(width, height, r, g, b, textLabel) {
  // Create uncompressed RGBA image buffer
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      // Draw border ring
      const isBorder = (x < 12 || x > width - 12 || y < 12 || y > height - 12);
      const isCorner = ((x < 36 && y < 36) || (x > width - 36 && y < 36) || (x < 36 && y > height - 36) || (x > width - 36 && y > height - 36));
      
      if (isBorder && !isCorner) {
        rawData[offset++] = 212; // Gold R
        rawData[offset++] = 175; // Gold G
        rawData[offset++] = 55;  // Gold B
        rawData[offset++] = 255;
      } else {
        rawData[offset++] = r;
        rawData[offset++] = g;
        rawData[offset++] = b;
        rawData[offset++] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // Helper to write chunk
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crc.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  // CRC32 implementation
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type 6 (RGBA)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(__dirname, '..', 'public');

// Generate 256x256 icon.png
const iconPng = createPNG(256, 256, 11, 15, 23, 'NLA');
fs.writeFileSync(path.join(publicDir, 'icon.png'), iconPng);

// Generate 256x256 splash.png
const splashPng = createPNG(256, 256, 7, 9, 14, 'NLA');
fs.writeFileSync(path.join(publicDir, 'splash.png'), splashPng);

// Generate 1200x630 og-image.png
const ogPng = createPNG(1200, 630, 7, 9, 14, 'NLA');
fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogPng);

console.log('PNG images generated successfully in public/');
