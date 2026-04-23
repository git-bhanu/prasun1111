# Technology Stack

**Analysis Date:** 2026-04-23

## Languages

**Primary:**
- TypeScript 5.9.x - application, CMS config, and shared utilities in `app/page.tsx`, `app/layout.tsx`, `components/base-layout.tsx`, `lib/utils.ts`, and `tina/config.tsx`.
- TSX / React JSX - UI and Tina field implementations in `app/client-page.tsx`, `components/base-layout.tsx`, `tina/fields/icon.tsx`, and `tina/fields/color.tsx`.

**Secondary:**
- JavaScript - build and tooling config in `postcss.config.js` and `graphql.config.js`.
- MDX - Tina-managed page content in `content/pages/home.mdx`.
- JSON - tool metadata and schema config in `package.json`, `biome.json`, `components.json`, and `tina/tina-lock.json`.
- YAML - CI/CD automation in `.github/workflows/build-and-deploy.yml`, `.github/workflows/pr-open.yml`, and `.github/workflows/update-dependabot-pr.yml`.
- HTML - Tina admin shell in `public/admin/index.html`.

## Runtime

**Environment:**
- Node.js v22 - pinned in `.nvmrc` and consumed by GitHub Actions in `.github/workflows/build-and-deploy.yml` and `.github/workflows/pr-open.yml`.
- Browser runtime - React client components run in `app/client-page.tsx` and `components/base-layout.tsx`.

**Package Manager:**
- pnpm 9 - preferred locally and in CI via `pnpm-lock.yaml`, `package.json`, `.github/workflows/build-and-deploy.yml`, and `.github/workflows/pr-open.yml`.
- Lockfile: present in `pnpm-lock.yaml`.

## Frameworks

**Core:**
- Next.js 15.3.8 - App Router site framework, route rendering, image handling, headers, and rewrites in `package.json`, `app/layout.tsx`, `app/page.tsx`, and `next.config.ts`.
- React 18.3.1 / React DOM 18.3.1 - component model for server and client rendering in `package.json`, `app/client-page.tsx`, and `components/base-layout.tsx`.
- TinaCMS 3.7.0 - content modeling, admin UI, generated queries, and visual editing in `package.json`, `tina/config.tsx`, `app/page.tsx`, `app/client-page.tsx`, and `public/admin/index.html`.

**Testing:**
- Not detected - `package.json` contains no test script and no Jest/Vitest/Playwright config files are present at the repository root.

**Build/Dev:**
- Turbopack through `next dev --turbopack` - local dev server inside the `dev` script in `package.json`.
- Tina CLI 2.2.0 - wraps dev/build/start flows in `package.json` and manages schema/admin output through `tina/config.tsx`.
- Biome 1.9.4 - linting, formatting, and import organization configured in `biome.json` and invoked by the `lint` script in `package.json`.
- Tailwind CSS 4.1.15 - utility-first styling wired through `postcss.config.js`, `styles.css`, `components.json`, and class usage in `components/base-layout.tsx`.
- PostCSS 8.5.6 with `@tailwindcss/postcss` - CSS processing configured in `postcss.config.js`.
- GraphQL config tooling - editor/query discovery setup in `graphql.config.js` for Tina generated schema and query documents.

## Key Dependencies

**Critical:**
- `next` 15.3.8 - application runtime and routing foundation in `package.json` and `next.config.ts`.
- `react` / `react-dom` 18.3.1 - rendering layer used throughout `app/` and `components/`.
- `tinacms` 3.7.0 - CMS, visual editing, and media/admin integration used in `tina/config.tsx`, `app/page.tsx`, and `app/client-page.tsx`.
- `@tinacms/cli` 2.2.0 - required for `tinacms dev`, `tinacms build`, and `tinacms audit` workflows in `package.json` and `.github/workflows/update-dependabot-pr.yml`.
- `typescript` 5.9.3 - strict type checking configured in `tsconfig.json`.

**Infrastructure:**
- `@biomejs/biome` 1.9.4 - code quality enforcement in `biome.json`.
- `tailwindcss` 4.1.15 and `@tailwindcss/postcss` 4.1.15 - styling pipeline via `postcss.config.js` and `styles.css`.
- `clsx` 2.1.1 and `tailwind-merge` 2.6.0 - class composition helper in `lib/utils.ts`.
- `lucide-react` 0.484.0 - icon set used in `components/base-layout.tsx`.
- `@headlessui/react` 2.2.9 and `react-icons` 5.5.0 - custom Tina field UI in `tina/fields/icon.tsx`.
- `next/font/google` support from Next.js - Google font loading in `app/fonts.ts`.
- `@svgr/webpack` 8.1.0 - SVG-to-React tooling dependency declared in `package.json`; no root webpack customization is present in `next.config.ts`.
- `mermaid`, `motion`, `next-themes`, `react-player`, `shiki`, `usehooks-ts`, `@radix-ui/react-avatar`, and `@radix-ui/react-slot` are installed in `package.json`; direct usage is not present in the currently matched files under `app/`, `components/`, `lib/`, and `tina/`.

## Configuration

**Environment:**
- TinaCMS requires `NEXT_PUBLIC_TINA_CLIENT_ID`, `NEXT_PUBLIC_TINA_BRANCH`, and `TINA_TOKEN` as shown in `.env.example` and consumed in `tina/config.tsx`.
- Branch detection also supports hosting-provided variables `NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF` and `HEAD` in `tina/config.tsx`.
- `.env` is present at the repository root for local environment configuration; contents were not read.
- TypeScript path alias `@/*` maps to the repository root in `tsconfig.json`.

**Build:**
- Next config in `next.config.ts` defines remote image hosts, security headers, and `/admin` rewrite behavior.
- Tina build config in `tina/config.tsx` emits admin assets to `public/admin` and uses `public/uploads` as the media root.
- GraphQL document discovery is configured in `graphql.config.js`.
- Biome rules and formatter settings live in `biome.json`.
- shadcn/ui generator metadata lives in `components.json` and points Tailwind CSS at `styles.css`.

## Platform Requirements

**Development:**
- Node.js v22 from `.nvmrc`.
- pnpm 9 in local and CI flows, evidenced by `pnpm-lock.yaml`, `.github/workflows/build-and-deploy.yml`, and `.github/workflows/pr-open.yml`.
- Tina local admin/dev server on `http://localhost:4001` and app server on `http://localhost:3000`, documented in `README.md` and referenced by `public/admin/index.html`.

**Production:**
- Static Next.js export deployed to GitHub Pages via `.github/workflows/build-and-deploy.yml`.
- Build output is expected in `out/`, uploaded by `.github/workflows/build-and-deploy.yml`.

---

*Stack analysis: 2026-04-23*
