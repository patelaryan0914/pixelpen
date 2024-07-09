import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
const fontSans = Roboto({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-sans",
});
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { default: "Pixel Pen", template: "%s - Pixel Pen" },
  description:
    "Pixel Pen: Your ultimate blogging platform. Share your stories, insights, and creativity with a vibrant community. Discover diverse content and connect with like-minded individuals.",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "h-screen bg-background font-sans antialiased ",
          fontSans.variable
        )}
      >
        <Toaster />
        <main>{children}</main>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
