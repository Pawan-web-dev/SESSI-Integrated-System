/**
 * Centrally administered master tables used to build the Employer Identification Number (EIN).
 *
 *   EIN = <Directorate Code>-<Industry Classification Code>-<Establishment Serial>[-<Branch>]
 *         e.g. 100-91-000001  (Malir Directorate – Retail Shops – establishment no. 1)
 *
 * IMPORTANT: once a code is in use it must never be changed or re-used for something else,
 * because every issued EIN contains it. Add new entries at the end; mark retired ones `active: false`.
 *
 * The codes below follow the examples in the SESSI requirement (100 = Malir, 91 = Retail Shops,
 * 92 = Textile Industry, 94 = Construction, 203 = an interior Directorate). All other codes are
 * placeholders until SESSI notifies the official code list.
 */

export interface Directorate {
  /** 3-digit Directorate code – first EIN segment */
  code: string;
  name: string;
  /** districts served by this Directorate */
  districts: string[];
  active: boolean;
}

export const DIRECTORATE_MASTER: Directorate[] = [
  { code: '100', name: 'Malir Directorate', districts: ['Malir'], active: true },
  { code: '101', name: 'Landhi Directorate', districts: ['Korangi'], active: true },
  { code: '102', name: 'City Directorate', districts: ['Karachi South', 'Karachi Central'], active: true },
  { code: '103', name: 'SITE East Directorate', districts: ['Karachi East'], active: true },
  { code: '104', name: 'SITE West Directorate', districts: ['Karachi West', 'Keamari'], active: true },
  { code: '201', name: 'Hyderabad Directorate', districts: ['Hyderabad', 'Jamshoro', 'Thatta'], active: true },
  { code: '202', name: 'Mirpurkhas Directorate', districts: ['Mirpurkhas'], active: true },
  { code: '203', name: 'Shaheed Benazirabad Directorate', districts: ['Shaheed Benazirabad'], active: true },
  { code: '204', name: 'Sukkur Directorate', districts: ['Sukkur'], active: true },
  { code: '205', name: 'Larkana Directorate', districts: ['Larkana'], active: true },
];

export interface IndustryClassification {
  /** 2-digit Industry Classification Code – second EIN segment, common to all Directorates */
  code: string;
  name: string;
  /**
   * true = registrations in this industry go to the ESSI approval workflow.
   * false = registration is instant (Employer No. issued on submit).
   * Currently true for all, as instructed; switch per industry once the legal requirement is confirmed.
   */
  approvalRequired: boolean;
  active: boolean;
}

const industry = (code: string, name: string): IndustryClassification => ({ code, name, approvalRequired: true, active: true });

export const INDUSTRY_MASTER: IndustryClassification[] = [
  industry('92', 'Textile Industry'),
  industry('93', 'Garments'),
  industry('95', 'Hosiery'),
  industry('91', 'Retail Shops'),
  industry('96', 'Wholesale Trade'),
  industry('94', 'Construction'),
  industry('10', 'Engineering'),
  industry('11', 'Pharmaceutical'),
  industry('12', 'Hospitals'),
  industry('13', 'Educational Institutions'),
  industry('14', 'Hotels'),
  industry('15', 'Restaurants'),
  industry('16', 'Banking'),
  industry('17', 'Insurance'),
  industry('18', 'Information Technology'),
  industry('19', 'Transport & Logistics'),
  industry('20', 'Ports & Shipping'),
  industry('21', 'Oil & Gas'),
  industry('22', 'Chemicals'),
  industry('23', 'Plastic'),
  industry('24', 'Food Processing'),
  industry('25', 'Rice Mills'),
  industry('26', 'Flour Mills'),
  industry('27', 'Sugar Mills'),
  industry('28', 'Steel Industry'),
  industry('29', 'Cement'),
  industry('30', 'Automobile'),
  industry('31', 'Leather & Tanneries'),
  industry('32', 'Fisheries'),
  industry('33', 'Agriculture'),
  industry('34', 'Mining'),
  industry('35', 'Power Generation'),
  industry('36', 'Telecommunications'),
  industry('37', 'Aviation'),
  industry('38', 'Warehousing'),
  industry('39', 'Security Services'),
  industry('40', 'Cleaning & Janitorial Services'),
  industry('99', 'Other (as notified by SESSI)'),
];

/** Active industries sorted by name, for drop-downs. */
export function industryOptions(): IndustryClassification[] {
  return INDUSTRY_MASTER.filter((i) => i.active).sort((a, b) => a.name.localeCompare(b.name));
}

export function findIndustry(code: string | undefined): IndustryClassification | undefined {
  return INDUSTRY_MASTER.find((i) => i.code === code);
}

export function findDirectorateByCode(code: string | undefined): Directorate | undefined {
  return DIRECTORATE_MASTER.find((d) => d.code === code);
}

/** Directorate that serves a district (assigned automatically at registration). */
export function directorateForDistrict(district: string | undefined): Directorate | undefined {
  return DIRECTORATE_MASTER.find((d) => d.active && d.districts.includes(String(district || '')));
}

export function findDirectorateByName(name: string | undefined): Directorate | undefined {
  return DIRECTORATE_MASTER.find((d) => d.name === name);
}
