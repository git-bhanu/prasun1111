import type { Template } from 'tinacms';

export const spaceBlock: Template = {
  name: 'space',
  label: 'Space',
  ui: {
    itemProps: (item) => {
      const d = item?.desktopSpace && item.desktopSpace !== 'none' ? `${item.desktopSpace}px` : 'none';
      const m = item?.mobileSpace && item.mobileSpace !== 'none' ? `${item.mobileSpace}px` : 'none';
      return { label: `Space — Desktop: ${d} / Mobile: ${m}` };
    },
  },
  fields: [
    {
      type: 'string',
      name: 'desktopSpace',
      label: 'Desktop Space',
      options: [
        { label: 'None', value: 'none' },
        { label: '16px', value: '16' },
        { label: '24px', value: '24' },
        { label: '32px', value: '32' },
        { label: '48px', value: '48' },
      ],
      ui: { defaultValue: 'none' },
    },
    {
      type: 'string',
      name: 'mobileSpace',
      label: 'Mobile Space',
      options: [
        { label: 'None', value: 'none' },
        { label: '12px', value: '12' },
        { label: '16px', value: '16' },
        { label: '24px', value: '24' },
        { label: '32px', value: '32' },
      ],
      ui: { defaultValue: 'none' },
    },
  ],
};
