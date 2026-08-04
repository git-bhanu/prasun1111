'use client';

import { BlurUpImage } from '@/components/shared/blur-up-image';
import { tinaField } from 'tinacms/dist/react';
import { type Components, TinaMarkdown } from 'tinacms/dist/rich-text';

import { Icon } from '@/components/icons';
import { ActionButton } from '@/components/shared/action-button';
import type { PageBlocksArtistIntro } from '@/tina/__generated__/types';

type ArtistIntroBlockProps = {
  block: PageBlocksArtistIntro;
};

type ArtistIntroSocialLink = NonNullable<NonNullable<PageBlocksArtistIntro['socialLinks']>[number]>;

const statementComponents: Components<{}> = {
  p: (props) => <span className='block'>{props?.children}</span>,
  break: () => <br />,
  italic: (props) => <em className='italic'>{props?.children}</em>,
};

export function ArtistIntroBlock({ block }: ArtistIntroBlockProps) {
  const socialLinks = block.socialLinks?.filter((link): link is ArtistIntroSocialLink => Boolean(link?.label)) ?? [];

  if (!block.statement) {
    return null;
  }

  return (
    <section className='w-full bg-black text-white md:flex md:aspect-[1920/545] md:items-stretch'>
      <Portrait block={block} />

      <div className='flex h-full flex-col justify-center gap-10 px-4 py-9 md:w-1/2 md:shrink-0 md:gap-12 md:px-16 md:py-0'>
        {socialLinks.length ? <SocialLinks links={socialLinks} /> : null}

        <h2 className='font-sedan text-[20px] leading-[1.20] text-white md:text-[28px]' data-tina-field={tinaField(block, 'statement')}>
          <TinaMarkdown content={block.statement} components={statementComponents} />
        </h2>

        <div className='md:w-fit'>
          <ActionButton color='white' icon='articlePerson' label={block.buttonLabel} href={block.buttonHref} dataTinaField={tinaField(block, 'buttonLabel')} />
        </div>
      </div>
    </section>
  );
}

function Portrait({ block }: ArtistIntroBlockProps) {
  return (
    <div className='relative h-[272px] w-full overflow-hidden bg-neutral-900 md:h-full md:w-1/2' data-tina-field={tinaField(block, 'image')}>
      {block.image ? (
        <BlurUpImage
          src={block.image}
          alt={block.imageAlt || block.nameLabel || ''}
          fill
          sizes='(min-width: 768px) 580px, calc(100vw - 72px)'
          className='object-cover grayscale'
        />
      ) : null}

      <div className='absolute inset-x-4 bottom-4 flex items-end justify-between gap-6 font-space-grotesk text-[12px] font-bold uppercase leading-none text-white md:inset-x-4 md:bottom-4'>
        {block.nameLabel ? <p data-tina-field={tinaField(block, 'nameLabel')}>{block.nameLabel}</p> : null}
        {block.roleLabel ? (
          <p className='text-right font-normal' data-tina-field={tinaField(block, 'roleLabel')}>
            {block.roleLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function SocialLinks({ links }: { links: ArtistIntroSocialLink[] }) {
  return (
    <div className='flex flex-wrap gap-x-5 gap-y-4 font-space-grotesk text-[14px] uppercase leading-none md:gap-x-5 md:gap-y-3'>
      {links.map((link, index) => {
        const content = (
          <>
            <span>{link.label}</span>
            <Icon name='arrowOutward' size={16} color='currentColor' aria-hidden='true' />
          </>
        );

        if (link.href) {
          return (
            <a
              key={`${link.label}-${index}`}
              href={link.href}
              className='inline-flex items-center gap-2 text-white transition-opacity hover:opacity-70'
              data-tina-field={tinaField(link, 'label')}
              target='_blank'
            >
              {content}
            </a>
          );
        }

        return (
          <span key={`${link.label}-${index}`} className='inline-flex items-center gap-2 text-white' data-tina-field={tinaField(link, 'label')}>
            {content}
          </span>
        );
      })}
    </div>
  );
}
