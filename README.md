ERPv3 — MVP ERP UI + ERPNext Integration

Overview

- Next.js 14 + Prisma (Postgres) with minimal ERP UI pages and secure ERPNext proxy routes.
- Auth via NextAuth (credentials, httpOnly JWT cookies).

Local Dev (Postgres)

- Set `.env`:
  - `DATABASE_URL=postgresql://<user>:<pass>@<host>/<db>?schema=public`
  - `NEXTAUTH_URL=http://localhost:3000`
  - `NEXTAUTH_SECRET=<random>`
  - Optional: `AUTH_USER`, `AUTH_PASS` (defaults to admin/admin)
  - Optional: `NEXTERP_HOST`, `NEXTERP_API_KEY`, `NEXTERP_API_SECRET`
- Commands:
  - `npm install`
  - `npx prisma migrate dev --name init && npx prisma generate`
  - `npm run dev` → http://localhost:3000

Vercel Deploy

- Connect the repo in Vercel. Set Environment Variables (Production/Preview):
  - `DATABASE_URL` → Neon Postgres URL
  - `NEXTAUTH_URL` → e.g., https://your-app.vercel.app
  - `NEXTAUTH_SECRET` → long random string
  - `NEXTERP_HOST` → e.g., napkin.v.frappe.cloud
  - `NEXTERP_API_KEY` → ERPNext API key
  - `NEXTERP_API_SECRET` → ERPNext API secret
- Build/Run: Next.js defaults (`npm run build` / `npm start`).
- See `vercel.json` for mapping to Vercel env secrets.

CI

- PR build: `.github/workflows/vercel-preview.yml` builds Next.js on pull requests to main (no secrets required) to catch regressions.
- Uptime: optional `.github/workflows/uptime-health.yml` pings your deployed health endpoint on a schedule. Configure repository Secret or Actions Variable `HEALTH_URL` to `https://<your-app>.vercel.app/api/health`.

Health & Smoke Tests

- Health: `GET /api/health` → `{ "ok": true }`
- ERPNext (read-only): see `docs/deploy-smoke.md` for curl examples.
