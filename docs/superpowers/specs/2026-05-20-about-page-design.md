# About Page Design

**Date:** 2026-05-20

## Overview

Build the About page using 4 new TinaCMS block templates added to the existing `page` collection. The page is content-managed and follows the same Tina + Next.js App Router pattern used by the Contact page.

## Routing

- New dedicated route: `app/about/page.tsx` + `app/about/client-page.tsx`
- Mirrors `app/contact/` pattern: server page fetches via `client.queries.page({ relativePath: 'about.mdx' })`, client page uses `useTina()` and renders blocks via switch
- Remove `about` from the placeholder map in `app/[slug]/page.tsx`

## New Tina Block Templates

All 4 templates are added to `tina/collection/page.ts` and registered in the `templates` array of the `Page` collection.

### 1. `aboutHero`

**Purpose:** Top section of the About page — large statement left, body text right.

**Fields:**
| Name | Type | Notes |
|------|------|-------|
| `eyebrow` | string | e.g. "PRASUN MAZUMDAR" — displayed small-caps in brand-blue |
| `statement` | rich-text | Large serif statement. Toolbar: italic only |
| `body` | rich-text | Right-column paragraphs. Toolbar: bold, italic |

**Layout:**
- Desktop: 2-column grid. Left col: eyebrow (small-caps, `text-[10px]` tracking-wide, brand-blue) + statement (`font-sedan`, ~`text-[40px]` leading tight). Right col: body text (`text-base` leading-relaxed).
- Mobile: stacked — eyebrow → statement → body.
- Padding: `px-4 py-16 md:px-[58px] md:py-24`

### 2. `media`

**Purpose:** Generic full-width or contained image block, reusable across pages.

**Fields:**
| Name | Type | Notes |
|------|------|-------|
| `image` | image | Required |
| `alt` | string | Alt text |
| `size` | string (options) | `full` \| `contained` |

**Layout:**
- `full`: `w-full`, no padding, edge-to-edge. Image uses `width={0} height={0} sizes="100vw" className="w-full h-auto"` or a fixed-height container with `object-cover`.
- `contained`: `max-w-[1280px] mx-auto px-4 md:px-[58px]`
- Next.js `<Image>` with `fill` inside a relative container using `aspect-[4/3]` or `aspect-video` depending on the image. Default to natural aspect ratio via `width`/`height` props set to `0` with `sizes="100vw"`.

### 3. `cvBio`

**Purpose:** CV entries (left) + body text (right).

**Fields:**
| Name | Type | Notes |
|------|------|-------|
| `entries` | object list | Each entry: `organization` (string), `role` (string), `period` (string) |
| `body` | rich-text | Right-column paragraphs + optional italic closing. Toolbar: bold, italic |

**Entry display (left col):**
- `organization`: bold, uppercase, `font-space-grotesk text-[11px]` tracking-wide
- `role`: normal weight, `text-[11px]` text-grey below org
- `period`: right-aligned, `text-[11px]` text-grey
- Horizontal rule (`border-t border-black/10`) between entries

**Layout:**
- Desktop: 2-column grid, equal or 40/60 split. Left: CV table. Right: body text.
- Mobile: stacked — CV entries → body.
- Padding: `px-4 py-16 md:px-[58px] md:py-24`

### 4. `statementCta`

**Purpose:** Large serif statement + two CTA buttons. Bottom-of-page placement.

**Fields:**
| Name | Type | Notes |
|------|------|-------|
| `statement` | rich-text | Large serif quote. Toolbar: bold, italic |
| `primaryLabel` | string | e.g. "REACH OUT" |
| `primaryHref` | string | |
| `primaryIcon` | string | Optional. Matches `ActionButton` icon names (e.g. `phone`) |
| `secondaryLabel` | string | e.g. "MAIL ME" |
| `secondaryHref` | string | |
| `secondaryIcon` | string | Optional |

**Layout:**
- Full-width section, `px-4 py-16 md:px-[58px] md:py-24`
- Statement: `font-sedan text-[32px] md:text-[64px]` leading-tight, full-width
- Buttons: flex row (mobile: column), using existing `ActionButton` component. Primary = filled (default), secondary = outlined (`color='outline'` or similar existing variant)

## New React Components

| File | Block |
|------|-------|
| `components/page-blocks/about-hero-block.tsx` | `aboutHero` |
| `components/page-blocks/media-block.tsx` | `media` |
| `components/page-blocks/cv-bio-block.tsx` | `cvBio` |
| `components/page-blocks/statement-cta-block.tsx` | `statementCta` |

Each is a `'use client'` component that receives the typed Tina block prop and uses `tinaField()` on visible DOM elements.

## Route Files

**`app/about/page.tsx`** — server component, fetches Tina data:
```ts
import client from '@/tina/client';
import AboutClientPage from './client-page';

export default async function AboutPage() {
  const result = await client.queries.page(
    { relativePath: 'about.mdx' },
    { fetchOptions: { next: { revalidate: 60 } } }
  );
  return <AboutClientPage query={result.query} data={result.data} variables={result.variables} />;
}
```

**`app/about/client-page.tsx`** — client component, switch on `__typename`:
- `PageBlocksAboutHero` → `<AboutHeroBlock>`
- `PageBlocksMedia` → `<MediaBlock>`
- `PageBlocksCvBio` → `<CvBioBlock>`
- `PageBlocksStatementCta` → `<StatementCtaBlock>`

## Content File

`content/pages/about.mdx` — pre-populated with all 4 blocks in order using placeholder content matching the mockup text.

## Files Changed

1. `tina/collection/page.ts` — add 4 templates, register in `templates` array
2. `components/page-blocks/about-hero-block.tsx` — new
3. `components/page-blocks/media-block.tsx` — new
4. `components/page-blocks/cv-bio-block.tsx` — new
5. `components/page-blocks/statement-cta-block.tsx` — new
6. `app/about/page.tsx` — new
7. `app/about/client-page.tsx` — new
8. `app/[slug]/page.tsx` — remove `about` entry from `pageCopy`
9. `content/pages/about.mdx` — populate with blocks

## Out of Scope

- Modifying existing blocks (`heroStatement`, `contact`, etc.)
- Adding About blocks to any other page's client-page switch
- Animation or transition customization beyond existing `SectionReveal` wrapper
