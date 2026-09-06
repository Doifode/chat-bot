"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type Chat } from "@/lib/api";
import { useChats } from "@/lib/chats";
import { useUser } from "@/lib/user";

export default function NewChatPage() {
  const router = useRouter();
  const { user } = useUser();
  const { reload } = useChats();

  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const chat = await api<Chat>("/chats", {
        method: "POST",
        body: JSON.stringify({ user_id: user.id, title: title.trim() || null }),
      });
      await reload();
      router.replace(`/chats/${chat.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6 md:p-10">
      <Card>
        <CardHeader className="p-6 pb-4">
          <CardTitle>Start a new chat</CardTitle>
          <p className="text-sm text-muted-foreground">
            Give it a title so you can find it later. Optional.
          </p>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Trip planning"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={busy}>
                {busy ? "Creating…" : "Start chat"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
