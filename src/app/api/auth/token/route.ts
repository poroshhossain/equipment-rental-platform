import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { signAppToken } from "@/lib/jwt";

/** The browser calls this after login to get a token for the Express API. */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ token: null }, { status: 401 });
  }

  const user = session.user as { role?: string };
  const token = await signAppToken({
    id: session.user.id,
    email: session.user.email,
    role: user.role ?? "customer",
  });

  return Response.json({ token });
}
