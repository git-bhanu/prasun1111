# Architecture

**Analysis Date:** 2026-04-23

## Pattern Overview

**Overall:** Content-driven Next.js App Router application with a TinaCMS schema layer and a server/client visual-editing split.

**Key Characteristics:**
- Routes in `app/` are thin orchestration points; the active home route in `app/page.tsx` fetches Tina data and delegates rendering/edit mode to `app/client-page.tsx`.
- The content model is defined in `tina/config.tsx`, `tina/collection/page.ts`, and `tina/collection/global.ts`, while actual editor-managed documents live under `content/`.
- Shared chrome is centralized in `app/layout.tsx` and `components/base-layout.tsx`, so route pages render inside a single application shell.

## Layers

**Route Layer:**
- Purpose: Define HTTP entry points, metadata, route-level composition, and route-local data fetching.
- Location: `app/`
- Contains: `app/layout.tsx`, `app/page.tsx`, `app/client-page.tsx`, `app/not-found.tsx`, `app/fonts.ts`, plus placeholder route folders `app/[...urlSegments]/` and `app/posts/[...urlSegments]/`.
- Depends on: `@/components/base-layout`, `@/lib/utils`, `@/tina/__generated__/client`, `@/tina/__generated__/types`, `next`, and `next/font/google`.
- Used by: Next.js runtime and the GitHub Pages build pipeline in `.github/workflows/build-and-deploy.yml`.

**Presentation Layer:**
- Purpose: Render reusable UI outside route files.
- Location: `components/`
- Contains: The main shell component in `components/base-layout.tsx`; `components/shared/` exists as a placeholder and currently contains an empty `components/shared/Header/` directory.
- Depends on: `next/link`, `next/image`, React state, and fonts exported from `app/fonts.ts`.
- Used by: `app/layout.tsx`.

**Utility and Styling Layer:**
- Purpose: Provide shared helpers and global design tokens.
- Location: `lib/utils.ts`, `styles.css`, `components.json`, `postcss.config.js`, `biome.json`.
- Contains: The `cn()` class-merging helper in `lib/utils.ts`, Tailwind v4 theme variables in `styles.css`, and shadcn alias metadata in `components.json`.
- Depends on: `clsx`, `tailwind-merge`, Tailwind/PostCSS, and Biome.
- Used by: `app/layout.tsx` and any future components that need shared class composition.

**Content Schema Layer:**
- Purpose: Define editable document shapes and editor behavior.
- Location: `tina/config.tsx`, `tina/collection/*.ts`, `tina/fields/*.tsx`.
- Contains: Collection registration, media/build settings, collection routing rules, and custom field UI helpers.
- Depends on: TinaCMS APIs and `next.config.ts` for `basePath` propagation.
- Used by: Tina admin in `public/admin/`, Tina generated artifacts in `tina/__generated__/`, and route queries in `app/page.tsx`.

**Generated Data Access Layer:**
- Purpose: Provide typed GraphQL queries and a generated client for Tina-backed content fetching.
- Location: `tina/__generated__/client.ts`, `tina/__generated__/types.ts`, `tina/__generated__/queries.gql`, `tina/__generated__/schema.gql`.
- Contains: `client.queries.page()` and `client.queries.global()` methods, generated GraphQL documents, and generated query/result types.
- Depends on: `tina/config.tsx` and collection definitions.
- Used by: `app/page.tsx` today; intended for future route-level queries.

**Content Storage Layer:**
- Purpose: Store editor-managed source content separate from rendering code.
- Location: `content/`
- Contains: Active page content in `content/pages/home.mdx` plus currently empty or placeholder collections under `content/authors/`, `content/global/`, `content/posts/`, and `content/tags/`.
- Depends on: Collection paths declared in `tina/collection/page.ts` and `tina/collection/global.ts`.
- Used by: Tina-generated GraphQL queries and the admin UI.

**Operations Layer:**
- Purpose: Build, validate, and deploy the app.
- Location: `.github/workflows/`, `package.json`, `next.config.ts`.
- Contains: PR build workflow in `.github/workflows/pr-open.yml`, Pages deployment in `.github/workflows/build-and-deploy.yml`, and a Tina dependency updater in `.github/workflows/update-dependabot-pr.yml`.
- Depends on: Node from `.nvmrc`, pnpm lock state in `pnpm-lock.yaml`, and Tina env vars passed in CI.
- Used by: GitHub Actions.

## Data Flow

**Home Page Request Flow:**

1. A request for `/` enters the App Router through `app/page.tsx`.
2. `app/page.tsx` calls `client.queries.page({ relativePath: 'home.mdx' })` from `tina/__generated__/client.ts` with `next.revalidate: 60`.
3. Tina resolves the query against the `page` collection configured in `tina/collection/page.ts`, which maps to `content/pages/home.mdx`.
4. The server route passes `query`, `data`, and `variables` into `app/client-page.tsx`.
5. `app/client-page.tsx` calls `useTina(props)` so the same route can participate in Tina visual editing.
6. The current client page returns `null`, so the data flow is wired but the actual page renderer has not been implemented in the active route.

**Application Shell Flow:**

1. `app/layout.tsx` wraps every route in `<BaseLayout>` from `components/base-layout.tsx`.
2. `components/base-layout.tsx` renders the global header shell, static navigation arrays, and an expandable utility menu.
3. Route content is inserted into the `<main>` region through the `children` prop.

**Tina Authoring Flow:**

1. `tina/config.tsx` defines client credentials, branch resolution, media storage under `public/uploads`, and admin output under `public/admin`.
2. Tina code generation emits the client and schema files in `tina/__generated__/`.
3. The Next config in `next.config.ts` rewrites `/admin` to `/admin/index.html`, exposing the generated admin application from `public/admin/index.html`.
4. Editors update files in `content/`, and route queries consume those documents through generated GraphQL methods.

**State Management:**
- Server state is fetched per route through generated Tina queries in `app/page.tsx`.
- Client state is minimal and local; `components/base-layout.tsx` uses `useState` only for the mobile/menu toggle.
- There is no global client state container such as Redux, Zustand, or React Context in the active source tree.

## Key Abstractions

**Server/Client Route Pair:**
- Purpose: Separate server-side data loading from client-side Tina edit-mode hydration.
- Examples: `app/page.tsx` + `app/client-page.tsx`; the intended pattern is also documented in `AGENTS.md`, `docs/tina-skill.md`, and `.github/copilot-instructions.md`.
- Pattern: Server component fetches via `client.queries.*()`, then passes `query`, `data`, and `variables` to a colocated client component that calls `useTina()`.

**Collection-Driven Routing:**
- Purpose: Keep URL resolution aligned with content file location.
- Examples: `tina/collection/page.ts` and `content/pages/home.mdx`.
- Pattern: `ui.router` in `tina/collection/page.ts` maps the `home` document to `/` and all other page documents to `/${breadcrumbs.join('/')}`.

**Global Layout Shell:**
- Purpose: Keep navigation, branding, and page framing outside individual routes.
- Examples: `app/layout.tsx`, `components/base-layout.tsx`, `app/fonts.ts`.
- Pattern: Root layout imports fonts and global CSS once, then delegates visible shell rendering to a reusable layout component.

**Generated Query Contract:**
- Purpose: Keep route data access typed and schema-derived.
- Examples: `tina/__generated__/client.ts`, `tina/__generated__/types.ts`.
- Pattern: Route code imports generated query methods and generated result/variables types instead of hand-writing GraphQL calls.

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every route request handled by the App Router.
- Responsibilities: Import global CSS, attach font variables to `<html>`, define global metadata, and wrap route children in `BaseLayout`.

**Home Route:**
- Location: `app/page.tsx`
- Triggers: Requests for `/`.
- Responsibilities: Fetch the `page` document for `content/pages/home.mdx`, set ISR revalidation, and hand off Tina payload props to `app/client-page.tsx`.

**Home Client Renderer:**
- Location: `app/client-page.tsx`
- Triggers: Rendered by `app/page.tsx`.
- Responsibilities: Call `useTina()` with the server payload. Current implementation does not render UI.

**Not Found Boundary:**
- Location: `app/not-found.tsx`
- Triggers: Next.js not-found rendering.
- Responsibilities: Render a reusable 404 surface with optional `title` and `description` props and a link back to `/`.

**Tina Configuration:**
- Location: `tina/config.tsx`
- Triggers: Tina CLI, generated client/schema build, and admin build.
- Responsibilities: Resolve branch/env config, register collections, set media root, and emit admin assets to `public/admin`.

**Deployment Pipeline:**
- Location: `.github/workflows/build-and-deploy.yml`
- Triggers: Pushes to `main` and manual workflow dispatch.
- Responsibilities: Install dependencies, run the build, upload `out/`, and deploy to GitHub Pages.

## Error Handling

**Strategy:** Minimal route-level handling with explicit fallback UI available but not yet wired into the active home route.

**Patterns:**
- `app/not-found.tsx` provides the repository-wide 404 UI surface.
- `next.config.ts` applies security headers globally and rewrites `/admin` to the generated admin file.
- The active `app/page.tsx` does not use `try/catch` or `notFound()`, so query failures would currently bubble to Next.js error handling.

## Cross-Cutting Concerns

**Logging:** No dedicated logging layer is present in runtime source files; `console.error` is recommended in `AGENTS.md` and `docs/tina-skill.md`, but it is not used in the active route code.

**Validation:** Content validation is schema-driven through Tina collection definitions in `tina/collection/page.ts` and `tina/collection/global.ts`, plus TypeScript strict mode from `tsconfig.json`.

**Authentication:** Runtime auth is not implemented in app routes. Tina admin/build authentication is environment-driven in `tina/config.tsx` through `NEXT_PUBLIC_TINA_CLIENT_ID`, `NEXT_PUBLIC_TINA_BRANCH`, and `TINA_TOKEN`.

---

*Architecture analysis: 2026-04-23*
