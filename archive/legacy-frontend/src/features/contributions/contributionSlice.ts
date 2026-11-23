import { createSlice } from '@reduxjs/toolkit';
import type { ContributionState } from './contributionTypes';

const initialState: ContributionState = {
  contributions: [
    { id: '1', month: 'November, 2026', workerCount: 48, totalAmount: '106,560', status: 'Unpaid', challanNo: 'CH-2026-004512' },
    { id: '2', month: 'October, 2026', workerCount: 48, totalAmount: '106,560', status: 'Paid', challanNo: 'CH-2026-004102' },
    { id: '3', month: 'September, 2026', workerCount: 46, totalAmount: '102,120', status: 'Paid', challanNo: 'CH-2026-003688' },
  ],
  loading: false,
  error: null,
};

const contributionSlice = createSlice({
  name: 'contributions',
  initialState,
  reducers: {},
});

export default contributionSlice.reducer;
