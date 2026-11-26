// Copies the offline FRC-scanning assets (OCR engine + English model, face-detector runtime) into public/ocr/
// so the browser loads them from this site and nothing is fetched from the internet when scanning.
// Runs automatically before `npm run dev` / `build` / `preview`.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'ocr');
const nm = (p) => join(root, 'node_modules', p);

const copies = [
  [nm('tesseract.js/dist/worker.min.js'), join(out, 'worker.min.js')],
  [nm('@mediapipe/tasks-vision/wasm'), join(out, 'mediapipe')],
];

// The English model is stored unzipped (eng.traineddata, ~4 MB). A ".gz" file is grabbed by download managers
// such as IDM before the OCR engine can read it, and dev servers send it with "Content-Encoding: gzip" so the
// browser unzips it on the way; either way the engine fails with "initialization failed".
const langGz = nm('@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz');
const lang = join(out, 'lang', 'eng.traineddata');
rmSync(join(out, 'lang', 'eng.traineddata.gz'), { force: true }); // old zipped copy
if (!existsSync(langGz)) console.warn('[ocr-assets] missing ' + langGz + ' - run "npm install" first');
else if (!existsSync(lang)) {
  mkdirSync(dirname(lang), { recursive: true });
  writeFileSync(lang, gunzipSync(readFileSync(langGz)));
  console.log('[ocr-assets] unzipped the English model to public/ocr/lang');
}
// only the LSTM builds of the OCR core are used
for (const f of readdirSync(nm('tesseract.js-core'))) {
  if (f.endsWith('-lstm.wasm.js')) copies.push([nm('tesseract.js-core/' + f), join(out, 'core', f)]);
}

let copied = 0;
for (const [from, to] of copies) {
  if (!existsSync(from)) {
    console.warn('[ocr-assets] missing ' + from + ' - run "npm install" first');
    continue;
  }
  if (existsSync(to) && !from.endsWith('wasm')) continue; // already there
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
  copied++;
}
console.log('[ocr-assets] ' + (copied ? 'copied ' + copied + ' item(s) to public/ocr' : 'up to date'));
