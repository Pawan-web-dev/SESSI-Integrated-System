/** Offline OCR (Tesseract compiled to WebAssembly). The engine and English model are served from public/ocr. */
import { createWorker, type Worker } from 'tesseract.js';
import type { OcrWord } from './frcParse';
import { ocrAsset } from './assets';

let worker: Promise<Worker> | null = null;
let progress: (fraction: number) => void = () => undefined;

function getWorker(): Promise<Worker> {
  worker ??= createWorker('eng', 1, {
    workerPath: ocrAsset('worker.min.js'),
    corePath: ocrAsset('core'),
    langPath: ocrAsset('lang'),
    gzip: true,
    cacheMethod: 'none',
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') progress(m.progress);
    },
  }).then(async (w) => {
    // sparse text mode suits the certificate: many short labelled fields in several columns
    await w.setParameters({ tessedit_pageseg_mode: '11' as never, preserve_interword_spaces: '1' });
    return w;
  });
  worker.catch(() => (worker = null));
  return worker;
}

/** Read every word and its position from an image. `onProgress` gets 0..1. */
export async function recognizeWords(image: HTMLCanvasElement, onProgress: (fraction: number) => void = () => undefined): Promise<OcrWord[]> {
  progress = onProgress;
  const w = await getWorker();
  const { data } = await w.recognize(image, {}, { blocks: true });
  const words: OcrWord[] = [];
  for (const b of data.blocks ?? []) for (const p of b.paragraphs) for (const l of p.lines) for (const word of l.words) words.push({ text: word.text, confidence: word.confidence, x0: word.bbox.x0, y0: word.bbox.y0, x1: word.bbox.x1, y1: word.bbox.y1 });
  return words;
}
