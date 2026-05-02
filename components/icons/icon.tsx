import ArticlePersonIcon from './article_person.svg';
import ErrorIcon from './error.svg';
import HamburgerIcon from './hamburger.svg';
import KeyboardBackspaceIcon from './keyboard_backspace.svg';
import PinchInZoom from './pinch_zoom_in.svg';
import PlayCircleIcon from './play_circle.svg';
import { SvgIcon, type SvgIconProps } from './svg-icon';

export const icons = {
  articlePerson: ArticlePersonIcon,
  error: ErrorIcon,
  hamburger: HamburgerIcon,
  keyboardBackspace: KeyboardBackspaceIcon,
  pinchInZoom: PinchInZoom,
  playCircle: PlayCircleIcon,
};

export type IconName = keyof typeof icons;

export interface IconProps extends Omit<SvgIconProps, 'icon'> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  return <SvgIcon icon={icons[name]} {...props} />;
}
