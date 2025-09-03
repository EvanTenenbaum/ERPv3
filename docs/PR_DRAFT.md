Title: MVP ERP UI + ERPNext API routes

Summary

- Adds secure ERPNext API forwarding routes: `/api/customers`, `/api/purchase-invoices` (POST mark_paid), `/api/sales-orders`, `/api/items`.
- Ensures secrets are server-only and returns 503 `{ error: "nexterp_credentials_missing" }` if missing.
- Adds NextAuth (JWT, httpOnly cookies) with `/login`, middleware redirects unauthenticated users.
- Adds `/api/auth/me` and `/api/auth/logout`.
- Adds unified client fetch helper and MVP UI pages: `/customers`, `/payables`, `/sales`.
- Updates README with a "Run in Codespaces" section.

Changed Files

- src/lib/server/erpnext.ts — ERPNext server-only helper (env read, auth header, URL builder)
- src/app/api/customers/route.ts — ERPNext Customer forwarder
- src/app/api/purchase-invoices/route.ts — ERPNext Purchase Invoice forwarder + mark_paid POST
- src/app/api/sales-orders/route.ts — ERPNext Sales Order forwarder (supports id)
- src/app/api/items/route.ts — ERPNext Item forwarder
- src/lib/api.ts — unified client fetch helper with credentials and error handling
- src/lib/auth.ts — NextAuth configuration (JWT sessions, credentials)
- src/app/api/auth/[...nextauth]/route.ts — NextAuth route handler
- src/app/api/auth/me/route.ts — Auth status endpoint
- src/app/api/auth/logout/route.ts — Logout endpoint (expires cookies)
- middleware.ts — Protects app, redirects unauthenticated users to /login
- src/app/login/page.tsx — Minimal login page
- src/app/customers/page.tsx — Customers search + table + drawer with recent orders
- src/app/payables/page.tsx — Payables tabs and Mark as Paid action
- src/app/sales/page.tsx — Sales orders table + details panel
- README.md — Setup and Codespaces instructions
- .env.example — Adds NEXTAUTH and NEXTERP variables, dev SQLite default
- prisma/schema.prisma — Switch dev datasource to sqlite
- package.json — Adds next-auth dependency
- docs/PR_DRAFT.md — This file

Test Plan

- Auth:
  - Sign in at `/login` using `AUTH_USER`/`AUTH_PASS` (default admin/admin). Verify `/api/auth/me` shows authenticated, and logout via POST `/api/auth/logout` works.
- ERPNext routes:
  - With valid `NEXTERP_*` envs, `GET /api/customers` returns data; removing an env yields 503 error payload.
  - `GET /api/sales-orders?id=<order>` returns a document including `items`.
  - `POST /api/purchase-invoices` with `{ action:"mark_paid", id:"<invoice>" }` attempts to mark invoice as Paid.
- UI pages:
  - `/customers` search + drawer with recent sales orders.
  - `/payables` tabs (Open / Due Soon / Overdue) and "Mark as Paid" action refreshes list.
  - `/sales` table with status chips; right panel shows selected order items.

Notes

- ERPNext field names/flows may require tweaking the mark-paid action based on your instance’s workflow permissions.
