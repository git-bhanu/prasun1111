import { BlurUpImage } from '@/components/shared/blur-up-image';

type ImageItem = {
  src?: string | null;
  alt?: string | null;
};

type Props = {
  block: {
    orientation?: string | null;
    images?: Array<ImageItem | null> | null;
  };
};

export function ImageBlock({ block }: Props) {
  const images = (block.images ?? []).filter(
    (img): img is ImageItem => img != null && !!img.src,
  );

  if (images.length === 0) return null;

  const aspectClass = block.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-8">
      {images.map((img, i) => (
        <div key={i} className={`relative ${aspectClass} min-w-0 flex-1 overflow-hidden`}>
          <BlurUpImage
            src={img.src!}
            alt={img.alt ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}
