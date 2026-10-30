import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
const editorialSerif = localFont({
  src: [
    {
      path: "./fonts/fraunces-normal.woff2",
      weight: "400 600",
      style: "normal",
    },
    {
      path: "./fonts/fraunces-italic.woff2",
      weight: "400 600",
      style: "italic",
    },
  ],
  variable: "--font-editorial-serif",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
  fallback: ["Georgia", "serif"],
});
const interfaceFont = localFont({
  src: "./fonts/dm-sans.woff2",
  weight: "400 600",
  variable: "--font-interface",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
  fallback: ["Arial", "sans-serif"],
});
const codeFont = localFont({
  src: "./fonts/jetbrains-mono.woff2",
  weight: "400 500",
  variable: "--font-code",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
  fallback: ["monospace"],
});
export const metadata: Metadata = {
  title: "Aayushi Sinha — AI Engineering & Systems",
  description:
    "Aayushi Sinha builds AI systems, agent infrastructure, and reliable software. Explore her projects, engineering decisions, and interactive browser-based labs.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${editorialSerif.variable} ${interfaceFont.variable} ${codeFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
