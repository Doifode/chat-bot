import { forward } from "@/lib/proxy";

// POST /api/users  ->  POST {API}/users/
export async function POST(req: Request) {
  const body = await req.text();
  return forward("/users/", { method: "POST", body });
}
