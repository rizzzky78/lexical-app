/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import {
  LayoutPanelLeft,
  LogOut,
  Moon,
  SquareUserRound,
  Sun,
  User,
  History,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { getServerSession } from "next-auth";

export function ToggleTheme() {
  const { setTheme, theme } = useTheme();
  const themeStatus = theme === "dark" ? "light" : "dark";
  return (
    <>
      <DropdownMenuItem onClick={() => setTheme(themeStatus)}>
        {themeStatus === "dark" ? (
          <Moon className="mr-2 h-4 w-4" />
        ) : (
          <Sun className="mr-2 h-4 w-4" />
        )}
        {themeStatus === "dark" ? "Dark" : "Light"}
      </DropdownMenuItem>
    </>
  );
}
