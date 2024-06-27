import { NextRequest } from "next/server";
import { getSession, updateSession } from "./app/actions";
import { AuthRequired } from "./lib/exceptions";

export async function middleware(request: NextRequest) {
  const session = getSession();
  if (!session) throw new AuthRequired("Session Experied Login Again");
  return await updateSession(request);
}
