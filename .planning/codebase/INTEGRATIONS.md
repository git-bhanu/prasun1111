# External Integrations

**Analysis Date:** 2026-04-23

## APIs & External Services

**Content Management:**
- TinaCMS / Tina Cloud - headless CMS, schema generation, admin UI, and visual editing for content under `content/`.
  - SDK/Client: `tinacms` and `@tinacms/cli` from `package.json`.
  - Auth: `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` from `.env.example`, consumed in `tina/config.tsx`.

**GraphQL / Editor Tooling:**
- Tina GraphQL endpoint - queried through generated client calls in `app/page.tsx` and configured for local/editor tooling in `graphql.config.js`.
  - SDK/Client: generated client import at `app/page.tsx` from `@/tina/__generated__/client`.
  - Auth: indirect through Tina environment variables in `tina/config.tsx`.
- Altair local GraphQL explorer - exposed during local Tina development at `http://localhost:4001/altair/`, documented in `README.md`.
  - SDK/Client: provided by Tina dev tooling; no app-side package import is present.
  - Auth: Not detected in repository code.

**Asset Delivery:**
- Tina-hosted assets - remote images allowed from `assets.tina.io` in `next.config.ts`.
  - SDK/Client: Next.js image optimization/runtime in `next.config.ts` and `components/base-layout.tsx`.
  - Auth: None in app code.
- Cloudinary CDN - remote images allowed from `res.cloudinary.com` in `next.config.ts`; optional Tina Cloudinary media-store example is commented in `tina/config.tsx`.
  - SDK/Client: Not configured as an active package; only host allowlist and commented example are present.
  - Auth: Not detected as active env vars in repository code.

## Data Storage

**Databases:**
- Not detected - no ORM, database driver, or database connection string usage appears in `package.json`, `tina/config.tsx`, `app/`, `components/`, `lib/`, or `tina/`.

**File Storage:**
- Repository-managed content files in `content/pages/home.mdx` and Tina global JSON under `content/`.
- Public asset storage in `public/uploads/` with Tina media configured in `tina/config.tsx` (`publicFolder: 'public'`, `mediaRoot: 'uploads'`).
- Tina Cloud media handling is enabled through the `media.tina` block in `tina/config.tsx`.

**Caching:**
- Next.js incremental data revalidation - `app/page.tsx` sets `revalidate: 60` on the Tina page query.
- GitHub Actions build caching - `.github/workflows/build-and-deploy.yml` caches `.next/cache`, and `.github/workflows/pr-open.yml` caches the pnpm store.

## Authentication & Identity

**Auth Provider:**
- Tina Cloud token-based project authentication.
  - Implementation: `tina/config.tsx` injects `clientId`, `branch`, and `token` from environment variables for CMS access.
- End-user site authentication: Not detected - no `next-auth`, Auth0, Clerk, Supabase Auth, or custom auth implementation is present in the repository files inspected.

## Monitoring & Observability

**Error Tracking:**
- None detected - no Sentry, LogRocket, Datadog, or similar integration is configured in `package.json`, `next.config.ts`, `app/`, `components/`, `lib/`, or `.github/workflows/`.

**Logs:**
- GitHub Actions job logs provide CI/build visibility in `.github/workflows/build-and-deploy.yml`, `.github/workflows/pr-open.yml`, and `.github/workflows/update-dependabot-pr.yml`.
- Local runtime logging is not configured beyond standard framework output; no dedicated logging library is present in `package.json`.

## CI/CD & Deployment

**Hosting:**
- GitHub Pages - production deployment target configured in `.github/workflows/build-and-deploy.yml`.
- GitHub Actions `configure-pages` auto-configures Next.js static hosting in `.github/workflows/build-and-deploy.yml`.

**CI Pipeline:**
- GitHub Actions - PR build validation in `.github/workflows/pr-open.yml`.
- GitHub Actions - production build and Pages deployment in `.github/workflows/build-and-deploy.yml`.
- GitHub Actions - automated Tina dependency refresh on Dependabot branches in `.github/workflows/update-dependabot-pr.yml`.

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_TINA_CLIENT_ID` - required by `tina/config.tsx`, documented in `.env.example`, and injected in `.github/workflows/build-and-deploy.yml` and `.github/workflows/pr-open.yml`.
- `NEXT_PUBLIC_TINA_BRANCH` - required by `tina/config.tsx`, documented in `.env.example`, and set from GitHub refs in `.github/workflows/build-and-deploy.yml` and `.github/workflows/pr-open.yml`.
- `TINA_TOKEN` - required by `tina/config.tsx`, documented in `.env.example`, and injected in `.github/workflows/build-and-deploy.yml` and `.github/workflows/pr-open.yml`.
- `NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF` - optional branch fallback in `tina/config.tsx`.
- `HEAD` - optional Netlify branch fallback in `tina/config.tsx`.
- `VERCEL_ENV` - preview-related variable documented in `.env.example`.

**Secrets location:**
- Local development uses root `.env` / `.env.example` files.
- CI uses GitHub Actions secrets in `.github/workflows/build-and-deploy.yml` and `.github/workflows/pr-open.yml`.

## Webhooks & Callbacks

**Incoming:**
- GitHub webhook events for `push`, `pull_request`, and `workflow_dispatch` trigger workflows in `.github/workflows/build-and-deploy.yml`, `.github/workflows/pr-open.yml`, and `.github/workflows/update-dependabot-pr.yml`.
- Application-level webhook endpoints: None detected in `app/`.

**Outgoing:**
- GitHub Actions uploads the static artifact to Pages through `actions/upload-pages-artifact@v3` and deploys with `actions/deploy-pages@v4` in `.github/workflows/build-and-deploy.yml`.
- Dependabot maintenance flow commits generated Tina updates back to the source branch through `EndBug/add-and-commit@v9` in `.github/workflows/update-dependabot-pr.yml`.

---

*Integration audit: 2026-04-23*
