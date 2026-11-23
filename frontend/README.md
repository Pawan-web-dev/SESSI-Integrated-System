# ESSI Sindh – Employer Portal (frontend)

React 19 + TypeScript + Vite + Tailwind CSS v4. Pixel-matched rebuild of the approved design
(`../design-reference/source/ESSI_Employer_Portal_updated version.html`).

```powershell
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run typecheck
npm run lint
```

Demo logins: `101-10-000001` / `Essi@2026` (with data), `102-96-000001` / `Essi@2026` (new employer),
admin `admin` / `Admin@2026`. Registration OTP codes: SMS `123456`, email `654321`.

## Pages

| URL           | Page                                         | Folder                         |
| ------------- | -------------------------------------------- | ------------------------------ |
| `#/login`     | Employer login, forgot password, track application | `src/features/auth`      |
| `#/register`  | Registration wizard (account → verify → 4 steps) | `src/features/registration` |
| `#/welcome`   | Application submitted + live tracking        | `src/features/registration`    |
| `#/inbox`     | Demo SMS / email inbox                       | `src/features/inbox`           |
| `#/admin`     | ESSI admin: review, approve, reject          | `src/features/admin`           |
| `#/dashboard` | Employer dashboard (all sidebar modules)     | `src/features/dashboard`       |

## Folder structure

```
src/
├── main.tsx                     entry point (router + global styles)
├── app/
│   ├── App.tsx                  route table (lazy-loads the larger pages)
│   └── routes.ts                ROUTES constants – use these instead of hard-coded paths
├── assets/images/               ESSI logo and header banner
├── styles/
│   ├── global.css               Tailwind setup + ESSI theme colours/fonts/shadows (@theme)
│   ├── portal.css               login / submitted / inbox / admin   (scoped to .portal)
│   ├── workspace.css            registration wizard + dashboard     (scoped to .workspace)
│   └── print.css                print layout for receipts / F-4 / F-5
├── components/                  shared, feature-independent UI
│   ├── layout/                  PortalPage, PortalHeader, PortalFooter, AppFooter
│   ├── ui/                      Modal, Alert, ActionButton
│   └── shared/                  ApplicationTimeline (used by auth, registration, admin)
├── features/
│   ├── auth/
│   │   ├── pages/LoginPage.tsx
│   │   ├── components/          CaptchaField, LoginInfoPanels, ForgotPasswordModal, TrackApplicationModal
│   │   └── utils/captcha.ts
│   ├── registration/
│   │   ├── pages/               RegisterPage, ApplicationSubmittedPage
│   │   └── wizard/
│   │       ├── RegistrationWizard.tsx   state, validation, step navigation
│   │       ├── RegistrationView.tsx     page shell
│   │       ├── layout/          RegistrationHeader, WizardProgress, DocumentsChecklist, SecureNotice
│   │       └── steps/           CreateAccount, VerifyContact, BusinessInformation, DocumentUpload,
│   │                            ContactLocation, ReviewSubmit, Submitted
│   ├── inbox/                   pages/InboxPage, components/MessageCard
│   ├── admin/                   pages/AdminPage, components/AdminSignInCard, RegistrationsTable, ReviewApplicationModal
│   └── dashboard/
│       ├── pages/DashboardPage.tsx
│       ├── logic/createDashboard.tsx    dashboard state + business rules
│       ├── logic/documents.ts           data for the printable receipt and F-4 return
│       ├── DashboardView.tsx            shell: header, sidebar, banner, current section, footer
│       ├── layout/              DashboardHeader, DashboardSidebar, MobileMenuButton, WelcomeBanner
│       └── sections/            one folder per sidebar menu group
│           ├── overview/        Overview, Contribution Summary
│           ├── company-profile/ Business Information, Mandatory Documents, Contact & Location,
│           │                    Change Requests, New Change Request, Request Details
│           ├── employees/       Register Employee, Profile for Contribution
│           ├── contributions/   Monthly Contribution, Create Contribution, Submitted
│           ├── payments/        Generate Challan, Payment History, Receipt, F-4 list, F-4 return,
│           │                    F-5, F-5 Voucher, documents/ (shared printable parts)
│           ├── notifications/   Inbox
│           ├── settings/        Change Password
│           └── common/          "Coming soon" placeholder for items not built yet
├── services/
│   ├── portal/                  demo data service (accounts, auth, registration, tracking, outbox,
│   │                            masterData = Directorate + Industry tables, employerNumber = EIN)
│   └── api/                     axios client for the future FastAPI backend
├── types/view.ts                ViewProps / ViewEnv shared by dashboard + registration views
└── utils/                       format, hash, print helpers
```

## Conventions

- Import from `src` with the `@/` alias (`import { Modal } from '@/components/ui/Modal'`).
  Inside a feature, use relative imports (`../components/...`).
- A feature owns its pages, components and helpers. Anything used by two or more features goes in `src/components`, `src/services` or `src/utils`.
- Pages never touch `localStorage` directly – they call `@/services/portal`. To connect the backend,
  replace the functions in `src/services/portal/*.ts` with calls through `src/services/api`.
- Dashboard / registration markup is copied from the design. Each section receives `v` (view model from
  `renderVals()`) and `P` (account + navigation). New dashboard modules: add a section under
  `features/dashboard/sections/<group>/` and a selector flag in `logic/createDashboard.tsx`.
- `logic/createDashboard.tsx` is untyped (`// @ts-nocheck`) because it is a direct port of the design's
  JavaScript; add types section by section when wiring the real API.

## Styling with Tailwind CSS

All component styling is written as Tailwind classes in the JSX (`className="flex gap-3 p-4 ..."`).

- **Colours, fonts, shadows** are named in `src/styles/global.css` under `@theme`. Use the names instead of
  hex codes, and change a colour there to change it everywhere:

  | Class part        | Value     | Used for                       |
  | ----------------- | --------- | ------------------------------ |
  | `essi-green`      | `#067a35` | primary green, links, title bars |
  | `essi-dark`       | `#0b4d24` | dark buttons, headings         |
  | `essi-line`       | `#cfe4d5` | borders                        |
  | `essi-mint`       | `#e3f2e8` | table header background        |
  | `essi-pale`       | `#f4fbf6` | panels                         |
  | `ink` / `ink-soft` / `ink-muted` | `#17321f` / `#3d5a45` / `#4d6654` | text |
  | `danger` / `warning` / `info` | `#b00020` / `#b45309` / `#0b5fa8` | status |
  | `shadow-card`, `shadow-panel`, `shadow-menu` | | card / panel / menu shadows |
  | `font-document`, `font-arial` | | printed documents |

  e.g. `bg-essi-green text-white border border-solid border-essi-line text-ink-muted`.
- Tailwind's CSS reset ("preflight") is **not** loaded, so browser defaults apply as in the design.
  Because of that, always write `border-solid` together with `border` when adding a new border.
- The design's own class rules (`.btn`, `.card`, `.panel`, `.inp`, header `.hd` …) live in `portal.css` and
  `workspace.css` in the `components` layer – Tailwind classes always win over them.
- Values that change at runtime (status colours, chart bar heights) stay in `style={{ ... }}`.
- Reusable button: `components/ui/ActionButton` (`variant="primary" | "outline"`).

## Payment documents and printing

- **Receipt** – shown after *Pay Now* on Generate Challan, from *View Receipt* there, and from every paid row
  in *Payment History*.
- **F-4 return** – the print icon in the *F-4* list opens the F-4 return for that month and opens the print
  dialog; the *Print F-4* button prints it again.
- **F-4 Declaration** – the Declaration icon in the *F-4* list: employer's declaration for that month (printable).
- **C-1 schedule** – the C1 icon in the *F-4* list: worker-wise schedule of wages and contributions (printable).
- **F-5 voucher** – *Print Receipt* button.

Wrap a printable document in an element with class `print-area` and call `printDocument()` from
`@/utils/print`; only that element is printed (class `no-print` hides parts of it).

## Employer Identification Number (EIN)

Format `DDD-II-NNNNNN[-BB]` – Directorate code, Industry Classification code, establishment serial,
optional branch. Example `100-91-000001` = Malir Directorate, Retail Shops, establishment no. 1.

- **Master tables:** `src/services/portal/masterData.ts` – `DIRECTORATE_MASTER` (code, name, districts) and
  `INDUSTRY_MASTER` (code, name, `approvalRequired`). Codes 100 (Malir), 91 (Retail), 92 (Textile),
  94 (Construction) and 203 follow the SESSI requirement; **all other codes are placeholders** – replace
  them with SESSI's official list. Never change or re-use a code once numbers are issued.
- **Registration:** Industry Classification is mandatory (step 1); the Directorate is assigned from the district.
- **Issuing:** `src/services/portal/employerNumber.ts` – the number is issued when the application is
  approved, the serial continues per Directorate + Industry, and every issued number is kept in a registry
  so it is never issued again (also after closure). An establishment keeps its number for life.
- **Approval:** all industries currently have `approvalRequired: true`. Set it to `false` for an industry
  once it is confirmed that no approval is legally required (instant registration – to be implemented then).
- **Industry change:** through *Company Profile → Change Requests* (needs a supporting document and ESSI
  approval); the change is written to the request's activity log and the EIN stays the same.
- The EIN appears on the dashboard, company profile, receipts, F-4, F-4 declaration, C-1, F-5 and SMS/email notices.
