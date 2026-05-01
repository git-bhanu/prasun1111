import {
  Inter as FontSans,
  Lato,
  Nunito,
  Sedan,
  Space_Grotesk,
} from "next/font/google";

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
