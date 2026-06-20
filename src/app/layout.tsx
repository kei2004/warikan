import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "スマート割り勘",
  description: "旅行やイベントの立替・割り勘を簡単に計算できるアプリ",
  other: {
    "google-adsense-account": "ca-pub-4836830009110277"
  }
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
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-4836830009110277'}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="bg-white/50 dark:bg-zinc-900/50 border-t py-8 mt-auto">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/about" className="hover:text-primary transition-colors">アプリについて</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">利用規約</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">プライバシーポリシー</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">お問い合わせ</Link>
            </div>
            <div className="text-xs">
              &copy; {new Date().getFullYear()} スマート割り勘
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
