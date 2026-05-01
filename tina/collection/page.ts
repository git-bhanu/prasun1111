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
      templates: [heroStatementBlock],
    },
  ],
};

export default Page;
