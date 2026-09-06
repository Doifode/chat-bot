"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type User } from "@/lib/api";
import { useUser } from "@/lib/user";
import { cn } from "@/lib/utils";

type Mode = "create" | "existing";

export default function WelcomePage() {
  const router = useRouter();
  const { user, ready, signIn } = useUser();

  const [mode, setMode] = useState<Mode>("create");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [existingId, setExistingId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) router.replace("/chats");
  }, [ready, user, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "create") {
        const created = await api<User & { email?: string }>("/users", {
          method: "POST",
          body: JSON.stringify({ name, email }),
        });
        signIn({ id: created.id, name: created.name ?? name });
      } else {
        const found = await api<User>(`/users/${existingId.trim()}`);
        signIn({ id: found.id, name: found.name });
      }
      router.replace("/chats");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 p-6 pb-4">
          <CardTitle className="text-xl">Welcome to Chat Bot</CardTitle>
          <p className="text-sm text-muted-foreground">
            Create an account or continue with an existing user ID.
          </p>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 text-sm">
            {(["create", "existing"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={cn(
                  "rounded-md px-3 py-1.5 font-medium transition-colors",
                  mode === m
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "create" ? "Create account" : "I have an ID"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "create" ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ada@example.com"
                    required
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="uid">User ID</Label>
                <Input
                  id="uid"
                  value={existingId}
                  onChange={(e) => setExistingId(e.target.value)}
                  placeholder="00000000-0000-0000-0000-000000000000"
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
