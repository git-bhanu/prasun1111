# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

> `AGENTS.md` is the authoritative operating guide — read it first for full commands, style rules, CI expectations, and workflow requirements. This file supplements it with architecture detail and Claude-specific notes.

**Package manager:** `pnpm` (never `npm` or `yarn`)
**Node version:** `v22` (see `.nvmrc`)

### Common commands

```bash
pnpm dev              # Start dev server with Tina (local mode)
pnpm build-local      # Tina build without cloud indexing — use this for local verification
pnpm exec tsc --noEmit
pnpm exec biome check --write <file>   # lint + format + organize imports in one step
```

No test framework is configured. Verification = typecheck + lint + build.

## Architecture Overview

This is an artist portfolio site built with **Next.js 15 App Router + TinaCMS**. All page content is managed through Tina and stored as MDX/JSON under `content/`.

### Data flow

```
TinaCMS Cloud ← content/pages/*.mdx  ←→  tina/collection/page.ts (schema)
                content/global/site.json ←→  tina/collection/global.ts (schema)
                         ↓
       app/[slug]/page.tsx  (server: calls client.queries.page())
                         ↓
       app/[slug]/client-page.tsx  (client: useTina() + block switch)
                         ↓
       components/page-blocks/*.tsx  (one component per block template)
```

The home route (`app/page.tsx`) follows the same pattern with `relativePath: 'home.mdx'`.

### Page blocks system

`tina/collection/page.ts` defines six block templates. Adding a new block requires changes in four places:

1. Add the `Template` definition in `tina/collection/page.ts`
2. Add it to the `templates` array in the `Page` collection
3. Create `components/page-blocks/<name>-block.tsx`
4. Add the `case` in `app/client-page.tsx` (and any other `client-page.tsx` files)

### Global settings

`content/global/site.json` holds brand, navigation, footer, and theme. The raw Tina query result is normalized through `lib/site-settings.ts → normalizeSiteSettings()`, which produces the `SiteSettings` type consumed by layout components. Extend the `global` collection rather than creating a second global document.

### SVG imports

SVGs import as React components by default via `@svgr/webpack`. Append `?url` to get the URL string instead (handled in `next.config.ts`).

### Media

Images must come from `assets.tina.io` or `res.cloudinary.com` (configured in `next.config.ts` `remotePatterns`). Video fields use Tina's `image` field type pointing at Cloudinary assets.

## TinaCMS Rules (summary — full detail in `docs/tina-skill.md`)

- Server `page.tsx` fetches via `client.queries.*()` with `fetchOptions.next.revalidate`.
- Client `client-page.tsx` calls `useTina({ query, data, variables })` — all three props required.
- `tinaField(object, 'fieldName')` attaches to visible DOM elements only; pass the source object, never a derived string.
- `tina/__generated__/` is generated — never hand-edit it.
- `tina-lock.json` is committed to source control.
- Use `pnpm build-local` when Tina cloud env vars are unavailable.

## Style Highlights

- **Tailwind v4** with `cn()` from `@/lib/utils` for class composition.
- **Biome** is source of truth for formatting (2-space indent, single quotes, semicolons, LF).
- Components use `class-variance-authority`; extend existing variants rather than branching.
- Design tokens live in `styles/tokens.css`.
- `@/` path alias maps to the repo root.

## Shared Component Rules

Do not pass extra `className` props to shared components like `ActionButton` (`components/shared/action-button.tsx`) or `SectionMasthead` (`components/shared/section-masthead.tsx`) unless there is a specific layout or spacing requirement the component's built-in variants cannot handle. These components already encapsulate their typography, color, and spacing logic — unnecessary overrides create drift from the design system. The same principle applies to all components in `components/shared/` and `components/ui/`.
