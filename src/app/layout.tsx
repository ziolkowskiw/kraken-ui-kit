import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

// Sans is driven by the brand token (--font-sans → "Moderat JIT" / "Noto Sans").
// Mono stays Geist Mono until a brand mono token exists.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kraken UI Kit",
  description: "shadcn-based design system with a 3-layer token architecture and brand theming.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Brand theming + browser extensions set attributes on <html> before React
      // hydrates; this tells React not to warn about that one element.
      suppressHydrationWarning
      className={`${geistMono.variable} h-full antialiased`}
    >
      {/* Randstadt brand font, registered under its literal name "Noto Sans" so
          the design token resolves to it. React 19 hoists these into <head>. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        // React 19 hoists this into <head>; precedence is required for
        // body-rendered stylesheets so React knows where to order it.
        precedence="default"
      />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
