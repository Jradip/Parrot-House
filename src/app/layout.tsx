import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const newsreader = localFont({
  src: "../fonts/newsreader-latin.woff2",
  variable: "--font-heading",
  weight: "200 800",
  display: "swap",
});

const plusJakartaSans = localFont({
  src: "../fonts/plus-jakarta-sans-latin.woff2",
  variable: "--font-body",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Parrot House — Sahabat Berbulu Anda",
    template: "%s | Parrot House",
  },
  description:
    "Jelajahi koleksi burung paruh bengkok Parrot House dan temukan sahabat berbulu yang tepat untuk keluarga Anda.",
  openGraph: {
    title: "Parrot House",
    description: "Temukan sahabat berbulu Anda bersama Parrot House.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${newsreader.variable} ${plusJakartaSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
