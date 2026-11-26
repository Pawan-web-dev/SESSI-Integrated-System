/** Turns an uploaded FRC (image or PDF) into canvases the scanner can work on. */

export interface PageImages {
  /** page at normal size (first OCR pass) */
  base: HTMLCanvasElement;
  /** enlarged page (up to 2x; second OCR pass, and the source of the person photos) */
  big: HTMLCanvasElement;
  /** grey-scale, contrast-stretched copy of the page (third OCR pass: helps with faint or uneven phone photos) */
  sharp: HTMLCanvasElement;
}

const MAX_BASE_WIDTH = 1700;
/** the enlarged copy is at most this wide: a 2x copy of a 1700 px page has 4x the pixels and took most of the scan time */
const MAX_BIG_WIDTH = 2600;
/** PDFs are drawn at this width (sharp vector text, so one OCR pass is usually enough) */
const PDF_WIDTH = 1600;
const MAX_PAGES = 6;

function canvasOf(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.round(w);
  c.height = Math.round(h);
  return c;
}

function scaled(src: HTMLCanvasElement, factor: number): HTMLCanvasElement {
  const c = canvasOf(src.width * factor, src.height * factor);
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

/** Grey-scale copy with the darkest 2% made black and the lightest 2% white, so faint print stands out. */
function contrasted(src: HTMLCanvasElement): HTMLCanvasElement {
  const c = canvasOf(src.width, src.height);
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  const hist = new Uint32Array(256);
  for (let i = 0; i < d.length; i += 4) {
    const g = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    d[i] = g;
    hist[g]++;
  }
  const total = d.length / 4;
  const cut = total * 0.02;
  let lo = 0;
  let below = hist[0];
  while (lo < 254 && below < cut) below += hist[++lo];
  let hi = 255;
  let above = hist[255];
  while (hi > lo + 1 && above < cut) above += hist[--hi];
  const span = Math.max(1, hi - lo);
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.max(0, Math.min(255, ((d[i] - lo) * 255) / span));
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/**
 * Small pictures (screenshots, WhatsApp images ~640 px wide) have text only ~8 px tall, which OCR cannot read;
 * they are enlarged to this width first so the text is ~20 px tall in every pass.
 */
const MIN_BASE_WIDTH = 1600;

function toPage(source: HTMLCanvasElement): PageImages {
  const base =
    source.width > MAX_BASE_WIDTH ? scaled(source, MAX_BASE_WIDTH / source.width)
    : source.width < MIN_BASE_WIDTH ? scaled(source, MIN_BASE_WIDTH / source.width)
    : source;
  return { base, big: scaled(base, Math.min(2, MAX_BIG_WIDTH / base.width)), sharp: contrasted(base) };
}

async function imagePage(file: File): Promise<PageImages[]> {
  const bitmap = await createImageBitmap(file);
  const c = canvasOf(bitmap.width, bitmap.height);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return [toPage(c)];
}

async function pdfPages(file: File): Promise<PageImages[]> {
  const pdfjs = await import('pdfjs-dist');
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: PageImages[] = [];
  for (let n = 1; n <= Math.min(doc.numPages, MAX_PAGES); n++) {
    const page = await doc.getPage(n);
    const natural = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: PDF_WIDTH / natural.width });
    const c = canvasOf(viewport.width, viewport.height);
    await page.render({ canvas: c, viewport }).promise;
    pages.push(toPage(c));
  }
  return pages;
}

export function loadPages(file: File): Promise<PageImages[]> {
  return /\.pdf$/i.test(file.name) || file.type === 'application/pdf' ? pdfPages(file) : imagePage(file);
}
