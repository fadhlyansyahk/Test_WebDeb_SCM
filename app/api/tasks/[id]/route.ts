import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Belum login" }, { status: 401 });

  const { id } = await params;

  const task = await prisma.task.findFirst({
    where: { id: Number(id), userId: Number(session.user.id) },
  });

  if (!task)
    return Response.json({ error: "Task tidak ditemukan" }, { status: 404 });

  return Response.json(task);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Belum login" }, { status: 401 });

  const { id } = await params;
  const { title, description, status } = await req.json();

  const task = await prisma.task.findFirst({
    where: { id: Number(id), userId: Number(session.user.id) },
  });

  if (!task)
    return Response.json({ error: "Task tidak ditemukan" }, { status: 404 });

  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: { title, description, status },
  });

  return Response.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Belum login" }, { status: 401 });

  const { id } = await params;

  const task = await prisma.task.findFirst({
    where: { id: Number(id), userId: Number(session.user.id) },
  });

  if (!task)
    return Response.json({ error: "Task tidak ditemukan" }, { status: 404 });

  await prisma.task.delete({ where: { id: Number(id) } });

  return Response.json({ message: "Task berhasil dihapus" });
}
