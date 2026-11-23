export interface Contribution {
  id: string;
  month: string;
  workerCount: number;
  totalAmount: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Unpaid';
  challanNo?: string;
  submittedDate?: string;
}

export interface ContributionState {
  contributions: Contribution[];
  loading: boolean;
  error: string | null;
}
