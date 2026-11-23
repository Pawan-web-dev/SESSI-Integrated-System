export interface Worker {
  id: string;
  name: string;
  cnic: string;
  designation: string;
  type: string;
  status: 'Active' | 'Inactive' | 'Separated';
}

export interface WorkerState {
  workers: Worker[];
  loading: boolean;
  error: string | null;
}
