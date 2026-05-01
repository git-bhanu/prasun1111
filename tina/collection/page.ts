import type { Collection, Template } from 'tinacms';

const heroStatementBlock: Template = {
  name: 'heroStatement',
  label: 'Hero Statement',
  fields: [
    {
      type: 'string',
      label: 'Eyebrow',
      name: 'eyebrow',
    },
    {
      type: 'rich-text',
      label: 'Statement',
      name: 'statement',
      description: 'Use Shift+Enter for line breaks. For underline, use Raw Markdown and wrap text in <u>...</u>.',
      required: true,
      overrides: {
        toolbar: ['bold', 'italic', 'raw'],
      },
    },
  ],
};

const featuredWorkSliderBlock: Template = {
  name: 'featuredWorkSlider',
  label: 'Featured Work Slider',
  fields: [
    {
      type: 'object',
      label: 'Slides',
      name: 'slides',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.title || item?.eyebrow || 'Featured slide' };
        },
        defaultItem: {
          eyebrow: 'ARTWORKS',
          title: 'RAMA / FROM AYODHA TO LANKA',
          backgroundType: 'image',
          tags: ['ILLUSTRATION', 'MYTHOLOGY', 'PRINTS AVAILABLE'],
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Eyebrow',
          name: 'eyebrow',
        },
        {
          type: 'string',
          label: 'Title',
          name: 'title',
          required: true,
        },
        {
          type: 'string',
          label: 'Link',
          name: 'href',
        },
        {
          type: 'string',
          label: 'Tags',
          name: 'tags',
          list: true,
        },
        {
          type: 'string',
          label: 'Background Type',
          name: 'backgroundType',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          type: 'image',
          label: 'Image',
          name: 'image',
        },
        {
          type: 'string',
          label: 'Image Alt Text',
          name: 'imageAlt',
        },
        {
          type: 'image',
          label: 'Video',
          name: 'videoUrl',
          description: 'Select a Cloudinary video or local public video file.',
        },
        {
          type: 'image',
          label: 'Video Poster',
          name: 'videoPoster',
          description: 'Fallback image shown before the video loads.',
        },
      ],
    },
  ],
};

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const filepath = document._sys.breadcrumbs.join('/');

      if (filepath === 'home') {
        return '/';
      }

      return `/${filepath}`;
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      isTitle: true,
      required: true,
    },
    {
      type: 'rich-text',
      label: 'Body',
      name: 'body',
      isBody: true,
    },
    {
      type: 'object',
      label: 'Page Blocks',
      name: 'blocks',
      list: true,
      ui: {
        visualSelector: true,
      },
      templates: [heroStatementBlock, featuredWorkSliderBlock],
    },
  ],
};

export default Page;
