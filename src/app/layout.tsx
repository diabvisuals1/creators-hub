import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cairo } from "next/font/google";
import "./globals.css";

const godber = localFont({
  src: "../assets/fonts/godber/Godber.ttf",
  variable: "--font-godber",
  display: "swap",
});

const kollektif = localFont({
  src: [
    {
      path: "../assets/fonts/kollektif/Kollektif.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/kollektif/Kollektif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/kollektif/Kollektif-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/kollektif/Kollektif-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-kollektif",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creators Hub",
  description: "Creators Hub — Social Media Agency",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${godber.variable} ${kollektif.variable} ${cairo.variable} font-en`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}