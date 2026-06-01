import type { Collection } from 'tinacms';
import { seoField } from '../fields/seo';

const DesignPage: Collection = {
  name: 'designPage',
  label: 'Design List Page',
  path: 'content/design-page',
  format: 'json',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [seoField],
};

export default DesignPage;
