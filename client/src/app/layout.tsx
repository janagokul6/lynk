import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "react-hot-toast";
import { CookieNotice } from "@/components/public/CookieNotice";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lynk",
  description: "Lynk is a marketplace where brands publish campaigns and creators apply, deliver work, and rate the collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 antialiased">
        {children}
        <Toaster position="top-right" />
        <CookieNotice />
      </body>
    </html>
  );
}
