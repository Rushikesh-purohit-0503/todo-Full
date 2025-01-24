import React, { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

const AddTaskModal = ({ onClose, onAddTask }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [assignedTo, setAssignedTo] = useState(""); // You can extend this with logic to assign tasks
  const [status, setStatus] = useState(false); // Default status is false (not completed)

  // Handle form submission
  const onSubmit = async (data) => {
    // The data object will have { title, description, status, assignedTo }
    const taskData = {
      ...data,
      status: status || false, // If status is not provided, default to false
      // assignedTo: assignedTo || null, // Assigning to the user based on state or the default one
    };
    
    // Call onAddTask to pass the task data to the parent component (MainPage)
    onAddTask(taskData);
    onClose(); // Close modal after submitting the task
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter task description"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("description")}
            />
          </div>

          {/* Status Input (Checkbox for completed) */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="status"
              {...register("status")}
              checked={status}
              onChange={() => setStatus((prevStatus) => !prevStatus)}
              className="mr-2"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700">Task Completed</label>
          </div>

          {/* Assigned To Input */}
          {/* <div className="mb-4">
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
              Assign to (Optional)
            </label>
            <input
              id="assignedTo"
              type="text"
              placeholder="Enter assigned user ID"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          {/* Modal Actions */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
