import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Perfect Chill Guy",
  description: "Create and customize your own chill guy memes with our easy-to-use meme generator. Add text, change backgrounds, and make it uniquely yours!",
  icons: {
    icon: [
      {
        url: "/variants/1.png",
        type: "image/png",
      }
    ],
    shortcut: ["/variants/1.png"],
    apple: [
      {
        url: "/variants/1.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  }
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
      </body>
    </html>
  );
}