# ShopBlock Page Block — Design Spec

**Date:** 2026-05-08

## Overview

New page block for a shop/product section. Blue background (`bg-brand-blue`), white text, auto-scrolling product image cards using the same RAF animation as `DesignSliderBlock`.

## Layout

### Mobile
- Section: `bg-brand-blue`, vertical stack
- SHOP eyebrow (`SectionMasthead`, white)
- Large serif heading (`TinaMarkdown`, white)
- Description paragraph (plain string, white)
- Full-width white `ActionButton` with `shoppingBag` icon
- Horizontally scrolling product card row below

### Desktop
- Left column: eyebrow + heading
- Right column: description + compact (non-full-width) white `ActionButton` with `shoppingBag` icon
- Product card row below spans full width

## Product Cards

- Image-only cards (no name, no price)
- `aspect-square` image, `object-cover`
- Optional `href` wraps card in `<Link>`
- Sizing: `w-[85vw]` mobile, `md:w-[calc((100vw-144px)/4)]` desktop (~4 cards visible)
- Auto-scroll: identical RAF loop to `DesignSliderBlock` — bounces direction at ends, pauses on hover

## Tina Schema Fields

**Block-level:**
- `eyebrow` (string)
- `eyebrowIndex` (string)
- `heading` (rich-text, bold + italic toolbar)
- `description` (string)
- `buttonLabel` (string)
- `buttonHref` (string)

**Item-level (list):**
- `image` (image, required)
- `imageAlt` (string)
- `href` (string)

## Files Changed

| File | Change |
|------|--------|
| `components/icons/icon.tsx` | Import `shopping_bag.svg`, add `shoppingBag` key to `icons` map |
| `components/page-blocks/shop-block.tsx` | New block component |
| `tina/collection/page.ts` | Add `shopBlock` template, push to `templates` array |
| `app/client-page.tsx` | Add `PageBlocksShop` case |

## Component Structure

```
ShopBlock
├── <section> bg-brand-blue
│   ├── Header (px-4 md:px-12)
│   │   ├── Left: SectionMasthead + TinaMarkdown heading
│   │   └── Right (desktop): description + ActionButton
│   ├── Scrolling row (same ref/RAF pattern as DesignSliderBlock)
│   │   └── ProductCard × N
│   └── Mobile button (md:hidden full-width ActionButton)
```

## Shared Components Used

- `ActionButton` — color=`white`, icon=`shoppingBag`, iconPosition=`left`
- `SectionMasthead` — color=`white`

## Notes

- No `accentColor` per card (image-only, no hover state needed beyond cursor)
- `tinaField` annotations on all editable DOM elements
- `useInView` + `useReducedMotion` guards identical to `DesignSliderBlock`
