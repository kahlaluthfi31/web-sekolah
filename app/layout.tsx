import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-expect-error Next.js global CSS import is handled by the framework
import "./globals.css";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";

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
    icon: "/images/web/logo-smkn1-ciamis.png",
    shortcut: "/images/web/logo-smkn1-ciamis.png",
    apple: "/images/web/logo-smkn1-ciamis.png",
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
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
