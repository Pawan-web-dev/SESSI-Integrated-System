/**
 * Relationships on an FRC are printed relative to the applicant (SPOUSE, SON, FATHER …). When the user picks a
 * different person on the certificate as the worker being registered, everyone else's relationship has to be
 * restated relative to that worker: e.g. worker = the applicant's son → the applicant becomes "Father", the
 * applicant's spouse "Mother" and the other children "Brother" / "Sister". No browser code: testable on its own.
 */
export type Gender = 'MALE' | 'FEMALE' | '';

type Kind = 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'grandchild' | 'other';

function kindOf(relation: string): Kind {
  const r = relation.toLowerCase();
  if (r === 'self' || r === 'applicant') return 'self';
  if (/\b(spouse|wife|husband)\b/.test(r)) return 'spouse';
  if (/\bgrand(son|daughter|child)\b/.test(r)) return 'grandchild';
  if (/\b(son|daughter|child)\b/.test(r)) return 'child';
  if (/\b(father|mother)\b/.test(r)) return 'parent';
  if (/\b(brother|sister)\b/.test(r)) return 'sibling';
  return 'other';
}

const pick = (g: Gender, male: string, female: string, unknown = '') => (g === 'MALE' ? male : g === 'FEMALE' ? female : unknown);

/**
 * Relationship of person P to the worker W, given both relationships to the applicant A as printed on the FRC.
 * `pGender` is P's own gender (the word chosen depends on it). Returns '' when it cannot be told from the
 * certificate (the user then chooses it).
 */
export function relationToWorker(pRelation: string, pGender: Gender, wRelation: string): string {
  const p = kindOf(pRelation);
  const w = kindOf(wRelation);
  if (p === 'other') return w === 'self' ? pRelation : '';
  switch (w) {
    case 'self':
      return pRelation;
    case 'spouse':
      if (p === 'self') return pick(pGender, 'Husband', 'Wife', 'Spouse');
      if (p === 'child' || p === 'grandchild') return pRelation;
      if (p === 'parent') return pick(pGender, 'Father-in-law', 'Mother-in-law');
      if (p === 'sibling') return pick(pGender, 'Brother-in-law', 'Sister-in-law');
      return '';
    case 'child':
      if (p === 'self' || p === 'spouse') return pick(pGender, 'Father', 'Mother');
      if (p === 'child') return pick(pGender, 'Brother', 'Sister');
      if (p === 'parent') return pick(pGender, 'Grandfather', 'Grandmother');
      if (p === 'sibling') return pick(pGender, 'Uncle', 'Aunt');
      return '';
    case 'parent':
      if (p === 'self' || p === 'sibling') return pick(pGender, 'Son', 'Daughter');
      if (p === 'spouse') return pick(pGender, 'Son-in-law', 'Daughter-in-law');
      if (p === 'child') return pick(pGender, 'Grandson', 'Granddaughter');
      if (p === 'parent') return pick(pGender, 'Husband', 'Wife', 'Spouse');
      return '';
    case 'sibling':
      if (p === 'self' || p === 'sibling') return pick(pGender, 'Brother', 'Sister');
      if (p === 'parent') return pRelation;
      if (p === 'spouse') return pick(pGender, 'Brother-in-law', 'Sister-in-law');
      if (p === 'child') return pick(pGender, 'Nephew', 'Niece');
      return '';
    default:
      return '';
  }
}

/** Gender implied by a relationship to the applicant (Son → MALE …); '' for Self, Spouse and unknown words. */
export function genderOfRelation(relation: string): Gender {
  const r = relation.toLowerCase();
  if (/\b(son|brother|father|husband|grandson|nephew|uncle)\b/.test(r)) return 'MALE';
  if (/\b(daughter|sister|mother|wife|granddaughter|niece|aunt)\b/.test(r)) return 'FEMALE';
  return '';
}
