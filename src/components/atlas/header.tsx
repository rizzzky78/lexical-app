/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  History,
  LogOut,
  LayoutPanelLeft,
  SquareUserRound,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { ToggleTheme } from "./toggle-theme";

export const Header: React.FC = async () => {
  const session = await getServerSession();
  return (
    <div className="w-full flex justify-center">
      <header className="fixed px-5 w-full md:max-w-screen-2xl p-1 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-background/80 md:bg-transparent">
        <div>
          <a href="/" className="flex items-center space-x-2">
            {/* <IconLogo className={cn("w-5 h-5")} /> */}
            <span className="font-semibold text-lg hidden md:inline">
              Morphix
            </span>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-105 hover:border-none hover:bg-background focus-visible:border-none focus:border-none focus-within:border-none"
              >
                <LayoutPanelLeft className="hover:rotate-180 transition-all h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-full *:text-xs rounded-none"
            >
              <DropdownMenuLabel className="flex items-center space-x-2">
                {session?.user?.image ? (
                  <img
                    src={session?.user?.image as string}
                    alt={"user_profile_picture"}
                    className="object-cover h-7 w-7 rounded-full"
                  />
                ) : (
                  <SquareUserRound className="h-7 w-7" />
                )}
                <div className="flex flex-col">
                  <p className="text-xs">{session?.user?.name}</p>
                  <p className="text-[0.65rem] text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ToggleTheme />
              <DropdownMenuItem>
                <History className="mr-2 h-4 w-4" />
                <span>History</span>
                {/* I want to trigger the Sheet using this button */}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {/* <Logout className="flex items-center"> */}
                <LogOut className="mr-2 h-4 w-4 text-[#FF6969]" />
                <span>Log out</span>
                {/* </Logout> */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default Header;
