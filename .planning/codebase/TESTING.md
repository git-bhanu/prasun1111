# Testing Patterns

**Analysis Date:** 2026-04-23

## Test Framework

**Runner:**
- No automated test runner is configured in `package.json`.
- No config file is present for Jest, Vitest, Playwright, or Cypress; `glob` checks found no `jest.config.*`, `vitest.config.*`, `playwright.config.*`, or `cypress.config.*` files.

**Assertion Library:**
- Not applicable; no test harness is installed or configured in `package.json`.

**Run Commands:**
```bash
pnpm lint                    # Run Biome linting from `package.json`
pnpm exec tsc --noEmit       # Run strict TypeScript verification from `tsconfig.json`
pnpm build                   # Run Tina build plus Next production build from `package.json`
```

## Test File Organization

**Location:**
- Not detected. A repository-wide search found no `*.test.*` or `*.spec.*` files.

**Naming:**
- Not applicable until a test framework is added.

**Structure:**
```
No automated test directories or co-located test files are present.
```

## Test Structure

**Suite Organization:**
```typescript
// Current verification pattern is command-based rather than test-file-based.
// Use source files like `app/page.tsx`, `app/layout.tsx`, and `tina/config.tsx`
// with repo commands from `package.json` and `AGENTS.md` for validation.
```

**Patterns:**
- Use static analysis and build verification instead of automated tests.
- Validate TypeScript changes with `pnpm exec tsc --noEmit`, especially for files importing generated Tina types such as `app/client-page.tsx`.
- Validate formatting and lint expectations with `pnpm lint` and, when editing files, `pnpm exec biome check --write <paths>` as directed by `AGENTS.md` and `docs/tina-skill.md`.
- Validate app behavior and Tina integration changes with `pnpm build`, which runs `tinacms build && next build` from `package.json`.

## Mocking

**Framework:** Not used

**Patterns:**
```typescript
// No mocking utilities are present because no automated tests exist.
```

**What to Mock:**
- Not applicable in the current repo state.

**What NOT to Mock:**
- Not applicable in the current repo state.

## Fixtures and Factories

**Test Data:**
```typescript
// No fixture or factory helpers are present.
```

**Location:**
- Not detected. The only content data currently checked in for the app is production/editor content such as `content/pages/home.mdx`, not test fixtures.

## Coverage

**Requirements:**
- None enforced. No coverage tool, coverage script, or threshold configuration exists in `package.json` or workflow files.

**View Coverage:**
```bash
Not available; add a test runner and coverage tool first.
```

## Test Types

**Unit Tests:**
- Not used. There are no unit test files for utilities like `lib/utils.ts` or field helpers like `tina/fields/color.tsx`.

**Integration Tests:**
- Not used. Tina query flow in `app/page.tsx` and editor field wiring in `tina/config.tsx`, `tina/collection/page.ts`, and `tina/collection/global.ts` are currently validated through typecheck/lint/build rather than integration tests.

**E2E Tests:**
- Not used. No Playwright or Cypress setup is present.

## Common Patterns

**Async Testing:**
```typescript
// No async test pattern exists today.
// Async behavior is checked indirectly by running `pnpm build` against files like `app/page.tsx`.
```

**Error Testing:**
```typescript
// No error-path tests exist today.
// Missing-content and Tina failure behavior is documented in `docs/tina-skill.md`
// and `.github/copilot-instructions.md`, but not covered by automated tests.
```

## CI and Build Verification

**Pull request checks:**
- `.github/workflows/pr-open.yml` installs dependencies with `pnpm install` and runs `pnpm build` on pull requests.
- PR CI passes Tina env vars from GitHub secrets in `.github/workflows/pr-open.yml`, so build verification depends on Tina-compatible environment configuration.

**Production/deployment checks:**
- `.github/workflows/build-and-deploy.yml` detects the package manager, installs dependencies, and runs the package manager build command on pushes to `main`.
- For this repo, the detected build resolves to `pnpm build`, so deployment validation is also build-based.
- The Pages workflow uploads `./out` after the build in `.github/workflows/build-and-deploy.yml`.

**Not currently enforced in CI:**
- No workflow runs `pnpm lint`.
- No workflow runs `pnpm exec tsc --noEmit` explicitly.
- No workflow runs unit, integration, or E2E tests because none exist.

## Current Coverage Posture

**What is covered today:**
- Syntax, type compatibility, Tina code generation compatibility, and production build viability are the practical quality gates.
- The strongest existing safety net is the build path touching `tina/config.tsx`, `app/page.tsx`, `app/layout.tsx`, and the generated Tina client referenced in `app/page.tsx`.

**What is not covered today:**
- No automated regression checks exist for `components/base-layout.tsx` interaction behavior.
- No automated checks verify editor UX in `tina/fields/icon.tsx` or `tina/fields/color.tsx`.
- No automated checks assert route rendering output, `not-found` behavior in `app/not-found.tsx`, or content-editing wiring documented in `docs/tina-skill.md` and `.github/copilot-instructions.md`.

**Recommended verification workflow for changes now:**
- Use `pnpm exec biome check --write <touched-files>` after TS or TSX edits.
- Use `pnpm exec tsc --noEmit` for all type-sensitive changes.
- Use `pnpm build` when changes affect routes, Tina schema/config, generated query usage, or deployment output.
- If Tina cloud env vars are unavailable locally, state the limitation explicitly and fall back to the highest-signal command available, following `docs/tina-skill.md`.

---

*Testing analysis: 2026-04-23*
