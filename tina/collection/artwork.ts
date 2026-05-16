import type { Collection } from 'tinacms';
import { headerBlock } from '../blocks/header-block';
import { imageBlock } from '../blocks/image-block';
import { spaceBlock } from '../blocks/space-block';
import { twoColumnTextBlock } from '../blocks/two-column-text-block';
import { videoBlock } from '../blocks/video-block';

const Artwork: Collection = {
  name: 'artwork',
  label: 'Artworks',
  path: 'content/artworks',
  format: 'json',
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      required: true,
      isTitle: true,
    },
    {
      type: 'number',
      name: 'sortOrder',
      label: 'Sort Order',
      description: 'Lower numbers appear first. Leave blank to sort to end.',
    },
    {
      type: 'string',
      name: 'slug',
      label: 'URL Slug',
      description: 'Lowercase, hyphens only. Set manually when title has non-Latin characters.',
    },
    {
      type: 'image',
      name: 'coverImage',
      label: 'Cover Image',
    },
    {
      type: 'string',
      name: 'coverImageAlt',
      label: 'Cover Image Alt Text',
    },
    {
      type: 'image',
      name: 'bentoImage',
      label: 'Bento Cover Image',
      description: 'Optional. Overrides Cover Image in the artworks grid.',
    },
    {
      type: 'string',
      name: 'bentoImageAlt',
      label: 'Bento Cover Image Alt Text',
    },
    {
      type: 'string',
      name: 'displaySize',
      label: 'Display Size',
      options: [
        { label: 'Hero (full width, 16:9)', value: 'hero' },
        { label: 'Large (half width, 3:4)', value: 'large' },
        { label: 'Medium (third width, 4:3)', value: 'medium' },
        { label: 'Small (quarter width, 1:1)', value: 'small' },
      ],
    },
    {
      type: 'string',
      name: 'orientation',
      label: 'Image Orientation',
      description: 'Override the default aspect ratio for this display size.',
      options: [
        { label: 'Landscape (4:3)', value: 'landscape' },
        { label: 'Portrait (3:4)', value: 'portrait' },
      ],
    },
    {
      type: 'boolean',
      name: 'mostViewed',
      label: 'Most Viewed',
    },
    {
      type: 'boolean',
      name: 'printsAvailable',
      label: 'Prints Available',
    },
    {
      type: 'object',
      name: 'tags',
      label: 'Tags',
      list: true,
      ui: {
        itemProps: (item) => {
          if (item?.tag) {
            const name =
              (item.tag as string)
                .split('/')
                .pop()
                ?.replace(/\.json$/, '') ?? 'Tag';
            return { label: name };
          }
          return { label: 'Select Tag Item' };
        },
      },
      fields: [
        {
          type: 'reference',
          name: 'tag',
          label: 'Tag',
          collections: ['tag'],
        },
      ],
    },
    {
      type: 'object',
      name: 'blocks',
      label: 'Artwork Blocks',
      list: true,
      ui: { visualSelector: true },
      templates: [headerBlock, twoColumnTextBlock, videoBlock, imageBlock, spaceBlock],
    },
  ],
};

export default Artwork;
