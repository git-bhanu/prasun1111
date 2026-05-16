import AddLinkIcon from '../add_link.svg';
import ArrowRightAltIcon from './arrow_right_alt.svg';
import ArrowUpwardAltIcon from './arrow_upward_alt.svg';
import ArrowOutwardIcon from './arrow_outward.svg';
import ArticlePersonIcon from './article_person.svg';
import ErrorIcon from './error.svg';
import HamburgerIcon from './hamburger.svg';
import KeyboardBackspaceIcon from './keyboard_backspace.svg';
import PinchInZoom from './pinch_zoom_in.svg';
import PlayCircleIcon from './play_circle.svg';
import ShoppingBagIcon from './shopping_bag.svg';
import ShoppingBagSpeedIcon from './shopping_bag_speed.svg';
import { SvgIcon, type SvgIconProps } from './svg-icon';

export const icons = {
  addLink: AddLinkIcon,
  articlePerson: ArticlePersonIcon,
  arrowOutward: ArrowOutwardIcon,
  arrowRightAlt: ArrowRightAltIcon,
  arrowUpwardAlt: ArrowUpwardAltIcon,
  error: ErrorIcon,
  hamburger: HamburgerIcon,
  keyboardBackspace: KeyboardBackspaceIcon,
  pinchInZoom: PinchInZoom,
  playCircle: PlayCircleIcon,
  shoppingBag: ShoppingBagIcon,
  shoppingBagSpeed: ShoppingBagSpeedIcon,
};

export type IconName = keyof typeof icons;

export interface IconProps extends Omit<SvgIconProps, 'icon'> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  return <SvgIcon icon={icons[name]} {...props} />;
}
