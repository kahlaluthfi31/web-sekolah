import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalAuthProvider } from "@/components/ConditionalAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "SMKN 1 CIAMIS - Official Site",
  description: "Official Site",
  icons: {
    icon: "/images/web/favicon-smea.png",
    shortcut: "/images/web/favicon-smea.png",
    apple: "/images/web/favicon-smea.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="overflow-x-hidden">
      <head>
        <link rel="preload" href="/videos/hero-bg.mp4" as="video" type="video/mp4" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <ConditionalAuthProvider>{children}</ConditionalAuthProvider>
      </body>
    </html>
  );
}
