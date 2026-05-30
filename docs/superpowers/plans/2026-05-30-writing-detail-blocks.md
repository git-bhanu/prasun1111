# Writing Detail Blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the body rich-text field on writings with a structured blocks system (Header, TwoColumnText, Video, Image, Space) matching artwork/installation, and render the existing `heroImage` field.

**Architecture:** Two-file change — update the Tina schema to swap `body` for `blocks`, then update the client page to render `heroImage` + blocks using the same `blockWrapperClass` pattern as artwork/installation.

**Tech Stack:** Next.js 15 App Router, TinaCMS, Tailwind v4

---

### Task 1: Update writing Tina schema

**Files:**
- Modify: `tina/collection/writing.ts`

- [ ] **Step 1: Replace body field with blocks in writing schema**

Replace entire file content:

```typescript
import type { Collection } from 'tinacms';
import { headerBlock } from '../blocks/header-block';
import { imageBlock } from '../blocks/image-block';
import { spaceBlock } from '../blocks/space-block';
import { twoColumnTextBlock } from '../blocks/two-column-text-block';
import { videoBlock } from '../blocks/video-block';

const Writing: Collection = {
  name: 'writing',
  label: 'Writings',
  path: 'content/writings',
  format: 'mdx',
  ui: {
    router: ({ document }) => `/writings/${document._sys.filename}`,
    filename: {
      slugify: (values) => {
        const date = values.date ? new Date(values.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        const text = (values.titleSections?.[0]?.text ?? '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 40);
        return text ? `${date}-${text}` : date;
      },
    },
  },
  fields: [
    {
      type: 'object',
      name: 'titleSections',
      label: 'Title Sections',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.text || 'Section' }),
      },
      fields: [
        { type: 'string', name: 'text', label: 'Text' },
        {
          type: 'string',
          name: 'font',
          label: 'Font',
          options: [
            { value: 'flex', label: 'Roboto Flex' },
            { value: 'mono', label: 'Roboto Mono' },
          ],
        },
        {
          type: 'string',
          name: 'weight',
          label: 'Weight',
          options: [
            { value: '100', label: '100 — Thin' },
            { value: '200', label: '200 — ExtraLight' },
            { value: '300', label: '300 — Light' },
            { value: '400', label: '400 — Regular' },
            { value: '500', label: '500 — Medium' },
            { value: '600', label: '600 — SemiBold' },
            { value: '700', label: '700 — Bold' },
            { value: '800', label: '800 — ExtraBold' },
            { value: '900', label: '900 — Black' },
          ],
        },
        {
          type: 'string',
          name: 'style',
          label: 'Style',
          options: [
            { value: 'normal', label: 'Normal' },
            { value: 'italic', label: 'Italic' },
          ],
        },
        { type: 'number', name: 'width', label: 'Width % (75–125)' },
        { type: 'boolean', name: 'lineBreakAfter', label: 'Line break after' },
      ],
    },
    { type: 'datetime', name: 'date', label: 'Date' },
    { type: 'string', name: 'tags', label: 'Tags', list: true },
    { type: 'number', name: 'visualsCount', label: 'Visuals Count' },
    { type: 'string', name: 'readingType', label: 'Reading Type' },
    { type: 'image', name: 'heroImage', label: 'Hero Image' },
    {
      type: 'object',
      name: 'blocks',
      label: 'Writing Blocks',
      list: true,
      ui: { visualSelector: true },
      templates: [headerBlock, twoColumnTextBlock, videoBlock, imageBlock, spaceBlock],
    },
  ],
};

export default Writing;
```

- [ ] **Step 2: Verify typecheck passes**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors (Tina types regenerate at dev time, so generated types may lag — ignore `tina/__generated__` errors if dev server is running)

- [ ] **Step 3: Commit**

```bash
git add tina/collection/writing.ts
git commit -m "feat: replace writing body with blocks field"
```

---

### Task 2: Update writing detail client page

**Files:**
- Modify: `app/writings/[slug]/client-page.tsx`

- [ ] **Step 1: Replace client page content**

Replace entire file:

```typescript
'use client';

import { HeaderBlock } from '@/components/blocks/header-block';
import { ImageBlock } from '@/components/blocks/image-block';
import { SpaceBlock } from '@/components/blocks/space-block';
import { TwoColumnTextBlock } from '@/components/blocks/two-column-text-block';
import { VideoBlock } from '@/components/blocks/video-block';
import { ActionButton } from '@/components/shared/action-button';
import { BlurUpImage } from '@/components/shared/blur-up-image';
import { WritingTitle } from '@/components/writings/writing-title';
import type { WritingQuery, WritingQueryVariables } from '@/tina/__generated__/types';
import { useRef } from 'react';
import { useTina } from 'tinacms/dist/react';

type Props = {
  query: string;
  data: WritingQuery;
  variables: WritingQueryVariables;
};

function formatWritingDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const day = d.getUTCDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    const month = d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' }).toUpperCase();
    const year = d.getUTCFullYear();
    return `${day}${suffix} ${month} ${year}`;
  } catch {
    return iso;
  }
}

function blockWrapperClass(width: string, verticalPadding: string) {
  switch (width) {
    case 'full':
      return `w-full ${verticalPadding}`;
    case 'wide':
      return `w-full px-[5svw] md:pl-[10svw] md:pr-[10svw] ${verticalPadding}`;
    case 'narrow':
    default:
      return `w-full px-[5svw] md:pl-[10svw] md:pr-[10svw] md:max-w-[75svw] ${verticalPadding}`;
  }
}

export default function WritingDetailClientPage({ query, data, variables }: Props) {
  const { data: tinaData } = useTina({ query, data, variables });
  const writing = tinaData.writing;
  const articleRef = useRef<HTMLElement>(null);

  const formattedDate = formatWritingDate(writing.date);
  const tagLabels = (writing.tags ?? []).filter((t): t is string => Boolean(t));

  return (
    <article ref={articleRef} className='w-full'>
      <div className='mx-auto max-w-5xl px-4 pb-24 pt-8 md:px-[58px] md:pt-12'>
        {(formattedDate || tagLabels.length > 0) && (
          <p className='mb-6 font-space-grotesk text-[12px] uppercase tracking-[0.14em] text-black/50'>
            {formattedDate && <span>{formattedDate}</span>}
            {formattedDate && tagLabels.length > 0 && <span className='mx-3 text-black/20'>·</span>}
            {tagLabels.length > 0 && <strong className='font-bold tracking-[0.1em] text-black'>{tagLabels.join(' / ')}</strong>}
          </p>
        )}

        <h1 className='mb-8 text-[56px] leading-[1.0] tracking-[-0.02em] text-black sm:text-[72px] md:text-[96px]'>
          <WritingTitle sections={writing.titleSections ?? []} />
        </h1>

        {(writing.visualsCount != null || writing.readingType) && (
          <div className='mb-12 flex items-center gap-5 font-space-grotesk text-[11px] uppercase tracking-[0.14em] text-black/40'>
            {writing.visualsCount != null && (
              <span className='flex items-center gap-1.5'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true'>
                  <rect x='3' y='3' width='18' height='18' rx='2' />
                  <circle cx='8.5' cy='8.5' r='1.5' />
                  <path d='m21 15-5-5L5 21' />
                </svg>
                {writing.visualsCount} VISUALS
              </span>
            )}
            {writing.readingType && (
              <span className='flex items-center gap-1.5'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true'>
                  <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
                  <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' />
                </svg>
                {writing.readingType}
              </span>
            )}
          </div>
        )}
      </div>

      {writing.heroImage && (
        <div className='relative w-full aspect-[16/9] overflow-hidden bg-[var(--surface-grey)]'>
          <BlurUpImage
            src={writing.heroImage}
            alt=''
            fill
            className='object-cover'
            sizes='100vw'
            priority
          />
        </div>
      )}

      {writing.blocks && writing.blocks.length > 0 && (
        <div className='mt-8'>
          {writing.blocks.map((block, i) => {
            switch (block?.__typename) {
              case 'WritingBlocksHeader':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('narrow', 'pb-2 md:py-4')}>
                    <HeaderBlock block={block} />
                  </div>
                );
              case 'WritingBlocksTwoColumnText':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('wide', 'py-4')}>
                    <TwoColumnTextBlock block={block} />
                  </div>
                );
              case 'WritingBlocksVideo':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('wide', 'py-10')}>
                    <VideoBlock block={block} />
                  </div>
                );
              case 'WritingBlocksImage': {
                const b = block as unknown as {
                  __typename: 'WritingBlocksImage';
                  width?: string | null;
                  orientation?: string | null;
                  images?: Array<{ src?: string | null; alt?: string | null } | null> | null;
                };
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass(b.width ?? 'narrow', 'py-4')}>
                    <ImageBlock block={b} />
                  </div>
                );
              }
              case 'WritingBlocksSpace': {
                const b = block as unknown as {
                  __typename: 'WritingBlocksSpace';
                  desktopSpace?: string | null;
                  mobileSpace?: string | null;
                };
                return <SpaceBlock key={`${block.__typename}-${i}`} block={b} />;
              }
              default:
                return null;
            }
          })}
        </div>
      )}

      <div className='mt-10 flex justify-center px-6 pb-10'>
        <ActionButton
          color='white'
          icon='arrowUpwardAlt'
          label='Back to Top'
          onClick={() => articleRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className='bg-surface-grey'
        />
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Lint file**

```bash
pnpm exec biome check --write app/writings/\[slug\]/client-page.tsx
```

- [ ] **Step 3: Typecheck**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/writings/\[slug\]/client-page.tsx
git commit -m "feat: add blocks and heroImage to writing detail page"
```
