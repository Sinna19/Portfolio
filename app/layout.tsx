import type { Metadata } from "next";
import "./globals.css";
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
      <body>{children}</body>
    </html>
  );
}
