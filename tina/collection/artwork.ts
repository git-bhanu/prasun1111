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
