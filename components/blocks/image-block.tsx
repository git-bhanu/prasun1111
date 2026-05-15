import Image from 'next/image';

type ImageItem = {
  src?: string | null;
  alt?: string | null;
};

type Props = {
  block: {
    images?: Array<ImageItem | null> | null;
  };
};

export function ImageBlock({ block }: Props) {
  const images = (block.images ?? []).filter(
    (img): img is ImageItem => img != null && !!img.src,
  );

  if (images.length === 0) return null;

  return (
    <div className="flex gap-8">
      {images.map((img, i) => (
        <div key={i} className="relative aspect-video min-w-0 flex-1 overflow-hidden">
          <Image
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
