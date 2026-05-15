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
      type: 'string',
      name: 'orientation',
      label: 'Orientation',
      options: [
        { label: 'Landscape (16:9)', value: 'landscape' },
        { label: 'Portrait (9:16)', value: 'portrait' },
      ],
      ui: { defaultValue: 'landscape' },
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
