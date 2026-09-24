import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET environment variable is not set");
}
const key = new TextEncoder().encode(secretKey);

// Session lifetime (sliding). Refreshed on every request via middleware.
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch {
    // Expired or tampered token -> treat as logged out instead of crashing.
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  let parsed: any;
  try {
    parsed = await decrypt(session);
  } catch {
    // Invalid/expired cookie: clear it so the user isn't stuck in a bad state.
    const res = NextResponse.next();
    res.cookies.delete("session");
    return res;
  }

  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  parsed.expires = expires;
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires,
  });
  return res;
}
