# Writing Detail Page — Blocks Refactor

**Date:** 2026-05-30

## Goal

Refactor the writing detail page to use the same blocks system as artwork and installation detail pages. Remove the `body` rich-text field and replace with structured blocks.

## Changes

### 1. `tina/collection/writing.ts`

- Remove `body` field (`rich-text`, `isBody: true`)
- Add imports: `headerBlock`, `twoColumnTextBlock`, `videoBlock`, `imageBlock`, `spaceBlock` from `tina/blocks/*`
- Add `blocks` field (object list, `visualSelector: true`) with all 5 templates
- Keep `heroImage` field (already in schema, now rendered)
- Keep all other fields: `titleSections`, `date`, `tags`, `visualsCount`, `readingType`

### 2. `app/writings/[slug]/client-page.tsx`

- Remove `TinaMarkdown` import and body prose section
- Add `blockWrapperClass` helper (identical to artwork/installation)
- Add block imports: `HeaderBlock`, `TwoColumnTextBlock`, `VideoBlock`, `ImageBlock`, `SpaceBlock`
- Render `heroImage` as full-width image section between badges and blocks (if present)
- Render `blocks` array after heroImage using same switch/case pattern as artwork/installation
- Add `ActionButton` "Back to Top" at bottom (consistent with other detail pages)

### Block types

| Block | Width | Vertical padding |
|-------|-------|-----------------|
| Header | narrow | `pb-2 md:py-4` |
| TwoColumnText | wide | `py-4` |
| Video | wide | `py-10` |
| Image | per-block width | `py-4` |
| Space | — | (block handles it) |

### 3. Existing MDX files

No migration needed. Frontmatter stays valid. Body text below frontmatter is ignored (no `isBody` field to map it).

## Out of scope

- Changes to writing listing page
- Changes to writing schema fields other than body/blocks
- New block types
