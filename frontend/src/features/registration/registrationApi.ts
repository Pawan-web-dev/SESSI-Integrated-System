/** Employer registration: contact verification and submission. */
import { baseApi } from '@/services/api/baseApi';
import type { Application, Message, RegistrationRequest, UploadedDocument } from '@/services/api/types';

export const registrationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendContactCodes: build.mutation<Message, { mobile: string; email: string }>({
      query: (body) => ({ url: '/registrations/contact/codes', method: 'POST', body }),
    }),
    verifyContact: build.mutation<{ contact_token: string }, { mobile: string; email: string; mobile_code: string; email_code: string }>({
      query: (body) => ({ url: '/registrations/contact/verify', method: 'POST', body }),
    }),
    /** One registration document (multipart upload); the answer's file_id goes into RegistrationRequest.documents. */
    uploadDocument: build.mutation<UploadedDocument, { contactToken: string; docType: string; file: File }>({
      query: ({ contactToken, docType, file }) => {
        const body = new FormData();
        body.append('contact_token', contactToken);
        body.append('doc_type', docType);
        body.append('file', file);
        return { url: '/registrations/documents', method: 'POST', body };
      },
    }),
    submitRegistration: build.mutation<Application, RegistrationRequest>({
      query: (body) => ({ url: '/registrations', method: 'POST', body }),
      invalidatesTags: ['Applications', 'Outbox'],
    }),
  }),
});

export const { useSendContactCodesMutation, useVerifyContactMutation, useUploadDocumentMutation, useSubmitRegistrationMutation } = registrationApi;

/** The last application submitted in this browser, so the status page can track it. */
const LAST_KEY = 'essi:lastApplication';
export interface LastApplication {
  app_no: string;
  cnic: string;
}
export function saveLastApplication(value: LastApplication): void {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
}
export function loadLastApplication(): LastApplication | null {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    return raw ? (JSON.parse(raw) as LastApplication) : null;
  } catch {
    return null;
  }
}
