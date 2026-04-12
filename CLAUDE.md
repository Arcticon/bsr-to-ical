# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# From repo root (runs all apps in parallel)
pnpm dev          # start both apps
pnpm build        # build all apps
pnpm test         # run all tests
pnpm lint         # lint all apps
pnpm format       # format all files (prettier)
pnpm format:check # check formatting

# From apps/backend or apps/frontend (run single app)
pnpm dev
pnpm test
pnpm lint

# Run single test file
pnpm vitest run src/util/bsr.test.ts
```

## Architecture

pnpm monorepo. Two apps: backend API and frontend SPA.

**Data flow:** User enters Berlin street address → frontend builds `webcal://` URL → backend `/ical` endpoint queries BSR public API → returns `.ics` calendar feed with waste pickup events.

### Backend (`apps/backend/`)

Fastify server on port 3001. Single endpoint: `GET /ical?street=&number=&zipcode=&categories=`.

- `src/util/bsr.ts` — two BSR API calls: address → location ID, then location ID → appointments by date
- `src/util/ical.ts` — transforms BSR appointments into iCal events (all-day, 6h alarm, German summary)
- `src/index.ts` — Fastify route wiring and validation schema

**Env:** `BSR_BASE` must be set (production value in `apps/backend/.env`). Dev uses `--env-file=.env`.

### Frontend (`apps/frontend/`)

React 19 + TanStack Router (file-based routing) + TailwindCSS v4. Vite on port 3000.

- `src/routes/index.tsx` — single page: street/number inputs → builds Google Calendar add URL with encoded `webcal://` link pointing to the backend
- `src/routes/__root.tsx` — root layout

**Env:** `VITE_BACKEND_URL` must be set (default `localhost:3001` in `apps/frontend/.env`). No protocol — prepended with `webcal://` at runtime.

## Conventions

- ESM throughout (`"type": "module"`)
- No semicolons, single quotes (prettier config)
- Strict TypeScript; `satisfies` used for type narrowing without widening
- BSR API categories: `HM` (Hausmuell), `BI` (Biogut), `WS` (Wertstoffe), `WB` (Weihnachtsbaum) — enum in `bsr.ts`
- Always use curly braces for `if`, `else`, `for`, `while` — no one-liner bodies
- Prefer array methods (`map`, `filter`, `find`, `reduce`, etc.) over imperative loops where applicable
- Use arrow functions for function definitions (`const a = () => {}`) instead of function declarations (`function a() {}`)
