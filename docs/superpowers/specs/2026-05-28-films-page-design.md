# Films Page Design

Date: 2026-05-28

## Overview

Dedicated `/films` route that renders a single featured film (currently Crow). Full-page dark mode — header, footer, center menu, and all body content go dark when the page is open. Film content managed via TinaCMS with a `film` collection and a `filmsPage` singleton that holds a reference to the currently featured film.

## Dark Mode

**Approach:** `app/films/layout.tsx` mounts a `DarkModeActivator` client component that adds `dark` to `document.documentElement` on mount and removes it on unmount.

Tailwind v4 already defines `@custom-variant dark (&:is(.dark *))` in `styles.css` — this fires globally once `dark` is on `<html>`.

**Dark variants required in existing components:**

| File | Change |
|------|--------|
| `components/base-layout.tsx` | outer div: `dark:bg-neutral-950` |
| `components/shared/Header/index.tsx` | desktop nav: `dark:bg-neutral-950`; center menu bg: `dark:bg-neutral-900`; nav links: `dark:text-white`; Lottie: `dark:invert` |
| `components/shared/Footer/index.tsx` | footer: `dark:bg-neutral-950 dark:text-white`; separators: `dark:text-white/50`; nav links: `dark:text-white`; Lottie: `dark:invert` |
| `components/blocks/header-block.tsx` | heading: `dark:text-white` |
| `components/blocks/two-column-text-block.tsx` | column text: `dark:text-white` |
| `components/blocks/annotation-panel.tsx` | hr: `dark:border-white/12`; annotation text: `dark:text-white` |

Dark variants on shared block components are safe — they only activate on the films page.

## TinaCMS Collections

### `tina/collection/film.ts`

Path: `content/films`, format: `json`

Fields:
- `title` — string, required, isTitle
- `slug` — string (manual URL override)
- `sortOrder` — number
- `tagline` — string (short description shown in hero)
- `awards` — list of `{ image: image, alt: string }` — each rendered as individual `<Image>` in a row
- `backgroundType` — options: `image | video`
- `heroImage` — image
- `heroVideo` — image (Cloudinary video)
- `heroVideoPoster` — image
- `duration` — string (e.g. "15-30 ANIMATION")
- `director` — string
- `year` — string
- `country` — string
- `watchFilmLabel` — string
- `watchFilmHref` — string
- `blocks` — list, templates: `[headerBlock, twoColumnTextBlock, videoBlock, imageBlock, spaceBlock]`

### `tina/collection/films-page.ts`

Path: `content/films-page`, format: `json`, singleton (`allowedActions: { create: false, delete: false }`)

Fields:
- `featuredFilm` — `type: 'reference'`, `collections: ['film']`

## Content Files

**`content/films/crow.json`** — Crow film data (populated with real data)

**`content/films-page/config.json`**:
```json
{ "featuredFilm": "content/films/crow.json" }
```

## App Routes

### `app/films/layout.tsx`

Server component. Renders `<DarkModeActivator />` (client) + `{children}`.

`DarkModeActivator`:
```tsx
'use client';
import { useEffect } from 'react';
export function DarkModeActivator() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);
  return null;
}
```

### `app/films/page.tsx`

Server component. Queries `filmsPage` (singleton) — Tina resolves the `featuredFilm` reference inline, returning full film fields. Passes `query`, `data`, `variables` to client page.

Remove `films` entry from `pageCopy` in `app/[slug]/page.tsx`.

### `app/films/client-page.tsx`

Client component. Calls `useTina({ query, data, variables })`.

## Films Page Layout

### Hero Section (full-width, dark bg)

**Desktop:**
- Full-width background: hero image or video with `bg-black/40` overlay
- Top-left: awards row — each `{ image, alt }` rendered as `<Image>` (~40px height), `flex gap-3`
- Bottom-left: `SectionMasthead index="03" title="FILMS"` + `h1` film title + tagline text + Watch Film `ActionButton`
- Bottom-right: meta grid (duration, director, year, country) — same pattern as `InstallationDetails`

**Mobile (stacked):**
1. Awards row (flex-wrap)
2. `SectionMasthead` + `h1` title
3. Hero image (`aspect-video`)
4. Tagline text
5. Meta grid
6. Watch Film button

### Body Blocks

Same `blockWrapperClass` width/padding pattern as installation detail. Switch on `FilmBlocks*` typename:

| Typename | Width | Padding |
|----------|-------|---------|
| `FilmBlocksHeader` | narrow | `pb-2 md:py-4` |
| `FilmBlocksTwoColumnText` | wide | `py-4` |
| `FilmBlocksVideo` | wide | `py-10` |
| `FilmBlocksImage` | from block | `py-4` |
| `FilmBlocksSpace` | — | — |

Dark variants in block components fire automatically. No extra wrapper needed.

Back-to-top button at bottom (same as installation detail).

## Tina Config

Register both `film` and `filmsPage` collections in `tina/config.tsx`.

## Files Changed

**New:**
- `app/films/layout.tsx`
- `app/films/page.tsx`
- `app/films/client-page.tsx`
- `tina/collection/film.ts`
- `tina/collection/films-page.ts`
- `content/films/crow.json`
- `content/films-page/config.json`

**Modified:**
- `app/[slug]/page.tsx` — remove `films` from pageCopy
- `tina/config.tsx` — register film + filmsPage
- `components/base-layout.tsx`
- `components/shared/Header/index.tsx`
- `components/shared/Footer/index.tsx`
- `components/blocks/header-block.tsx`
- `components/blocks/two-column-text-block.tsx`
- `components/blocks/annotation-panel.tsx`
