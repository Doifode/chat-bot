import { forward } from "@/lib/proxy";

// GET /api/users/:userId  ->  GET {API}/users/:userId
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return forward(`/users/${userId}`);
}
