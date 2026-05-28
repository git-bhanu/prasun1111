import type { Collection } from 'tinacms';

const InstallationsPage: Collection = {
  name: 'installationsPage',
  label: 'Installations List Page',
  path: 'content/installations-page',
  format: 'json',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: 'object',
      name: 'quoteBreaks',
      label: 'Quote Breaks',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.afterAll ? 'After all installations' : `After installation #${item?.afterPosition ?? '?'}`,
        }),
        defaultItem: {
          afterPosition: 2,
          afterAll: false,
        },
      },
      fields: [
        {
          type: 'boolean',
          name: 'afterAll',
          label: 'After All Installations',
          description: 'When enabled, this quote appears after the full listing (ignores After Position).',
        },
        {
          type: 'number',
          name: 'afterPosition',
          label: 'After Position',
          description: 'Insert after the Nth installation (1-indexed). Ignored when "After All Installations" is on.',
        },
        {
          type: 'rich-text',
          name: 'leftText',
          label: 'Left Column',
        },
        {
          type: 'rich-text',
          name: 'rightText',
          label: 'Right Column',
        },
        {
          type: 'rich-text',
          name: 'rightTextFootnote',
          label: 'Right Column Footnote',
          description: 'Rendered smaller + uppercase below right column.',
        },
      ],
    },
  ],
};

export default InstallationsPage;
