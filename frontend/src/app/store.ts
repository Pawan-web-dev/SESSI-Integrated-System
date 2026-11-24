/**
 * Redux store.
 *
 *   auth          who is signed in (employer / ESSI officer)           – saved in sessionStorage
 *   registration  registration wizard draft, uploads, step, messages   – draft saved in localStorage
 *   dashboard     employer dashboard: open section, menus, messages
 *   admin         admin panel: list, filters, application under review
 *   documentViewer  uploaded document shown on screen (any page)
 *   api           RTK Query cache: ALL server data (profile, employees, contributions, applications …)
 */
import { combineReducers, configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import adminReducer from '@/features/admin/adminSlice';
import authReducer, { adminSignedIn, adminSignedOut, employerSignedIn, employerSignedOut, persistAuth } from '@/features/auth/authSlice';
import dashboardReducer from '@/features/dashboard/dashboardSlice';
import documentViewerReducer from '@/features/documents/documentViewerSlice';
import registrationReducer, { saveDraft } from '@/features/registration/registrationSlice';
import { baseApi } from '@/services/api/baseApi';

const rootReducer = combineReducers({
  auth: authReducer,
  registration: registrationReducer,
  dashboard: dashboardReducer,
  admin: adminReducer,
  documentViewer: documentViewerReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;

/* ---------------------------------------------------------------- persistence (side effects outside reducers) */
const persistence = createListenerMiddleware<RootState>();

persistence.startListening({
  matcher: isAnyOf(employerSignedIn, employerSignedOut, adminSignedIn, adminSignedOut),
  effect: (_action, api) => persistAuth(api.getState().auth),
});

persistence.startListening({
  predicate: (action) => action.type.startsWith('registration/'),
  effect: (_action, api) => saveDraft(api.getState().registration),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault().prepend(persistence.middleware).concat(baseApi.middleware),
});

// lets queries that ask for it refresh when the user comes back to the tab or the network returns
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
