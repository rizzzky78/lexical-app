"use client";

import { Session } from "next-auth";
import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface AuthProps {
  children: ReactNode;
  session: Session | null;
}

export const NextAuthSessionProvider: FC<AuthProps> = ({
  children,
  session,
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
