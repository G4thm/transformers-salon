import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Transformers Unisex Salon & Beauty Atelier",
    template: "%s | Transformers Salon",
  },
  description:
    "Luxury unisex salon in Puducherry — precision haircuts, beard styling, hair coloring, facials & more. Book your appointment online.",
  metadataBase: new URL("https://transformerssalon.in"),
  icons: {
    icon: [
      { url: "/brand/fox-mascot.webp", sizes: "any", type: "image/webp" },
      { url: "/brand/logo-web.jpeg", sizes: "180x180", type: "image/jpeg" },
    ],
    apple: "/brand/logo-web.jpeg",
    shortcut: "/brand/fox-mascot.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full antialiased">
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
