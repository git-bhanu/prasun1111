import type { Template } from 'tinacms';

export const videoBlock: Template = {
  name: 'video',
  label: 'Video',
  fields: [
    {
      type: 'image',
      name: 'posterImage',
      label: 'Poster Image (16:9)',
    },
    {
      type: 'string',
      name: 'youtubeUrl',
      label: 'YouTube URL',
    },
    {
      type: 'string',
      name: 'duration',
      label: 'Duration (e.g. 8MIN. 23 SEC.)',
    },
  ],
};
