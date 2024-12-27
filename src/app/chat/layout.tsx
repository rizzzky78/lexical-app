import { Header } from "@/components/kratos/essentials/header";
import { ReactNode } from "react";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
}
