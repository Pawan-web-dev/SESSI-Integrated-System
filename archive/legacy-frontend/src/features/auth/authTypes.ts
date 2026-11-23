export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employer' | 'admin';
  employerNo?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
