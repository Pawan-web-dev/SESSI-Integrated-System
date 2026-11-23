import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Worker, WorkerState } from './workerTypes';

const initialState: WorkerState = {
  workers: [
    { id: '1', name: 'Ahmed Raza', cnic: '42101-1234567-1', designation: 'Production Supervisor', type: 'Permanent', status: 'Active' },
    { id: '2', name: 'Sana Malik', cnic: '42201-2345678-2', designation: 'Quality Inspector', type: 'Permanent', status: 'Active' },
    { id: '3', name: 'Imran Shah', cnic: '42301-3456789-3', designation: 'Machine Operator', type: 'Contractual', status: 'Active' },
  ],
  loading: false,
  error: null,
};

const workerSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {
    addWorker: (state, action: PayloadAction<Worker>) => {
      state.workers.unshift(action.payload);
    },
    updateWorker: (state, action: PayloadAction<Worker>) => {
      const index = state.workers.findIndex(w => w.id === action.payload.id);
      if (index !== -1) state.workers[index] = action.payload;
    },
  },
});

export const { addWorker, updateWorker } = workerSlice.actions;
export default workerSlice.reducer;
