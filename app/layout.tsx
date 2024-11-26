import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chill Guy Generator",
  description: "Generate your own chill guy meme",
  icons: {
    icon: [
      {
        url: "/variants/1.png",
        type: "image/png",
      },
    ],
    shortcut: ["/variants/1.png"],
    apple: [
      {
        url: "/variants/1.png",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}