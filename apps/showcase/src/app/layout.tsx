import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { PageTitle } from "../components/page-title";

export const metadata: Metadata = {
  title: "UI Components",
  description: "A collection of components for building modern interfaces.",
  metadataBase: new URL("https://ui.danielsi.ms"),
  openGraph: {
    url: "https://ui.danielsi.ms",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
    >
      <body className={`${GeistSans.className}`}>
        <PageTitle />
        <div className="h-12" />
        {children}
      </body>
    </html>
  );
}
