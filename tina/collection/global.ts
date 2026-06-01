import type { Collection } from 'tinacms';
import { ColorPickerInput } from '../fields/color';
import { iconSchema } from '../fields/icon';

const navigationLinkFields = [
  {
    type: 'string',
    label: 'Index',
    name: 'index',
  },
  {
    type: 'string',
    label: 'Label',
    name: 'label',
    required: true,
  },
  {
    type: 'string',
    label: 'Link',
    name: 'href',
    required: true,
  },
  {
    type: 'string',
    label: 'Group',
    name: 'group',
    required: true,
    options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Utility', value: 'utility' },
    ],
  },
  {
    type: 'boolean',
    label: 'Show in footer',
    name: 'showInFooter',
  },
  {
    type: 'boolean',
    label: 'Locked (triggers coming-soon overlay)',
    name: 'locked',
  },
] as const;

const Global: Collection = {
  label: 'Global',
  name: 'global',
  path: 'content/global',
  format: 'json',
  ui: {
    global: true,
  },
  fields: [
    {
      type: 'boolean',
      label: 'Show Announcement Banner',
      name: 'showAnnouncementBanner',
    },
    {
      type: 'string',
      label: 'Reach Out Href',
      name: 'reachOutHref',
    },
    {
      type: 'object',
      label: 'Brand',
      name: 'brand',
      fields: [
        {
          type: 'image',
          label: 'Logo',
          name: 'logo',
        },
        {
          type: 'string',
          label: 'Logo Alt Text',
          name: 'logoAlt',
        },
        {
          type: 'string',
          label: 'Home Link Label',
          name: 'homeAriaLabel',
        },
      ],
    },
    {
      type: 'object',
      label: 'Navigation',
      name: 'navigation',
      fields: [
        {
          type: 'object',
          label: 'Links',
          name: 'links',
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.label || item?.href };
            },
            defaultItem: {
              index: '01',
              label: 'ARTWORKS',
              href: '/artworks',
              group: 'primary',
              showInFooter: true,
            },
          },
          fields: navigationLinkFields as any,
        },
      ],
    },
    {
      type: 'string',
      label: 'Artist Same-As URLs',
      name: 'sameAs',
      list: true,
      description: 'Social profiles and related URLs for structured data (schema.org sameAs). One URL per entry.',
    },
    {
      type: 'object',
      label: 'Site Meta',
      name: 'siteMeta',
      fields: [
        {
          type: 'string',
          label: 'Established Label',
          name: 'establishedLabel',
        },
        {
          type: 'string',
          label: 'Time Zone',
          name: 'timeZone',
        },
        {
          type: 'string',
          label: 'Time Zone Suffix',
          name: 'timeZoneSuffix',
        },
        {
          type: 'string',
          label: 'Issue Label',
          name: 'issueLabel',
        },
        {
          type: 'string',
          label: 'Location',
          name: 'location',
        },
      ],
    },
    {
      type: 'object',
      label: 'Footer',
      name: 'footer',
      fields: [
        {
          type: 'object',
          label: 'Social Links',
          name: 'social',
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.icon?.name || 'undefined' };
            },
          },
          fields: [
            iconSchema as any,
            {
              type: 'string',
              label: 'Url',
              name: 'url',
            },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Sliders',
      name: 'sliders',
      fields: [
        {
          type: 'number',
          label: 'Autoplay Interval (seconds)',
          name: 'autoplaySeconds',
        },
      ],
    },
    {
      type: 'object',
      label: 'Theme',
      name: 'theme',
      fields: [
        {
          type: 'string',
          label: 'Primary Color',
          name: 'color',
          ui: {
            component: ColorPickerInput as any,
          },
        },
        {
          type: 'string',
          name: 'font',
          label: 'Font Family',
          options: [
            {
              label: 'System Sans',
              value: 'sans',
            },
            {
              label: 'Nunito',
              value: 'nunito',
            },
            {
              label: 'Lato',
              value: 'lato',
            },
          ],
        },
        {
          type: 'string',
          name: 'darkMode',
          label: 'Dark Mode',
          options: [
            {
              label: 'System',
              value: 'system',
            },
            {
              label: 'Light',
              value: 'light',
            },
            {
              label: 'Dark',
              value: 'dark',
            },
          ],
        },
      ],
    },
  ],
};

export default Global;
