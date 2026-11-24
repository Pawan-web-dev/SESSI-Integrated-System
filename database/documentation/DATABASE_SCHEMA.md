# Database Schema

20 tables, PostgreSQL. Full DDL: [`../schema.sql`](../schema.sql). Amounts are whole rupees (integer);
timestamps are stored with time zone (UTC).

## Master data

| Table | Key | Purpose |
| --- | --- | --- |
| `directorates` | `code` (3 digits) | SESSI Directorates – first EIN segment |
| `directorate_districts` | `district` | Which Directorate serves a district |
| `industry_classifications` | `code` (2 digits) | Industry Classification Master Table – second EIN segment; `approval_required` decides approval vs instant registration |

Codes are permanent: never change or re-use a code once an EIN contains it; set `active = false` instead.

## Employers and the Employer Identification Number

| Table | Key | Purpose |
| --- | --- | --- |
| `employers` | `id`; `ein` unique | The establishment: status (`pending`, `approved`, `rejected`, `closed`), business details, Directorate, industry |
| `employer_users` | `id`; `cnic`, `email` unique | Authorized person who signs in; failed-login counter and lock |
| `ein_registry` | `ein` | Every EIN ever issued (one per employer). Never deleted, so a number is never re-issued |
| `ein_sequences` | `(directorate_code, industry_code)` unique | Last serial issued per Directorate + Industry, locked while issuing |
| `one_time_codes` | `id` | Hashed 6-digit codes: contact verification and password reset (expire after 10 minutes, single use) |

## Registration

| Table | Key | Purpose |
| --- | --- | --- |
| `registration_applications` | `id`; `app_no` unique | Application `REG-YYYY-NNNNN`, status, review stage (1-4), decision |
| `application_events` | `id` | Activity log shown to the applicant (submitted, docs, inspect, final, rejected) |
| `application_documents` | `id` | Mandatory documents per application |

## Workforce, contributions and payments

| Table | Key | Purpose |
| --- | --- | --- |
| `employees` | `id`; `(employer_id, cnic)` unique | Workers of an employer; status Active / Inactive / Separated |
| `contributions` | `id`; `(employer_id, month)` unique | Monthly return (F-4): workers, wages, contribution |
| `contribution_lines` | `id` | Worker-wise schedule (C-1); copies name / CNIC so the return stays as filed |
| `challans` | `id`; `challan_no`, `receipt_no` unique | Payment voucher per contribution; when paid: date, days late, increase, receipt |

## Change requests, messages, staff, audit

| Table | Key | Purpose |
| --- | --- | --- |
| `change_requests` / `change_request_events` | `id`; `ref` unique | Requests to change registered details and their history |
| `outbox_messages` | `id` | Every SMS / e-mail the system sends (delivered by a gateway job) |
| `admin_users` | `id`; `username` unique | ESSI officers |
| `audit_log` | `id` | Who did what, when (EIN issued, industry changed, logins, payments …). Append-only |
