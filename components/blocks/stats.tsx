import { PageBlocksStats } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { sectionBlockSchemaField } from '../layout/section';

export const Stats = ({ data }: { data: PageBlocksStats }) => {
  return (
    <Section background={data.background!}>
      <div className='mx-auto max-w-5xl space-y-8 px-6 md:space-y-16'>
        <div className='relative z-10 mx-auto max-w-xl space-y-6 text-center'>
          <h2 className='text-4xl font-medium lg:text-5xl' data-tina-field={tinaField(data, 'title')}>
            {data.title}
          </h2>
          <p data-tina-field={tinaField(data, 'description')}>{data.description}</p>
        </div>

        <div className='grid divide-y *:text-center md:grid-cols-3 md:divide-x md:divide-y-0'>
          {data.stats?.map((stat) => (
            <div key={stat?.type} className='space-y-4 py-4'>
              <div className='text-5xl font-bold' data-tina-field={tinaField(stat, 'stat')}>
                {stat!.stat}
              </div>
              <p data-tina-field={tinaField(stat, 'type')}>{stat!.type}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export const statsBlockSchema: Template = {
  name: 'stats',
  label: 'Stats',
  ui: {
    previewSrc: '/blocks/stats.png',
    defaultItem: {
      title: 'Add a quick credibility section',
      description: 'Use this block for stats, milestones, customer numbers, or product metrics.',
      stats: [
        {
          stat: '120',
          type: 'Customers',
        },
        {
          stat: '3',
          type: 'Core features',
        },
        {
          stat: '24/7',
          type: 'Availability',
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Title',
      name: 'title',
    },
    {
      type: 'string',
      label: 'Description',
      name: 'description',
    },
    {
      type: 'object',
      label: 'Stats',
      name: 'stats',
      list: true,
      ui: {
        defaultItem: {
          stat: '120',
          type: 'Customers',
        },
        itemProps: (item) => {
          return {
            label: `${item.stat} ${item.type}`,
          };
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Stat',
          name: 'stat',
        },
        {
          type: 'string',
          label: 'Type',
          name: 'type',
        },
      ],
    },
  ],
};
