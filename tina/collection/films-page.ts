import type { Collection } from 'tinacms';
import { seoField } from '../fields/seo';

const FilmsPage: Collection = {
  name: 'filmsPage',
  label: 'Films Page',
  path: 'content/films-page',
  format: 'json',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: 'reference',
      name: 'featuredFilm',
      label: 'Featured Film',
      collections: ['film'],
    },
    seoField,
  ],
};

export default FilmsPage;
