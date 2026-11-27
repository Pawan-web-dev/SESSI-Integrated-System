/** ESSI officer: sign-in, dashboard, establishments, workers and their dependents, registration and change-request review. */
import { baseApi } from '@/services/api/baseApi';
import type {
  AdminDashboard, AdminEmployer, AdminEmployerDetail, AdminWorker, AdminWorkerDetail, ApplicationDetail, ApplicationList, ApplicationStatus,
  ChangeRequest, Dependent, DependentInput, Eligibility, Message, PartnerKey, PartnerKeyCreated, PartnerKind, TokenResponse,
} from '@/services/api/types';

export interface WorkerQuery {
  q?: string;
  status?: string;
  employer_id?: number;
  offset?: number;
  limit?: number;
}

const DEPENDENT_TAGS = ['AdminWorkers', 'AdminDashboard', 'AdminEmployers', 'Employees'] as const;

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminLogin: build.mutation<TokenResponse, { username: string; password: string }>({
      query: (body) => ({ url: '/admin/login', method: 'POST', body }),
    }),
    getAdminDashboard: build.query<AdminDashboard, void>({
      query: () => '/admin/dashboard',
      providesTags: ['AdminDashboard'],
    }),
    getAdminEmployers: build.query<AdminEmployer[], { q?: string; status?: string }>({
      query: ({ q, status }) => ({ url: '/admin/employers', params: { ...(q ? { q } : {}), ...(status ? { status } : {}) } }),
      providesTags: ['AdminEmployers'],
    }),
    getAdminEmployer: build.query<AdminEmployerDetail, number>({
      query: (id) => `/admin/employers/${id}`,
      providesTags: ['AdminEmployers', 'AdminWorkers'],
    }),
    getAdminWorkers: build.query<{ total: number; items: AdminWorker[] }, WorkerQuery>({
      query: (p) => ({ url: '/admin/employees', params: Object.fromEntries(Object.entries(p).filter(([, v]) => v !== '' && v !== undefined)) }),
      providesTags: ['AdminWorkers'],
    }),
    getAdminWorker: build.query<AdminWorkerDetail, number>({
      query: (id) => `/admin/employees/${id}`,
      providesTags: ['AdminWorkers'],
    }),
    addDependent: build.mutation<Dependent, { employeeId: number; body: DependentInput }>({
      query: ({ employeeId, body }) => ({ url: `/admin/employees/${employeeId}/dependents`, method: 'POST', body }),
      invalidatesTags: [...DEPENDENT_TAGS],
    }),
    updateDependent: build.mutation<Dependent, { id: number; body: DependentInput }>({
      query: ({ id, body }) => ({ url: `/admin/dependents/${id}`, method: 'PUT', body }),
      invalidatesTags: [...DEPENDENT_TAGS],
    }),
    deleteDependent: build.mutation<Message, number>({
      query: (id) => ({ url: `/admin/dependents/${id}`, method: 'DELETE' }),
      invalidatesTags: [...DEPENDENT_TAGS],
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
      invalidatesTags: ['Applications', 'Outbox', 'AdminDashboard', 'AdminEmployers'],
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
    getPartnerKeys: build.query<PartnerKey[], void>({
      query: () => '/admin/partner-keys',
      providesTags: ['PartnerKeys'],
    }),
    createPartnerKey: build.mutation<PartnerKeyCreated, { name: string; kind: PartnerKind }>({
      query: (body) => ({ url: '/admin/partner-keys', method: 'POST', body }),
      invalidatesTags: ['PartnerKeys'],
    }),
    revokePartnerKey: build.mutation<PartnerKey, number>({
      query: (id) => ({ url: `/admin/partner-keys/${id}/revoke`, method: 'POST' }),
      invalidatesTags: ['PartnerKeys'],
    }),
    checkEligibility: build.mutation<Eligibility, string>({
      // a mutation, not a query: every check is a fresh lookup and is written to the audit trail
      query: (number) => ({ url: `/admin/eligibility/${encodeURIComponent(number.trim())}` }),
    }),
  }),
});

export const {
  useGetAdminDashboardQuery, useGetAdminEmployersQuery, useGetAdminEmployerQuery, useGetAdminWorkersQuery, useGetAdminWorkerQuery,
  useAddDependentMutation, useUpdateDependentMutation, useDeleteDependentMutation,
  useAdminLoginMutation, useGetApplicationsQuery, useGetApplicationQuery, usePostProgressMutation, useApproveApplicationMutation,
  useRejectApplicationMutation, useGetChangeRequestsForReviewQuery, useDecideChangeRequestMutation,
  useGetPartnerKeysQuery, useCreatePartnerKeyMutation, useRevokePartnerKeyMutation, useCheckEligibilityMutation,
} = adminApi;
