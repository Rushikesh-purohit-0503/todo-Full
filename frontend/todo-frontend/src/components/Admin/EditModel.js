import React, { useState, useEffect } from 'react';

const EditModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState();
  
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-sky-900 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 border border-sky-200">
        <h2 className="text-2xl mb-4 font-semibold text-sky-900">
          Edit {data.userName ? 'User' : 'Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          {data.userName ? (
            <>
              <div className="mb-4">
                <label className="block text-sky-800" htmlFor="userName">User Name</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full p-2 border border-sky-300 rounded focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sky-800" htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-sky-300 rounded focus:ring-2 focus:ring-sky-300"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sky-800" htmlFor="taskName">Task Name</label>
                <input
                  type="text"
                  name="taskName"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-sky-300 rounded focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sky-800" htmlFor="taskDescription">Description</label>
                <textarea
                  name="taskDescription"
                  value={formData.taskDescription}
                  onChange={handleChange}
                  className="w-full p-2 border border-sky-300 rounded focus:ring-2 focus:ring-sky-300"
                />
              </div>
            </>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-sky-100 text-sky-800 rounded hover:bg-sky-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;