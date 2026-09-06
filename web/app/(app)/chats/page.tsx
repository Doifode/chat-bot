"use client";

import Link from "next/link";
import { MessageSquarePlus, MessagesSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ChatsIndexPage() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <MessagesSquare className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">No chat selected</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Pick a conversation from the sidebar, or start a new one to talk to the
          assistant.
        </p>
      </div>
      <Button asChild className="gap-2">
        <Link href="/chats/new">
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </Link>
      </Button>
    </div>
  );
}
