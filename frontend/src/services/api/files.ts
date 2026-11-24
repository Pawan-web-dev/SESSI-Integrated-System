/** Addresses of uploaded documents. Show one with dispatch(openDocument({ path, name })) – see features/documents. */

/** Admin: a document of a registration application. */
export const adminDocumentUrl = (applicationId: number, documentId: number) => `/admin/applications/${applicationId}/documents/${documentId}`;

/** Employer: one of the employer's own documents. */
export const employerDocumentUrl = (documentId: number) => `/employer/documents/${documentId}/file`;
