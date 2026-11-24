/** Turn an RTK Query / backend error into a sentence to show the user. */
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

type ApiError = FetchBaseQueryError | SerializedError | undefined | unknown;

export function errorMessage(error: ApiError, fallback = 'Something went wrong. Please try again.'): string {
  if (!error || typeof error !== 'object') return fallback;
  if ('status' in error) {
    if (error.status === 'FETCH_ERROR') return 'Cannot reach the SESSI server. Check that it is running and try again.';
    const data = (error as FetchBaseQueryError).data as { detail?: unknown } | undefined;
    const detail = data?.detail;
    if (typeof detail === 'string') return detail;
    // FastAPI validation errors: [{ loc: [...], msg: '...' }]
    if (Array.isArray(detail) && detail.length) {
      const first = detail[0] as { loc?: (string | number)[]; msg?: string };
      const field = first.loc?.[first.loc.length - 1];
      return (field ? `${String(field).replace(/_/g, ' ')}: ` : '') + (first.msg || fallback);
    }
  }
  if ('message' in error && typeof (error as SerializedError).message === 'string') return (error as SerializedError).message as string;
  return fallback;
}
