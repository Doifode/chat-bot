"use client";

import { useEffect, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api, type User } from "@/lib/api";
import { initials } from "@/lib/format";
import { useUser } from "@/lib/user";

export default function ProfilePage() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [occupation, setOccupation] = useState("");
  const [bio, setBio] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const hasMetadata =
    !!profile?.user_metadata &&
    (!!profile.user_metadata.bio || !!profile.user_metadata.occupation);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    api<User>(`/users/${user.id}`)
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setOccupation(data.user_metadata?.occupation ?? "");
        setBio(data.user_metadata?.bio ?? "");
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await api(`/users/${user.id}/metadata`, {
        method: "POST",
        body: JSON.stringify({
          occupation: occupation.trim() || null,
          bio: bio.trim() || null,
        }),
      });
      setSaved(true);
      setProfile((p) =>
        p
          ? {
              ...p,
              user_metadata: {
                occupation: occupation.trim() || null,
                bio: bio.trim() || null,
              },
            }
          : p
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6 md:p-10">
      <Card>
        <CardHeader className="p-6 pb-4">
          <CardTitle>Profile</CardTitle>
          <p className="text-sm text-muted-foreground">
            Context the assistant uses in its system prompt.
          </p>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Avatar fallback={initials(profile?.name ?? user?.name ?? "?")} />
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {profile?.name ?? user?.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.id}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {hasMetadata ? (
                <div className="space-y-4">
                  <Field label="Occupation">
                    {profile?.user_metadata?.occupation || "—"}
                  </Field>
                  <Field label="Bio">
                    {profile?.user_metadata?.bio || "—"}
                  </Field>
                  <p className="text-xs text-muted-foreground">
                    Metadata is set once — the API has no update endpoint yet.
                  </p>
                </div>
              ) : (
                <form onSubmit={save} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="Data scientist"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="A few sentences the assistant should know about you."
                      rows={4}
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  {saved && (
                    <p className="text-sm text-muted-foreground">Saved.</p>
                  )}
                  <Button type="submit" disabled={busy}>
                    {busy ? "Saving…" : "Save profile"}
                  </Button>
                </form>
              )}

              {hasMetadata && error && (
                <p className="mt-4 text-sm text-destructive">{error}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="whitespace-pre-wrap text-sm">{children}</p>
    </div>
  );
}
