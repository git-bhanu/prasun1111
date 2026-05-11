# Video Block — Design Spec

## Summary

Add a `videoBlock` template to the artwork blocks system. Shows a 16:9 poster image with an orange "WATCH FILM" button. Clicking replaces the poster with an inline YouTube iframe (autoplay).

## Schema

File: `tina/blocks/video-block.ts`

| Field | Type | Notes |
|-------|------|-------|
| `posterImage` | image | Full 16:9 poster — text/overlays baked into image |
| `youtubeUrl` | string | Full YouTube URL; video ID extracted at render time |
| `duration` | string | Shown in button, e.g. `8MIN. 23 SEC.` |

Tina typename generated: `ArtworkBlocksVideo`

## Component Behaviour

File: `components/blocks/video-block.tsx`

- Container: `aspect-[16/9]`, `rounded-2xl`, `overflow-hidden`, `relative`
- **Default state:** `Next.js Image` fill poster + top-left orange pill button `▶ WATCH FILM • {duration}`
- **Click:** `setPlaying(true)` — unmount poster + button, mount `<iframe>` 100%×100% with `?autoplay=1&rel=0`
- Video ID extracted from YouTube URL via regex (handles `watch?v=`, `youtu.be/`, `embed/` formats)
- `posterImage` alt text: empty string (decorative — text is baked in)

## Files Changed

1. `tina/blocks/video-block.ts` — new schema template
2. `components/blocks/video-block.tsx` — new React component
3. `tina/collection/artwork.ts` — import and add `videoBlock` to templates array
4. `app/artworks/client-page.tsx` — import `VideoBlock`, add `ArtworkBlocksVideo` case in block switch
