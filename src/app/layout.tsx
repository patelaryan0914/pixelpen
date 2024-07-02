import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
const fontSans = Roboto({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-sans",
});
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blend",
  description: "Bloging Platform",
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
      </body>
    </html>
  );
}
