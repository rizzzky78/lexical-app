import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LexAna - AI-Powered Research Analysis",
  description:
    "LexAna simplifies research with AI-powered multi-step agents. Extract insights, summarize papers, and visualize data for smarter research.",
  keywords: [
    "AI research analysis",
    "paper extraction",
    "data visualization",
    "semantic search",
    "Next.js AI app",
    "LexAna",
  ],
  authors: [{ name: "Casper Halcro", url: "https://your-portfolio-site.com" }],
  themeColor: "#4F46E5", // Matches the app's primary theme color
  colorScheme: "light",
  alternates: {
    canonical: "https://lexana.app",
    languages: {
      en: "https://lexana.app/en",
    },
  },
  openGraph: {
    type: "website",
    url: "https://lexana.app",
    title: "LexAna - AI-Powered Research Analysis",
    description:
      "Streamline your research workflow with AI-powered document analysis, insights, and visualizations.",
    siteName: "LexAna",
    images: [
      {
        url: "https://lexana.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "LexAna Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@LexAnaApp",
    creator: "@CasperHalcro",
    title: "LexAna - AI-Powered Research Analysis",
    description:
      "Explore AI-powered research tools for smarter, faster document analysis and visualization.",
    images: [
      {
        url: "https://lexana.app/og-image.png",
        alt: "LexAna Logo",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-192.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest", // Progressive Web App support
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased`
        )}
      >
        {children}
      </body>
    </html>
  );
}
