type Props = {
  block: {
    desktopSpace?: string | null;
    mobileSpace?: string | null;
  };
};

export function SpaceBlock({ block }: Props) {
  const desktop = block.desktopSpace && block.desktopSpace !== 'none' ? Number(block.desktopSpace) : 0;
  const mobile = block.mobileSpace && block.mobileSpace !== 'none' ? Number(block.mobileSpace) : 0;

  if (!desktop && !mobile) return null;

  return (
    <>
      {mobile > 0 && (
        <div className="block md:hidden" style={{ height: `${mobile}px` }} />
      )}
      {desktop > 0 && (
        <div className="hidden md:block" style={{ height: `${desktop}px` }} />
      )}
    </>
  );
}
