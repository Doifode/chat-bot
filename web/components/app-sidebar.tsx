"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, MessagesSquare, User2 } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useChats } from "@/lib/chats";
import { initials } from "@/lib/format";
import { useUser } from "@/lib/user";
import { cn } from "@/lib/utils";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useUser();
  const { chats, loading } = useChats();

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-2 px-4 py-4">
        <MessagesSquare className="h-5 w-5" />
        <span className="font-semibold">Chat Bot</span>
      </div>

      <Separator />

      <div className="p-3">
        <Button asChild className="w-full justify-start gap-2" onClick={onNavigate}>
          <Link href="/chats/new">
            <MessageSquarePlus className="h-4 w-4" />
            New chat
          </Link>
        </Button>
      </div>

      <nav className="px-3 pb-2">
        <NavLink
          href="/profile"
          active={pathname === "/profile"}
          onNavigate={onNavigate}
        >
          <User2 className="h-4 w-4" />
          Profile
        </NavLink>
      </nav>

      <Separator />

      <div className="flex-1 overflow-y-auto p-3">
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Chats
        </p>
        {loading && chats.length === 0 ? (
          <div className="space-y-2 px-1">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        ) : chats.length === 0 ? (
          <p className="px-2 text-sm text-muted-foreground">No chats yet.</p>
        ) : (
          <ul className="space-y-1">
            {chats.map((chat) => {
              const active = pathname === `/chats/${chat.id}`;
              return (
                <li key={chat.id}>
                  <Link
                    href={`/chats/${chat.id}`}
                    onClick={onNavigate}
                    className={cn(
                      "block truncate rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {chat.title || "New Chat"}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Separator />

      <div className="flex items-center gap-3 p-3">
        <Avatar fallback={initials(user?.name ?? "?")} className="h-8 w-8" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.id}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut}>
          Switch
        </Button>
      </div>
    </div>
  );
}

function NavLink({
  href,
  active,
  onNavigate,
  children,
}: {
  href: string;
  active: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        active
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </Link>
  );
}
