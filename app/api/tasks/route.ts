import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Belum login" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Belum login" }, { status: 401 });

  const { title, description } = await req.json();

  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId: Number(session.user.id),
    },
  });

  return Response.json(task);
}
