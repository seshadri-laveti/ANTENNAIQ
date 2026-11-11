import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ANTENNAIQ — AI-Powered Antenna Design Laboratory",
  description:
    "Learn antenna engineering, build designs in HFSS, understand your simulation results, troubleshoot problems and optimize performance with AI assistance.",
  keywords: [
    "antenna design",
    "HFSS",
    "RF engineering",
    "patch antenna",
    "AIVA",
    "AI copilot",
    "electromagnetics",
    "Maxwell",
  ],
  authors: [{ name: "ANTENNAIQ" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${mono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
