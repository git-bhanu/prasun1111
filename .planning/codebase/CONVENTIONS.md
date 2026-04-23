# Coding Conventions

**Analysis Date:** 2026-04-23

## Naming Patterns

**Files:**
- Use Next.js route filenames for app entrypoints in `app/page.tsx`, `app/layout.tsx`, and `app/not-found.tsx`.
- Use kebab-case for colocated route helpers like `app/client-page.tsx`.
- Use lowercase utility filenames in `lib/utils.ts` and lowercase collection names in `tina/collection/page.ts` and `tina/collection/global.ts`.
- Use lowercase field helper filenames in `tina/fields/color.tsx` and `tina/fields/icon.tsx`.

**Functions:**
- Use PascalCase for React components such as `Home` in `app/page.tsx`, `ClientPage` in `app/client-page.tsx`, `RootLayout` in `app/layout.tsx`, `BaseLayout` in `components/base-layout.tsx`, and `ColorPickerInput` in `tina/fields/color.tsx`.
- Use camelCase for utilities and helpers such as `cn` in `lib/utils.ts` and `parseIconName` in `tina/fields/icon.tsx`.
- Use descriptive handler names when callbacks stay inline; examples appear in `components/base-layout.tsx` with `setMenuExpanded((current) => !current)` and in `tina/fields/icon.tsx` with inline `onChange` and `onClick` handlers.

**Variables:**
- Use camelCase for local variables and props such as `menuExpanded` in `components/base-layout.tsx`, `result` in `app/page.tsx`, `filteredBlocks` in `tina/fields/icon.tsx`, and `inputClasses` in `tina/fields/color.tsx`.
- Use UPPER_SNAKE_CASE only for env vars referenced in config, such as `NEXT_PUBLIC_TINA_CLIENT_ID`, `NEXT_PUBLIC_TINA_BRANCH`, and `TINA_TOKEN` in `tina/config.tsx` and `.github/workflows/*.yml`.

**Types:**
- Use `type` aliases for component props in app and component files, such as `ClientPageProps` in `app/client-page.tsx` and `BaseLayoutProps` in `components/base-layout.tsx`.
- Use `interface` when a shape is intended to read as a public contract, as in `NotFoundProps` in `app/not-found.tsx`.
- Prefer generated Tina types from `@/tina/__generated__/types`, as shown in `app/client-page.tsx` and prescribed in `docs/tina-skill.md`.

## Code Style

**Formatting:**
- Use Biome from `biome.json` as the formatter and import organizer.
- Follow 2-space indentation, LF line endings, semicolons, single quotes in TS/JS, single quotes in JSX, and ES5 trailing commas per `biome.json`.
- Keep line width within 160 characters per `biome.json`.
- Treat `tina/__generated__/`, `public/admin/`, `.next/`, `out/`, `*.gql`, and `*.json` as formatting/lint ignore zones per `biome.json`.
- Normalize touched files with `pnpm exec biome check --write <paths>`; some committed files still diverge from the configured style, notably `components/base-layout.tsx` and `next.config.ts` using double quotes or missing semicolons while `app/page.tsx` and `app/layout.tsx` match Biome settings.

**Linting:**
- Use `pnpm lint`, which runs `biome lint` from `package.json`.
- Treat strict type safety as part of the convention: `tsconfig.json` enables `strict` and `strictNullChecks`.
- Expect Biome rules to allow pragmatic exceptions already present in the repo: `noExplicitAny` is off, `noNonNullAssertion` is off, and `noUnusedVariables` is off in `biome.json`.
- Prefer `const` and avoid `var`; TypeScript overrides in `biome.json` set `useConst` and `noVar` to `error`.

## Import Organization

**Order:**
1. Framework or library imports first, for example `next`, `react`, `lucide-react`, or `tinacms` in `app/layout.tsx`, `components/base-layout.tsx`, and `tina/fields/icon.tsx`.
2. Internal absolute imports via `@/` next, as in `app/layout.tsx` and `app/page.tsx`.
3. Relative imports for nearby modules when staying within a local feature folder, as in `tina/config.tsx`, `tina/collection/global.ts`, and `app/page.tsx`.

**Path Aliases:**
- Use `@/*` for repository-root imports per `tsconfig.json`.
- `components.json` also maps shadcn-style aliases such as `@/components`, `@/lib/utils`, and `@/components/ui`; use them when adding shared UI or utility code.
- Use `import type` for type-only imports when practical, as shown in `app/client-page.tsx`, `tina/collection/page.ts`, `tina/collection/global.ts`, and `next.config.ts`.

## Error Handling

**Patterns:**
- Prefer route-level fallbacks instead of silent failures. `docs/tina-skill.md` and `.github/copilot-instructions.md` prescribe `notFound()` for missing content in server routes.
- Keep async route fetching simple and close to the route; `app/page.tsx` fetches via Tina on the server and forwards the payload directly.
- When a UI surface intentionally renders nothing, return `null` explicitly, as in `app/client-page.tsx`.
- Accept that the current repo uses targeted escape hatches where Tina typing is awkward: `iconSchema as any` in `tina/collection/global.ts`, `@ts-ignore` in `tina/collection/global.ts` and `tina/fields/color.tsx`, and `any` event/icon props in `tina/fields/icon.tsx`. Prefer avoiding new escape hatches unless a Tina API forces them.

## Logging

**Framework:** console

**Patterns:**
- Keep logs concise and actionable. This is documented in `AGENTS.md` and `.github/copilot-instructions.md`.
- No runtime logging is present in the current source files under `app/`, `components/`, `lib/`, or `tina/`; follow the documented pattern only for unexpected async failures.

## Comments

**When to Comment:**
- Use short comments for platform-specific or framework-specific context, not for obvious code. Examples: branch fallback comments in `tina/config.tsx` and GitHub Pages header notes in `next.config.ts`.
- Avoid narrative comments in normal component rendering; files like `app/layout.tsx`, `app/not-found.tsx`, and `lib/utils.ts` rely on readable code instead.

**JSDoc/TSDoc:**
- Not used in the current source set under `app/`, `components/`, `lib/`, and `tina/`.
- Prefer clear naming and small props/types over adding docblocks unless an API becomes non-obvious.

## Function Design

**Size:**
- Keep app-level functions small and focused: `Home` in `app/page.tsx`, `RootLayout` in `app/layout.tsx`, and `cn` in `lib/utils.ts` are all single-purpose.
- Allow larger interactive field components only when wrapping third-party editor UI, as in `tina/fields/icon.tsx`.

**Parameters:**
- Destructure props in layout or presentational components when only children are needed, as in `components/base-layout.tsx` and `app/layout.tsx`.
- Pass the full Tina payload object into client renderers, then hand it to `useTina(props)`, as in `app/client-page.tsx`.
- Keep collection configuration callbacks narrow and data-driven, such as `router: ({ document }) => ...` in `tina/collection/page.ts` and `itemProps: (item) => ...` in `tina/collection/global.ts`.

**Return Values:**
- Return JSX directly from components.
- Return small computed values from helpers, such as strings in `tina/fields/icon.tsx` and merged class names in `lib/utils.ts`.
- For config modules, export a single object as the default export, as in `tina/config.tsx`, `tina/collection/page.ts`, `tina/collection/global.ts`, and `next.config.ts`.

## Module Design

**Exports:**
- Use one default export per route or config module, such as `app/page.tsx`, `app/layout.tsx`, `tina/config.tsx`, `tina/collection/page.ts`, and `tina/collection/global.ts`.
- Use named exports for reusable helpers/components that may coexist in the same file, such as `BaseLayout` in `components/base-layout.tsx`, `Illustration` in `app/not-found.tsx`, `cn` in `lib/utils.ts`, `ColorPickerInput` in `tina/fields/color.tsx`, and `iconSchema` in `tina/fields/icon.tsx`.

**Barrel Files:**
- Not used in the current codebase. Import directly from source files like `@/components/base-layout` and `../fields/color`.

## Content Editing Conventions

**Tina server/client split:**
- Fetch Tina data in a server route file like `app/page.tsx` with `client.queries.*()`.
- Pass `query`, `data`, and `variables` into a colocated client file like `app/client-page.tsx`.
- Call `useTina()` only in client components, per `app/client-page.tsx`, `docs/tina-skill.md`, and `.github/copilot-instructions.md`.

**Editable content location:**
- Put page content in `content/`, not hardcoded JSX. The current homepage source lives in `content/pages/home.mdx`, and Tina collections point at `content/pages` in `tina/collection/page.ts` and `content/global` in `tina/collection/global.ts`.
- Keep schema and content in sync by updating the relevant Tina collection when fields change, per `docs/tina-skill.md`.

**Schema conventions:**
- Define Tina collections in `tina/collection/*.ts` and shared field building blocks in `tina/fields/*.tsx`.
- Use singular collection names like `page` and `global` in `tina/collection/page.ts` and `tina/collection/global.ts`.
- Use explicit field names that mirror rendered usage, such as `title`, `body`, `header`, `footer`, and `theme`.
- Use `object` plus `list: true` for repeatable structured content, as in `header.nav` and `footer.social` in `tina/collection/global.ts`.
- Use `ui.defaultItem`, `ui.itemProps`, and `ui.router` to shape the editing experience, as shown in `tina/collection/global.ts` and `tina/collection/page.ts`.

**Visual editing wiring:**
- When rendering Tina-managed content, add `data-tina-field={tinaField(object, 'fieldName')}` on visible editable DOM nodes only, following `docs/tina-skill.md` and `.github/copilot-instructions.md`.
- Pass the source object into `tinaField()`, not a derived string, per `docs/tina-skill.md`.
- Do not hand-edit generated Tina files under `tina/__generated__/`; treat them as generated output per `docs/tina-skill.md` and the ignore rules in `biome.json`.

---

*Convention analysis: 2026-04-23*
