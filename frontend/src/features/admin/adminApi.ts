/** ESSI officer: sign-in, registration review, change-request review. */
import { baseApi } from '@/services/api/baseApi';
import type { ApplicationDetail, ApplicationList, ApplicationStatus, ChangeRequest, TokenResponse } from '@/services/api/types';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminLogin: build.mutation<TokenResponse, { username: string; password: string }>({
      query: (body) => ({ url: '/admin/login', method: 'POST', body }),
    }),
    getApplications: build.query<ApplicationList, ApplicationStatus>({
      query: (status) => ({ url: '/admin/applications', params: { status } }),
      providesTags: ['Applications'],
    }),
    getApplication: build.query<ApplicationDetail, number>({
      query: (id) => `/admin/applications/${id}`,
      providesTags: ['Applications'],
    }),
    postProgress: build.mutation<ApplicationDetail, { id: number; stage: number; note: string }>({
      query: ({ id, ...body }) => ({ url: `/admin/applications/${id}/progress`, method: 'POST', body }),
      invalidatesTags: ['Applications', 'Outbox'],
    }),
    approveApplication: build.mutation<ApplicationDetail, number>({
      query: (id) => ({ url: `/admin/applications/${id}/approve`, method: 'POST' }),
      invalidatesTags: ['Applications', 'Outbox'],
    }),
    rejectApplication: build.mutation<ApplicationDetail, { id: number; reason: string }>({
      query: ({ id, reason }) => ({ url: `/admin/applications/${id}/reject`, method: 'POST', body: { reason } }),
      invalidatesTags: ['Applications', 'Outbox'],
    }),
    getChangeRequestsForReview: build.query<ChangeRequest[], string>({
      query: (status) => ({ url: '/admin/change-requests', params: { status } }),
      providesTags: ['ChangeRequests'],
    }),
    decideChangeRequest: build.mutation<ChangeRequest, { id: number; status: string; remarks?: string }>({
      query: ({ id, ...body }) => ({ url: `/admin/change-requests/${id}/decision`, method: 'POST', body }),
      invalidatesTags: ['ChangeRequests', 'Profile', 'Notifications', 'Outbox'],
    }),
  }),
});

export const {
  useAdminLoginMutation, useGetApplicationsQuery, useGetApplicationQuery, usePostProgressMutation, useApproveApplicationMutation,
  useRejectApplicationMutation, useGetChangeRequestsForReviewQuery, useDecideChangeRequestMutation,
} = adminApi;
