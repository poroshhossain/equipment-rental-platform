import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { signAppToken } from "@/lib/jwt";

/** Server Components use this instead of calling the browser token endpoint. */
export async function serverToken(): Promise<string | undefined> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return undefined;

  const user = session.user as { role?: string };

  return signAppToken({
    id: session.user.id,
    email: session.user.email,
    role: user.role ?? "customer",
  });
}
