/** Employer sign-in, password reset and application tracking. */
import { baseApi } from '@/services/api/baseApi';
import type { Application, Message, TokenResponse } from '@/services/api/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TokenResponse, { login_id: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    requestPasswordReset: build.mutation<{ message: string; sent_to: string }, { login_id: string }>({
      query: (body) => ({ url: '/auth/password-reset/request', method: 'POST', body }),
    }),
    confirmPasswordReset: build.mutation<Message, { login_id: string; code: string; new_password: string }>({
      query: (body) => ({ url: '/auth/password-reset/confirm', method: 'POST', body }),
    }),
    /** Application status by Application No. + CNIC (a query, so pages can poll it). */
    trackApplication: build.query<Application, { app_no: string; cnic: string }>({
      query: (body) => ({ url: '/registrations/track', method: 'POST', body }),
    }),
  }),
});

export const { useLoginMutation, useRequestPasswordResetMutation, useConfirmPasswordResetMutation, useTrackApplicationQuery, useLazyTrackApplicationQuery } = authApi;
