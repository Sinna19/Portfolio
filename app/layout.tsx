import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Aayushi Sinha — Developer Portfolio', description: 'Selected projects by Aayushi Sinha: AI evaluation, reliable support agents, and MCP infrastructure.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
