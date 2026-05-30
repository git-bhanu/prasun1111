import { Fragment } from 'react';
import { cn } from '@/lib/utils';

type TitleSection = {
  text?: string | null;
  font?: string | null;
  weight?: string | number | null;
  style?: string | null;
  width?: number | null;
  lineBreakAfter?: boolean | null;
};

type Props = {
  sections: (TitleSection | null)[];
  className?: string;
};

export function WritingTitle({ sections, className }: Props) {
  return (
    <span className={cn('inline', className)}>
      {sections.map((section, i) => {
        if (!section?.text) return null;
        const isMono = section.font === 'mono';
        const weight = Number(section.weight ?? 400) || 400;
        const width = section.width ?? 100;
        const style: React.CSSProperties = {
          fontFamily: isMono ? 'var(--font-roboto-mono)' : 'var(--font-roboto-flex)',
          fontStyle: section.style === 'italic' ? 'italic' : 'normal',
          fontVariationSettings: isMono ? `'wght' ${weight}` : `'wght' ${weight}, 'wdth' ${width}`,
        };
        return (
          <Fragment key={i}>
            <span style={style}>{section.text}</span>
            {section.lineBreakAfter && <br />}
          </Fragment>
        );
      })}
    </span>
  );
}
