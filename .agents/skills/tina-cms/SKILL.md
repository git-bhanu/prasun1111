---
name: tina-cms
description: Use this skill for any task that adds or modifies TinaCMS collections, fields, templates, visual editing, generated query usage, Tina-backed routes, or Tina-managed content in this repository. Do not use it for unrelated UI-only changes that do not touch Tina data flow or content modeling.
---

# TinaCMS Skill

Follow this skill when implementing TinaCMS-backed changes in this repository.

## Purpose
- Keep Tina work schema-driven, strongly typed, and aligned with this repo's Next.js App Router plus Tina visual editing patterns.

## First Checks
- Inspect the relevant route, renderer, schema, and content files together before editing.
- Prefer existing repository patterns over generic Tina examples when they differ.
- Do not hand-edit files inside `tina/__generated__/`.

## Repository Rules
- Fetch content on the server with `client.queries.*()`.
- For visual editing routes, keep the server/client split:
  - `page.tsx` fetches Tina data.
  - `client-page.tsx` calls `useTina({ query, data, variables })`.
- Always pass all three Tina values to editable client pages: `query`, `data`, `variables`.
- Import generated Tina types from `@/tina/__generated__/types` when needed.
- Prefer content changes in `content/` over hardcoded editable JSX.
- Keep schema and rendering in sync.
- Apply `data-tina-field` only to real HTML elements that map directly to editable content.
- Pass the source object to `tinaField()`, not derived strings.

## File Map
- `tina/config.tsx`: Tina config and collection registration.
- `tina/collection/*.ts`: collections.
- `tina/fields/*.tsx`: custom fields and shared schema fragments.
- `components/blocks/*.tsx`: block renderers and many block template schemas.
- `components/blocks/index.tsx`: block union dispatch.
- `content/`: Tina-managed content.

## Common Tasks

### Add or update a block
- Define or update the block template in `components/blocks/<block>.tsx`.
- Register the template in `tina/collection/page.ts`.
- Render the generated `__typename` in `components/blocks/index.tsx`.
- Add sensible `ui.defaultItem` and `ui.itemProps` when useful for editor UX.

### Add a field
- Update the collection or template schema first.
- Regenerate Tina outputs if required by the workflow.
- Update the UI renderer.
- Add `tinaField()` wiring if the field should be click-to-edit.
- Update `content/` when required fields or starter data are needed.

### Add a Tina-backed route
- Prefer async server `page.tsx`.
- Fetch with `client.queries.<query>()`.
- For editable pages, pass `query`, `data`, and `variables` into `client-page.tsx`.
- In the client component, render from `useTina()` output, not stale props.

### Work with global content
- Prefer extending the existing `global` collection over creating parallel site-settings structures.
- Keep shared layout flow aligned with `components/layout/layout.tsx`.

## Tina Product Constraints
- `tina/config.{ts,tsx}` must be deterministic.
- `tina-lock.json` should be committed.
- A collection must use either `fields` or `templates`, not both.
- Prefer singular collection names.
- Use `isTitle` on one required top-level string field at most.
- Use only one `isBody` field per markdown or MDX collection.
- Use `match.include` and `match.exclude` when the collection path should target only some files.
- Use `ui.allowedActions` for singleton or controlled collections.
- Rich-text default values require AST-shaped data, not plain markdown strings.

## Visual Editing Rules
- `useTina()` belongs in client components only.
- Visual editing works best with an individual document query for the editable page.
- `data-tina-field` must be attached to a DOM element, not a React component.
- For custom components rendered through `TinaMarkdown`, `tinaField(props)` can use the injected edit metadata.

## Query Rules
- Prefer generated client queries over manual GraphQL.
- Use single-document queries for pages and global docs.
- Use connection queries for lists, pagination, sorting, and filtering.
- Filter `_sys.filename` in application code when needed.
- Use `fetchOptions.next.revalidate` or route revalidation deliberately when App Router caching would hide Tina updates.

## Verification
- Run `pnpm exec biome check --write <touched-files>` after TS or TSX edits.
- Run `pnpm exec tsc --noEmit` for type safety.
- Run `pnpm build` when Tina config, schema, routes, or production output changed.

## Anti-Patterns
- Do not bypass Tina for content that should be editor-managed.
- Do not invent a second content-fetching pattern when the existing split works.
- Do not forget renderer updates after schema changes.
- Do not hand-edit generated Tina files.

See `references/repo-guide.md` for the fuller repo-specific guide.
