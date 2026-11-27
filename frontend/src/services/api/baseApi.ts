/**
 * RTK Query base for every backend call. Features add their endpoints with `baseApi.injectEndpoints`.
 *
 * - Calls to /admin/* send the officer's token; all others send the employer's token (if signed in).
 * - A 401 on a signed-in call ends that session (token expired), so the page sends the user to sign in.
 */
import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { config } from '@/config/env';
import type { AuthState } from '@/features/auth/authSlice';
import { adminSignedOut, employerSignedOut } from '@/features/auth/authSlice';

/** Backend address, e.g. http://localhost:8000/api/v1 (VITE_API_BASE_URL in frontend/.env). */
export const API_BASE_URL = config.apiBaseUrl;

const isAdminCall = (args: string | FetchArgs) => (typeof args === 'string' ? args : args.url).startsWith('/admin');

const rawBaseQuery = fetchBaseQuery({ baseUrl: API_BASE_URL });

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extra) => {
  const auth = (api.getState() as { auth: AuthState }).auth;
  const admin = isAdminCall(args);
  const token = admin ? auth.admin?.token : auth.employer?.token;
  const request: FetchArgs = typeof args === 'string' ? { url: args } : { ...args };
  if (token) request.headers = { ...(request.headers as Record<string, string>), Authorization: `Bearer ${token}` };

  const result = await rawBaseQuery(request, api, extra);
  if (result.error?.status === 401 && token) {
    api.dispatch(admin ? adminSignedOut() : employerSignedOut('Your session has ended. Please log in again.'));
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Profile', 'Employees', 'Contributions', 'Challans', 'ChangeRequests', 'Notifications', 'Documents', 'Dashboard', 'Applications', 'Outbox', 'AdminDashboard', 'AdminEmployers', 'AdminWorkers', 'PartnerKeys'],
  endpoints: () => ({}),
});
