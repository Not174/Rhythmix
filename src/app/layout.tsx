import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AudioProvider } from "@/context/AudioContext";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "Rhythmix — Stream Your Rhythm",
  description:
    "Rhythmix is a modern music streaming platform. Discover, upload, and play your favorite songs with a premium listening experience.",
  keywords: ["music", "streaming", "rhythmix", "bangla music", "audio player"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AudioProvider>
            <LayoutShell>{children}</LayoutShell>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
