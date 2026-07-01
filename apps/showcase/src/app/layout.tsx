import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { PageTitle } from "../components/page-title";

export const metadata: Metadata = {
  title: "ui",
  description:
    "A collection of interface experiments developed by @danielsims.",
  metadataBase: new URL("https://ui.danielsi.ms"),
  openGraph: {
    url: "https://ui.danielsi.ms",
    type: "website",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og"],
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
