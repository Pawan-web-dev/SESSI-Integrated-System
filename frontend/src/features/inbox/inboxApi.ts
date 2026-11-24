/** Messages the system would send by SMS / e-mail (backend DEMO_MODE only, until a gateway is connected). */
import { baseApi } from '@/services/api/baseApi';
import type { OutboxItem } from '@/services/api/types';

export const inboxApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOutbox: build.query<OutboxItem[], string>({
      query: (q) => ({ url: '/demo/outbox', params: q ? { q } : undefined }),
      providesTags: ['Outbox'],
    }),
  }),
});

export const { useGetOutboxQuery } = inboxApi;
