import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Sesión cerrada" });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 0,
    path: "/",
  };

  response.cookies.set("kubi_token", "", cookieOptions);
  response.cookies.set("kubi_user", "", cookieOptions);

  return response;
}
