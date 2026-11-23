export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export class ApiError extends Error {
  status?: number;
  details?: Record<string, any>;

  constructor(message: string, status?: number, details?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}
