# Artwork Blocks — Header H2

**Date:** 2026-05-09  
**Status:** Approved

## Overview

Add a blocks system to the `Artwork` Tina collection, starting with a single block type: Header H2. Blocks render in the artwork detail panel (slide-up overlay on `/artworks`) below the existing info card.

## Architecture

### New files
- `components/artwork-blocks/header-h2-block.tsx` — React component for the Header H2 block

### Modified files
- `tina/collection/artwork.ts` — add `blocks` field with `headerH2` template
- `app/artworks/client-page.tsx` — render blocks in `DetailPanel` below `ArtworkInfoCard`

## Schema (`tina/collection/artwork.ts`)

Add `headerH2Block` template:

```ts
const headerH2Block: Template = {
  name: 'headerH2',
  label: 'Header H2',
  fields: [
    {
      type: 'rich-text',
      name: 'heading',
      label: 'Heading',
      overrides: { toolbar: ['bold', 'italic'] },
    },
  ],
};
```

Add `blocks` field to `Artwork` collection:

```ts
{
  type: 'object',
  name: 'blocks',
  label: 'Artwork Blocks',
  list: true,
  ui: { visualSelector: true },
  templates: [headerH2Block],
}
```

## Component (`components/artwork-blocks/header-h2-block.tsx`)

- Client component (`'use client'`)
- Accepts `ArtworkBlocksHeaderH2` from generated types
- Renders `<h2>` with `TinaMarkdown`
- Bold → `<strong className="font-bold">`
- Italic → `<em className="italic font-sedan">` (matches existing `HeroStatementBlock` pattern)
- Typography: `font-space-grotesk text-2xl tracking-[-0.04em] text-black`
- `data-tina-field` on the `<h2>` for visual editing

## Rendering (`app/artworks/client-page.tsx`)

In `DetailPanel`, below `ArtworkInfoCard` (inside the existing `w-full md:max-w-[450px]` div):

```tsx
<div className="space-y-6">
  {artwork.blocks?.map((block, i) => {
    switch (block?.__typename) {
      case 'ArtworkBlocksHeaderH2':
        return <HeaderH2Block key={i} block={block} />;
      default:
        return null;
    }
  })}
</div>
```

## Type generation

After schema changes, run `pnpm dev` (or `pnpm build-local`) to regenerate `tina/__generated__/types.ts` before using the new `ArtworkBlocksHeaderH2` type in the component.

## Out of scope

- Additional block types (body text, image, etc.) — future additions follow the same pattern
- Blocks on the artworks listing page itself
