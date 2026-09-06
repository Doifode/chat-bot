export type Chat = { id: string; title: string | null };
export type Message = {
  id: string;
  role: "user" | "assistant" | string;
  content: string;
  created_at: string;
};
export type User = {
  id: string;
  name: string;
  user_metadata?: { bio: string | null; occupation: string | null } | null;
};

/** Call a Next.js proxy route. Throws Error(detail) on non-2xx. */
export async function api<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail =
      (data && (data.detail ?? data.message)) || `Request failed (${res.status})`;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return data as T;
}
