import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const upstream = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Always force role: "partner" — this endpoint is partner-only
      body: JSON.stringify({ ...body, role: "partner" }),
      cache: "no-store",
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status });
    }

    const { token, user } = data as { token: string; user: object };

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days — matches JWT_EXPIRES_IN=7d
      path: "/",
    };

    const response = NextResponse.json({ user });
    response.cookies.set("kubi_token", token, cookieOptions);
    response.cookies.set("kubi_user", JSON.stringify(user), cookieOptions);

    return response;
  } catch {
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
