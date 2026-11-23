# API Integration

Today the frontend uses demo data stored in the browser. All data access goes through one layer,
so connecting the real backend does not require changes in the pages.

```
pages / components  →  frontend/src/services/portal/*  →  (today) localStorage
                                                       →  (later) frontend/src/services/api → FastAPI
```

## Steps

1. Set the API address in `frontend/.env.local`:

   ```
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

2. In `frontend/src/services/portal/*.ts`, replace each function body with a call through
   `axiosInstance` from `@/services/api/axiosInstance` (e.g. `getAccounts()` → `GET /employers`).
   Make the functions `async` and update the callers.
3. Move server-side rules to the backend: password checks, the Employer Identification Number registry
   (`employerNumber.ts`), approval workflow, and the master tables (`masterData.ts`).
4. Remove the demo seed data in `accounts.ts` once the API returns real records.

Endpoint definitions: [API_CONTRACTS.md](API_CONTRACTS.md).
