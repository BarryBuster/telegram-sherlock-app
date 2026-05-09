import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sherlock — Розумний помічник для прийняття рішень",
  description:
    "Опишіть дилему, і Sherlock допоможе вам прийняти обґрунтоване рішення за допомогою зваженого аналізу за 8 критеріями.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={inter.variable}>
      <head>
        {/* Telegram Web App SDK */}
        <script src="https://telegram.org/js/telegram-web-app.js" defer />
      </head>
      <body className="font-[var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}
