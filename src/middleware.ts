import { NextRequest } from "next/server";
import { getSession, updateSession } from "./app/actions";
import { AuthRequiredError } from "./lib/exceptions";

export async function middleware(request: NextRequest) {
  const session = getSession();
  if (!session) throw new AuthRequiredError("Session Experied Login Again");
  return await updateSession(request);
}
