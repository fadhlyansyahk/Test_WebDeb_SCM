"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: "PENDING" | "DONE";
};

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchTasks();
  }, [status, router, fetchTasks]);

  async function deleteTask(id: number) {
    if (!confirm("Yakin ingin menghapus task ini?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  }

  async function toggleStatus(task: Task) {
    const newStatus = task.status === "PENDING" ? "DONE" : "PENDING";
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status: newStatus }),
    });
    fetchTasks();
  }

  if (status === "loading")
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Task Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Halo, {session?.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Isi halaman */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Task Saya</h2>
          <button
            onClick={() => router.push("/tasks/new")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
          >
            + Tambah Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            Belum ada task. Klik tombol di atas untuk menambah!
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-start"
              >
                <div className="flex-1">
                  {/* Judul task, coret kalau sudah Done */}
                  <p
                    className={`font-medium ${task.status === "DONE" ? "line-through text-gray-400" : ""}`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {task.description}
                    </p>
                  )}
                  {/* Tombol ganti status */}
                  <button
                    onClick={() => toggleStatus(task)}
                    className={`mt-2 text-xs px-2 py-1 rounded-full font-medium ${
                      task.status === "DONE"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task.status === "DONE" ? " Done" : " Pending"}
                  </button>
                </div>
                <div className="flex gap-3 ml-4">
                  <button
                    onClick={() => router.push(`/tasks/${task.id}/edit`)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
