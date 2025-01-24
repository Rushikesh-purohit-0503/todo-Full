import React from "react";

const AddTaskButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
    >
      Add Task
    </button>
  );
};

export default AddTaskButton;
