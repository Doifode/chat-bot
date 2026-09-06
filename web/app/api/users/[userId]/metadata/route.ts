import { forward } from "@/lib/proxy";

// POST /api/users/:userId/metadata  ->  POST {API}/users/:userId/metadata
export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const body = await req.text();
  return forward(`/users/${userId}/metadata`, { method: "POST", body });
}
