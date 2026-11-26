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

/** Engine start-up normally takes 2-5 s; past this something is wrong (e.g. a missing or broken model file). */
const START_TIMEOUT_MS = 60_000;

/** Start-up stages reported by the engine, so the user sees it working instead of a frozen bar. */
const START_STAGES: Record<string, string> = {
  'loading tesseract core': 'Loading the text reader…',
  'initializing tesseract': 'Starting the text reader…',
  'loading language traineddata': 'Loading the English model…',
  'initializing api': 'Preparing the text reader…',
};
let startListener: ((message: string) => void) | null = null;
/** Called with a short message for each start-up stage of any OCR worker (used while the first scan waits). */
export function onOcrStartup(listener: ((message: string) => void) | null): void {
  startListener = listener;
}

/** One worker per pass (3) on machines with 8+ cores, two with 4+, otherwise one. Each uses one CPU core and ~60 MB. */
const CORES = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 2 : 2;
const POOL_SIZE = CORES >= 8 ? 3 : CORES >= 4 ? 2 : 1;
const pool: PoolWorker[] = [];
const waiting: ((w: PoolWorker) => void)[] = [];

function startWorker(): PoolWorker {
  const slot: PoolWorker = { worker: null as unknown as Promise<Worker>, busy: false, progress: () => undefined };
  // Tesseract does not reject when the language model fails to load: it reports "initialization failed" to
  // errorHandler and then waits forever. Turn that (and any other stall) into an error the user can see.
  let started = false;
  let reject: (err: Error) => void = () => undefined;
  const failed = new Promise<never>((_, r) => (reject = r));
  const fail = (err: Error) => {
    if (!started) reject(err); // errors after start-up surface through recognize() instead
  };
  const timer = setTimeout(() => fail(new Error('The text reader did not start. Reload the page and try again; if it keeps happening, run "npm install" in the frontend folder and restart it.')), START_TIMEOUT_MS);
  const created = createWorker('eng', 1, {
    workerPath: ocrAsset('worker.min.js'),
    corePath: ocrAsset('core'),
    langPath: ocrAsset('lang'),
    gzip: false, // the model is served unzipped: see scripts/prepare-ocr-assets.mjs
    cacheMethod: 'none',
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') slot.progress(m.progress);
      else if (START_STAGES[m.status]) startListener?.(START_STAGES[m.status]);
    },
    errorHandler: (e: unknown) => fail(new Error('The text reader could not load its files (' + String(e) + '). Run "npm install" in the frontend folder, restart it, and reload the page.')),
  });
  const ready = created.then((w) => {
    started = true;
    return w;
  });
  // a worker that finishes starting after a failure was reported is not used; shut it down
  failed.catch(() => created.then((w) => w.terminate()).catch(() => undefined));
  slot.worker = Promise.race([ready, failed]).finally(() => clearTimeout(timer)).then(async (w) => {
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
