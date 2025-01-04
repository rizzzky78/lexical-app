import { AppStateProvider } from "@/lib/utility/provider/app-state";
import { AI } from "../(server-action)/action-single";

export default function TestingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppStateProvider>
      <AI>{children}</AI>
    </AppStateProvider>
  );
}
