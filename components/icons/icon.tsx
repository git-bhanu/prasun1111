import HamburgerIcon from './hamburger.svg';
import PinchInZoom from './pinch_zoom_in.svg';
import { SvgIcon, type SvgIconProps } from './svg-icon';

export const icons = {
  hamburger: HamburgerIcon,
  pinchInZoom: PinchInZoom,
};

export type IconName = keyof typeof icons;

export interface IconProps extends Omit<SvgIconProps, 'icon'> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  return <SvgIcon icon={icons[name]} {...props} />;
}
