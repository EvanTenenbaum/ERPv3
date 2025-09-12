# Roadmap Issues and Milestone

Milestone: v0 Beta (M0–M5)

Below are canonical issue drafts. Create each as a GitHub issue and assign to the `v0 Beta (M0–M5)` milestone.

---

## M0: Repo & Deployment Audit

Acceptance Criteria
- Can build in CI (`npm ci && npm run build`) on PRs
- README contains Validation Commands and Live Checks
- `DEVELOPMENT_LOG.md` created and updated
- Baseline deploy verified (homepage, inventory, quotes, search)

Tasks
- Add/confirm CI workflow for lint/typecheck/test/build
- Update README with validation and live check steps
- Log status in `DEVELOPMENT_LOG.md`

---

## M1: Core Infra & Data (Prisma + Seed)

Acceptance Criteria
- `prisma migrate dev` succeeds locally and on CI (shadow DB)
- Idempotent seed populates sample products, batches, lots, customers
- Basic pages render seeded data

Tasks
- Validate/extend schema
- Add `prisma/seed.cjs`
- Document DB setup in README

---

## M2: Core UX Flow (Inventory → Search → Cart → Quotes)

Acceptance Criteria
- Add-to-cart from Search works; quantities update
- Create Quote from cart pre-fills items on `/quotes/new`
- Quote list/detail render amounts; share link works
- PDF generation works for sample data

Tasks
- Wire cart → quote creation
- Harden actions for quote CRUD
- Verify `src/lib/pdf/quote.ts` against live data

---

## M3: Customers CRUD

Acceptance Criteria
- List/new/detail pages exist under `/customers`
- Quote can be associated with a customer
- Empty-states and basic validation present

Tasks
- Build pages and actions for customers
- Integrate customer selection in quotes

---

## M4: Quality Gates (Errors, Loading, 404)

Acceptance Criteria
- Global `app/error.tsx`, `app/not-found.tsx` present
- Route-level `loading.tsx` for search/quotes
- Minimal logging (no PII)

Tasks
- Add error boundaries and skeletons
- Add basic logging and docs

---

## M5: E2E + Beta Release

Acceptance Criteria
- Playwright smoke covers nav + core flow
- README updated with release notes
- Tag `v0.0.0-beta` created after green CI

Tasks
- Add Playwright smoke tests
- Prep release notes and tag

