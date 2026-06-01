import AddCallIcon from './add_call.svg';
import AnimatedImagesIcon from './animated_images.svg';
import ChromeReaderModeIcon from './chrome_reader_mode.svg';
import AddLinkIcon from '../add_link.svg';
import ArrowRightAltIcon from './arrow_right_alt.svg';
import ArrowUpwardAltIcon from './arrow_upward_alt.svg';
import ArrowOutwardIcon from './arrow_outward.svg';
import ArticlePersonIcon from './article_person.svg';
import ErrorIcon from './error.svg';
import ForwardToInboxIcon from './forward_to_inbox.svg';
import HamburgerIcon from './hamburger.svg';
import KeyboardBackspaceIcon from './keyboard_backspace.svg';
import OutboundIcon from './outbound.svg';
import OutboundHoverIcon from './outbound-hover.svg';
import PinchInZoom from './pinch_zoom_in.svg';
import PlayCircleIcon from './play_circle.svg';
import ShoppingBagIcon from './shopping_bag.svg';
import ShoppingBagSpeedIcon from './shopping_bag_speed.svg';
import { SvgIcon, type SvgIconProps } from './svg-icon';

export const icons = {
  addCall: AddCallIcon,
  animatedImages: AnimatedImagesIcon,
  chromeReaderMode: ChromeReaderModeIcon,
  addLink: AddLinkIcon,
  articlePerson: ArticlePersonIcon,
  arrowOutward: ArrowOutwardIcon,
  arrowRightAlt: ArrowRightAltIcon,
  arrowUpwardAlt: ArrowUpwardAltIcon,
  error: ErrorIcon,
  forwardToInbox: ForwardToInboxIcon,
  hamburger: HamburgerIcon,
  keyboardBackspace: KeyboardBackspaceIcon,
  outbound: OutboundIcon,
  outboundHover: OutboundHoverIcon,
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
