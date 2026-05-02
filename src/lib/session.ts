import { cookies } from "next/headers";
import type { SessionUser } from "@/types/api";

export interface Session {
  token: string;
  user?: SessionUser;
}

/**
 * Reads the httpOnly session cookies server-side.
 * Use in Server Components, Route Handlers, and layouts.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("kubi_token");
  const userCookie = cookieStore.get("kubi_user");

  if (!tokenCookie) return null;

  let user: SessionUser | undefined;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value) as SessionUser;
    } catch {
      // Corrupted cookie — ignore, middleware will re-authenticate
    }
  }

  return { token: tokenCookie.value, user };
}
