/**
 * Who is signed in: an employer and/or an ESSI officer (separate sessions, separate tokens).
 * Kept in sessionStorage, so closing the browser tab signs the user out.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface EmployerSession {
  token: string;
  name: string;
  employerNo: string;
}
export interface AdminSession {
  token: string;
  name: string;
  role: string;
}
export interface AuthState {
  employer: EmployerSession | null;
  admin: AdminSession | null;
  /** one-time message for the login page (e.g. after logout or a password change) */
  flash: string;
}

const STORAGE_KEY = 'essi:auth';

function load(): AuthState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return { flash: '', ...(JSON.parse(raw) as Omit<AuthState, 'flash'>) };
  } catch {
    /* storage blocked */
  }
  return { employer: null, admin: null, flash: '' };
}

export function persistAuth(state: AuthState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ employer: state.employer, admin: state.admin }));
  } catch {
    /* storage blocked */
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: load,
  reducers: {
    employerSignedIn(state, action: PayloadAction<EmployerSession>) {
      state.employer = action.payload;
      state.flash = '';
    },
    employerSignedOut(state, action: PayloadAction<string | undefined>) {
      state.employer = null;
      state.flash = action.payload ?? '';
    },
    adminSignedIn(state, action: PayloadAction<AdminSession>) {
      state.admin = action.payload;
    },
    adminSignedOut(state) {
      state.admin = null;
    },
    setFlash(state, action: PayloadAction<string>) {
      state.flash = action.payload;
    },
  },
});

export const { employerSignedIn, employerSignedOut, adminSignedIn, adminSignedOut, setFlash } = authSlice.actions;
export default authSlice.reducer;
