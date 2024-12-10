import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Noto_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/provider/theme-provider";

const notoSerif = Noto_Serif({
  weight: "300",
  subsets: ["latin"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(`${notoSerif.className} antialiased`)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* <Header /> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
