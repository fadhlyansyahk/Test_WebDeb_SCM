import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Jalankan untuk setiap request ke /tasks
export async function proxy(req: NextRequest) {
  const token = await getToken({ req });

  // Kalau belum login, redirect ke halaman login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Halaman /tasks dan semua sub-halamannya butuh login
export const config = {
  matcher: ["/tasks/:path*"],
};
