import type { User } from '../../features/auth/authTypes';

export const mockAuthService = {
  login: async (identifier: string, pass: string): Promise<{ user: User; token: string }> => {
    await new Promise((r) => setTimeout(r, 500));
    if (pass !== 'Essi@2026' && pass !== 'Admin@2026') {
      throw new Error('Invalid credentials');
    }
    const isAdmin = identifier.toLowerCase() === 'admin';
    const token = 'mock-jwt-token-xyz';
    localStorage.setItem('token', token);
    return {
      user: {
        id: isAdmin ? 'admin-1' : 'user-1',
        name: isAdmin ? 'System Administrator' : 'ABC Manufacturing',
        email: isAdmin ? 'admin@essi.sindh.gov.pk' : 'accounts@abcmanufacturing.example',
        role: isAdmin ? 'admin' : 'employer',
        employerNo: isAdmin ? undefined : '3-61-0001',
      },
      token,
    };
  },
};
