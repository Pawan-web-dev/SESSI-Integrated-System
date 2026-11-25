/**
 * Offline OCR (Tesseract compiled to WebAssembly). The engine and English model are served from public/ocr.
 *
 * Speed: a small pool of OCR workers is started ahead of time (`warmUpOcr`, called when the FRC panel opens), so
 * the 2-3 s engine start-up is not paid when the user clicks "Upload FRC", and several pages / passes can be read
 * at the same time on different CPU cores.
 */
import { createWorker, type Worker } from 'tesseract.js';
import type { OcrWord } from './frcParse';
import { ocrAsset } from './assets';

interface PoolWorker {
  worker: Promise<Worker>;
  busy: boolean;
  progress: (fraction: number) => void;
}

/** One worker per pass (3) on machines with 8+ cores, two with 4+, otherwise one. Each uses one CPU core and ~60 MB. */
const CORES = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 2 : 2;
const POOL_SIZE = CORES >= 8 ? 3 : CORES >= 4 ? 2 : 1;
const pool: PoolWorker[] = [];
const waiting: ((w: PoolWorker) => void)[] = [];

function startWorker(): PoolWorker {
  const slot: PoolWorker = { worker: null as unknown as Promise<Worker>, busy: false, progress: () => undefined };
  slot.worker = createWorker('eng', 1, {
    workerPath: ocrAsset('worker.min.js'),
    corePath: ocrAsset('core'),
    langPath: ocrAsset('lang'),
    gzip: true,
    cacheMethod: 'none',
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') slot.progress(m.progress);
    },
  }).then(async (w) => {
    // sparse text mode suits the certificate: many short labelled fields in several columns
    await w.setParameters({ tessedit_pageseg_mode: '11' as never, preserve_interword_spaces: '1' });
    return w;
  });
  slot.worker.catch(() => {
    // drop the broken worker; the next request starts a new one
    const i = pool.indexOf(slot);
    if (i >= 0) pool.splice(i, 1);
  });
  return slot;
}

function fillPool() {
  while (pool.length < POOL_SIZE) pool.push(startWorker());
}

/** Start the OCR engine in the background so the first scan does not wait for it. Safe to call many times. */
export function warmUpOcr(): void {
  fillPool();
}

function acquire(): Promise<PoolWorker> {
  fillPool();
  const free = pool.find((w) => !w.busy);
  if (free) {
    free.busy = true;
    return Promise.resolve(free);
  }
  return new Promise((resolve) => waiting.push(resolve));
}

function release(slot: PoolWorker) {
  slot.progress = () => undefined;
  const next = waiting.shift();
  if (next && pool.includes(slot)) next(slot);
  else {
    slot.busy = false;
    if (next) acquire().then(next);
  }
}

/** Read every word and its position from an image. `onProgress` gets 0..1. Runs on the first free worker. */
export async function recognizeWords(image: HTMLCanvasElement, onProgress: (fraction: number) => void = () => undefined): Promise<OcrWord[]> {
  const slot = await acquire();
  try {
    slot.progress = onProgress;
    const w = await slot.worker;
    const { data } = await w.recognize(image, {}, { blocks: true });
    const words: OcrWord[] = [];
    for (const b of data.blocks ?? []) for (const p of b.paragraphs) for (const l of p.lines) for (const word of l.words) words.push({ text: word.text, confidence: word.confidence, x0: word.bbox.x0, y0: word.bbox.y0, x1: word.bbox.x1, y1: word.bbox.y1 });
    onProgress(1);
    return words;
  } finally {
    release(slot);
  }
}
