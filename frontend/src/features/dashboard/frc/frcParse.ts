/**
 * Reads the layout of a NADRA Family Registration Certificate (FRC) from OCR words.
 *
 * Every person on the certificate is a "card" that starts with a "Full Name" line. The CNIC, date of birth and
 * relationship label of that person sit inside the card (to the right of, or below, the name), and the photo is to
 * the left of the name. Cards are found from the "Full Name" lines, then CNICs, dates and labels are assigned to the
 * card they fall in. This file has no browser code so it can be tested on its own.
 */

export interface OcrWord {
  text: string;
  confidence: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** A run of words on one line, e.g. "Full Name : Tariq Bashir". */
export interface Segment {
  text: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** vertical centre */
  cy: number;
}

export type FrcRole = 'self' | 'father' | 'mother' | 'member';

export interface FrcPerson {
  role: FrcRole;
  /** label printed on the card (BROTHER, SISTER, SPOUSE …) or "Father" / "Mother" */
  relation: string;
  name: string;
  fatherName: string;
  motherName: string;
  cnic: string;
  dob: string;
  marital: string;
  /** position of the "Full Name" line, in OCR pixels */
  anchor: { x: number; y: number; h: number };
}

export interface FrcResult {
  /** the applicant (the employee) */
  applicant: FrcPerson | null;
  /** everyone else on the certificate */
  members: FrcPerson[];
  /** "Relation with HOF" of the applicant, e.g. "Son" */
  hofRelation: string;
  /** typical text height, used to size photo windows */
  textHeight: number;
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};

const LABEL_START = /^(full\s*name|father\s*name|mother\s*name|citizen\s*number|date\s*of\s*birth|marital\s*status|present\s*district|relation\s*with)\b/i;

/** Group OCR words into line segments. */
export function buildSegments(words: OcrWord[]): { segments: Segment[]; textHeight: number } {
  // numbers (CNICs, dates) are kept even when the engine is unsure: it often reads them right but scores them ~0
  // next to the "VALID" badge; the CNIC / date patterns below decide whether they are usable
  const usable = words.filter((w) => /[A-Za-z0-9]/.test(w.text) && w.y1 > w.y0 && w.x1 > w.x0 && (w.confidence >= 20 || /\d{4,}/.test(w.text)));
  const h = median(usable.map((w) => w.y1 - w.y0)) || 12;
  const lines: OcrWord[][] = [];
  [...usable].sort((a, b) => (a.y0 + a.y1) / 2 - (b.y0 + b.y1) / 2).forEach((w) => {
    const cy = (w.y0 + w.y1) / 2;
    const line = lines.find((l) => Math.abs(cy - (l[0].y0 + l[0].y1) / 2) < h * 0.55 && Math.abs(cy - l.reduce((s, x) => s + (x.y0 + x.y1) / 2, 0) / l.length) < h * 0.55);
    if (line) line.push(w);
    else lines.push([w]);
  });
  const segments: Segment[] = [];
  for (const line of lines) {
    line.sort((a, b) => a.x0 - b.x0);
    let cur: OcrWord[] = [];
    const flush = () => {
      // drop stray marks in front of a field label ("IP Date of Birth" -> "Date of Birth")
      for (let k = 1; k <= 2 && cur.length > k; k++) {
        const rest = cur.slice(k).map((w) => w.text).join(' ');
        if (LABEL_START.test(rest) && !LABEL_START.test(cur.map((w) => w.text).join(' '))) {
          cur = cur.slice(k);
          break;
        }
      }
      if (!cur.length) return;
      segments.push({
        text: cur.map((w) => w.text).join(' ').replace(/\s*:\s*/g, ' : ').replace(/\s+/g, ' ').trim(),
        x0: Math.min(...cur.map((w) => w.x0)), x1: Math.max(...cur.map((w) => w.x1)),
        y0: Math.min(...cur.map((w) => w.y0)), y1: Math.max(...cur.map((w) => w.y1)),
        cy: cur.reduce((s, w) => s + (w.y0 + w.y1) / 2, 0) / cur.length,
      });
      cur = [];
    };
    for (const w of line) {
      if (cur.length && w.x0 - cur[cur.length - 1].x1 > h * 4.5) flush();
      cur.push(w);
    }
    flush();
  }
  return { segments, textHeight: h };
}

// real CNICs are 5-7-1 digits; some sample certificates print 8 digits in the middle, so both are accepted as printed
// OCR sometimes drops one of the dashes ("12345-500979929"), so each dash is optional but the digit count must fit
const CNIC = /(?<!\d)(\d{5})\s*[-–—]?\s*(\d{7,8})\s*[-–—]?\s*(\d)(?!\d)/;
const DATE = /(\d{1,2})\s*[/.\-]\s*(\d{1,2})\s*[/.\-]\s*(\d{4})/;

/** "9/02/1942" -> "09/02/1942"; null when the date cannot be right. */
function normalizeDate(m: RegExpExecArray): string | null {
  const [d, mo, y] = [+m[1], +m[2], +m[3]];
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear()) return null;
  return String(d).padStart(2, '0') + '/' + String(mo).padStart(2, '0') + '/' + y;
}

/** Keep letters, spaces, dots and apostrophes; fix common OCR noise at the edges of a name. */
function cleanName(s: string): string {
  return s
    .replace(/[^A-Za-z .'’-]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s.'’-]+|[\s.'’-]+$/g, '')
    .split(' ')
    .filter((w, _i, all) => w.length > 1 || all.length === 1 || /^[A-Z]$/.test(w))
    .join(' ')
    .trim();
}

const RELATION_WORDS = ['SELF', 'BROTHER', 'SISTER', 'SON', 'DAUGHTER', 'SPOUSE', 'WIFE', 'HUSBAND', 'FATHER', 'MOTHER', 'ADOPTED SON', 'ADOPTED DAUGHTER', 'GRANDSON', 'GRANDDAUGHTER'];

function labelValue(text: string, label: RegExp): string | null {
  const m = new RegExp('^(?:' + label.source + ')\\s*:?\\s*(.*)$', 'i').exec(text);
  return m ? m[1].trim() : null;
}

/** Cards found on one OCR pass, before the applicant is picked out. */
export interface FrcCards {
  cards: FrcPerson[];
  /** first card: the "Applicant Details" box at the top */
  box: FrcPerson | null;
  hofRelation: string;
  textHeight: number;
}

/** Stages 1-4: find a card for every "Full Name" line and read its fields. */
export function extractCards(words: OcrWord[]): FrcCards {
  const { segments, textHeight: u } = buildSegments(words);
  const byY = [...segments].sort((a, b) => a.cy - b.cy || a.x0 - b.x0);

  /** value of a "Label : value" segment, or the text of the segment right of / just below a bare label */
  const valueOf = (seg: Segment, label: RegExp): string => {
    const inline = labelValue(seg.text, label);
    if (inline) return inline;
    const right = byY.find((s) => s !== seg && Math.abs(s.cy - seg.cy) < u * 0.8 && s.x0 >= seg.x1 - 2 && s.x0 - seg.x1 < u * 25);
    if (right) return right.text.replace(/^:\s*/, '');
    const below = byY.find((s) => s !== seg && s.cy > seg.cy + u * 0.5 && s.cy < seg.cy + u * 2.2 && Math.abs(s.x0 - seg.x0) < u * 3);
    return below ? below.text : '';
  };

  // 1. one card per "Full Name" line
  const nameSegs = byY.filter((s) => /^full\s*name\b/i.test(s.text));
  const cards: FrcPerson[] = nameSegs.map((s) => ({
    role: 'member', relation: '', name: cleanName(valueOf(s, /full\s*name/)), fatherName: '', motherName: '', cnic: '', dob: '', marital: '',
    anchor: { x: s.x0, y: s.cy, h: s.y1 - s.y0 },
  }));
  if (!cards.length) return { cards: [], box: null, hofRelation: '', textHeight: u };

  /** card a segment belongs to: the nearest card start above it, in the column to its left */
  const cardFor = (seg: Segment, above = 0.6): FrcPerson | null => {
    const candidates = cards.filter((c) => seg.cy >= c.anchor.y - u * above && seg.x0 >= c.anchor.x - u * 1.5);
    if (!candidates.length) return null;
    const lowest = Math.max(...candidates.map((c) => c.anchor.y));
    // cards on the same row (father | mother): take the one starting furthest right that is still left of the segment
    return candidates.filter((c) => Math.abs(c.anchor.y - lowest) < u * 1.2).sort((a, b) => b.anchor.x - a.anchor.x)[0];
  };

  // 2. fields printed as "Label : value"
  for (const seg of byY) {
    const card = cardFor(seg);
    if (!card) continue;
    if (/^father\s*name\b/i.test(seg.text)) card.fatherName ||= cleanName(valueOf(seg, /father\s*name/));
    else if (/^mother\s*name\b/i.test(seg.text)) card.motherName ||= cleanName(valueOf(seg, /mother\s*name/));
    else if (/^marital\s*status\b/i.test(seg.text)) card.marital ||= cleanName(valueOf(seg, /marital\s*status/));
  }

  // 3. CNICs and dates of birth. The very first card (applicant box) prints its CNIC above its name.
  const first = [...cards].sort((a, b) => a.anchor.y - b.anchor.y)[0];
  for (const seg of byY) {
    const m = CNIC.exec(seg.text.replace(/[Oo]/g, '0'));
    const c = m && /[-–—]/.test(m[0]) ? m : null; // a bare 13-digit run is a barcode, not a CNIC
    const card = (c && seg.cy < first.anchor.y && first.anchor.y - seg.cy < u * 3.2 ? first : null) || cardFor(seg, 0.9);
    if (c && card && !card.cnic) card.cnic = `${c[1]}-${c[2]}-${c[3]}`;
  }
  for (const seg of byY) {
    if (!/date\s*of\s*birth|^dob\b/i.test(seg.text) && !DATE.test(seg.text)) continue;
    const label = /date\s*of\s*birth|^dob\b/i.test(seg.text);
    const card = cardFor(seg, 0.9);
    if (!card || card.dob) continue;
    const text = label ? valueOf(seg, /date\s*of\s*birth|dob/) || seg.text : seg.text;
    const m = DATE.exec(text);
    const d = m ? normalizeDate(m) : null;
    // a bare date is only trusted right under a "Date of Birth" label (other dates are not birthdays)
    if (d && (label || byY.some((s) => /date\s*of\s*birth/i.test(s.text) && Math.abs(s.x0 - seg.x0) < u * 3 && seg.cy > s.cy && seg.cy - s.cy < u * 2.2))) card.dob = d;
  }

  // 4. relationship labels (BROTHER, SELF …) and the section headings of the father / mother cards
  for (const seg of byY) {
    // a label stands alone: skip the family-count box ("Mother(s) : 1  Son(s)") and anything with numbers
    if (!/DETAILS/i.test(seg.text) && /[(\d]/.test(seg.text.replace(/[^\x20-\x7E]/g, ''))) continue;
    const text = seg.text.replace(/[^A-Za-z ]/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
    if (RELATION_WORDS.filter((r) => new RegExp('\\b' + r + '\\b').test(text)).length > 1 && !/DETAILS/.test(text)) continue;
    const card = cardFor(seg, 1.6);
    if (!card || card === first || card.relation) continue;
    const head = /\b(FATHER|MOTHER|SPOUSE) DETAILS\b/.exec(text);
    if (head) card.relation = head[1][0] + head[1].slice(1).toLowerCase();
    else {
      const rel = RELATION_WORDS.filter((r) => text === r || text.startsWith(r + ' ')).sort((a, b) => b.length - a.length)[0];
      if (rel && seg.cy < card.anchor.y + u * 2 && seg.x0 > card.anchor.x + u * 8) card.relation = rel[0] + rel.slice(1).toLowerCase();
    }
  }

  const hofSeg = byY.find((s) => /relation\s*with\s*hof/i.test(s.text));
  const hofRelation = hofSeg ? cleanName(valueOf(hofSeg, /relation\s*with\s*hof/)) : '';
  return { cards, box: first, hofRelation, textHeight: u };
}

const FIELDS = ['name', 'fatherName', 'motherName', 'cnic', 'dob', 'marital', 'relation'] as const;

/**
 * Combine several OCR passes of the same page (e.g. normal size and enlarged). The first pass wins; blanks are
 * filled from later passes. Cards are matched by the position of their "Full Name" line.
 */
export function mergeCards(passes: FrcCards[]): FrcCards {
  const live = passes.filter((p) => p.cards.length);
  if (!live.length) return { cards: [], box: null, hofRelation: '', textHeight: passes[0]?.textHeight || 12 };
  const [main, ...others] = live;
  const u = main.textHeight;
  const same = (a: FrcPerson, b: FrcPerson) => Math.abs(a.anchor.y - b.anchor.y) < u * 1.8 && Math.abs(a.anchor.x - b.anchor.x) < u * 3;
  const cards = main.cards.map((c) => ({ ...c }));
  let box = main.box ? cards[main.cards.indexOf(main.box)] : null;
  for (const o of others) {
    for (const oc of o.cards) {
      const hit = cards.find((c) => same(c, oc));
      if (hit) {
        for (const f of FIELDS) if (!hit[f] || (f === 'relation' && hit[f] === '')) hit[f] = oc[f];
      } else cards.push({ ...oc });
    }
    if (!box && o.box) box = cards.find((c) => same(c, o.box!)) || null;
  }
  cards.sort((a, b) => a.anchor.y - b.anchor.y || a.anchor.x - b.anchor.x);
  return { cards, box: box || cards[0], hofRelation: live.map((p) => p.hofRelation).find(Boolean) || '', textHeight: u };
}

/** Stage 5: pick the applicant (the "SELF" card, or the card with the applicant box's CNIC) and list everyone else. */
export function assembleFrc(found: FrcCards): FrcResult {
  const { cards, box, hofRelation, textHeight: u } = found;
  if (!box) return { applicant: null, members: [], hofRelation, textHeight: u };
  const sameCnic = (a: string, b: string) => !!a && a.replace(/\D/g, '') === b.replace(/\D/g, '');
  const letters = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');
  const others = cards.filter((c) => c !== box && c.relation !== 'Spouse' && c.relation !== 'Father' && c.relation !== 'Mother');
  // the applicant's card: labelled SELF, else the one with the applicant box's name, else its CNIC (family members
  // can share a CNIC on sample certificates, so the name is the safer match)
  let applicant =
    others.find((c) => c.relation === 'Self') ||
    others.find((c) => !!box.name && letters(c.name) === letters(box.name)) ||
    others.find((c) => sameCnic(c.cnic, box.cnic)) ||
    null;
  if (applicant && !applicant.relation) applicant.relation = 'Self';
  if (applicant) {
    applicant.role = 'self';
    // the applicant box only knows name + CNIC; use it to fill gaps from OCR mistakes
    if (box !== applicant) {
      applicant.cnic ||= box.cnic;
      applicant.name ||= box.name;
      box.role = 'self';
    }
  } else {
    applicant = box;
    applicant.role = 'self';
  }
  for (const c of cards) {
    if (c === applicant || c === box) continue;
    if (c.relation === 'Father') c.role = 'father';
    else if (c.relation === 'Mother') c.role = 'mother';
  }
  const father = cards.find((c) => c.role === 'father');
  if (!applicant.fatherName && father) applicant.fatherName = father.name;
  const mother = cards.find((c) => c.role === 'mother');
  if (!applicant.motherName && mother) applicant.motherName = mother.name;

  const members = cards.filter((c) => c !== applicant && c !== box && (c.name || c.cnic));
  // a card whose heading was not read is still the father / mother if the applicant's parents' names match it
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');
  members.forEach((m) => {
    if (!m.relation) {
      if (m.name && norm(m.name) === norm(applicant.fatherName)) m.relation = 'Father';
      else if (m.name && norm(m.name) === norm(applicant.motherName)) m.relation = 'Mother';
      else m.relation = 'Family member';
    }
  });
  return { applicant, members, hofRelation, textHeight: u };
}

/** Parse one OCR pass. */
export const parseFrc = (words: OcrWord[]): FrcResult => assembleFrc(extractCards(words));

/** Gender from the applicant's relation with the head of family. */
export function genderFromRelation(relation: string): 'MALE' | 'FEMALE' | '' {
  const r = relation.toLowerCase();
  if (/\b(son|brother|father|husband|grandson|nephew)\b/.test(r)) return 'MALE';
  if (/\b(daughter|sister|mother|wife|granddaughter|niece)\b/.test(r)) return 'FEMALE';
  return '';
}
