import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Söhne — official Epiphan brand typeface (from the Epiphan Brand kit).
const soehne = localFont({
  src: [
    { path: "./fonts/soehne-buch.otf", weight: "400", style: "normal" },
    { path: "./fonts/soehne-halbfett.otf", weight: "600", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cost of Inaction Calculator | Epiphan Video",
  description:
    "Calculate the hidden costs of aging AV infrastructure in higher education. Research-backed analysis across 7 cost categories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${soehne.variable} ${soehne.className} antialiased`}>{children}</body>
    </html>
  );
}
