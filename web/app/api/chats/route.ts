import { forward } from "@/lib/proxy";

// POST /api/chats  ->  POST {API}/chats/
export async function POST(req: Request) {
  const body = await req.text();
  return forward("/chats/", { method: "POST", body });
}
