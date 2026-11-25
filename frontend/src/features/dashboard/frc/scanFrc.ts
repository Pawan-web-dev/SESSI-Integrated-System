/**
 * Scans a Family Registration Certificate completely offline:
 *   1. OCR (Tesseract) reads the text, twice (normal and 2x size) so each pass can fix the other's misreads;
 *   2. the layout parser turns the words into people (name, CNIC, date of birth, relationship);
 *   3. a face detector (MediaPipe BlazeFace) finds each person's photo, which is cropped to a 200x200 JPEG.
 */
import { detectFaces, type FaceBox } from './faces';
import { assembleFrc, extractCards, genderFromRelation, mergeCards, type FrcCards, type FrcPerson, type OcrWord } from './frcParse';
import { recognizeWords } from './ocr';
import { loadPages, type PageImages } from './pages';

export interface FrcMember {
  relation: string;
  name: string;
  cnic: string;
  dob: string;
  /** 200x200 JPEG data URL, when a face was found next to this person */
  photo?: string;
}

export interface FrcApplicant {
  name: string;
  fatherName: string;
  cnic: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | '';
  photo?: string;
}

export interface FrcScan {
  applicant: FrcApplicant | null;
  members: FrcMember[];
  pages: number;
  /** how many people (applicant included) got a photo */
  photosFound: number;
}

export type ScanProgress = (message: string, percent: number) => void;

const PHOTO_SIZE = 200;

/** Is this a plausible head-and-shoulders photo next to the card's "Full Name" line? Coordinates are page pixels (1x). */
function photoWindow(p: FrcPerson, u: number) {
  return { x0: p.anchor.x - 8.3 * u, x1: p.anchor.x - 0.5 * u, y0: p.anchor.y - 1.3 * u, y1: p.anchor.y + 5.7 * u };
}

/** Find the person's face to the left of their name and return it as a square 200x200 JPEG. */
async function cropPhoto(page: PageImages, p: FrcPerson, u: number): Promise<string | undefined> {
  const k = page.big.width / page.base.width; // 2
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
  onProgress('Opening the file…', 2);
  const pages = await loadPages(file);
  const total = pages.length * 2;
  let done = 0;
  const step = (label: string) => (fraction: number) => onProgress(label, Math.round(5 + ((done + fraction) / total) * 70));

  const cardsByPage: FrcCards[] = [];
  const pageOf = new Map<FrcPerson, number>();
  for (let i = 0; i < pages.length; i++) {
    const label = pages.length > 1 ? `Reading page ${i + 1} of ${pages.length}` : 'Reading the certificate';
    const passes: FrcCards[] = [];
    // pass 1 at normal size, pass 2 at 2x (coordinates are scaled back so both passes agree)
    const normal: OcrWord[] = await recognizeWords(pages[i].base, step(label + '…'));
    done++;
    const enlarged = (await recognizeWords(pages[i].big, step(label + ' (enlarged)…'))).map((w) => ({ ...w, x0: w.x0 / 2, y0: w.y0 / 2, x1: w.x1 / 2, y1: w.y1 / 2 }));
    done++;
    passes.push(extractCards(enlarged), extractCards(normal));
    const merged = mergeCards(passes);
    merged.cards.forEach((c) => pageOf.set(c, i));
    cardsByPage.push(merged);
  }

  const first = cardsByPage.find((p) => p.cards.length);
  if (!first) throw new Error('No family details were found. Make sure the picture is a clear, upright FRC.');
  const result = assembleFrc({ cards: cardsByPage.flatMap((p) => p.cards), box: first.box, hofRelation: cardsByPage.map((p) => p.hofRelation).find(Boolean) || '', textHeight: first.textHeight });
  if (!result.applicant) throw new Error('The applicant could not be found on this certificate.');

  const people = [result.applicant, ...result.members];
  const photos = new Map<FrcPerson, string>();
  for (let i = 0; i < people.length; i++) {
    onProgress(`Finding photos (${i + 1} of ${people.length})…`, 78 + Math.round((i / people.length) * 20));
    const pageIndex = pageOf.get(people[i]) ?? 0;
    try {
      const photo = await cropPhoto(pages[pageIndex], people[i], cardsByPage[pageIndex].textHeight);
      if (photo) photos.set(people[i], photo);
    } catch {
      /* no photo for this person; the rest of the scan still works */
    }
  }

  const a = result.applicant;
  onProgress('Done', 100);
  return {
    applicant: { name: a.name, fatherName: a.fatherName, cnic: a.cnic, dob: a.dob, gender: genderFromRelation(result.hofRelation), photo: photos.get(a) },
    members: result.members.map((m) => ({ relation: m.relation, name: m.name, cnic: m.cnic, dob: m.dob, photo: photos.get(m) })),
    pages: pages.length,
    photosFound: photos.size,
  };
}
