# Codebase Concerns

**Analysis Date:** 2026-04-23

## Tech Debt

**Homepage rendering is effectively unfinished:**
- Issue: The server route in `app/page.tsx` fetches Tina data, but the client renderer in `app/client-page.tsx` ignores the `useTina()` result and returns `null`.
- Files: `app/page.tsx`, `app/client-page.tsx`, `content/pages/home.mdx`
- Impact: The only implemented route can render a blank page even when content exists, and future homepage work has no established rendering pattern to extend.
- Fix approach: Replace the `return null` path in `app/client-page.tsx` with actual rendering from `const { data } = useTina(props)`, then bind visible fields from `content/pages/home.mdx`.

**Global content model is defined but not wired into the app:**
- Issue: `tina/collection/global.ts` defines `header`, `footer`, and `theme` content under `content/global`, but no route or layout code queries that collection. The current shell is hardcoded in `components/base-layout.tsx`.
- Files: `tina/collection/global.ts`, `components/base-layout.tsx`, `app/layout.tsx`
- Impact: Editors can configure data that never reaches production UI, while the live header/footer must still be changed in code.
- Fix approach: Either query `global` content from the shared layout flow and render it in `components/base-layout.tsx`, or remove the unused collection until it is supported.

**Agent docs and repository reality are out of sync:**
- Issue: `AGENTS.md`, `docs/tina-skill.md`, and `.agents/skills/tina-cms/references/repo-guide.md` describe `components/layout/layout.tsx` and a global-content-driven layout, but the repo only contains `components/base-layout.tsx` and no `content/global` usage.
- Files: `AGENTS.md`, `docs/tina-skill.md`, `.agents/skills/tina-cms/references/repo-guide.md`, `components/base-layout.tsx`
- Impact: Future edits are likely to follow nonexistent file paths and outdated integration guidance.
- Fix approach: Update the docs to reflect `components/base-layout.tsx` and the actual current Tina data flow, or restore the documented layout structure.

**Type safety is bypassed around Tina custom fields:**
- Issue: The Tina field setup relies on `as any`, `props: any`, `event: any`, and `@ts-ignore` to satisfy types.
- Files: `tina/collection/global.ts`, `tina/fields/icon.tsx`, `tina/fields/color.tsx`
- Impact: Schema and editor regressions can compile cleanly while hiding real typing mistakes, especially when Tina packages are updated.
- Fix approach: Introduce explicit types for custom field props and schema objects, then remove the current `any`/ignore escapes incrementally.

## Known Bugs

**Primary navigation points to routes that do not exist:**
- Symptoms: The main menu links in `components/base-layout.tsx` point to `/artworks`, `/installations`, `/films`, `/design`, `/writings`, `/shop`, `/cart`, `/about`, and `/contact`, but `app/` only defines the root route plus `not-found`.
- Files: `components/base-layout.tsx`, `app/page.tsx`, `app/not-found.tsx`
- Trigger: Click any hardcoded navigation item from the shared layout.
- Workaround: Add matching routes under `app/`, or replace the hardcoded links with only implemented destinations.

**Additional Tina pages cannot be visited even though the schema suggests they can:**
- Symptoms: `tina/collection/page.ts` maps page documents to routes like `/${filepath}`, but the app has no dynamic page route such as `app/[slug]/page.tsx` or `app/[...slug]/page.tsx`.
- Files: `tina/collection/page.ts`, `app/page.tsx`
- Trigger: Add any document besides `content/pages/home.mdx`, then try to visit the route returned by the Tina router.
- Workaround: Keep all content in `content/pages/home.mdx` until a dynamic page route is implemented.

## Security Considerations

**Frame protection depends on headers that GitHub Pages does not serve:**
- Risk: `next.config.ts` sets `X-Frame-Options` and `Content-Security-Policy: frame-ancestors 'self'`, but the same file explicitly notes GitHub Pages does not support headers and claims the protections are also defined in the root layout. `app/layout.tsx` does not add an equivalent `<meta httpEquiv>` fallback.
- Files: `next.config.ts`, `app/layout.tsx`, `.github/workflows/build-and-deploy.yml`
- Current mitigation: Header configuration exists for platforms that honor Next.js headers.
- Recommendations: Add a layout-level fallback that works with the actual hosting target, or move deployment to a platform that can enforce response headers.

**Tina configuration hard-fails on missing secrets:**
- Risk: `tina/config.tsx` uses non-null assertions for `NEXT_PUBLIC_TINA_CLIENT_ID`, `NEXT_PUBLIC_TINA_BRANCH`, and `TINA_TOKEN`.
- Files: `tina/config.tsx`, `.github/workflows/build-and-deploy.yml`, `.github/workflows/pr-open.yml`
- Current mitigation: CI injects the required variables, and root `.env` / `.env.example` files are present for local setup.
- Recommendations: Validate env vars explicitly with actionable error messages before Tina initialization so local and preview failures are easier to diagnose.

## Performance Bottlenecks

**The entire shared layout is forced onto the client:**
- Problem: `app/layout.tsx` wraps all pages with `BaseLayout`, and `components/base-layout.tsx` is a `'use client'` component even though most of the markup is static.
- Files: `app/layout.tsx`, `components/base-layout.tsx`
- Cause: A small interactive menu toggle pulls the full shell into the client bundle.
- Improvement path: Keep the root layout server-rendered and isolate only the menu toggle or mobile-nav state into a smaller client component.

**The custom Tina icon field imports a very large icon surface area:**
- Problem: `tina/fields/icon.tsx` imports `* as BoxIcons` and then filters across the full icon registry in the picker UI.
- Files: `tina/fields/icon.tsx`
- Cause: The field loads a broad icon catalog for every editor session instead of a curated set.
- Improvement path: Replace the wildcard import with a narrowed icon list or a lazy-loaded picker so the Tina admin bundle stays smaller.

## Fragile Areas

**Root page fetching has no recovery path:**
- Files: `app/page.tsx`, `content/pages/home.mdx`
- Why fragile: The route performs `await client.queries.page(...)` with no `try/catch`, no `notFound()`, and no fallback UI. Missing content or Tina query failures will bubble into a hard error.
- Safe modification: Add guarded fetching with `notFound()` for missing documents and concise error logging for unexpected failures before extending the route.
- Test coverage: No automated route tests are present.

**Deployment automation mixes package managers and stale action versions:**
- Files: `package.json`, `pnpm-lock.yaml`, `.github/workflows/update-dependabot-pr.yml`
- Why fragile: The repo is pnpm-based, but the Dependabot follow-up workflow runs `yarn install`, `yarn upgrade`, and `yarn tinacms audit` using older `actions/checkout@v2` and `actions/setup-node@v3`.
- Safe modification: Standardize the workflow on `pnpm` commands and current GitHub Action versions before changing dependency automation further.
- Test coverage: No workflow validation or smoke-test job checks the generated lockfile strategy.

**Starter content and UI are only partially cleaned up:**
- Files: `README.md`, `public/uploads/posts/*`, `public/uploads/authors/*`, `public/uploads/testimonials/*`, `components/base-layout.tsx`
- Why fragile: The repo advertises that sample blog content was removed, but the public asset tree still contains many starter uploads while the live shell contains project-specific hardcoded branding and navigation.
- Safe modification: Audit `public/uploads/` and remove unused starter assets only after confirming current references; then move remaining shell copy into Tina-managed content.
- Test coverage: No automated asset or route checks catch stale references.

## Scaling Limits

**The page system currently scales to one real route:**
- Current capacity: `app/page.tsx` serves only `content/pages/home.mdx`.
- Limit: The Tina page collection in `tina/collection/page.ts` can model more documents, but the app has no dynamic route layer to render them.
- Scaling path: Add a slug-based App Router route that resolves Tina page documents by path and shares the same server/client editing pattern.

## Dependencies at Risk

**Tina custom-field compatibility is sensitive to package upgrades:**
- Risk: The repo pins active Tina packages in `package.json`, but the surrounding field code in `tina/fields/icon.tsx` and `tina/fields/color.tsx` already requires type escapes.
- Impact: Future Tina upgrades can break editor behavior without clear compile-time feedback.
- Migration plan: Tighten custom field typing before updating Tina packages aggressively, and run a full Tina admin smoke test after each upgrade.

## Missing Critical Features

**No implemented renderer for Tina-managed page content:**
- Problem: The main content collection in `tina/collection/page.ts` stores rich text, but no component renders that rich text on the site. The only client page currently returns `null`.
- Blocks: Publishing editable page content through Tina, validating visual editing, and adding additional site pages without bespoke rewrites.

**No implemented consumer for global settings:**
- Problem: The `global` collection stores header, footer, theme, nav, and social data, but the live app does not query or display any of it.
- Blocks: Non-developer content edits to site chrome, navigation, and theme settings.

## Test Coverage Gaps

**Application routes and Tina flows are untested:**
- What's not tested: Homepage rendering, Tina query failures, navigation validity, layout behavior, and editor field integrations.
- Files: `package.json`, `app/page.tsx`, `app/client-page.tsx`, `components/base-layout.tsx`, `tina/fields/icon.tsx`, `tina/fields/color.tsx`
- Risk: Regressions in the only live route, the shared shell, and Tina editor widgets can ship unnoticed because the repo has no test runner or `*.test.*` / `*.spec.*` files.
- Priority: High

---

*Concerns audit: 2026-04-23*
