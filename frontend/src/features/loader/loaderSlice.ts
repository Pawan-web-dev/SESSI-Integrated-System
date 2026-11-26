/**
 * Global loader state for work that is NOT an API call (for example reading a file in the browser).
 * API calls are picked up automatically from the RTK Query cache, see selectLoading.ts.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LoaderState {
  /** running manual tasks: id -> message shown to the user */
  tasks: Record<string, string>;
}

const initialState: LoaderState = { tasks: {} };

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    taskStarted(state, action: PayloadAction<{ id: string; label: string }>) {
      state.tasks[action.payload.id] = action.payload.label;
    },
    taskFinished(state, action: PayloadAction<string>) {
      delete state.tasks[action.payload];
    },
  },
});

export const { taskStarted, taskFinished } = loaderSlice.actions;
export default loaderSlice.reducer;
