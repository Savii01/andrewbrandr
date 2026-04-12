import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import CursorFollower from "@/components/public/CursorFollower";

export const metadata: Metadata = {
  title: "AndrewBrandr — Brand Studio",
  description:
    "I design systems that connect clarity with Creativity. Saviour Andrew — a multidisciplinary designer focused on brand identity, digital design, and web development.",
  keywords: ["branding", "design", "web development", "brand identity", "AndrewBrandr", "Saviour Andrew"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/ig-profile.png" />
      </head>
      <body className="bg-white dark:bg-black text-black dark:text-white font-sans antialiased overflow-x-hidden">
        <ThemeProvider>
          <CursorFollower />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
