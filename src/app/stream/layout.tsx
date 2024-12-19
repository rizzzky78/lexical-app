import { Metadata } from "next";
import { Toaster } from "sonner";
import { RootAI } from "../root-action";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-rsc-genui.vercel.dev"),
  title: "Generative User Interfaces Preview",
  description: "Generative UI with React Server Components and Vercel AI SDK",
};

export default function StreamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Toaster position="top-center" richColors />
      <RootAI>{children}</RootAI>
    </div>
  );
}
