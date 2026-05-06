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
  label: 'Featured Work Slider',
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
          title: 'RAMA / FROM AYODHA TO LANKA',
          backgroundType: 'image',
          tags: ['ILLUSTRATION', 'MYTHOLOGY', 'PRINTS AVAILABLE'],
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
          label: 'Tags',
          name: 'tags',
          list: true,
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
          return { label: item?.title || item?.eyebrow || 'Installation slide' };
        },
        defaultItem: {
          eyebrow: 'INSTALLATIONS',
          title: 'REPEAT / BIODIVERSITY OF THE BALANCE',
          medium: 'EPOXY',
          artists: ['PRASUN MAZUMDAR', 'MANAS MATHUR'],
          dimensions: '6.4ft (H) x 5.6ft (W)',
          weight: '32 kg',
          year: '2023',
          backgroundType: 'image',
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
          label: 'Title',
          name: 'title',
          required: true,
        },
        {
          type: 'string',
          label: 'Medium',
          name: 'medium',
        },
        {
          type: 'string',
          label: 'Artists',
          name: 'artists',
          list: true,
        },
        {
          type: 'string',
          label: 'Dimensions',
          name: 'dimensions',
        },
        {
          type: 'string',
          label: 'Weight',
          name: 'weight',
        },
        {
          type: 'string',
          label: 'Year',
          name: 'year',
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
      templates: [heroStatementBlock, artistIntroBlock, featuredWorkSliderBlock, featuredSliderBlock, installationSliderBlock, movieListBlock],
    },
  ],
};

export default Page;
