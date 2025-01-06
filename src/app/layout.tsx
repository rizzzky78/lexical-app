import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Noto_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { Header } from "@/components/kratos/essentials/header";
import { Toaster } from "sonner";
import { NextAuthSessionProvider } from "@/components/provider/session-provider";
import { getServerSession } from "next-auth";

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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
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
          <NextAuthSessionProvider session={session}>
            <Toaster />
            {children}
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
