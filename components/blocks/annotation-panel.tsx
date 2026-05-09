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
        <div key={a.id ?? i} className="w-[200px]">
          <hr className="border-black/25 w-[200px]" />
          <div className="py-3">
            <span className="font-space-grotesk text-[14px] text-brand-orange">
              [{a.id}]
            </span>
            <p className="font-space-grotesk mt-3 mb-4 text-[10px] text-black leading-6">
              {a.text}
            </p>
          </div>
        </div>
      ))}
      <hr className="border-black/25" />
    </div>
  );
}
