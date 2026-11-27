/**
 * Admin panel screen state (Redux): which list is shown, its status filter, the application under review
 * and the last result message. Server data is in the RTK Query cache (adminApi.ts).
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { adminSignedOut } from '@/features/auth/authSlice';
import type { ApplicationStatus, ChangeRequest } from '@/services/api/types';

export type AdminSection = 'dashboard' | 'employers' | 'workers' | 'registrations' | 'changes' | 'partners';

export interface AdminState {
  section: AdminSection;
  applicationStatus: ApplicationStatus;
  changeRequestStatus: ChangeRequest['status'];
  /** application open in the review window */
  reviewId: number | null;
  /** establishment / worker opened from a list (null: show the list) */
  employerId: number | null;
  workerId: number | null;
  message: string;
}

const initialState: AdminState = {
  section: 'dashboard',
  applicationStatus: 'pending',
  changeRequestStatus: 'Pending Review',
  reviewId: null,
  employerId: null,
  workerId: null,
  message: '',
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    sectionChanged(state, action: PayloadAction<AdminSection>) {
      state.section = action.payload;
      state.employerId = null;
      state.workerId = null;
      state.message = '';
    },
    /** open an establishment's page (or back to the list with null) */
    employerOpened(state, action: PayloadAction<number | null>) {
      state.section = 'employers';
      state.employerId = action.payload;
      state.workerId = null;
      state.message = '';
    },
    /** open a worker's page with their dependents (or back with null); stays in the current section */
    workerOpened(state, action: PayloadAction<number | null>) {
      if (state.section !== 'employers') state.section = 'workers';
      state.workerId = action.payload;
      state.message = '';
    },
    applicationStatusChanged(state, action: PayloadAction<ApplicationStatus>) {
      state.applicationStatus = action.payload;
    },
    changeRequestStatusChanged(state, action: PayloadAction<ChangeRequest['status']>) {
      state.changeRequestStatus = action.payload;
    },
    reviewOpened(state, action: PayloadAction<number>) {
      state.reviewId = action.payload;
    },
    /** review window closed; optionally show a result and switch to the list where the application now is */
    reviewClosed(state, action: PayloadAction<{ message?: string; switchTo?: ApplicationStatus } | undefined>) {
      state.reviewId = null;
      if (action.payload?.message) state.message = action.payload.message;
      if (action.payload?.switchTo) state.applicationStatus = action.payload.switchTo;
    },
    messageShown(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(adminSignedOut, () => initialState);
  },
});

export const { sectionChanged, employerOpened, workerOpened, applicationStatusChanged, changeRequestStatusChanged, reviewOpened, reviewClosed, messageShown } = adminSlice.actions;
export default adminSlice.reducer;
