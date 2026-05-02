import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function GET() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("kubi_token");

  if (!tokenCookie) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const upstream = await fetch(`${API_URL}/api/v1/partners/dashboard`, {
      headers: { Authorization: `Bearer ${tokenCookie.value}` },
      cache: "no-store",
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
