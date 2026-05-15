import type { Template } from 'tinacms';

export const twoColumnTextBlock: Template = {
  name: 'twoColumnText',
  label: 'Two Column Text',
  ui: {
    itemProps: (item) => {
      const count = Array.isArray(item?.annotations) ? item.annotations.length : 0;
      return { label: count > 0 ? `Two Column Text — ${count} ${count === 1 ? 'annotation' : 'annotations'}` : 'Two Column Text' };
    },
  },
  fields: [
    {
      type: 'rich-text',
      name: 'leftColumn',
      label: 'Left Column',
      overrides: { toolbar: ['bold', 'italic', 'raw'] },
    },
    {
      type: 'rich-text',
      name: 'rightColumn',
      label: 'Right Column',
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
