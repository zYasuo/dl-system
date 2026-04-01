# DL System — Frontend

[Next.js](https://nextjs.org/) (App Router) app for **DL System** with [TanStack Query](https://tanstack.com/query), [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/), [shadcn/ui](https://ui.shadcn.com/), and a typed HTTP client via [openapi-fetch](https://github.com/drwpow/openapi-fetch) / [openapi-typescript](https://github.com/drwpow/openapi-typescript).

## Requirements

- Node 20+
- Nest backend from this repo (default `http://localhost:3000`, prefix `/api/v1`)

## Setup

```bash
cp .env.example .env.local
```

- **`BACKEND_INTERNAL_URL`**: target for `next.config.ts` rewrites (`/api/v1/*` → Nest). Avoids browser CORS issues.
- **`NEXT_PUBLIC_API_BASE_PATH`**: base path used by the client in the browser (should be `/api/v1` to match the proxy).

**Authentication:** users sign in against the backend (`POST /api/v1/auth/login`). The JWT access token is sent in the `Authorization: Bearer …` header for all protected API routes (e.g. tickets, clients, client-contracts). The refresh token is stored in an **httpOnly** cookie on path `/api/v1/auth`; calls to `refresh` / `logout` must use `credentials: 'include'` so the cookie is sent. Ticket ownership is inferred from the token — **do not** send `userId` in the body when creating a ticket.

## Development

Terminal 1 — backend (Redis/Postgres per project setup):

```bash
cd ../backend
npm run start:dev
```

Terminal 2 — frontend on port **3001** (avoids clashing with Nest on 3000):

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). After login, the default route is **`/dashboard`** (KPIs and charts). Authenticated app routes: `/dashboard`, `/tickets`, `/tickets/new`, `/tickets/[id]/edit` (the UI currently focuses on dashboard and tickets; other API modules can be integrated later).

**Dashboard:** per-status totals come from `GET /api/v1/tickets?status=…&limit=1` (`meta.total`). The time-series chart aggregates recent tickets from the same API on the client (up to 100 per page); for full series, a dedicated metrics endpoint in the backend would be better (see `TODO` comments in `features/dashboard`).

## OpenAPI / types

Types are generated in `src/lib/api/v1.d.ts` from the snapshot at `openapi/openapi.snapshot.json`.

- Regenerate from the current snapshot:

  ```bash
  npm run openapi:generate
  ```

- Refresh the snapshot with the backend running:

  ```bash
  npm run openapi:pull
  npm run openapi:generate
  ```

## Architecture (short)

- **`src/features/dashboard`**: shell with sidebar (shadcn), `useDashboardStats`, overview page with charts (Recharts via `Chart`).
- **`src/features/tickets`**: hooks (`useTicketsList`, `useCreateTicket`, …), Zod schemas, ticket UI.
- **`src/lib/api`**: OpenAPI client, adapter helpers, and `ApiError` aligned with the Nest error envelope (`success: false`, `message`, …).
- **`src/shared`**: shadcn UI and shared components (`PageHeader`, `EmptyState`, `ErrorAlert`).

**Note:** there is no `GET /tickets/:id` in the backend. The edit page finds a ticket by scanning the paginated list (MVP).
