import type { Template } from 'tinacms';

export const headerH2Block: Template = {
  name: 'headerH2',
  label: 'Header H2',
  fields: [
    {
      type: 'string',
      name: 'width',
      label: 'Width',
      options: [
        { label: 'Content', value: 'content' },
        { label: 'Full', value: 'full' },
      ],
    },
    {
      type: 'rich-text',
      name: 'heading',
      label: 'Heading',
      overrides: { toolbar: ['bold', 'italic', 'raw'] },
    },
    {
      type: 'object',
      name: 'annotations',
      label: 'Annotations',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.id ? `[${item.id}]` : 'Annotation' }),
      },
      fields: [
        { type: 'string', name: 'id', label: 'ID (e.g. 01)' },
        { type: 'string', name: 'text', label: 'Annotation Text', ui: { component: 'textarea' } },
      ],
    },
  ],
};
