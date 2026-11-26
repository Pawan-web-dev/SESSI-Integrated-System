# API Contracts

Base URL `/api/v1`. Full, interactive documentation with request / response examples: run the backend and
open http://localhost:8000/docs.

Errors return `{"detail": "message for the user"}` with 400 (rule broken), 401 (sign in), 403 (not allowed
yet), 404, 409 (conflict / duplicate), 422 (invalid input) or 429 (login locked).
Signed-in calls send `Authorization: Bearer <access_token>`.

## Public

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/master/directorates` | Directorates with their districts |
| GET | `/master/industries` | Industry classifications |
| POST | `/auth/login` | Employer login by EIN, CNIC, e-mail or mobile → token |
| POST | `/auth/password-reset/request` | Send a reset code |
| POST | `/auth/password-reset/confirm` | Set a new password with the code |
| POST | `/registrations/contact/codes` | Send mobile + e-mail verification codes |
| POST | `/registrations/contact/verify` | Check the codes → `contact_token` |
| POST | `/registrations/documents` | Upload one document (multipart: `contact_token`, `doc_type`, `file`) → `file_id` |
| POST | `/registrations` | Submit a registration (needs `contact_token`; `documents` = type → `file_id`) |
| POST | `/registrations/track` | Application status by Application No. + CNIC |
| GET | `/demo/outbox?q=` | Messages that would be sent (only when `DEMO_MODE=true`) |

## Employer (signed in)

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/employer/me` | Profile with EIN breakdown |
| POST | `/employer/password` | Change password |
| GET | `/employer/notifications` | SMS / e-mail notices sent to this employer (newest first); `read_at` is null while unread |
| POST | `/employer/notifications/{id}/read` | Mark one notification as read |
| POST | `/employer/notifications/read-all` | Mark every notification as read |
| GET | `/employer/documents` | Documents from the registration application and their status |
| GET | `/employer/documents/{id}/file` | One of the employer's own uploaded files (inline) |
| GET | `/employer/dashboard` | Employee counts, last 6 months, outstanding, next due |
| GET, POST | `/employer/employees` | List / add employees |
| GET, PUT, DELETE | `/employer/employees/{id}` | View / edit / delete (delete only if never in a contribution) |
| POST | `/employer/employees/{id}/status` | Active / Inactive / Separated |
| GET, POST | `/employer/contributions` | List / submit a month (creates the challan) |
| GET | `/employer/contributions/preview?month=YYYY-MM` | Worker lines and amounts the month would have (nothing saved) |
| GET | `/employer/contributions/{id}` | Contribution with worker lines |
| GET | `/employer/contributions/{id}/f4` | F-4 return + C-1 schedule + declaration data |
| GET | `/employer/challans` | All challans |
| GET | `/employer/challans/{no}` | One challan, incl. amount payable today |
| POST | `/employer/challans/{no}/pay` | Demo payment → receipt |
| GET | `/employer/challans/{no}/receipt` | Payment receipt |
| GET, POST | `/employer/change-requests` | List / submit change requests |
| GET | `/employer/change-requests/{id}` | One request with history |

## Admin (ESSI officers)

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/admin/login` | Officer login → token |
| GET | `/admin/applications?status=pending` | Applications + counts per status |
| GET | `/admin/applications/{id}` | Details incl. `employer_no_on_approval` and the uploaded documents |
| GET | `/admin/applications/{id}/documents/{doc_id}` | The uploaded file (inline; the view is audited) |
| POST | `/admin/applications/{id}/progress` | Stage 2 (documents) or 3 (directorate review) + note |
| POST | `/admin/applications/{id}/approve` | Approve and issue the EIN |
| POST | `/admin/applications/{id}/reject` | Reject with a reason |
| GET | `/admin/change-requests?status=` | Change requests to review |
| POST | `/admin/change-requests/{id}/decision` | Under Review / Approved / Rejected |
| GET | `/admin/audit?ein=` | Audit trail (all, or for one employer) |
