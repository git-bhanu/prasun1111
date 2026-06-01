import type { Collection } from 'tinacms';
import { seoField } from '../fields/seo';
import { headerBlock } from '../blocks/header-block';
import { imageBlock } from '../blocks/image-block';
import { spaceBlock } from '../blocks/space-block';
import { twoColumnTextBlock } from '../blocks/two-column-text-block';
import { videoBlock } from '../blocks/video-block';

const Film: Collection = {
  name: 'film',
  label: 'Films',
  path: 'content/films',
  format: 'json',
  fields: [
    {
      type: 'rich-text',
      name: 'title',
      label: 'Title',
      overrides: { toolbar: ['bold', 'italic'] },
    },
    {
      type: 'number',
      name: 'sortOrder',
      label: 'Sort Order',
      description: 'Lower numbers appear first.',
    },
    {
      type: 'string',
      name: 'slug',
      label: 'URL Slug',
      description: 'Lowercase, hyphens only.',
    },
    {
      type: 'rich-text',
      name: 'tagline',
      label: 'Tagline',
      overrides: { toolbar: ['bold', 'italic'] },
    },
    {
      type: 'rich-text',
      name: 'synopsis',
      label: 'Synopsis',
      overrides: { toolbar: ['bold', 'italic'] },
    },
    {
      type: 'object',
      name: 'awards',
      label: 'Awards',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.alt || 'Award' }),
      },
      fields: [
        { type: 'image', name: 'image', label: 'Award Image' },
        { type: 'string', name: 'alt', label: 'Alt Text' },
      ],
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
      name: 'heroImage',
      label: 'Film Poster',
    },
    {
      type: 'image',
      name: 'heroVideo',
      label: 'Film Video (Cloudinary)',
      description: 'Select a Cloudinary video asset.',
    },
    {
      type: 'string',
      name: 'youtubeUrl',
      label: 'YouTube URL (embed + watch button)',
      description: 'Paste a YouTube URL to embed in the header video player.',
    },
    {
      type: 'string',
      name: 'medium',
      label: 'Medium',
    },
    {
      type: 'string',
      name: 'storyDirection',
      label: 'Story & Direction',
    },
    {
      type: 'string',
      name: 'resolution',
      label: 'Resolution',
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
      type: 'object',
      name: 'blocks',
      label: 'Film Blocks',
      list: true,
      ui: { visualSelector: true },
      templates: [headerBlock, twoColumnTextBlock, videoBlock, imageBlock, spaceBlock],
    },
    seoField,
  ],
};

export default Film;
