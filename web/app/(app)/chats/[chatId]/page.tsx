"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api, type Message } from "@/lib/api";
import { useChats } from "@/lib/chats";
import { initials, shortId } from "@/lib/format";
import { useUser } from "@/lib/user";
import { cn } from "@/lib/utils";

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);
  const { user } = useUser();
  const { chats } = useChats();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  const chatTitle = useMemo(
    () => chats.find((c) => c.id === chatId)?.title || "New Chat",
    [chats, chatId]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    api<Message[]>(`/chats/${chatId}/messages`)
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch((err) => {
        if (!cancelled)
          setLoadError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function send() {
    const content = input.trim();
    if (!content || sending) return;
    setInput("");
    setSendError(null);
    setSending(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      },
    ]);
    try {
      const reply = await api<Message>(`/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : String(err));
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center justify-between border-b px-4 py-3 md:px-6">
        <div className="min-w-0">
          <h1 className="truncate font-semibold">{chatTitle}</h1>
          <p className="truncate text-xs text-muted-foreground">
            chat {shortId(chatId)}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-16 w-2/3" />
              <Skeleton className="ml-auto h-10 w-1/2" />
              <Skeleton className="h-20 w-3/4" />
            </>
          ) : loadError ? (
            <p className="text-sm text-destructive">{loadError}</p>
          ) : messages.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No messages yet. Say hello 👋
            </div>
          ) : (
            messages.map((m) => <Bubble key={m.id} message={m} userName={user?.name ?? "You"} />)
          )}

          {sending && (
            <div className="flex items-end gap-2">
              <Avatar fallback="AI" className="h-7 w-7 text-[10px]" />
              <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                <span className="inline-flex gap-1">
                  <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t bg-background px-4 py-3 md:px-6">
        <div className="mx-auto max-w-2xl">
          {sendError && (
            <p className="mb-2 text-sm text-destructive" role="alert">
              {sendError}
            </p>
          )}
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message the assistant…  (Enter to send, Shift+Enter for newline)"
              rows={1}
              className="max-h-40 min-h-[44px] resize-none"
              disabled={sending || !!loadError}
            />
            <Button
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={() => void send()}
              disabled={sending || !input.trim() || !!loadError}
              aria-label="Send"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  message,
  userName,
}: {
  message: Message;
  userName: string;
}) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar
        fallback={isUser ? initials(userName) : "AI"}
        className={cn(
          "h-7 w-7 text-[10px]",
          isUser ? "" : "bg-foreground text-background"
        )}
      />
      <div
        className={cn(
          "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"
      style={{ animationDelay: delay }}
    />
  );
}
