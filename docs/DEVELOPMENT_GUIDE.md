# Development Guide

## Requirements

- Node.js 20+ and npm (frontend)
- Python 3.10+ (backend, when started)

## Frontend

```powershell
cd frontend
npm install
npm run dev         # http://localhost:5173
npm run typecheck   # TypeScript
npm run lint        # oxlint
npm run build       # production build into frontend/dist
```

Structure, styling (Tailwind theme), the Employer Number and printing are documented in
[`frontend/README.md`](../frontend/README.md).

## Conventions

- One folder per feature under `frontend/src/features/<feature>/` (pages, components, utils).
  Code shared by several features goes to `src/components`, `src/services` or `src/utils`.
- Import with the `@/` alias across folders; relative imports inside a feature.
- Style with Tailwind classes and the ESSI theme names (`bg-essi-green`, `text-ink-muted`, …).
- Pages read and write data only through `@/services/portal`.
- The approved design is `design-reference/employer-portal-design.html`; keep screens matching it.

## Git workflow

1. Create a branch from `main` for each change: `git checkout -b feature/short-name`.
2. Before committing run `npm run typecheck`, `npm run lint` and `npm run build` in `frontend/`.
3. Write clear commit messages (what and why), e.g. `Add C-1 worker schedule to F-4`.
4. Push the branch and open a pull request into `main`.
5. Never commit `node_modules/`, `dist/`, `.env` files or test code (e.g. `// testing` comments).
