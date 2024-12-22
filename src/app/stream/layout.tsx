import { ReactNode } from "react";
import { AI } from "../(server-action)/action-single";

interface StreamLayoutProps {
  children: ReactNode;
}

export default function StreamLayout({
  children,
}: Readonly<StreamLayoutProps>) {
  return (
    <div>
      <AI>{children}</AI>
    </div>
  );
}
