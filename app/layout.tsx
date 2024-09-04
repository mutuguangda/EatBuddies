import type { Metadata } from "next";
import { Noto_Serif_SC as FontSerif } from "next/font/google"
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ['400','600','900']
})

export const metadata: Metadata = {
  title: "EatBuddies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={fontSerif.className}>
        <main className="mx-auto md:max-w-3xl w-full bg-background">
          {children}
        </main>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
