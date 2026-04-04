# AGENTS.md
## Purpose
This repository is a Next.js 15 + TinaCMS site using the App Router, TypeScript, Tailwind CSS v4, and Biome.
Use this file as the operating guide for coding agents making changes here.
## Environment
- Preferred package manager: `pnpm`
- Node version: `.nvmrc` specifies `v22`
- Install dependencies with `pnpm install`
- Path alias: `@/*` maps to the repository root
- Main app code lives in `app/`, `components/`, `lib/`, and `tina/`
- Content lives in `content/`
## High-Signal Commands
### Development
- Start local dev with Tina and Next: `pnpm dev`
- Plain Next build only: `pnpm dev:build`
- Production build with Tina cloud setup: `pnpm build`
- Local/offline-oriented build: `pnpm build-local`
- Start production server: `pnpm start`
- Export static output: `pnpm export`
### Linting and Formatting
- Lint the repo: `pnpm lint`
- Lint a single file: `pnpm exec biome lint app/page.tsx`
- Format a single file: `pnpm exec biome format --write app/page.tsx`
- Organize imports for a file: `pnpm exec biome check --write app/page.tsx`
- Apply Biome fixes repo-wide: `pnpm exec biome check --write .`
### Type Checking
- Run TypeScript only: `pnpm exec tsc --noEmit`
### Tests
- There is currently no automated test runner configured in `package.json`
- No `vitest`, `jest`, `playwright`, or `cypress` config is present
- No `*.test.*` or `*.spec.*` files are present
- Single-test command: not available until a test framework is added
- For verification today, rely on `pnpm exec tsc --noEmit`, `pnpm lint`, and a relevant build command
## CI Expectations
- Pull requests run `pnpm install` and `pnpm build`
- GitHub Pages deploys from `main` and also runs a build
- Build jobs use environment variables for Tina:
  - `NEXT_PUBLIC_TINA_CLIENT_ID`
  - `NEXT_PUBLIC_TINA_BRANCH`
  - `TINA_TOKEN`
- Avoid introducing changes that require a separate runtime not reflected in the existing workflows
## Repository Architecture
- `app/` contains Next.js routes and layouts
- Many routes use a server/client split:
  - `page.tsx` fetches Tina data on the server
  - `client-page.tsx` renders interactive UI on the client
- `components/blocks/` contains Tina-driven content block renderers
- `components/ui/` contains UI primitives, including shadcn-style components
- `components/layout/` contains layout shell pieces
- `tina/collection/` defines Tina collections and schema
- `tina/fields/` contains custom Tina field definitions
- `content/` stores Markdown/MDX/JSON content edited through Tina
## Copilot Rules Incorporated Here
The repository includes `.github/copilot-instructions.md`. Follow these rules:
- Preserve the Tina server/client split pattern
- Server routes should fetch via `client.queries.*()`
- Client pages should receive and pass through all three Tina values:
  - `query`
  - `data`
  - `variables`
- Use `useTina()` in client components that support visual editing
- Add `data-tina-field={tinaField(object, 'fieldName')}` to user-editable elements
- Import generated Tina query types from `@/tina/__generated__/types` when needed
- Do not invent alternative content-fetching patterns when an existing Tina query already fits
## TinaCMS Skill
- Treat `docs/tina-skill.md` as the implementation playbook for Tina-related work in this repository
- Read that file before changing Tina collections, block schemas, generated query usage, visual editing wiring, or content structure
- Prefer the repository's existing Tina patterns over generic examples when there is any conflict
## Cursor Rules
- No `.cursorrules` file is present
- No `.cursor/rules/` directory is present
- Do not claim Cursor-specific repository rules beyond what is documented here
## Style Guide
### Formatting
- Use Biome as the source of truth
- Indentation: 2 spaces
- Line endings: LF
- Semicolons: required
- Quotes in JS/TS: single quotes
- JSX quote style: single quotes
- Trailing commas: ES5 style
- Max line width in Biome: 160
- Run Biome after edits because some existing files are not fully normalized yet
### Imports
- Prefer `@/` absolute imports for repository code
- Keep React/Next/library imports before internal imports
- Use `import type` for type-only imports when practical
- Let Biome organize imports instead of hand-tuning order
- Follow existing file-local conventions if a file has a stable pattern, then run Biome
### TypeScript
- TypeScript is strict; keep new code compatible with `strict` and `strictNullChecks`
- Prefer explicit interfaces or type aliases for component props
- Prefer generated Tina types over handwritten equivalents
- Avoid weakening types unless there is a real schema or library constraint
- `any` is not globally banned, but treat it as a last resort
- Non-null assertions are allowed by lint config, but use them only when the invariant is clear
### Naming
- React component names: `PascalCase`
- Component file names are usually kebab-case, with some existing legacy exceptions
- Route files follow Next.js conventions: `page.tsx`, `layout.tsx`, `not-found.tsx`
- Server/client route pairs commonly use `client-page.tsx`
- Utility/helper functions use `camelCase`
- Keep naming aligned with Tina schema names and generated types
### React and Next.js Patterns
- Default to server components in `app/` unless client behavior is required
- Add `'use client';` only when hooks, browser APIs, or client-only libraries are needed
- Prefer async server components for Tina data fetching
- Reuse shared layout wrappers like `Layout` and `Section` instead of duplicating page chrome
- Use Next primitives like `Image`, `Link`, and `Metadata` where appropriate
- Respect revalidation settings already present on routes
### Styling
- Tailwind utility classes are the primary styling mechanism
- Use the shared `cn()` helper from `@/lib/utils` to compose class names
- Existing UI primitives use `class-variance-authority`; extend variants instead of branching ad hoc when modifying those components
- The repo uses shadcn-style component structure (`components.json` style `new-york`)
- Prefer CSS variables and existing design tokens over hardcoded one-off values
### Error Handling
- Prefer graceful fallback behavior for content-loading failures
- In route-level server code, use patterns like `notFound()` when content is missing
- Logging with `console.error` is already used for unexpected failures; keep logs concise and actionable
- Do not swallow errors silently in async code
- In UI surfaces that can fail independently, reuse existing boundaries such as `components/error-boundary.tsx`
### Content and TinaCMS
- Content changes often belong in `content/` rather than hardcoded JSX
- Keep Tina collection definitions and renderers in sync
- When adding editable UI, wire `tinaField()` to visible, user-editable DOM nodes only
- Pass parent objects to `tinaField()`; do not attach it to derived strings
- Prefer schema-driven changes over one-off content parsing hacks
## Agent Workflow
- Before editing, inspect the relevant route/component/schema files together
- After editing TS/TSX files, run `pnpm exec biome check --write <paths>` on touched files when possible
- Run `pnpm exec tsc --noEmit` for type-sensitive changes
- Run `pnpm build` for high-confidence verification when changes affect app behavior, routing, Tina config, or production output
- If a task asks for tests, state clearly that no test harness exists yet and use typecheck/lint/build verification instead
## Practical Notes
- `package.json` exists, but the repo is effectively pnpm-based because `pnpm-lock.yaml` is committed and CI installs with pnpm
- `biome lint` is the only package script for linting; formatting and import organization use `pnpm exec biome ...`
- `build-local` is useful when you need a Tina build without cloud indexing/checks
- GitHub Pages deployment creates static output in `out/`
