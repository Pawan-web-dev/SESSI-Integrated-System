/**
 * Scans a Family Registration Certificate completely offline:
 *   1. OCR (Tesseract) reads every page three times (normal size, enlarged, high contrast) and the passes fill each
 *      other's gaps. The passes and pages run in parallel on the OCR workers;
 *   2. the layout parser turns the words into people (name, CNIC, date of birth, relationship);
 *   3. a face detector (MediaPipe BlazeFace) finds each person's photo, which is cropped to a 200x200 JPEG.
 */
import { detectFaces, warmUpFaces, type FaceBox } from './faces';
import { assembleFrc, extractCards, genderFromRelation, mergeCards, type FrcCards, type FrcPerson } from './frcParse';
import { genderOfRelation, type Gender } from './frcRelations';

/**
 * The FRC does not print the applicant's gender: take it from "Relation with HOF" (Son, Wife …), the spouse's
 * label (Wife / Husband), or the children's cards (the applicant is their father or their mother).
 */
function applicantGender(a: FrcPerson, members: FrcPerson[], hofRelation: string): Gender {
  const fromHof = genderFromRelation(hofRelation);
  if (fromHof) return fromHof;
  if (members.some((m) => /\bwife\b/i.test(m.relation))) return 'MALE';
  if (members.some((m) => /\bhusband\b/i.test(m.relation))) return 'FEMALE';
  if (!a.name) return '';
  const children = members.filter((m) => /\b(son|daughter)\b/i.test(m.relation));
  const mrs = /^\s*mrs\.?\s+/i; // "Mrs. Mansoor Ali" is Mansoor Ali's wife, so Mansoor Ali is the man
  if (children.some((c) => sameName(c.fatherName, a.name) || (mrs.test(c.motherName) && sameName(c.motherName, a.name)))) return 'MALE';
  if (children.some((c) => !mrs.test(c.motherName) && sameName(c.motherName, a.name))) return 'FEMALE';
  return '';
}

/** Letters only, without a "Mr." / "Mrs." title. */
const nameKey = (s: string) => s.toLowerCase().replace(/^\s*(mrs?|miss|ms)\.?\s+/, '').replace(/[^a-z]/g, '');

/** Same person's name, allowing a couple of misread letters ("Mansoor All Buriro" = "Mansoor Ali Buriro"). */
export function sameName(x: string, y: string): boolean {
  const a = nameKey(x);
  const b = nameKey(y);
  if (a.length < 3 || b.length < 3) return false;
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 2) return false;
  // edit distance, stopping once it is clearly more than allowed
  const allowed = Math.max(1, Math.floor(Math.min(a.length, b.length) / 8));
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (Math.min(...cur) > allowed) return false;
    prev = cur;
  }
  return prev[b.length] <= allowed;
}
import { onOcrStartup, recognizeWords, warmUpOcr } from './ocr';
import { loadPages, type PageImages } from './pages';

/** One person on the certificate. */
export interface FrcPersonFound {
  /** relationship to the FRC applicant as printed ("Self" for the applicant, "Spouse", "Son" …; '' when not read) */
  relation: string;
  name: string;
  fatherName: string;
  cnic: string;
  dob: string;
  gender: Gender;
  /** 200x200 JPEG data URL, when a face was found next to this person */
  photo?: string;
}

export interface FrcScan {
  /** everyone on the certificate; the FRC applicant first */
  people: FrcPersonFound[];
  pages: number;
  /** how many people (applicant included) got a photo */
  photosFound: number;
  /** seconds the scan took */
  seconds: number;
}

/** Start the OCR engine and face detector in the background, so the user's first scan does not wait for them. */
export function warmUpScanner(): void {
  warmUpOcr();
  warmUpFaces();
}

export type ScanProgress = (message: string, percent: number) => void;

const PHOTO_SIZE = 200;

/** Is this a plausible head-and-shoulders photo next to the card's "Full Name" line? Coordinates are page pixels (1x). */
function photoWindow(p: FrcPerson, u: number) {
  return { x0: p.anchor.x - 8.3 * u, x1: p.anchor.x - 0.5 * u, y0: p.anchor.y - 1.3 * u, y1: p.anchor.y + 5.7 * u };
}

/** Find the person's face to the left of their name and return it as a square 200x200 JPEG. */
async function cropPhoto(page: PageImages, p: FrcPerson, u: number): Promise<string | undefined> {
  const k = page.big.width / page.base.width; // up to 2
  const win = photoWindow(p, u);
  const sx = Math.max(0, Math.floor(win.x0 * k));
  const sy = Math.max(0, Math.floor(win.y0 * k));
  const sw = Math.min(page.big.width, Math.ceil(win.x1 * k)) - sx;
  const sh = Math.min(page.big.height, Math.ceil(win.y1 * k)) - sy;
  if (sw < 40 || sh < 40) return undefined;

  const area = document.createElement('canvas');
  area.width = sw;
  area.height = sh;
  area.getContext('2d')!.drawImage(page.big, sx, sy, sw, sh, 0, 0, sw, sh);

  // the face must sit beside this card's name, not belong to a neighbouring card
  const faces: FaceBox[] = (await detectFaces(area)).filter((f) => {
    const cy = (sy + f.y + f.h / 2) / k;
    const cx = (sx + f.x + f.w / 2) / k;
    return cy > p.anchor.y - 1.5 * u && cy < p.anchor.y + 7.5 * u && cx < p.anchor.x - 0.4 * u;
  });
  if (!faces.length) return undefined;
  const face = faces.sort((a, b) => b.score * b.w * b.h - a.score * a.w * a.h)[0];

  // passport-style crop: a square about twice the face, kept inside the search area
  const side = Math.min(Math.max(face.w, face.h) * 1.7, sw, sh);
  const cx = face.x + face.w / 2;
  const cy = face.y + face.h / 2 + side * 0.1;
  const x = Math.min(Math.max(0, cx - side / 2), sw - side);
  const y = Math.min(Math.max(0, cy - side / 2), sh - side);
  const out = document.createElement('canvas');
  out.width = PHOTO_SIZE;
  out.height = PHOTO_SIZE;
  const ctx = out.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, PHOTO_SIZE, PHOTO_SIZE);
  ctx.drawImage(area, x, y, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
  return out.toDataURL('image/jpeg', 0.85);
}

/** Read an FRC (image or PDF) and return the applicant, the family members and their photos. */
export async function scanFrc(file: File, onProgress: ScanProgress = () => undefined): Promise<FrcScan> {
  const started = performance.now();
  warmUpScanner();
  onProgress('Opening the file…', 2);
  const pages = await loadPages(file);
  // until the first word is read, show the engine's start-up stages (the first scan after opening the page waits for it)
  let reading = false;
  onOcrStartup((message) => {
    if (!reading) onProgress(message, 4);
  });
  onProgress('Starting the text reader…', 3);
  try {
    return await readAll(pages, started, onProgress, () => (reading = true));
  } finally {
    onOcrStartup(null);
  }
}

async function readAll(pages: PageImages[], started: number, onProgress: ScanProgress, onReading: () => void): Promise<FrcScan> {

  // Every page is always read three times (normal size, enlarged, high contrast). The passes run side by side on
  // the OCR workers and are merged, so each fills what the others misread. Nothing is shown until all are done.
  const PASSES = 3;
  const done = pages.map(() => new Array<number>(PASSES).fill(0));
  const report = () => {
    onReading();
    const all = done.flat();
    const fraction = all.reduce((a, b) => a + b, 0) / all.length;
    const finished = all.filter((f) => f >= 1).length;
    onProgress(`Reading the certificate carefully (pass ${Math.min(finished + 1, all.length)} of ${all.length})…`, Math.round(5 + fraction * 75));
  };
  const pass = (i: number, n: number, image: HTMLCanvasElement) =>
    recognizeWords(image, (f) => { done[i][n] = f; report(); }).then((words) => { done[i][n] = 1; report(); return words; });

  const readPage = async (i: number): Promise<FrcCards> => {
    const p = pages[i];
    const k = p.big.width / p.base.width;
    const [normal, enlarged, sharp] = await Promise.all([pass(i, 0, p.base), pass(i, 1, p.big), pass(i, 2, p.sharp)]);
    // coordinates of the enlarged pass are scaled back so all passes agree; the enlarged pass reads small print best
    const big = enlarged.map((w) => ({ ...w, x0: w.x0 / k, y0: w.y0 / k, x1: w.x1 / k, y1: w.y1 / k }));
    return mergeCards([extractCards(big), extractCards(normal), extractCards(sharp)]);
  };

  const cardsByPage = await Promise.all(pages.map((_, i) => readPage(i)));
  const pageOf = new Map<FrcPerson, number>();
  cardsByPage.forEach((merged, i) => merged.cards.forEach((c) => pageOf.set(c, i)));

  const first = cardsByPage.find((p) => p.cards.length);
  if (!first) throw new Error('No family details were found. Make sure the picture is a clear, upright FRC.');
  const result = assembleFrc({ cards: cardsByPage.flatMap((p) => p.cards), box: first.box, hofRelation: cardsByPage.map((p) => p.hofRelation).find(Boolean) || '', textHeight: first.textHeight });
  if (!result.applicant) throw new Error('The applicant could not be found on this certificate.');

  const people = [result.applicant, ...result.members];
  const photos = new Map<FrcPerson, string>();
  let photosDone = 0;
  onProgress('Finding photos…', 80);
  await Promise.all(people.map(async (person) => {
    const pageIndex = pageOf.get(person) ?? 0;
    try {
      const photo = await cropPhoto(pages[pageIndex], person, cardsByPage[pageIndex].textHeight);
      if (photo) photos.set(person, photo);
    } catch {
      /* no photo for this person; the rest of the scan still works */
    }
    photosDone++;
    onProgress(`Finding photos (${photosDone} of ${people.length})…`, 80 + Math.round((photosDone / people.length) * 18));
  }));

  const a = result.applicant;
  const aGender = applicantGender(a, result.members, result.hofRelation);
  const genderOf = (m: FrcPerson): Gender => genderOfRelation(m.relation) || (/\bspouse\b/i.test(m.relation) ? (aGender === 'MALE' ? 'FEMALE' : aGender === 'FEMALE' ? 'MALE' : '') : '');
  onProgress('Done', 100);
  return {
    people: [
      { relation: 'Self', name: a.name, fatherName: a.fatherName, cnic: a.cnic, dob: a.dob, gender: aGender, photo: photos.get(a) },
      ...result.members.map((m) => ({
        relation: m.relation === 'Family member' ? '' : m.relation,
        name: m.name,
        // a child's "Father Name" is the applicant (or the spouse): use that card's name, which is read more reliably
        fatherName: [a, ...result.members].find((x) => x !== m && sameName(x.name, m.fatherName))?.name || m.fatherName,
        cnic: m.cnic, dob: m.dob, gender: genderOf(m), photo: photos.get(m),
      })),
    ],
    pages: pages.length,
    photosFound: photos.size,
    seconds: Math.round((performance.now() - started) / 100) / 10,
  };
}
