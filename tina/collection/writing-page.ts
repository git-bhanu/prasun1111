import type { Collection } from 'tinacms';
import { seoField } from '../fields/seo';

const WritingPage: Collection = {
  name: 'writingPage',
  label: 'Writings List Page',
  path: 'content/writing-page',
  format: 'json',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [seoField],
};

export default WritingPage;
