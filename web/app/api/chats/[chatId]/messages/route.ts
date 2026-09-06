import { forward } from "@/lib/proxy";

// GET  /api/chats/:chatId/messages  ->  GET  {API}/chats/:chatId/messages
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  return forward(`/chats/${chatId}/messages`);
}

// POST /api/chats/:chatId/messages  ->  POST {API}/chats/:chatId/messages
export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const body = await req.text();
  return forward(`/chats/${chatId}/messages`, { method: "POST", body });
}
