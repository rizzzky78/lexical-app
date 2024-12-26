import { ReactNode } from "react";
import { AI } from "../(server-action)/action-single";
import { AppStateProvider } from "@/lib/utility/provider/app-state";

interface StreamLayoutProps {
  children: ReactNode;
}

export default function StreamLayout({
  children,
}: Readonly<StreamLayoutProps>) {
  return (
    <div>
      <AppStateProvider>
        <AI>{children}</AI>
      </AppStateProvider>
    </div>
  );
}
