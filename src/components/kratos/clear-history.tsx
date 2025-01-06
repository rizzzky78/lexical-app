"use client";

import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { clearChats } from "@/lib/agents/action/chat-service";
import { Trash2 } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";

type ClearHistoryProps = {
  empty: boolean;
};

export function ClearHistory({ empty }: ClearHistoryProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <SidebarMenuButton
          tooltip={{
            children: "Clear Chats",
            hidden: false,
            className: "rounded-3xl",
          }}
          className="px-2.5 md:px-2 text-red-200"
        >
          <Trash2 />
        </SidebarMenuButton>
      </AlertDialogTrigger>
      <div className="rounded-3xl">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              history and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-3xl" disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-3xl"
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                startTransition(async () => {
                  const result = await clearChats();
                  if (result?.error) {
                    toast.error(result.error);
                  } else {
                    toast.success("History cleared");
                  }
                  setOpen(false);
                });
              }}
            >
              {isPending ? <Spinner /> : "Clear"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  );
}
