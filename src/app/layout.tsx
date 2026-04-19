import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CleanupInjectedAttributes from "@/components/CleanupInjectedAttributes";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Games - Play Free Online Games",
  description:
    "Play the best free online games without downloading. Thousands of games to choose from on Free Games!",
  keywords: [
    "free games",
    "online games",
    "free online games",
    "play games online",
  ],
  authors: [{ name: "Free Games Team" }],
  metadataBase: new URL("https://free-games.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://free-games.com",
    siteName: "Free Games",
    title: "Free Games - Play Free Online Games",
    description: "Play the best free online games without downloading",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Games - Play Free Online Games",
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
        <link rel="canonical" href="https://freeonlinegames.us" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-QLS6XLSWL6" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QLS6XLSWL6');
        `}</Script>
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
