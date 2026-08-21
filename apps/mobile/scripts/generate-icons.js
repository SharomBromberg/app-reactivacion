#!/usr/bin/env node
/**
 * Genera los PNG de identidad (ícono, favicon, íconos PWA) a partir del
 * glyph aprobado en design/Identidad y Activos de Instalación.dc.html
 * (pin de ubicación con tres nodos de comunidad, sin degradados).
 * Sin dependencias: rasteriza el path SVG a mano y codifica PNG con el
 * zlib nativo de Node. Correr con `node scripts/generate-icons.js` cada
 * vez que cambie la identidad visual.
 */
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const BROWN = [0x6d, 0x3a, 0x18]; // #6D3A18 — fondo / trazo
const CREAM = [0xf2, 0xed, 0xe4]; // #F2EDE4 — pin / puntos

// Path del pin en el viewBox 100x100 del mockup aprobado.
const PIN_PATH = [
  { type: 'M', p: [50, 10] },
  { type: 'C', c1: [28, 10], c2: [16, 26], p: [16, 42] },
  { type: 'C', c1: [16, 62], c2: [50, 92], p: [50, 92] },
  { type: 'C', c1: [50, 92], c2: [84, 62], p: [84, 42] },
  { type: 'C', c1: [84, 26], c2: [72, 10], p: [50, 10] },
];

function flattenPath(segments, steps = 24) {
  const points = [];
  let current = segments[0].p;
  points.push(current);
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i];
    const [x0, y0] = current;
    const [x1, y1] = seg.c1;
    const [x2, y2] = seg.c2;
    const [x3, y3] = seg.p;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const mt = 1 - t;
      const x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
      const y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
      points.push([x, y]);
    }
    current = seg.p;
  }
  return points;
}

const PIN_POLYGON = flattenPath(PIN_PATH);
const PIN_BBOX = PIN_POLYGON.reduce(
  (box, [x, y]) => ({
    minX: Math.min(box.minX, x),
    maxX: Math.max(box.maxX, x),
    minY: Math.min(box.minY, y),
    maxY: Math.max(box.maxY, y),
  }),
  { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
);

function pointInPolygon(x, y, polygon) {
  if (x < PIN_BBOX.minX || x > PIN_BBOX.maxX || y < PIN_BBOX.minY || y > PIN_BBOX.maxY) {
    return false;
  }
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function inCircle(x, y, cx, cy, r) {
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function inRoundedRect(x, y, size, radius) {
  const cx = Math.min(Math.max(x, radius), size - radius);
  const cy = Math.min(Math.max(y, radius), size - radius);
  if (x >= radius && x <= size - radius) return y >= 0 && y <= size;
  if (y >= radius && y <= size - radius) return x >= 0 && x <= size;
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

/**
 * Dibuja el glyph en un lienzo de `size` px.
 * `roundedBg`: true = fondo con esquinas redondeadas (ícono "any");
 *   false = fondo cuadrado a sangre completa (ícono "maskable").
 * `scale`/`offset`: para dejar zona segura en el ícono maskable.
 */
function renderIcon(size, { roundedBg, contentScale = 1, contentOffset = 0, invert = false }) {
  // Supersampling para bordes suaves sin librerías externas; más bajo en
  // lienzos grandes para que el rasterizado a mano siga siendo rápido.
  const SS = size >= 384 ? 2 : 4;
  const hi = size * SS;
  const pixels = Buffer.alloc(hi * hi * 3);
  // invert: variante "moderador" — mismo glyph, fondo/trazo con los
  // colores intercambiados para que el ícono se distinga a simple vista
  // del de la app pública en la pantalla de inicio.
  const bg = invert ? CREAM : BROWN;
  const fg = invert ? BROWN : CREAM;

  for (let py = 0; py < hi; py++) {
    for (let px = 0; px < hi; px++) {
      // Coordenadas del glyph en el viewBox 100x100.
      const vx = ((px / SS - contentOffset) / contentScale) * (100 / size);
      const vy = ((py / SS - contentOffset) / contentScale) * (100 / size);

      let color = null;

      const bgHit = roundedBg
        ? inRoundedRect(px / SS, py / SS, size, size * 0.2)
        : true;
      if (bgHit) color = bg;

      if (color && pointInPolygon(vx, vy, PIN_POLYGON)) color = fg;
      if (color && inCircle(vx, vy, 50, 42, 16)) color = bg;
      if (color && inCircle(vx, vy, 50, 33, 5)) color = fg;
      if (color && inCircle(vx, vy, 43, 50, 5)) color = fg;
      if (color && inCircle(vx, vy, 57, 50, 5)) color = fg;

      const idx = (py * hi + px) * 3;
      if (color) {
        pixels[idx] = color[0];
        pixels[idx + 1] = color[1];
        pixels[idx + 2] = color[2];
      } else {
        // Fuera del fondo redondeado: transparente-equivalente (blanco),
        // no se usa en manifest (solo favicon/assets planos).
        pixels[idx] = 0xff;
        pixels[idx + 1] = 0xff;
        pixels[idx + 2] = 0xff;
      }
    }
  }

  // Downsample SS x SS -> size x size (promedio simple, sin dependencias).
  const out = Buffer.alloc(size * size * 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const idx = ((y * SS + sy) * hi + (x * SS + sx)) * 3;
          r += pixels[idx];
          g += pixels[idx + 1];
          b += pixels[idx + 2];
        }
      }
      const n = SS * SS;
      const outIdx = (y * size + x) * 3;
      out[outIdx] = Math.round(r / n);
      out[outIdx + 1] = Math.round(g / n);
      out[outIdx + 2] = Math.round(b / n);
    }
  }
  return out;
}

// --- Codificador PNG mínimo (RGB de 8 bits, sin alfa) ---------------------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(rgbBuffer, size) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // profundidad de bits
  ihdr[9] = 2; // color type 2 = RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 3 + 1);
    raw[rowStart] = 0; // filtro "None"
    rgbBuffer.copy(raw, rowStart + 1, y * size * 3, (y + 1) * size * 3);
  }
  const idatData = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function writeIcon(filePath, size, opts) {
  const rgb = renderIcon(size, opts);
  fs.writeFileSync(filePath, encodePng(rgb, size));
  console.log(`✓ ${path.relative(process.cwd(), filePath)} (${size}x${size})`);
}

const ASSETS_DIR = path.join(__dirname, '../assets');
const PUBLIC_DIR = path.join(__dirname, '../public');

writeIcon(path.join(ASSETS_DIR, 'icon.png'), 1024, { roundedBg: true, contentScale: 1, contentOffset: 0 });
writeIcon(path.join(PUBLIC_DIR, 'icon-192.png'), 192, { roundedBg: true, contentScale: 1, contentOffset: 0 });
writeIcon(path.join(PUBLIC_DIR, 'icon-512.png'), 512, { roundedBg: true, contentScale: 1, contentOffset: 0 });
// Maskable: fondo cuadrado a sangre completa, glyph reducido a ~70% y
// centrado para no perderse bajo la máscara circular de algunos launchers.
writeIcon(path.join(PUBLIC_DIR, 'icon-maskable.png'), 512, {
  roundedBg: false,
  contentScale: 0.7,
  contentOffset: 512 * 0.15,
});
writeIcon(path.join(PUBLIC_DIR, 'favicon.png'), 48, { roundedBg: true, contentScale: 1, contentOffset: 0 });

// Variante "moderador" (colores invertidos) para la PWA instalable aparte
// del panel admin — ver apps/mobile/public/admin-manifest.json.
writeIcon(path.join(PUBLIC_DIR, 'admin-icon-192.png'), 192, {
  roundedBg: true,
  contentScale: 1,
  contentOffset: 0,
  invert: true,
});
writeIcon(path.join(PUBLIC_DIR, 'admin-icon-512.png'), 512, {
  roundedBg: true,
  contentScale: 1,
  contentOffset: 0,
  invert: true,
});
writeIcon(path.join(PUBLIC_DIR, 'admin-icon-maskable.png'), 512, {
  roundedBg: false,
  contentScale: 0.7,
  contentOffset: 512 * 0.15,
  invert: true,
});
writeIcon(path.join(PUBLIC_DIR, 'admin-favicon.png'), 48, {
  roundedBg: true,
  contentScale: 1,
  contentOffset: 0,
  invert: true,
});

console.log('Íconos generados.');
