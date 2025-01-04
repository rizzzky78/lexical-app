import { Header } from "@/components/kratos/essentials/header";
import { AppStateProvider } from "@/lib/utility/provider/app-state";
import { ReactNode } from "react";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div>
      <AppStateProvider>{children}</AppStateProvider>
    </div>
  );
}
