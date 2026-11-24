/**
 * Document viewer (Redux): any page can show an uploaded document with
 *   dispatch(openDocument({ path: adminDocumentUrl(appId, docId), name: 'SECP.pdf' }))
 * The file is fetched with the sign-in token and shown by <DocumentViewer /> (mounted once in App.tsx).
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@/app/store';
import { API_BASE_URL } from '@/services/api/baseApi';

export interface DocumentViewerState {
  open: boolean;
  loading: boolean;
  name: string;
  /** blob: URL of the fetched file (released when the viewer closes) */
  url: string;
  contentType: string;
  error: string;
}

const initialState: DocumentViewerState = { open: false, loading: false, name: '', url: '', contentType: '', error: '' };
const createThunk = createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch; rejectValue: string }>();

export const openDocument = createThunk(
  'documentViewer/open',
  async ({ path }: { path: string; name: string }, { getState, rejectWithValue }) => {
    const auth = getState().auth;
    const token = path.startsWith('/admin') ? auth.admin?.token : auth.employer?.token;
    try {
      const res = await fetch(API_BASE_URL + path, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) {
        let detail = `The document could not be opened (error ${res.status}).`;
        try {
          detail = (await res.json()).detail || detail;
        } catch {
          /* not JSON */
        }
        return rejectWithValue(detail);
      }
      const blob = await res.blob();
      return { url: URL.createObjectURL(blob), contentType: blob.type || res.headers.get('content-type') || '' };
    } catch {
      return rejectWithValue('The server could not be reached. Check your connection and try again.');
    }
  },
);

/** Close the viewer and release the file from memory. */
export const closeDocument = createThunk('documentViewer/close', async (_: void, { getState }) => {
  const { url } = getState().documentViewer;
  if (url) URL.revokeObjectURL(url);
});

const documentViewerSlice = createSlice({
  name: 'documentViewer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(openDocument.pending, (_state, action) => ({ ...initialState, open: true, loading: true, name: action.meta.arg.name }))
      .addCase(openDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.url = action.payload.url;
        state.contentType = action.payload.contentType;
      })
      .addCase(openDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'The document could not be opened.';
      })
      .addCase(closeDocument.fulfilled, () => initialState);
  },
});

export default documentViewerSlice.reducer;
