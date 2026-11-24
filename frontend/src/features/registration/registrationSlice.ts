/**
 * Registration wizard state (Redux): every field typed so far, the uploaded documents, the current step and
 * messages. The draft is saved on this device by the listener in app/store.ts, so a reload or a closed tab
 * keeps the work; passwords, verification codes and the contact token are never saved.
 *
 * Server calls run as thunks that use the RTK Query endpoints in registrationApi.ts.
 */
import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@/app/store';
import { errorMessage } from '@/services/api/errors';
import type { RegistrationRequest } from '@/services/api/types';
import { registrationApi } from './registrationApi';

export type Step = 'acct' | 'verify' | 1 | 2 | 3 | 4;
export type FieldValue = string | boolean;

export interface UploadedDoc {
  fileId: string;
  fileName: string;
  size: number;
}

export interface RegistrationState {
  step: Step;
  fields: Record<string, FieldValue>;
  /** document type -> uploaded file */
  docs: Record<string, UploadedDoc>;
  /** mobile number (digits) the uploaded files belong to – they only count for that verified applicant */
  docsOwner: string;
  /** document types being uploaded right now */
  uploading: Record<string, boolean>;
  /** SECP / NTN / SRB format check results */
  checks: Record<string, { msg: string; ok: boolean }>;
  error: string;
  notice: string;
  busy: boolean;
  /** true when the form was filled from a saved draft */
  restored: boolean;
  /** proof of verified mobile + e-mail, needed to upload and submit (memory only) */
  contactToken: string;
}

export const DRAFT_KEY = 'essi:regdraft';
/** never written to the device */
const SECRET_FIELDS = ['ap', 'ap2', 'otpM', 'otpE'];

const blank = (): RegistrationState => ({
  step: 'acct', fields: {}, docs: {}, docsOwner: '', uploading: {}, checks: {}, error: '', notice: '', busy: false, restored: false, contactToken: '',
});

function loadDraft(): RegistrationState {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const d = JSON.parse(raw) as Partial<RegistrationState> & { f?: Record<string, FieldValue> };
      // keep only uploads in the current format (older drafts stored file names only)
      const docs = Object.fromEntries(Object.entries(d.docs ?? {}).filter(([, v]) => typeof v === 'object' && v && 'fileId' in v));
      // a draft always restarts at the account step: password and verification are asked again
      return { ...blank(), fields: d.fields ?? d.f ?? {}, docs, docsOwner: d.docsOwner ?? '', restored: true };
    }
  } catch {
    /* storage blocked or damaged */
  }
  return blank();
}

/** What is kept on the device (see the listener in app/store.ts). */
export function saveDraft(state: RegistrationState): void {
  try {
    const fields = { ...state.fields };
    SECRET_FIELDS.forEach((k) => delete fields[k]);
    if (!Object.keys(fields).length && !Object.keys(state.docs).length) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ fields, docs: state.docs, docsOwner: state.docsOwner }));
  } catch {
    /* storage blocked */
  }
}

const digits = (v: FieldValue | undefined) => String(v ?? '').replace(/\D/g, '');
const text = (f: Record<string, FieldValue>, k: string) => String(f[k] ?? '').trim();

/* ---------------------------------------------------------------- thunks */
const createThunk = createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch; rejectValue: string }>();

/** Run an RTK Query mutation, then drop it from the cache (bodies can hold passwords). */
async function run<T>(request: { unwrap: () => Promise<T>; reset: () => void }): Promise<T> {
  try {
    return await request.unwrap();
  } finally {
    request.reset();
  }
}

export const sendCodes = createThunk('registration/sendCodes', async (resend: boolean, { getState, dispatch, rejectWithValue }) => {
  const f = getState().registration.fields;
  try {
    await run(dispatch(registrationApi.endpoints.sendContactCodes.initiate({ mobile: text(f, 'am'), email: text(f, 'ae') })));
    return resend;
  } catch (e) {
    return rejectWithValue(errorMessage(e));
  }
});

export const verifyCodes = createThunk('registration/verifyCodes', async (_: void, { getState, dispatch, rejectWithValue }) => {
  const f = getState().registration.fields;
  try {
    const res = await run(dispatch(registrationApi.endpoints.verifyContact.initiate({
      mobile: text(f, 'am'), email: text(f, 'ae'), mobile_code: text(f, 'otpM'), email_code: text(f, 'otpE'),
    })));
    return res.contact_token;
  } catch (e) {
    return rejectWithValue(errorMessage(e));
  }
});

export const uploadDocument = createThunk(
  'registration/uploadDocument',
  async ({ docType, file }: { docType: string; file: File }, { getState, dispatch, rejectWithValue }) => {
    try {
      const res = await run(dispatch(registrationApi.endpoints.uploadDocument.initiate({ contactToken: getState().registration.contactToken, docType, file })));
      return { fileId: res.file_id, fileName: res.file_name, size: res.size } satisfies UploadedDoc;
    } catch (e) {
      return rejectWithValue(`${file.name}: ${errorMessage(e)}`);
    }
  },
);

export const submitApplication = createThunk(
  'registration/submit',
  async (body: RegistrationRequest, { dispatch, rejectWithValue }) => {
    try {
      return await run(dispatch(registrationApi.endpoints.submitRegistration.initiate(body)));
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);

/* ---------------------------------------------------------------- slice */
const registrationSlice = createSlice({
  name: 'registration',
  initialState: loadDraft,
  reducers: {
    fieldChanged(state, action: PayloadAction<{ key: string; value: FieldValue }>) {
      state.fields[action.payload.key] = action.payload.value;
    },
    stepChanged(state, action: PayloadAction<Step>) {
      state.step = action.payload;
      state.error = '';
      state.notice = '';
      state.restored = false;
    },
    errorShown(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    numberChecked(state, action: PayloadAction<{ key: string; ok: boolean; msg: string }>) {
      state.checks[action.payload.key] = { ok: action.payload.ok, msg: action.payload.msg };
    },
    /** "Reset" button: empty the fields of the current step */
    stepCleared(state, action: PayloadAction<string[]>) {
      action.payload.forEach((k) => delete state.fields[k]);
      if (state.step === 1) state.checks = {};
      if (state.step === 2) state.docs = {};
      state.error = '';
    },
    /** start a new application from scratch */
    wizardCleared() {
      return { ...blank(), restored: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendCodes.fulfilled, (state, action) => {
        if (action.payload) state.notice = 'New codes sent. Earlier codes no longer work.';
        else {
          state.step = 'verify';
          state.restored = false;
        }
      })
      .addCase(verifyCodes.fulfilled, (state, action) => {
        const f = state.fields;
        state.contactToken = action.payload;
        f.pn = f.pn || f.an || '';
        f.pm = f.pm || f.am || '';
        f.pe = f.pe || f.ae || '';
        // files uploaded earlier for another mobile number cannot be used by this applicant
        if (state.docsOwner && state.docsOwner !== digits(f.am)) state.docs = {};
        state.docsOwner = digits(f.am);
        state.step = 1;
        delete f.otpM;
        delete f.otpE;
      })
      .addCase(uploadDocument.pending, (state, action) => {
        state.uploading[action.meta.arg.docType] = true;
        state.error = '';
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        delete state.uploading[action.meta.arg.docType];
        state.docs[action.meta.arg.docType] = action.payload;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        delete state.uploading[action.meta.arg.docType];
        state.error = action.payload ?? 'Upload failed.';
      })
      // submitted: the draft is finished
      .addCase(submitApplication.fulfilled, () => ({ ...blank(), restored: false }))
      .addMatcher(isAnyOf(sendCodes.pending, verifyCodes.pending, submitApplication.pending), (state) => {
        state.busy = true;
        state.error = '';
        state.notice = '';
      })
      .addMatcher(isAnyOf(sendCodes.fulfilled, verifyCodes.fulfilled), (state) => {
        state.busy = false;
      })
      .addMatcher(isAnyOf(sendCodes.rejected, verifyCodes.rejected, submitApplication.rejected), (state, action) => {
        state.busy = false;
        state.error = action.payload ?? 'Something went wrong. Please try again.';
      });
  },
});

export const { fieldChanged, stepChanged, errorShown, numberChecked, stepCleared, wizardCleared } = registrationSlice.actions;
export default registrationSlice.reducer;
