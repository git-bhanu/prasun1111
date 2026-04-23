# TinaCMS Repo Guide

This repository-specific reference expands the `tina-cms` skill.

## Source Of Truth
- `AGENTS.md`
- `.github/copilot-instructions.md`
- `docs/tina-skill.md`

## Existing Repo Patterns
- The app uses Next.js 15 App Router.
- Tina content is modeled in `tina/collection/`.
- Global settings come from `content/global` and are queried in `components/layout/layout.tsx`.

## Repo-Specific Expectations
- Preserve the current Tina server/client split when a page is intended to support visual editing.
- Reuse existing field helpers from `tina/fields/` when possible.
- Keep edits compatible with strict TypeScript and Biome formatting.

## Verification Commands
- `pnpm exec biome check --write <paths>`
- `pnpm exec tsc --noEmit`
- `pnpm build`
