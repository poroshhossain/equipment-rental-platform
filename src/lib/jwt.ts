import "server-only";

import { SignJWT } from "jose";

/** Signs the short-lived token that the Express API verifies. */
export async function signAppToken(user: {
  id: string;
  role: string;
  email: string;
}) {
  return new SignJWT({ role: user.role, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET ?? ""));
}
