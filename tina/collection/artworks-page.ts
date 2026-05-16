import type { Collection } from 'tinacms';

const ArtworksPage: Collection = {
  name: 'artworksPage',
  label: 'Artworks List Page',
  path: 'content/artworks-page',
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
          label: `After artwork #${item?.afterPosition ?? '?'}`,
        }),
        defaultItem: {
          afterPosition: 5,
          leftText: '',
          rightText: '',
          rightTextFootnote: '',
        },
      },
      fields: [
        {
          type: 'number',
          name: 'afterPosition',
          label: 'After Position',
          description: 'Insert after the Nth artwork in the filtered list (1-indexed)',
          required: true,
        },
        {
          type: 'string',
          name: 'leftText',
          label: 'Left Column Text',
          ui: { component: 'textarea' },
        },
        {
          type: 'string',
          name: 'rightText',
          label: 'Right Column Text',
          ui: { component: 'textarea' },
        },
        {
          type: 'string',
          name: 'rightTextFootnote',
          label: 'Right Column Footnote (uppercase small text)',
          ui: { component: 'textarea' },
        },
      ],
    },
  ],
};

export default ArtworksPage;
