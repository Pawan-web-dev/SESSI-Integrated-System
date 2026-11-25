/** Turns an uploaded FRC (image or PDF) into canvases the scanner can work on. */

export interface PageImages {
  /** page at normal size (used for the first OCR pass) */
  base: HTMLCanvasElement;
  /** page at 2x (second OCR pass and the source of the person photos) */
  big: HTMLCanvasElement;
}

const MAX_BASE_WIDTH = 1700;
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

function toPage(source: HTMLCanvasElement): PageImages {
  const base = source.width > MAX_BASE_WIDTH ? scaled(source, MAX_BASE_WIDTH / source.width) : source;
  return { base, big: scaled(base, 2) };
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
    const viewport = page.getViewport({ scale: 1100 / natural.width });
    const c = canvasOf(viewport.width, viewport.height);
    await page.render({ canvas: c, viewport }).promise;
    pages.push(toPage(c));
  }
  return pages;
}

export function loadPages(file: File): Promise<PageImages[]> {
  return /\.pdf$/i.test(file.name) || file.type === 'application/pdf' ? pdfPages(file) : imagePage(file);
}
