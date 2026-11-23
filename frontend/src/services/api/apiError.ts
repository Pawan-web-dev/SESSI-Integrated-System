export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  status?: number;
  details?: Record<string, unknown>;

  constructor(message: string, status?: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}
