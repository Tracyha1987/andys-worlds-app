// Copies the Baloo 2 font files (Latin + Vietnamese) into www/fonts so the app works offline.
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'node_modules', '@fontsource', 'baloo-2', 'files');
const dst = path.join(__dirname, '..', 'www', 'fonts');
fs.mkdirSync(dst, { recursive: true });
let copied = 0;
for (const w of [500, 700, 800]) for (const sub of ['latin', 'vietnamese']) {
  const f = `baloo-2-${sub}-${w}-normal.woff2`;
  try { fs.copyFileSync(path.join(src, f), path.join(dst, f)); copied++; }
  catch (e) { console.warn('Font not found (system font will be used):', f); }
}
console.log(`Copied ${copied} font files`);
