# Codebase Structure

**Analysis Date:** 2026-04-23

## Directory Layout

```text
prasun1111/
├── app/                  # Next.js App Router entry points and route-local Tina fetch/render files
├── components/           # Shared UI and application shell components
├── content/              # Tina-managed source content
├── docs/                 # Repository-specific implementation playbooks
├── lib/                  # Shared utilities
├── public/               # Static assets, Tina admin build output, uploaded media
├── tina/                 # Tina config, collection definitions, field helpers, generated GraphQL client
├── .github/workflows/    # CI and deployment automation
├── styles.css            # Global Tailwind v4 theme tokens and base styles
├── next.config.ts        # Next.js headers and admin rewrite configuration
├── package.json          # Scripts and dependency manifest
└── tsconfig.json         # TypeScript compiler and alias configuration
```

## Directory Purposes

**`app/`:**
- Purpose: Own route entry points, global layout, and route-local client/server split files.
- Contains: `app/layout.tsx`, `app/page.tsx`, `app/client-page.tsx`, `app/not-found.tsx`, `app/fonts.ts`, empty route placeholders in `app/[...urlSegments]/` and `app/posts/[...urlSegments]/`.
- Key files: `app/layout.tsx`, `app/page.tsx`, `app/client-page.tsx`.

**`components/`:**
- Purpose: Hold reusable UI outside route files.
- Contains: Active shell component in `components/base-layout.tsx`; placeholder subtree `components/shared/Header/`.
- Key files: `components/base-layout.tsx`.

**`content/`:**
- Purpose: Store Tina-backed editable documents.
- Contains: `content/pages/home.mdx` plus currently empty or starter directories `content/authors/`, `content/global/`, `content/posts/june/`, and `content/tags/`.
- Key files: `content/pages/home.mdx`.

**`docs/`:**
- Purpose: Capture repository-specific operational guidance.
- Contains: `docs/tina-skill.md`.
- Key files: `docs/tina-skill.md`.

**`lib/`:**
- Purpose: Store small shared helpers with no route ownership.
- Contains: `lib/utils.ts`.
- Key files: `lib/utils.ts`.

**`public/`:**
- Purpose: Expose static assets directly to the Next.js app and Tina admin.
- Contains: Generated admin app in `public/admin/`, block preview images in `public/blocks/`, site assets in `public/uploads/`, and `public/favicon.ico`.
- Key files: `public/admin/index.html`, `public/uploads/11-logo.svg`.

**`tina/`:**
- Purpose: Define CMS schema and generated query artifacts.
- Contains: `tina/config.tsx`, collections in `tina/collection/`, custom fields in `tina/fields/`, generated client/schema files in `tina/__generated__/`, and an empty customization area in `tina/queries/`.
- Key files: `tina/config.tsx`, `tina/collection/page.ts`, `tina/collection/global.ts`, `tina/__generated__/client.ts`.

**`.github/workflows/`:**
- Purpose: Automate validation and deployment.
- Contains: `build-and-deploy.yml`, `pr-open.yml`, `update-dependabot-pr.yml`.
- Key files: `.github/workflows/build-and-deploy.yml`, `.github/workflows/pr-open.yml`.

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout for all routes.
- `app/page.tsx`: Active home route server entry.
- `app/client-page.tsx`: Home route client-side Tina hydration entry.
- `app/not-found.tsx`: Global not-found UI.
- `tina/config.tsx`: Tina schema/build/admin entry.
- `.github/workflows/build-and-deploy.yml`: Production build/deploy entry.

**Configuration:**
- `package.json`: Project scripts and dependency manifest.
- `tsconfig.json`: TypeScript options and `@/*` alias.
- `next.config.ts`: Response headers and `/admin` rewrite.
- `biome.json`: Formatting/linting rules.
- `graphql.config.js`: GraphQL schema/document lookup for Tina-generated and custom queries.
- `components.json`: shadcn alias and generator metadata.
- `.nvmrc`: Node runtime version for local/CI use.

**Core Logic:**
- `app/page.tsx`: Tina query orchestration for the home page.
- `app/client-page.tsx`: `useTina()` bridge for edit mode.
- `components/base-layout.tsx`: Global header shell and menu state.
- `tina/collection/page.ts`: Page collection routing and fields.
- `tina/collection/global.ts`: Global singleton-style structured content schema.
- `tina/__generated__/client.ts`: Generated Tina query client.

**Testing:**
- No test directory or test runner config is present.
- Validation currently lives in workflows and scripts: `.github/workflows/pr-open.yml`, `.github/workflows/build-and-deploy.yml`, and the scripts in `package.json`.

## Naming Conventions

**Files:**
- Next.js route files use framework names: `app/page.tsx`, `app/layout.tsx`, `app/not-found.tsx`.
- Server/client Tina pairs use `page.tsx` plus `client-page.tsx`: `app/page.tsx` and `app/client-page.tsx`.
- Utility modules use short lowercase names: `lib/utils.ts`.
- Tina collection files use singular content names: `tina/collection/page.ts`, `tina/collection/global.ts`.
- Shared component files are currently kebab-case: `components/base-layout.tsx`.

**Directories:**
- Route segment directories follow App Router conventions, including dynamic catch-alls: `app/[...urlSegments]/`, `app/posts/[...urlSegments]/`.
- Tina folders are role-based: `tina/collection/`, `tina/fields/`, `tina/__generated__/`, `tina/queries/`.
- Content directories mirror collection paths: `content/pages/` for the `page` collection and `content/global/` for the `global` collection.

## Where to Add New Code

**New Feature:**
- Primary route code: add a new route folder under `app/`, following the existing split of `page.tsx` for server fetching and `client-page.tsx` for Tina-enabled rendering when the feature is editor-backed.
- Tests: not applicable in current state; use build/type/lint verification from `package.json` and `.github/workflows/pr-open.yml`.

**New Component/Module:**
- Implementation: place reusable UI in `components/`.
- If the component is the main app shell or a cross-route primitive, follow the existing direct-file pattern used by `components/base-layout.tsx`.
- If the component belongs to a more specific feature area, create a subdirectory in `components/` rather than expanding route files.

**Utilities:**
- Shared helpers: `lib/`.
- Class-name helpers should reuse or extend `lib/utils.ts` instead of duplicating `clsx` and `tailwind-merge` calls in components.

**Content-Managed Features:**
- Collection/schema: `tina/collection/` and `tina/fields/`.
- Generated queries/types: `tina/__generated__/` are outputs, not authoring targets.
- Source content: `content/` in the subdirectory that matches the collection path.

## Special Directories

**`tina/__generated__/`:**
- Purpose: Generated GraphQL schema, client, and TypeScript types.
- Generated: Yes.
- Committed: Yes.

**`public/admin/`:**
- Purpose: Built Tina admin application served through the `/admin` rewrite in `next.config.ts`.
- Generated: Yes.
- Committed: Yes.

**`public/uploads/`:**
- Purpose: Tina media root for editor-uploaded assets, configured in `tina/config.tsx`.
- Generated: No.
- Committed: Yes.

**`.next/`:**
- Purpose: Local Next.js build cache and artifacts.
- Generated: Yes.
- Committed: No; ignored by `.gitignore`.

**`out/`:**
- Purpose: Static export target uploaded by `.github/workflows/build-and-deploy.yml`.
- Generated: Yes.
- Committed: No; ignored by `.gitignore`.

**Empty Placeholder Trees:**
- Purpose: Reserved structure for future routes or shared modules.
- Paths: `app/[...urlSegments]/`, `app/posts/[...urlSegments]/`, `components/shared/Header/`, `tina/queries/`, `content/authors/`, `content/global/`, `content/posts/june/`, `content/tags/`.
- Generated: No.
- Committed: Yes.

---

*Structure analysis: 2026-04-23*
