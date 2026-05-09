import type { Collection } from 'tinacms';
import { HexColorInput } from '../fields/hex-color';

const Tag: Collection = {
  name: 'tag',
  label: 'Tags',
  path: 'content/tags',
  format: 'json',
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      required: true,
      isTitle: true,
    },
    {
      type: 'string',
      name: 'color',
      label: 'Color',
      ui: { component: HexColorInput as any },
    },
  ],
};

export default Tag;
