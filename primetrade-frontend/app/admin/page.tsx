"use client";
import { useEffect, useState } from "react";
import { getAllTasks, getMe } from "@/lib/api";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: number;
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | "all">("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, meRes, userRes] = await Promise.all([
          getAllTasks(),
          getMe(),
          api.get("/admin/users"),
        ]);
        setTasks(taskRes.data);
        setUser(meRes.data);
        setUsers(userRes.data);
      } catch {
        setError("Failed to load admin data");
      }
    };
    fetchData();
  }, []);

  const getUserName = (user_id: number) => {
    const found = users.find((u) => u.id === user_id);
    return found ? found.name : `User #${user_id}`;
  };

  const filteredTasks =
    selectedUserId === "all"
      ? tasks
      : tasks.filter((t) => t.user_id === selectedUserId);

  const total = filteredTasks.length;
  const completed = filteredTasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar username={user?.name || "..."} role="admin" />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold tracking-wide mb-6">Admin Dashboard</h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-600 p-4 bg-gray-900">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Tasks</p>
            <p className="text-3xl font-bold">{total}</p>
          </div>
          <div className="border border-gray-600 p-4 bg-gray-900">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">{pending}</p>
          </div>
          <div className="border border-gray-600 p-4 bg-gray-900">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-400">{completed}</p>
          </div>
        </div>

        {/* Dropdown Filter */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm text-gray-400 uppercase tracking-wider">
            Filter by User:
          </label>
          <select
            value={selectedUserId}
            onChange={(e) =>
              setSelectedUserId(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="bg-gray-900 border border-gray-600 text-white text-sm px-4 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Users</option>
            {users
              .filter((u) => u.role !== "admin")
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.email}
                </option>
              ))}
          </select>
        </div>

        {/* Tasks List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            {selectedUserId === "all"
              ? "All Tasks — All Users"
              : `Tasks — ${getUserName(Number(selectedUserId))}`}
          </h2>
          <span className="text-xs text-gray-500">{total} tasks</span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="border border-gray-700 p-8 text-center text-gray-500">
            No tasks found.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`border ${
                  task.completed ? "border-gray-700 opacity-60" : "border-gray-600"
                } p-4 bg-gray-900`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className={`font-medium ${
                        task.completed ? "line-through text-gray-500" : "text-white"
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 ${
                      task.completed
                        ? "bg-green-900 text-green-400"
                        : "bg-yellow-900 text-yellow-400"
                    }`}
                  >
                    {task.completed ? "Done" : "Pending"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Assigned to:{" "}
                  <span className="text-gray-300">{getUserName(task.user_id)}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
