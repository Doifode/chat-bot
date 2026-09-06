const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8000";

/**
 * Forward a request to the FastAPI backend and pass its response straight back.
 * Keeps the browser talking only to the Next.js origin.
 */
export async function forward(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json",
    },
  });
}
