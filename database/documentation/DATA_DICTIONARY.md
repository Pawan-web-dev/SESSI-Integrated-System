# Data Dictionary

Key fields and their formats. Column types and lengths: [`../schema.sql`](../schema.sql).

## Identifiers

| Field | Format | Example | Notes |
| --- | --- | --- | --- |
| `employers.ein` | `DDD-II-NNNNNN[-BB]` | `100-91-000001` | Directorate code, Industry code, serial, optional branch. Permanent; empty until approved |
| `directorates.code` | 3 digits | `100` | 100 = Malir Directorate |
| `industry_classifications.code` | 2 digits | `91` | 91 = Retail Shops, 92 = Textile, 94 = Construction |
| `registration_applications.app_no` | `REG-YYYY-NNNNN` | `REG-2026-10001` | Given to the applicant for tracking |
| `contributions.ref` | `CNTR-YYYY-NNNNN` | `CNTR-2026-00123` | |
| `challans.challan_no` | `CH-YYYY-NNNNNN` | `CH-2026-004512` | |
| `challans.receipt_no` | `RCP-YYYY-NNNNNN` | `RCP-2026-008590` | Set when paid |
| `change_requests.ref` | `CR-YYYY-NNNN` | `CR-2026-0001` | |
| CNIC | `00000-0000000-0` | `42101-1234567-1` | Stored formatted |
| Mobile | `03XX-XXXXXXX` | `0300-1234567` | Stored formatted |

## Status values

| Field | Values |
| --- | --- |
| `employers.status` | `pending`, `approved`, `rejected`, `closed` |
| `registration_applications.status` | `pending`, `approved`, `rejected` |
| `registration_applications.stage` | 1 submitted · 2 documents verified · 3 directorate review done · 4 complete |
| `application_events.code` | `submitted`, `docs`, `inspect`, `final`, `rejected` |
| `employees.status` | `Active`, `Inactive`, `Separated` |
| `employees.employment_type` | `Permanent`, `Contractual`, `Daily Wages`, `Piece Rated`, `Others` |
| `challans.status` | `unpaid`, `paid` |
| `change_requests.status` | `Pending Review`, `Under Review`, `Approved`, `Rejected` |
| `one_time_codes.purpose` | `contact` (registration), `password_reset` |
| `admin_users.role` | `officer`, `admin` |

## Amounts (whole rupees)

| Field | Meaning |
| --- | --- |
| `contribution_lines.amount` | 6% × min(wage, 37,000) × days / 30 |
| `contributions.amount` | Sum of the lines – contribution under section 20(1) |
| `challans.service_charges` | PKR 40 per challan |
| `challans.late_increase` | 0.5% of the contribution per day after `due_date`, at most 50% (section 24(1)) |
| `challans.total_paid` | amount + service charges + late increase |

Rates are application settings (`backend/app/core/config.py`) and must be confirmed by SESSI.
