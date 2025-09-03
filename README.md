ERPv3 MVP ERP UI + ERPNext Integration

This app is a Next.js 14 + Prisma ERP MVP. It includes minimal UI pages for customers, payables, and sales, and server-side API routes that securely forward to ERPNext using token auth.

Run in Codespaces

- Create `.env` in the project root with at minimum:
  - `DATABASE_URL=file:./dev.db`
  - `NEXTAUTH_URL=http://localhost:3000`
  - `NEXTAUTH_SECRET=your_long_random_secret`
  - Optional for local login (defaults to admin/admin):
    - `AUTH_USER=admin`
    - `AUTH_PASS=admin`
  - For ERPNext forwarding (required for live data):
    - `NEXTERP_HOST=https://your-erpnext-host` (e.g. https://erp.example.com)
    - `NEXTERP_API_KEY=...`
    - `NEXTERP_API_SECRET=...`

- Install deps and setup DB:
  - `npm install`
  - `npx prisma migrate dev --name init`

- Start the app:
  - `npm run dev`
  - Open forwarded port 3000

Auth

- NextAuth Credentials provider with httpOnly cookies (JWT sessions). Sign in at `/login`.
- Unauthenticated users are redirected to `/login` by middleware.

ERPNext API Routes

- `/api/customers` – GET forwards to ERPNext `Customer` resource
- `/api/items` – GET forwards to ERPNext `Item` resource
- `/api/sales-orders` – GET forwards to ERPNext `Sales Order` resource (supports `id` to fetch a single document)
- `/api/purchase-invoices` – GET forwards to ERPNext `Purchase Invoice`; POST with `{ action:"mark_paid", id }` attempts to mark invoice as Paid.

All routes require env vars `NEXTERP_HOST`, `NEXTERP_API_KEY`, `NEXTERP_API_SECRET`. If missing, they return `503 { error: "nexterp_credentials_missing" }`. Secrets are only used server-side via the `Authorization: token <KEY>:<SECRET>` header to ERPNext.

UI Pages

- `/customers` – search + table; click a row to open a drawer with customer details and recent sales orders.
- `/payables` – tabs (Open / Due Soon / Overdue) with a "Mark as Paid" action per invoice.
- `/sales` – orders table with status chips; right panel shows items for the selected order.

Notes

- ERPNext filters can be passed directly via query params (e.g., `filters=[...]`, `fields=[...]`, `order_by=...`).
- Adjust the POST handler for purchase invoices if your ERPNext workflow requires different fields to mark as paid.

Test Plan (MVP)

- Auth:
  - Visit `/login`, sign in with `AUTH_USER`/`AUTH_PASS`. Verify redirect to `/` then navigate to `/customers`.
  - Hit `/api/auth/me` returns 200 with user when signed in; 401 when signed out.
  - POST `/api/auth/logout` then refresh; accessing `/customers` redirects to `/login`.
- ERPNext routes:
  - With valid `NEXTERP_*` envs, `GET /api/customers` returns ERPNext JSON list; remove an env and verify 503 with `nexterp_credentials_missing`.
  - `GET /api/sales-orders?id=<order>` returns a document with `items`.
  - `POST /api/purchase-invoices` with `{ action:"mark_paid", id:"<invoice>" }` forwards and returns ERPNext response.
- UI:
  - `/customers` search filters results; clicking a row opens drawer and shows recent sales orders.
  - `/payables` tabs filter lists; clicking "Mark as Paid" triggers request and refreshes list.
  - `/sales` lists orders; selecting one shows item lines in right panel.

SQLite dev

- Env:
  - `DATABASE_URL=file:./dev.db`
  - Prisma datasource uses `provider = "sqlite"` and `relationMode = "prisma"` in `prisma/schema.prisma`.
  - `NEXTAUTH_URL=http://localhost:3000`
  - `NEXTAUTH_SECRET=<random>`
  - Optional login: `AUTH_USER`, `AUTH_PASS` (defaults to admin/admin)
  - Optional ERPNext for live data: `NEXTERP_HOST`, `NEXTERP_API_KEY`, `NEXTERP_API_SECRET`
- Install + DB initialize:
  - `npm install`
  - `npx prisma migrate dev --name init-sqlite || npx prisma db push`
  - `npx prisma generate`
- Run:
  - `npm run dev` then open http://localhost:3000

Postgres dev (Neon)

- Create a Neon database and set:
  - `DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?schema=public`
- Prisma datasource in `prisma/schema.prisma` is configured for Postgres.
- Initialize and run:
  - `npm install`
  - `npx prisma migrate dev --name init`
  - `npx prisma generate`
  - `npm run dev` then open http://localhost:3000
