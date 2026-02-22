import type { Metadata } from "next";
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

import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "런치 브레인 🐯",
  description: "당신의 완벽한 강남역 점심 파트너",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100 text-slate-900`}
      >
        <div className="mx-auto max-w-lg min-h-screen bg-white shadow-2xl flex flex-col relative border-x border-slate-200">
          <main className="flex-1 pb-20 overflow-x-hidden">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
