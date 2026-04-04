import { Inter as FontSans, Lato, Nunito, Space_Grotesk } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: '400',
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: '400',
});
