import React from "react";
import { Check, Clock } from "lucide-react";

const TaskTable = ({ tasks, users }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Assigned To</th>
            <th className="px-4 py-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">{task.title}</td>
              <td className="px-4 py-3">{task.description}</td>
              <td className="px-4 py-3">
                {users.find((user) => user._id === task.assignedTo)?.userName || "Unassigned"}
              </td>
              <td className="px-4 py-3 text-center">
                {task.status ? (
                  <span className="flex items-center justify-center text-green-500">
                    <Check size={16} className="mr-1" /> Completed
                  </span>
                ) : (
                  <span className="flex items-center justify-center text-yellow-500">
                    <Clock size={16} className="mr-1" /> Pending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;