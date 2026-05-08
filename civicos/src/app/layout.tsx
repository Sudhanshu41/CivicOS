import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import CinematicBackground from "../components/ui/CinematicBackground";
import { DataStream } from "../components/motion/DataStream";
import { ScanlineOverlay } from "../components/ui/ScanlineOverlay";
import { NeuralBackground } from "../components/motion/NeuralBackground";
import { CursorGlow } from "../components/motion/CursorGlow";
import { HoloNotification } from "../components/motion/HoloNotification";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CivicOS - AI Operating System",
  description: "AI Operating System For Smarter Communities. Autonomous civic intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased dark`}>
      <body className="font-outfit bg-[#010008] text-foreground min-h-screen flex flex-col relative overflow-x-hidden cursor-none">
        <CinematicBackground />
        <NeuralBackground />
        <DataStream direction="down" />
        <ScanlineOverlay />
        {/* Global microinteraction layer */}
        <CursorGlow />
        <HoloNotification />
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
