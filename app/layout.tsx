import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Aayushi Sinha — Engineering Playground",
  description:
    "Interactive engineering labs by Aayushi Sinha. Explore MCP routing, support-agent boundaries, and AI evaluation with source-grounded local demonstrations.",
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
