/**
 * Frontend settings, read from frontend/.env (see .env.example). Restart `npm run dev` after changing them.
 * Everything here ends up in the browser, so never put passwords or API keys in VITE_* variables –
 * credentials belong in backend/.env.
 */
const env = import.meta.env;

export const config = {
  /** FastAPI address including /api/v1 */
  apiBaseUrl: env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  /** show the "SMS / email inbox (testing)" link on the login page (needs DEMO_MODE=true on the backend) */
  showTestInbox: (env.VITE_SHOW_TEST_INBOX ?? 'true') === 'true',
  /** largest document the registration form accepts – keep equal to MAX_UPLOAD_MB in backend/.env */
  maxUploadMb: Number(env.VITE_MAX_UPLOAD_MB || 5),
} as const;
