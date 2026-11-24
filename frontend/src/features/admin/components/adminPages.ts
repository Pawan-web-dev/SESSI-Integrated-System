export type AdminPageKey = 'overview' | 'companies' | 'registrations' | 'changes' | 'challans';

export const ADMIN_PAGES: { key: AdminPageKey; label: string; title: string }[] = [
  { key: 'overview', label: '▦ Dashboard', title: 'Admin Dashboard' },
  { key: 'companies', label: '▤ Enrolled Companies', title: 'Enrolled Companies' },
  { key: 'registrations', label: '✓ Document Approvals', title: 'Company Document Approval' },
  { key: 'changes', label: '⇄ Change Requests', title: 'Company Change Requests' },
  { key: 'challans', label: '▣ Previous Month Challans', title: 'Previous Month Challans' },
];
