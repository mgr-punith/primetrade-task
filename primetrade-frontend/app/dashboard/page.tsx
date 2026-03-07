"use client";
import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask, getMe } from "@/lib/api";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      const [taskRes, meRes] = await Promise.all([getTasks(), getMe()]);
      setTasks(taskRes.data);
      setUser(meRes.data);
    } catch {
      setError("Failed to load data");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({ title, description });
      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchData();
    } catch {
      setError("Failed to create task");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTask) return;
    try {
      await updateTask(editTask.id, { title: editTask.title, description: editTask.description });
      setEditTask(null);
      fetchData();
    } catch {
      setError("Failed to update task");
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      await updateTask(id, { completed });
      fetchData();
    } catch {
      setError("Failed to update task");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      fetchData();
    } catch {
      setError("Failed to delete task");
    }
  };

  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar username={user?.name || "..."} role="user" />

      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">My Tasks</h1>
            <p className="text-gray-400 text-sm mt-1">
              {pending.length} pending / {done.length} completed
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditTask(null); }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium"
          >
            {showForm ? "Cancel" : "+ New Task"}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="border border-gray-600 p-4 mb-6 flex flex-col gap-3 bg-gray-900">
            <h2 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">New Task</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={2}
              className="bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 py-2 text-sm font-medium">
              Create Task
            </button>
          </form>
        )}

        {/* Edit Form */}
        {editTask && (
          <form onSubmit={handleUpdate} className="border border-yellow-600 p-4 mb-6 flex flex-col gap-3 bg-gray-900">
            <h2 className="font-semibold text-sm text-yellow-400 uppercase tracking-wider">Edit Task</h2>
            <input
              type="text"
              value={editTask.title}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              required
              className="bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            />
            <textarea
              value={editTask.description || ""}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              rows={2}
              className="bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-yellow-500 resize-none"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 py-2 px-4 text-sm font-medium">
                Save Changes
              </button>
              <button type="button" onClick={() => setEditTask(null)} className="bg-gray-700 hover:bg-gray-600 py-2 px-4 text-sm">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="border border-gray-700 p-8 text-center text-gray-500">
            No tasks yet. Create your first task above.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={setEditTask}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
