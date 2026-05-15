import type { Template } from 'tinacms';

export const imageBlock: Template = {
  name: 'image',
  label: 'Image',
  fields: [
    {
      type: 'string',
      name: 'width',
      label: 'Width',
      options: [
        { label: 'Narrow (869px)', value: 'narrow' },
        { label: 'Wide (1410px)', value: 'wide' },
        { label: 'Full', value: 'full' },
      ],
    },
    {
      type: 'object',
      name: 'images',
      label: 'Images',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.alt ?? 'Image' }),
      },
      fields: [
        {
          type: 'image',
          name: 'src',
          label: 'Image',
        },
        {
          type: 'string',
          name: 'alt',
          label: 'Alt Text',
        },
      ],
    },
  ],
};
