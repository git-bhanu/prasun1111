"use client";

import type { ReactNode } from "react";

export type Annotation = {
  id?: string | null;
  text?: string | null;
};

export function AnnotatedLayout({
  children,
  annotations,
  className,
}: {
  children: ReactNode;
  annotations: Annotation[];
  className?: string;
}) {
  return (
    <section className={`w-full align-top flex flex-col md:flex-row gap-[10svw] ${className ?? ''}`}>
      <div className="md:w-[55svw]">{children}</div>
      {annotations.length > 0 ? (
        <div className="flex md:justify-end">
          <AnnotationPanel annotations={annotations} />
        </div>
      ) : null}
    </section>
  );
}

export function AnnotationPanel({
  annotations,
}: {
  annotations: Annotation[];
}) {
  return (
    <div className="w-full md:w-60 px-6 md:px-0 pt-4 pb-6">
      {annotations.map((a, i) => (
        <div key={a.id ?? i} className="w-full md:w-60">
          <hr className="border-black/25 w-full md:w-60" />
          <div className="py-6 px-4">
            <span className="font-space-grotesk text-[12px] text-brand-orange">
              [{a.id}]
            </span>
            <p className="font-space-grotesk mt-3 text-[14px] text-black leading-normal">
              {a.text}
            </p>
          </div>
        </div>
      ))}
      <hr className="border-black/25 w-full md:w-60" />
    </div>
  );
}
