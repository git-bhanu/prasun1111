import type { TinaField } from 'tinacms';

export const seoField: TinaField = {
  type: 'object',
  name: 'seo',
  label: 'SEO',
  fields: [
    {
      type: 'string',
      name: 'metaTitle',
      label: 'Meta Title',
    },
    {
      type: 'string',
      name: 'metaDescription',
      label: 'Meta Description',
      ui: { component: 'textarea' },
    },
    {
      type: 'image',
      name: 'ogImage',
      label: 'OG Image',
    },
  ],
};
