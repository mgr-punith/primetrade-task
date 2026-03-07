interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id?: number;
}

interface TaskCardProps {
  task: Task;
  onToggle?: (id: number, completed: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete, isAdmin }: TaskCardProps) {
  return (
    <div className={`border ${task.completed ? "border-gray-700 opacity-60" : "border-gray-600"} p-4 flex items-start justify-between gap-4 bg-gray-900`}>
      <div className="flex items-start gap-3 flex-1">
        {!isAdmin && (
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle && onToggle(task.id, !task.completed)}
            className="mt-1 accent-blue-500 w-4 h-4 cursor-pointer"
          />
        )}
        <div className="flex-1">
          <p className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-white"}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-gray-400 text-sm mt-1">{task.description}</p>
          )}
          {isAdmin && task.user_id && (
            <p className="text-xs text-gray-500 mt-1">User ID: {task.user_id}</p>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit && onEdit(task)}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(task.id)}
            className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
