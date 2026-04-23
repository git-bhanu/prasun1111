import type { Collection } from 'tinacms';

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
  ],
};

export default Page;
