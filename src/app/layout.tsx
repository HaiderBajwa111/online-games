import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CleanupInjectedAttributes from "@/components/CleanupInjectedAttributes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poki - Play Free Online Games",
  description:
    "Play the best free online games without downloading. Thousands of games to choose from!",
  keywords: [
    "free games",
    "online games",
    "game website",
    "play games online",
  ],
  authors: [{ name: "Poki Games" }],
  metadataBase: new URL("https://poki-games.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://poki-games.com",
    siteName: "Poki Games",
    title: "Poki - Play Free Online Games",
    description: "Play the best free online games without downloading",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poki - Play Free Online Games",
    description: "Play the best free online games without downloading",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://poki-games.com" />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <CleanupInjectedAttributes />
        <main suppressHydrationWarning className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
