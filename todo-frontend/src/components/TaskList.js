import React from "react";
import { CheckCircle, Trash2, Edit } from "lucide-react";

const TaskList = ({ tasks, onToggleStatus, onDelete, onEditTask }) => {
  if (tasks.length === 0) {
    return <div className="text-center py-8 text-gray-500">No tasks found. Add some tasks to get started!</div>;
  }

  // Sort tasks by 'createdAt' in descending order (most recent first)
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const sortBystatus = sortedTasks.sort((a,b)=> a.completed - b.completed)
  return (
    <div className="space-y-4">
      {sortBystatus.map((task) => (
        <div
          key={task._id}
          className={`bg-white p-4 rounded-lg shadow-sm border ${task.completed ? "border-green-200 bg-green-50" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">

              <button
                onClick={() => onToggleStatus(task._id, task.completed)}
                className={`p-1 rounded-full ${task.completed ? "text-green-500" : "text-blue-500"}`}
              >
                <CheckCircle className="h-6 w-6" />
              </button>
              <span className={`flex-1 ${task.completed ? "line-through text-blue-500" : ""}`}>{task.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 text-blue-500 hover:text-gray-600">
                <Edit onClick={() => onEditTask(task)} className="h-5 w-5" />
              </button>
              <button onClick={() => onDelete(task._id)} className="p-1 text-red-400 hover:text-red-600">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <p className="text-sm text-grey-500"><strong>Description:</strong> {task.description}</p>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Created: {new Date(task.createdAt).toLocaleString('en-US', {
              weekday: 'short',  // 3-letter day abbreviation (Mon, Tue, etc.)
              year: 'numeric',
              month: 'short',    // 3-letter month abbreviation (Jan, Feb, etc.)
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true        // 12-hour time format with AM/PM
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
