/**
 * Employer dashboard screen state (Redux): which section is open, sidebar / menus, the record a section
 * is showing (receipt, F-4, F-5, change request, submitted contribution) and status messages.
 *
 * Server data (employees, contributions …) is NOT here – it lives in the RTK Query cache (employerApi.ts).
 * Half-typed forms stay in the component (see frontend/README.md, "Redux").
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { employerSignedOut } from '@/features/auth/authSlice';
import type { Contribution } from '@/services/api/types';

export type EmployeePanel = { mode: 'view' | 'del' | 'sep'; id: number } | null;

export interface DashboardState {
  /** "Group|Item" of the open section, e.g. "Challans & Payments|Receipt" */
  section: string;
  openGroups: Record<string, boolean>;
  mobileMenuOpen: boolean;
  userMenuOpen: boolean;
  /** message above the employee list (saved / deleted / status changed) */
  notice: string;
  /** message above the change-request list */
  changeRequestNotice: string;
  employeePanel: EmployeePanel;
  /** employee being edited in the Register Employee form */
  editEmployeeId: number | null;
  passwordChanged: boolean;
  receiptChallan: string | null;
  f4ContributionId: number | null;
  f5Challan: string | null;
  changeRequestId: number | null;
  submittedContribution: Contribution | null;
  /** a save / payment is running (buttons disabled) */
  busy: boolean;
}

const initialState: DashboardState = {
  section: 'Dashboard|Overview',
  openGroups: { Dashboard: true },
  mobileMenuOpen: false,
  userMenuOpen: false,
  notice: '',
  changeRequestNotice: '',
  employeePanel: null,
  editEmployeeId: null,
  passwordChanged: false,
  receiptChallan: null,
  f4ContributionId: null,
  f5Challan: null,
  changeRequestId: null,
  submittedContribution: null,
  busy: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    navigated(state, action: PayloadAction<string>) {
      state.section = action.payload;
      state.openGroups = { [action.payload.split('|')[0]]: true };
      state.mobileMenuOpen = false;
      state.userMenuOpen = false;
    },
    groupToggled(state, action: PayloadAction<string>) {
      // accordion: opening one group closes the others
      state.openGroups = state.openGroups[action.payload] ? {} : { [action.payload]: true };
    },
    mobileMenuToggled(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    userMenuToggled(state) {
      state.userMenuOpen = !state.userMenuOpen;
    },
    noticeShown(state, action: PayloadAction<string>) {
      state.notice = action.payload;
    },
    changeRequestNoticeShown(state, action: PayloadAction<string>) {
      state.changeRequestNotice = action.payload;
    },
    employeePanelOpened(state, action: PayloadAction<EmployeePanel>) {
      state.employeePanel = action.payload;
      if (action.payload) state.notice = '';
    },
    employeeEditStarted(state, action: PayloadAction<number | null>) {
      state.editEmployeeId = action.payload;
      state.employeePanel = null;
      state.notice = '';
    },
    passwordChangedSet(state, action: PayloadAction<boolean>) {
      state.passwordChanged = action.payload;
    },
    receiptOpened(state, action: PayloadAction<string>) {
      state.receiptChallan = action.payload;
    },
    f4Opened(state, action: PayloadAction<number>) {
      state.f4ContributionId = action.payload;
    },
    f5Opened(state, action: PayloadAction<string>) {
      state.f5Challan = action.payload;
    },
    changeRequestOpened(state, action: PayloadAction<number>) {
      state.changeRequestId = action.payload;
    },
    contributionSubmitted(state, action: PayloadAction<Contribution>) {
      state.submittedContribution = action.payload;
    },
    busyChanged(state, action: PayloadAction<boolean>) {
      state.busy = action.payload;
    },
    /** leaving a form: clear messages, panels and edit mode */
    messagesCleared(state) {
      state.notice = '';
      state.changeRequestNotice = '';
      state.employeePanel = null;
      state.editEmployeeId = null;
      state.passwordChanged = false;
    },
  },
  extraReducers: (builder) => {
    // a new sign-in starts on the overview
    builder.addCase(employerSignedOut, () => initialState);
  },
});

export const {
  navigated, groupToggled, mobileMenuToggled, userMenuToggled, noticeShown, changeRequestNoticeShown, employeePanelOpened, employeeEditStarted,
  passwordChangedSet, receiptOpened, f4Opened, f5Opened, changeRequestOpened, contributionSubmitted, busyChanged, messagesCleared,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
