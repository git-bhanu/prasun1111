import {
  Inter as FontSans,
  Lato,
  Nunito,
  Sedan,
  Space_Grotesk,
} from "next/font/google";
import localFont from "next/font/local";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: "400",
});

export const sedan = Sedan({
  subsets: ["latin"],
  variable: "--font-sedan",
  weight: "400",
  style: ["normal", "italic"],
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "700"],
});

export const robotoFlex = localFont({
  src: "../public/fonts/RobotoFlex.ttf",
  variable: "--font-roboto-flex",
  display: "swap",
});

export const robotoMono = localFont({
  src: [
    { path: "../public/fonts/RobotoMono.ttf", style: "normal" },
    { path: "../public/fonts/RobotoMono-Italic.ttf", style: "italic" },
  ],
  variable: "--font-roboto-mono",
  display: "swap",
});
