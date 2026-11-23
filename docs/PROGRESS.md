# Progress

## Done – Employer Portal (frontend, demo data)

- All screens of the approved design rebuilt in React and checked element-by-element against it:
  login, registration wizard, application tracking, demo inbox, admin panel, employer dashboard.
- Feature-based folder structure, Tailwind CSS with ESSI theme, lazy-loaded pages.
- Payment receipt, F-4 return, F-4 declaration, C-1 worker schedule, F-5 voucher – all printable.
- Employer Identification Number `DDD-II-NNNNNN`: Directorate and Industry master tables, mandatory
  Industry Classification at registration, permanent numbers issued on approval and never re-used,
  industry change through an approved change request.

## Next

- Replace placeholder Directorate / Industry codes with SESSI's official list.
- Decide which industries need approval; enable instant registration for the others.
- Backend: FastAPI endpoints, PostgreSQL schema, move business rules server-side
  (see [API_INTEGRATION.md](API_INTEGRATION.md)).
- Modules not built yet in the dashboard (shown as "coming soon"): reports, alerts, FAQs, tickets,
  account and notification settings.
