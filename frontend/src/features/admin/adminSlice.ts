/**
 * Admin panel screen state (Redux): which list is shown, its status filter, the application under review
 * and the last result message. Server data is in the RTK Query cache (adminApi.ts).
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { adminSignedOut } from '@/features/auth/authSlice';
import type { ApplicationStatus, ChangeRequest } from '@/services/api/types';

export type AdminSection = 'registrations' | 'changes';

export interface AdminState {
  section: AdminSection;
  applicationStatus: ApplicationStatus;
  changeRequestStatus: ChangeRequest['status'];
  /** application open in the review window */
  reviewId: number | null;
  message: string;
}

const initialState: AdminState = {
  section: 'registrations',
  applicationStatus: 'pending',
  changeRequestStatus: 'Pending Review',
  reviewId: null,
  message: '',
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    sectionChanged(state, action: PayloadAction<AdminSection>) {
      state.section = action.payload;
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

export const { sectionChanged, applicationStatusChanged, changeRequestStatusChanged, reviewOpened, reviewClosed, messageShown } = adminSlice.actions;
export default adminSlice.reducer;
