import type { Collection } from 'tinacms';
import { headerBlock } from '../blocks/header-block';
import { imageBlock } from '../blocks/image-block';
import { spaceBlock } from '../blocks/space-block';
import { twoColumnTextBlock } from '../blocks/two-column-text-block';
import { videoBlock } from '../blocks/video-block';
import { HexColorInput } from '../fields/hex-color';
import { seoField } from '../fields/seo';

const Design: Collection = {
  name: 'design',
  label: 'Design',
  path: 'content/design',
  format: 'json',
  fields: [
    {
      type: 'rich-text',
      name: 'title',
      label: 'Title',
      required: true,
      overrides: { toolbar: ['bold', 'italic'] },
    },
    {
      type: 'number',
      name: 'sortOrder',
      label: 'Sort Order',
      description: 'Lower numbers appear first. Leave blank to sort to end.',
    },
    {
      type: 'boolean',
      name: 'archived',
      label: 'Archived',
      description: 'Hides this item from the site when enabled.',
    },
    {
      type: 'string',
      name: 'slug',
      label: 'URL Slug',
      description: 'Lowercase, hyphens only. Set manually when title has non-Latin characters.',
    },
    {
      type: 'image',
      name: 'image',
      label: 'Image',
    },
    {
      type: 'string',
      name: 'imageAlt',
      label: 'Image Alt Text',
    },
    {
      type: 'image',
      name: 'cardImage',
      label: 'Card Image',
      description: 'Optional. Overrides Image in the listing grid.',
    },
    {
      type: 'string',
      name: 'cardImageAlt',
      label: 'Card Image Alt Text',
    },
    {
      type: 'datetime',
      name: 'date',
      label: 'Date',
      ui: {
        dateFormat: 'DD MMMM YYYY',
      },
    },
    {
      type: 'reference',
      name: 'category',
      label: 'Category',
      collections: ['tag'],
    },
    {
      type: 'string',
      name: 'designType',
      label: 'Design Type',
      options: [
        { label: 'By Doing', value: 'byDoing' },
        { label: 'By Knowing', value: 'byKnowing' },
      ],
    },
    {
      type: 'rich-text',
      name: 'description',
      label: 'Description',
    },
    {
      type: 'string',
      name: 'accentColor',
      label: 'Accent Color',
      ui: { component: HexColorInput as any },
    },
    {
      type: 'object',
      name: 'blocks',
      label: 'Design Blocks',
      list: true,
      ui: { visualSelector: true },
      templates: [headerBlock, twoColumnTextBlock, videoBlock, imageBlock, spaceBlock],
    },
    seoField,
  ],
};

export default Design;
