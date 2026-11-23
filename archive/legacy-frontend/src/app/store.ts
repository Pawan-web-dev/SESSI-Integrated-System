import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import workerReducer from '../features/workers/workerSlice';
import contributionReducer from '../features/contributions/contributionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workers: workerReducer,
    contributions: contributionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
