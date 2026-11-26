/** Signed-in employer: profile, employees, contributions, challans, receipts, change requests. */
import { baseApi } from '@/services/api/baseApi';
import type {
  Challan, ChangeRequest, Contribution, ContributionDetail, ContributionPreview, DashboardSummary, Employee, EmployeeInput,
  EmployerDocument, EmployerProfile, F4Return, Message, Notification, Receipt,
} from '@/services/api/types';

const PAYMENT_TAGS = ['Contributions', 'Challans', 'Dashboard', 'Notifications'] as const;

export const employerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<EmployerProfile, void>({ query: () => '/employer/me', providesTags: ['Profile'] }),
    getDashboard: build.query<DashboardSummary, void>({ query: () => '/employer/dashboard', providesTags: ['Dashboard'] }),
    getNotifications: build.query<Notification[], void>({ query: () => '/employer/notifications', providesTags: ['Notifications'] }),
    markNotificationRead: build.mutation<Notification, number>({
      query: (id) => ({ url: `/employer/notifications/${id}/read`, method: 'POST' }),
      invalidatesTags: ['Notifications'],
    }),
    markAllNotificationsRead: build.mutation<Message, void>({
      query: () => ({ url: '/employer/notifications/read-all', method: 'POST' }),
      invalidatesTags: ['Notifications'],
    }),
    getDocuments: build.query<EmployerDocument[], void>({ query: () => '/employer/documents', providesTags: ['Documents'] }),
    changePassword: build.mutation<Message, { current_password: string; new_password: string }>({
      query: (body) => ({ url: '/employer/password', method: 'POST', body }),
    }),

    getEmployees: build.query<Employee[], void>({ query: () => '/employer/employees', providesTags: ['Employees'] }),
    createEmployee: build.mutation<Employee, EmployeeInput>({
      query: (body) => ({ url: '/employer/employees', method: 'POST', body }),
      invalidatesTags: ['Employees', 'Dashboard'],
    }),
    updateEmployee: build.mutation<Employee, { id: number; body: EmployeeInput }>({
      query: ({ id, body }) => ({ url: `/employer/employees/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Employees', 'Dashboard'],
    }),
    setEmployeeStatus: build.mutation<Employee, { id: number; status: Employee['status'] }>({
      query: ({ id, status }) => ({ url: `/employer/employees/${id}/status`, method: 'POST', body: { status } }),
      invalidatesTags: ['Employees', 'Dashboard'],
    }),
    deleteEmployee: build.mutation<Message, number>({
      query: (id) => ({ url: `/employer/employees/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Employees', 'Dashboard'],
    }),

    getContributions: build.query<Contribution[], void>({ query: () => '/employer/contributions', providesTags: ['Contributions'] }),
    previewContribution: build.query<ContributionPreview, string>({
      query: (month) => ({ url: '/employer/contributions/preview', params: { month } }),
      providesTags: ['Contributions', 'Employees'],
    }),
    createContribution: build.mutation<ContributionDetail, { month: string }>({
      query: (body) => ({ url: '/employer/contributions', method: 'POST', body }),
      invalidatesTags: [...PAYMENT_TAGS],
    }),
    getF4: build.query<F4Return, number>({ query: (id) => `/employer/contributions/${id}/f4`, providesTags: ['Contributions'] }),

    getChallans: build.query<Challan[], void>({ query: () => '/employer/challans', providesTags: ['Challans'] }),
    payChallan: build.mutation<Receipt, string>({
      query: (challanNo) => ({ url: `/employer/challans/${challanNo}/pay`, method: 'POST', body: { channel: '1Bill' } }),
      invalidatesTags: [...PAYMENT_TAGS],
    }),
    getReceipt: build.query<Receipt, string>({ query: (challanNo) => `/employer/challans/${challanNo}/receipt`, providesTags: ['Challans'] }),

    getChangeRequests: build.query<ChangeRequest[], void>({ query: () => '/employer/change-requests', providesTags: ['ChangeRequests'] }),
    createChangeRequest: build.mutation<ChangeRequest, { field: string; new_value: string; reason: string; document: string | null }>({
      query: (body) => ({ url: '/employer/change-requests', method: 'POST', body }),
      invalidatesTags: ['ChangeRequests'],
    }),
  }),
});

export const {
  useGetProfileQuery, useGetDashboardQuery, useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation, useGetDocumentsQuery, useChangePasswordMutation,
  useGetEmployeesQuery, useCreateEmployeeMutation, useUpdateEmployeeMutation, useSetEmployeeStatusMutation, useDeleteEmployeeMutation,
  useGetContributionsQuery, usePreviewContributionQuery, useCreateContributionMutation, useGetF4Query,
  useGetChallansQuery, usePayChallanMutation, useGetReceiptQuery, useGetChangeRequestsQuery, useCreateChangeRequestMutation,
} = employerApi;
