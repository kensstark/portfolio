import type { Metadata, Viewport } from "next";
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
  title: "Tadiwa Kennedy Vambe",
  description: "Creative engineer, forward-deployed. A map of where I've been, and what I built, wrote and read there.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Paint edge to edge (the dusk scene runs under the notch); content stays inside the safe area.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className="text-[15px] antialiased"
      >
        {children}
      </body>
    </html>
  );
}
