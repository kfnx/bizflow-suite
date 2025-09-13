# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router routes, layouts, API handlers.
- `components/`: Reusable React components (PascalCase files, `.tsx`).
- `lib/`: Server/client utilities (e.g., DB, auth, schemas).
- `hooks/`: Reusable React hooks (`useX` naming).
- `utils/`: Pure helpers shared across the app.
- `types/`: Shared TypeScript types and declarations.
- `public/`: Static assets; served at site root.
- `mysql/`, `drizzle.config.ts`: Drizzle ORM setup and migrations.
- `scripts/`: Local tooling (e.g., MinIO init/test).
- `docs/`: Project documentation and references.

## Build, Test, and Development Commands
- `pnpm dev`: Run the Next.js dev server.
- `pnpm build`: Production build; checks types during compilation.
- `pnpm start`: Start the production server after build.
- `pnpm lint` / `pnpm lint:fix`: Lint (and auto‑fix) with ESLint.
- `pnpm typecheck`: Strict TypeScript checks without emit.
- `pnpm format`: Format with Prettier (incl. import sorting).
- Database (Drizzle): `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`, `pnpm db:drop`, `pnpm db:studio`.
- Local services: `pnpm docker:dev` (MySQL, MinIO), `pnpm init:minio`, `pnpm test:minio`.

## Coding Style & Naming Conventions
- TypeScript, 2‑space indent, semicolons off (Prettier default), single quotes allowed.
- Components: PascalCase; hooks: `useX`; files in `components/` and `hooks/` are `.tsx`/`.ts`.
- Tailwind for styling; prefer utility classes; keep variants via `tailwind-variants`.
- Linting: ESLint (`eslint-config-next`, Tailwind plugin). Formatting: Prettier with import sorting.

## Testing Guidelines
- No dedicated test runner configured yet. For now, rely on type checks, lint, and manual QA.
- If adding tests, prefer Vitest/Playwright; colocate as `__tests__/` or `*.test.ts(x)` near sources.

## Commit & Pull Request Guidelines
- Follow Conventional Commits where possible: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`.
- Keep subjects imperative and scoped: `feat(roles): enforce permission checks`.
- PRs must include: concise description, screenshots for UI changes, linked issues, migration notes if DB changes.

## Security & Configuration Tips
- Copy `.env.example` to `.env`; never commit secrets. Required services: MySQL and MinIO (use `pnpm docker:dev`).
- Sentry is enabled (`sentry.*.config.ts`); avoid logging sensitive data.
- On install, Drizzle codegen runs automatically (`postinstall`). Review generated SQL before migrating.
