/** URL of every page (hash routes, same as the design: #/login, #/register, ...). */
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  applicationSubmitted: '/welcome',
  inbox: '/inbox',
  admin: '/admin',
  dashboard: '/dashboard',
} as const;

export type RouteKey = keyof typeof ROUTES;
