import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  // Kalau sudah login → langsung ke halaman tasks
  // Kalau belum login → ke halaman login
  if (session) redirect("/tasks");
  redirect("/login");
}
