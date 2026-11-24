# ESSI Sindh – Employer Portal (frontend)

React 19 + TypeScript + Vite + Tailwind CSS v4 + Redux Toolkit (RTK Query). Pixel-matched rebuild of the
approved design (`../design-reference/source/ESSI_Employer_Portal_updated version.html`).
All data comes from the FastAPI backend in `../backend` – start it first (see `../backend/README.md`).

```powershell
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run typecheck
npm run lint
```

Settings are in `frontend/.env` (copy `.env.example`; restart `npm run dev` after a change):

| Variable | Meaning |
| --- | --- |
| `VITE_API_BASE_URL` | Backend address incl. `/api/v1` (default `http://localhost:8000/api/v1`) |
| `VITE_SHOW_TEST_INBOX` | Show the "SMS / email inbox (testing)" link on the login page – `false` in production |
| `VITE_MAX_UPLOAD_MB` | Largest registration document – keep equal to `MAX_UPLOAD_MB` in `backend/.env` |

`VITE_*` values are built into the JavaScript every visitor downloads, so **never put passwords or keys here**.
All credentials (database, SMTP, SMS gateway, admin, 1LINK) belong in `backend/.env`. They are read in one place:
`src/config/env.ts`.

There are no demo accounts. Register an employer, approve it in `#/admin` (admin account from
`python -m app.create_admin`), then log in with the issued Employer No. Verification codes appear in `#/inbox`
while the backend runs with `DEMO_MODE=true`.

## Pages

| URL           | Page                                         | Folder                         |
| ------------- | -------------------------------------------- | ------------------------------ |
| `#/login`     | Employer login, forgot password, track application | `src/features/auth`      |
| `#/register`  | Registration wizard (account → verify → 4 steps) | `src/features/registration` |
| `#/welcome`   | Application submitted + live tracking        | `src/features/registration`    |
| `#/inbox`     | SMS / email outbox (testing, `DEMO_MODE` only) | `src/features/inbox`         |
| `#/admin`     | ESSI admin: registrations + change requests  | `src/features/admin`           |
| `#/dashboard` | Employer dashboard (all sidebar modules)     | `src/features/dashboard`       |

## Folder structure

```
src/
├── main.tsx                     entry point (Redux Provider + router + global styles)
├── app/
│   ├── App.tsx                  route table (lazy-loads the larger pages)
│   ├── routes.ts                ROUTES constants – use these instead of hard-coded paths
│   ├── store.ts                 Redux store: all slices + RTK Query cache + persistence listener
│   └── hooks.ts                 typed useAppDispatch / useAppSelector
├── config/env.ts                frontend settings from .env (VITE_*)
├── assets/images/               ESSI logo and header banner
├── styles/
│   ├── global.css               Tailwind setup + ESSI theme colours/fonts/shadows (@theme)
│   ├── portal.css               login / submitted / inbox / admin   (scoped to .portal)
│   ├── workspace.css            registration wizard + dashboard     (scoped to .workspace)
│   └── print.css                print layout for receipts / F-4 / F-5
├── components/                  shared, feature-independent UI
│   ├── layout/                  PortalPage, PortalHeader, PortalFooter, AppFooter
│   ├── ui/                      Modal, Alert, ActionButton
│   └── shared/                  ApplicationTimeline, DocumentViewer (shows uploaded PDFs / images)
├── features/
│   ├── auth/
│   │   ├── authSlice.ts         signed-in employer / admin (kept in sessionStorage)
│   │   ├── authApi.ts           login, password reset, track application
│   │   ├── pages/LoginPage.tsx
│   │   ├── components/          CaptchaField, LoginInfoPanels, ForgotPasswordModal, TrackApplicationModal
│   │   └── utils/captcha.ts
│   ├── registration/
│   │   ├── registrationApi.ts   verification codes, document upload, submit application
│   │   ├── registrationSlice.ts wizard draft, uploaded files, step, messages + thunks
│   │   ├── pages/               RegisterPage, ApplicationSubmittedPage
│   │   └── wizard/
│   │       ├── RegistrationWizard.tsx   state, validation, step navigation
│   │       ├── RegistrationView.tsx     page shell
│   │       ├── layout/          RegistrationHeader, WizardProgress, DocumentsChecklist, SecureNotice
│   │       └── steps/           CreateAccount, VerifyContact, BusinessInformation, DocumentUpload,
│   │                            ContactLocation, ReviewSubmit, Submitted
│   ├── inbox/                   inboxApi.ts, pages/InboxPage, components/MessageCard
│   ├── documents/               documentViewerSlice.ts (open a protected document from any page)
│   ├── admin/                   adminApi.ts, adminSlice.ts, pages/AdminPage, components/AdminSignInCard, RegistrationsTable,
│   │                            ReviewApplicationModal, ChangeRequestsReview
│   └── dashboard/
│       ├── employerApi.ts               profile, employees, contributions, challans, change requests …
│       ├── dashboardSlice.ts            open section, menus, selected receipt / F-4 / request, messages
│       ├── pages/DashboardPage.tsx
│       ├── logic/useDashboardModel.ts   reads the API hooks and builds the view model for the sections
│       ├── logic/documents.ts           data for the printable receipt, F-4, declaration and C-1
│       ├── logic/photo.ts               resize an employee photo before upload
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
│   └── api/                     baseApi.ts (RTK Query + auth header + 401 sign-out), types.ts (API shapes),
│                                masterApi.ts (Directorates, industries), errors.ts (readable messages),
│                                files.ts (addresses of uploaded documents)
├── types/view.ts                ViewProps / ViewEnv shared by dashboard + registration views
└── utils/                       format, print helpers
```

## Redux – how state is organised

| Kind of state | Where | Examples |
| --- | --- | --- |
| **Server data** | RTK Query cache (`api` slice) via `<feature>Api.ts` hooks | profile, employees, contributions, challans, applications, documents list |
| **Session** | `auth` slice (sessionStorage) | signed-in employer / officer and their tokens |
| **Multi-step draft** | `registration` slice (draft in localStorage) | wizard fields, uploaded file ids, current step |
| **Screen state shared across components / pages** | `dashboard`, `admin`, `documentViewer` slices | open section, selected receipt / F-4, filters, messages, the document on screen |
| **A single form while it is being typed** | `useState` in the component | employee form, change-password form, reject reason |

Why it is split this way (the official Redux style guide):

- **Server data belongs in RTK Query, never copied into a slice.** RTK Query already caches, de-duplicates,
  polls, refetches on focus and refreshes lists through tags after a mutation. A copy in a slice goes stale.
- **Slices hold what the server doesn't know** – who is signed in, where the user is, what is selected – so any
  component can read or change it (`useAppSelector` / `useAppDispatch`) and it is visible in Redux DevTools.
- **Keystroke-by-keystroke form state stays local** unless it must survive navigation (the registration
  draft does, so it is in Redux). Sending every keystroke of every form through the global store adds
  re-renders and boilerplate for no benefit.
- **Side effects stay out of reducers:** server calls run in thunks (`createAsyncThunk` calling RTK Query
  endpoints), saving to storage runs in the listener middleware in `app/store.ts`.
- **Only serialisable values in the store** (no `File`, `Date` or functions); passwords and tokens that must not
  be saved are excluded from persistence (`registrationSlice.saveDraft`).

Adding something new: a new endpoint → `injectEndpoints` in the feature's `*Api.ts`; new shared screen state →
a reducer in that feature's slice; a one-screen form → `useState`.

## Conventions

- Import from `src` with the `@/` alias (`import { Modal } from '@/components/ui/Modal'`).
  Inside a feature, use relative imports (`../components/...`).
- A feature owns its pages, components and helpers. Anything used by two or more features goes in `src/components`, `src/services` or `src/utils`.
- **Server data** goes through RTK Query only (see "Redux" above). Each feature has its endpoints in `<feature>Api.ts`
  (`baseApi.injectEndpoints`), and components use the generated hooks (`useGetEmployeesQuery`,
  `useCreateContributionMutation` …). Mutations invalidate tags, so lists refresh by themselves.
- **App state** (who is signed in) is the `auth` slice; read it with `useAppSelector`. Don't copy server data
  into Redux slices or `localStorage`.
- API types live in `services/api/types.ts` and match the backend schemas (`backend/app/schemas`).
  Show errors with `errorMessage(error)` from `services/api/errors.ts`.
- Dashboard / registration markup is copied from the design. Each section receives `v` (view model from
  `logic/useDashboardModel.ts`) and `P` (account + navigation). New dashboard modules: add a section under
  `features/dashboard/sections/<group>/` and the values it needs in `useDashboardModel.ts`.

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

- **Master tables:** kept in the database (`backend/app/services/master_data.py`) and read with
  `useGetDirectoratesQuery` / `useGetIndustriesQuery`. Codes 100 (Malir), 91 (Retail), 92 (Textile),
  94 (Construction) and 203 follow the SESSI requirement; **all other codes are placeholders** – replace
  them with SESSI's official list. Never change or re-use a code once numbers are issued.
- **Registration:** Industry Classification is mandatory (step 1); the Directorate is assigned from the district.
- **Issuing:** by the backend (`backend/app/services/ein.py`) – the number is issued when the application is
  approved, the serial continues per Directorate + Industry, and every issued number is kept in a registry
  so it is never issued again (also after closure). An establishment keeps its number for life.
- **Approval:** all industries currently have `approval_required = true`. Set it to `false` for an industry
  once it is confirmed that no approval is legally required (instant registration – to be implemented then).
- **Industry change:** through *Company Profile → Change Requests* (needs a supporting document and ESSI
  approval); the change is written to the request's activity log and the EIN stays the same.
- The EIN appears on the dashboard, company profile, receipts, F-4, F-4 declaration, C-1, F-5 and SMS/email notices.
