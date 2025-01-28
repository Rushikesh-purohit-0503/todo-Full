import React from 'react';
import { CheckCircle, Clock, Edit, Trash2 } from 'lucide-react'

const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {

  const sortedTasks = tasks.sort((a, b) => a.completed - b.completed);
  return (
    <div className="space-y-3">
      {sortedTasks.map(task => (
        <div
          key={task._id}
          className="bg-blue-50 p-3 rounded-lg border border-blue-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-blue-800">{task.title}</h4>
              <p className="text-sm text-blue-700">{task.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {task.completed ? (
                  <CheckCircle className="text-green-600 mr-2" size={18} />
                ) : (
                  <Clock className="text-red-500 mr-2" size={18} />
                )}
                <span className={task.status
                  ? 'text-blue-700'
                  : 'text-blue-600'
                }>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
              <button
                onClick={() => onEditTask(task)}
                className="text-blue-600 hover:bg-blue-200 p-1 rounded"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDeleteTask(task._id)}
                className="text-red-600 hover:bg-red-200 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;