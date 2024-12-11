import { ReactNode } from "react";
import { AI } from "../action-mock";

export default function RSCLayout({ children }: { children: ReactNode }) {
  return <AI>{children}</AI>;
}
