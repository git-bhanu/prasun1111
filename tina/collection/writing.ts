import type { Collection } from 'tinacms';
import { headerBlock } from '../blocks/header-block';
import { imageBlock } from '../blocks/image-block';
import { spaceBlock } from '../blocks/space-block';
import { twoColumnTextBlock } from '../blocks/two-column-text-block';
import { videoBlock } from '../blocks/video-block';
import { seoField } from '../fields/seo';

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
    {
      type: 'boolean',
      name: 'archived',
      label: 'Archived',
      description: 'Hides this item from the site when enabled.',
    },
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
    seoField,
  ],
};

export default Writing;
