import type { Collection } from 'tinacms';
import { headerBlock } from '../blocks/header-block';
import { imageBlock } from '../blocks/image-block';
import { spaceBlock } from '../blocks/space-block';
import { twoColumnTextBlock } from '../blocks/two-column-text-block';
import { videoBlock } from '../blocks/video-block';

const Installation: Collection = {
  name: 'installation',
  label: 'Installations',
  path: 'content/installations',
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
      type: 'string',
      name: 'backgroundType',
      label: 'Background Type',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
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
      type: 'object',
      name: 'listingImages',
      label: 'Listing Images',
      description: 'Images shown in the listing page slider. Falls back to main image if empty.',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.alt || 'Image' }),
      },
      fields: [
        { type: 'image', name: 'src', label: 'Image' },
        { type: 'string', name: 'alt', label: 'Alt Text' },
      ],
    },
    {
      type: 'image',
      name: 'videoUrl',
      label: 'Video',
      description: 'Select a Cloudinary video or local public video file.',
    },
    {
      type: 'image',
      name: 'videoPoster',
      label: 'Video Poster',
      description: 'Fallback image shown before the video loads.',
    },
    {
      type: 'string',
      name: 'medium',
      label: 'Medium',
    },
    {
      type: 'string',
      name: 'artists',
      label: 'Artists',
      list: true,
    },
    {
      type: 'string',
      name: 'dimensions',
      label: 'Dimensions',
    },
    {
      type: 'string',
      name: 'weight',
      label: 'Weight',
    },
    {
      type: 'string',
      name: 'year',
      label: 'Year',
    },
    {
      type: 'string',
      name: 'watchFilmLabel',
      label: 'Watch Film Label',
    },
    {
      type: 'string',
      name: 'watchFilmHref',
      label: 'Watch Film Link',
    },
    {
      type: 'string',
      name: 'filmDuration',
      label: 'Film Duration',
    },
    {
      type: 'string',
      name: 'readMoreLabel',
      label: 'Read More Label',
    },
    {
      type: 'object',
      name: 'blocks',
      label: 'Installation Blocks',
      list: true,
      ui: { visualSelector: true },
      templates: [headerBlock, twoColumnTextBlock, videoBlock, imageBlock, spaceBlock],
    },
  ],
};

export default Installation;
