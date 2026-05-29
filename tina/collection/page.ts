import type { Collection, Template } from 'tinacms';

const heroStatementBlock: Template = {
  name: 'heroStatement',
  label: 'Hero Statement',
  fields: [
    {
      type: 'string',
      label: 'Eyebrow',
      name: 'eyebrow',
    },
    {
      type: 'rich-text',
      label: 'Statement',
      name: 'statement',
      description: 'Use Shift+Enter for line breaks. For underline, use Raw Markdown and wrap text in <u>...</u>.',
      required: true,
      overrides: {
        toolbar: ['bold', 'italic', 'raw'],
      },
    },
  ],
};

const artistIntroBlock: Template = {
  name: 'artistIntro',
  label: 'Artist Intro',
  fields: [
    {
      type: 'image',
      label: 'Portrait Image',
      name: 'image',
      required: true,
    },
    {
      type: 'string',
      label: 'Image Alt Text',
      name: 'imageAlt',
    },
    {
      type: 'string',
      label: 'Name Label',
      name: 'nameLabel',
    },
    {
      type: 'string',
      label: 'Role Label',
      name: 'roleLabel',
    },
    {
      type: 'object',
      label: 'Social Links',
      name: 'socialLinks',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.label || 'Social link' };
        },
      },
      fields: [
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
        },
      ],
    },
    {
      type: 'rich-text',
      label: 'Statement',
      name: 'statement',
      required: true,
      overrides: {
        toolbar: ['italic'],
      },
    },
    {
      type: 'string',
      label: 'Button Label',
      name: 'buttonLabel',
    },
    {
      type: 'string',
      label: 'Button Link',
      name: 'buttonHref',
    },
  ],
};

const featuredWorkSliderBlock: Template = {
  name: 'featuredWorkSlider',
  label: 'Artwork Slider',
  fields: [
    {
      type: 'object',
      label: 'Slides',
      name: 'slides',
      list: true,
      ui: {
        itemProps: (item) => {
          const artworkLabel = item?.artwork
            ? (item.artwork as string).split('/').pop()?.replace(/\.json$/, '') ?? 'Slide'
            : null;
          return { label: artworkLabel || item?.eyebrow || 'Featured slide' };
        },
        defaultItem: {
          eyebrow: 'ARTWORKS',
          backgroundType: 'image',
        },
      },
      fields: [
        {
          type: 'reference',
          label: 'Artwork',
          name: 'artwork',
          collections: ['artwork'],
        },
        {
          type: 'string',
          label: 'Background Type',
          name: 'backgroundType',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          type: 'image',
          label: 'Image',
          name: 'image',
        },
        {
          type: 'string',
          label: 'Image Alt Text',
          name: 'imageAlt',
        },
        {
          type: 'image',
          label: 'Video',
          name: 'videoUrl',
          description: 'Select a Cloudinary video or local public video file.',
        },
        {
          type: 'image',
          label: 'Video Poster',
          name: 'videoPoster',
          description: 'Fallback image shown before the video loads.',
        },
      ],
    },
  ],
};

const featuredSliderBlock: Template = {
  name: 'featuredSlider',
  label: 'Featured Slider',
  fields: [
    {
      type: 'object',
      label: 'Slides',
      name: 'slides',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.title || item?.eyebrow || 'Featured slide' };
        },
        defaultItem: {
          eyebrow: 'ARTWORKS',
          title: 'The eye belongs to the tiger',
          desktopAssetType: 'image',
          mobileAssetType: 'image',
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Eyebrow',
          name: 'eyebrow',
        },
        {
          type: 'string',
          label: 'Title',
          name: 'title',
          required: true,
        },
        {
          type: 'string',
          label: 'Link',
          name: 'href',
        },
        {
          type: 'string',
          label: 'Desktop Asset Type',
          name: 'desktopAssetType',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          type: 'image',
          label: 'Desktop Image',
          name: 'desktopImage',
        },
        {
          type: 'string',
          label: 'Desktop Image Alt Text',
          name: 'desktopImageAlt',
        },
        {
          type: 'image',
          label: 'Desktop Video',
          name: 'desktopVideoUrl',
          description: 'Select a Cloudinary video or local public video file.',
        },
        {
          type: 'image',
          label: 'Desktop Video Poster',
          name: 'desktopVideoPoster',
          description: 'Fallback image shown before the video loads.',
        },
        {
          type: 'string',
          label: 'Mobile Asset Type',
          name: 'mobileAssetType',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          type: 'image',
          label: 'Mobile Image',
          name: 'mobileImage',
        },
        {
          type: 'string',
          label: 'Mobile Image Alt Text',
          name: 'mobileImageAlt',
        },
        {
          type: 'image',
          label: 'Mobile Video',
          name: 'mobileVideoUrl',
          description: 'Select a Cloudinary video or local public video file.',
        },
        {
          type: 'image',
          label: 'Mobile Video Poster',
          name: 'mobileVideoPoster',
          description: 'Fallback image shown before the video loads.',
        },
      ],
    },
  ],
};

const installationSliderBlock: Template = {
  name: 'installationSlider',
  label: 'Installation Slider',
  fields: [
    {
      type: 'object',
      label: 'Slides',
      name: 'slides',
      list: true,
      ui: {
        itemProps: (item) => {
          const installationLabel = item?.installation
            ? (item.installation as string).split('/').pop()?.replace(/\.json$/, '') ?? 'Slide'
            : null;
          return { label: installationLabel || item?.eyebrow || 'Installation slide' };
        },
        defaultItem: {
          eyebrow: 'INSTALLATIONS',
          backgroundType: 'image',
        },
      },
      fields: [
        {
          type: 'reference',
          label: 'Installation',
          name: 'installation',
          collections: ['installation'],
        },
        {
          type: 'string',
          label: 'Eyebrow',
          name: 'eyebrow',
        },
        {
          type: 'string',
          label: 'Background Type',
          name: 'backgroundType',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          type: 'image',
          label: 'Image',
          name: 'image',
        },
        {
          type: 'string',
          label: 'Image Alt Text',
          name: 'imageAlt',
        },
        {
          type: 'image',
          label: 'Video',
          name: 'videoUrl',
          description: 'Select a Cloudinary video or local public video file.',
        },
        {
          type: 'image',
          label: 'Video Poster',
          name: 'videoPoster',
          description: 'Fallback image shown before the video loads.',
        },
      ],
    },
  ],
};

const designSliderBlock: Template = {
  name: 'designSlider',
  label: 'Design Slider',
  fields: [
    {
      type: 'string',
      label: 'Eyebrow',
      name: 'eyebrow',
    },
    {
      type: 'string',
      label: 'Eyebrow Index',
      name: 'eyebrowIndex',
    },
    {
      type: 'rich-text',
      label: 'Heading',
      name: 'heading',
      overrides: {
        toolbar: ['bold', 'italic'],
      },
    },
    {
      type: 'string',
      label: 'Button Label',
      name: 'buttonLabel',
    },
    {
      type: 'string',
      label: 'Button Link',
      name: 'buttonHref',
    },
    {
      type: 'object',
      label: 'Design Items',
      name: 'items',
      list: true,
      ui: {
        itemProps: (item) => {
          if (item?.design) {
            const name = (item.design as string).split('/').pop()?.replace(/\.json$/, '') ?? 'Design';
            return { label: name };
          }
          return { label: 'Select Design' };
        },
      },
      fields: [
        {
          type: 'reference',
          label: 'Design',
          name: 'design',
          collections: ['design'],
        },
      ],
    },
  ],
};

const contactBlock: Template = {
  name: 'contact',
  label: 'Contact',
  fields: [
    {
      type: 'rich-text',
      label: 'Heading',
      name: 'heading',
      overrides: {
        toolbar: ['italic'],
      },
    },
    {
      type: 'rich-text',
      label: 'Description',
      name: 'body',
      overrides: {
        toolbar: ['bold', 'italic'],
      },
    },
    {
      type: 'string',
      label: 'Reach Out Button Label',
      name: 'reachOutLabel',
    },
    {
      type: 'string',
      label: 'Reach Out Button Link',
      name: 'reachOutHref',
    },
    {
      type: 'string',
      label: 'Mail Button Label',
      name: 'mailLabel',
    },
    {
      type: 'string',
      label: 'Mail Button Link',
      name: 'mailHref',
    },
    {
      type: 'object',
      label: 'Venture Cards',
      name: 'ventures',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title || 'Venture' }),
      },
      fields: [
        {
          type: 'image',
          label: 'Logo',
          name: 'logo',
        },
        {
          type: 'string',
          label: 'Era (e.g. 2010-PRESENT)',
          name: 'era',
        },
        {
          type: 'string',
          label: 'Title',
          name: 'title',
        },
        {
          type: 'string',
          label: 'Website Label',
          name: 'websiteLabel',
        },
        {
          type: 'string',
          label: 'Link',
          name: 'href',
        },
        {
          type: 'string',
          label: 'Hover Background Color',
          name: 'hoverColor',
          description: 'Background color of the card on hover. e.g. #f5e6d0',
          ui: { component: 'color' },
        },
      ],
    },
    {
      type: 'object',
      label: 'Social Links',
      name: 'socialLinks',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.platform || 'Social link' }),
      },
      fields: [
        {
          type: 'string',
          label: 'Platform',
          name: 'platform',
          options: [
            { label: 'Gmail', value: 'gmail' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          type: 'string',
          label: 'Link',
          name: 'href',
        },
        {
          type: 'string',
          label: 'Icon Hover Color',
          name: 'hoverColor',
          description: 'Color the icon changes to on hover. Defaults to the platform brand color.',
          ui: { component: 'color' },
        },
      ],
    },
  ],
};

const aboutHeroBlock: Template = {
  name: 'aboutHero',
  label: 'About Hero',
  fields: [
    {
      type: 'string',
      label: 'Eyebrow',
      name: 'eyebrow',
    },
    {
      type: 'rich-text',
      label: 'Statement',
      name: 'statement',
      required: true,
      overrides: {
        toolbar: ['italic'],
      },
    },
    {
      type: 'rich-text',
      label: 'Body',
      name: 'body',
      overrides: {
        toolbar: ['bold', 'italic'],
      },
    },
  ],
};

const mediaBlock: Template = {
  name: 'media',
  label: 'Media',
  fields: [
    {
      type: 'image',
      label: 'Image',
      name: 'image',
      required: true,
    },
    {
      type: 'string',
      label: 'Alt Text',
      name: 'alt',
    },
    {
      type: 'string',
      label: 'Size',
      name: 'size',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Contained', value: 'contained' },
      ],
    },
  ],
};

const cvBioBlock: Template = {
  name: 'cvBio',
  label: 'CV + Bio',
  fields: [
    {
      type: 'object',
      label: 'CV Entries',
      name: 'entries',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.organization || 'Entry' }),
      },
      fields: [
        {
          type: 'string',
          label: 'Organization',
          name: 'organization',
        },
        {
          type: 'string',
          label: 'Role',
          name: 'role',
        },
        {
          type: 'string',
          label: 'Period',
          name: 'period',
        },
      ],
    },
    {
      type: 'rich-text',
      label: 'Body',
      name: 'body',
      overrides: {
        toolbar: ['bold', 'italic'],
      },
    },
  ],
};

const statementCtaBlock: Template = {
  name: 'statementCta',
  label: 'Statement + CTA',
  fields: [
    {
      type: 'rich-text',
      label: 'Statement',
      name: 'statement',
      required: true,
      overrides: {
        toolbar: ['bold', 'italic'],
      },
    },
    {
      type: 'string',
      label: 'Primary Button Label',
      name: 'primaryLabel',
    },
    {
      type: 'string',
      label: 'Primary Button Link',
      name: 'primaryHref',
    },
    {
      type: 'string',
      label: 'Secondary Button Label',
      name: 'secondaryLabel',
    },
    {
      type: 'string',
      label: 'Secondary Button Link',
      name: 'secondaryHref',
    },
  ],
};

const shopBlock: Template = {
  name: 'shop',
  label: 'Shop',
  fields: [
    {
      type: 'string',
      label: 'Eyebrow',
      name: 'eyebrow',
    },
    {
      type: 'string',
      label: 'Eyebrow Index',
      name: 'eyebrowIndex',
    },
    {
      type: 'rich-text',
      label: 'Heading',
      name: 'heading',
      overrides: {
        toolbar: ['bold', 'italic'],
      },
    },
    {
      type: 'string',
      label: 'Description',
      name: 'description',
    },
    {
      type: 'string',
      label: 'Button Label',
      name: 'buttonLabel',
    },
    {
      type: 'string',
      label: 'Button Link',
      name: 'buttonHref',
    },
    {
      type: 'object',
      label: 'Products',
      name: 'items',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.imageAlt || 'Product' };
        },
      },
      fields: [
        {
          type: 'image',
          label: 'Image',
          name: 'image',
          required: true,
        },
        {
          type: 'string',
          label: 'Image Alt Text',
          name: 'imageAlt',
        },
        {
          type: 'string',
          label: 'Link',
          name: 'href',
        },
      ],
    },
  ],
};

const movieListBlock: Template = {
  name: 'movieList',
  label: 'Movie List',
  fields: [
    {
      type: 'object',
      label: 'Movies',
      name: 'movies',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.title || item?.eyebrow || 'Movie' };
        },
        defaultItem: {
          eyebrow: 'FILMS',
          eyebrowIndex: '03',
          title: 'CROW: The movie / Life',
          italicTitle: 'always',
          titleSuffix: 'finds its way.',
          desktopImage: 'https://res.cloudinary.com/dkxfwnlbz/image/upload/v1778094048/crow-film_yx48ho.jpg',
          readMoreLabel: 'READ MORE',
          watchFilmLabel: 'WATCH FILM',
          filmDuration: '8MIN. 23 SEC.',
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Eyebrow',
          name: 'eyebrow',
        },
        {
          type: 'string',
          label: 'Eyebrow Index',
          name: 'eyebrowIndex',
        },
        {
          type: 'string',
          label: 'Title',
          name: 'title',
          required: true,
        },
        {
          type: 'string',
          label: 'Italic Title Text',
          name: 'italicTitle',
        },
        {
          type: 'string',
          label: 'Title Suffix',
          name: 'titleSuffix',
        },
        {
          type: 'image',
          label: 'Desktop Image',
          name: 'desktopImage',
          required: true,
        },
        {
          type: 'string',
          label: 'Desktop Image Alt Text',
          name: 'desktopImageAlt',
        },
        {
          type: 'image',
          label: 'Mobile Image',
          name: 'mobileImage',
        },
        {
          type: 'string',
          label: 'Mobile Image Alt Text',
          name: 'mobileImageAlt',
        },
        {
          type: 'string',
          label: 'Read More Label',
          name: 'readMoreLabel',
        },
        {
          type: 'string',
          label: 'Read More Link',
          name: 'readMoreHref',
        },
        {
          type: 'string',
          label: 'Watch Film Label',
          name: 'watchFilmLabel',
        },
        {
          type: 'string',
          label: 'Watch Film Link',
          name: 'watchFilmHref',
        },
        {
          type: 'string',
          label: 'Film Duration',
          name: 'filmDuration',
        },
      ],
    },
  ],
};

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const filepath = document._sys.breadcrumbs.join('/');

      if (filepath === 'home') {
        return '/';
      }

      return `/${filepath}`;
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      isTitle: true,
      required: true,
    },
    {
      type: 'rich-text',
      label: 'Body',
      name: 'body',
      isBody: true,
    },
    {
      type: 'object',
      label: 'Page Blocks',
      name: 'blocks',
      list: true,
      ui: {
        visualSelector: true,
      },
      templates: [heroStatementBlock, artistIntroBlock, featuredWorkSliderBlock, featuredSliderBlock, installationSliderBlock, movieListBlock, designSliderBlock, shopBlock, contactBlock, aboutHeroBlock, mediaBlock, cvBioBlock, statementCtaBlock],
    },
  ],
};

export default Page;
