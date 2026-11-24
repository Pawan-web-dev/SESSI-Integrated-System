import type { Account } from '@/services/portal';

/** Props every admin view receives from AdminPage. */
export interface AdminViewProps {
  /** all registration applications and employer accounts, freshly read */
  accounts: Account[];
  /** re-read the data after a change */
  refresh: () => void;
  /** show a success message at the top of the workspace */
  notify: (message: string) => void;
}
