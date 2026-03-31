import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ハマベロ - 横浜駅周辺の激アツクーポン",
  description: "横浜駅周辺の居酒屋のLINE限定クーポンやタイムセール情報をお届け",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen pb-20">{children}</main>
      </body>
    </html>
  );
}
