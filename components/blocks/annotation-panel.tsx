"use client";

export type Annotation = {
  id?: string | null;
  text?: string | null;
};

export function AnnotationPanel({
  annotations,
}: {
  annotations: Annotation[];
}) {
  return (
    <div>
      {annotations.map((a, i) => (
        <div key={a.id ?? i} className="w-60">
          <hr className="border-black/25 w-60" />
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
      <hr className="border-black/25 w-60" />
    </div>
  );
}
