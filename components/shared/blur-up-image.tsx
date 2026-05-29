"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

function cloudinaryBlurUrl(src: string): string {
  return src.replace("/upload/", "/upload/w_30,e_blur:800,q_20/");
}

type BlurUpImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  "data-tina-field"?: string;
};

export function BlurUpImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className,
  priority,
  "data-tina-field": dataTinaField,
}: BlurUpImageProps) {
  const [loaded, setLoaded] = useState(false);

  if (fill) {
    const blurSrc = cloudinaryBlurUrl(src);
    return (
      <>
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${blurSrc})`,
            filter: "blur(12px)",
            opacity: loaded ? 0 : 1,
          }}
        />
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "100vw"}
          className={cn(className, "transition-opacity duration-700", loaded ? "opacity-100" : "opacity-0")}
          priority={priority}
          data-tina-field={dataTinaField}
          onLoad={() => setLoaded(true)}
        />
      </>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(className, "transition-[filter,opacity] duration-700")}
      style={{ filter: loaded ? "blur(0px)" : "blur(10px)", opacity: loaded ? 1 : 0 }}
      priority={priority}
      data-tina-field={dataTinaField}
      onLoad={() => setLoaded(true)}
    />
  );
}
