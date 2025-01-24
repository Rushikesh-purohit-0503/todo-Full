import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const UpdateModal = ({ 
    isOpen, 
    onClose, 
    task, 
    onUpdate 
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

   useEffect(() => {
        if (isOpen && task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
        }
    }, [isOpen, task]); 

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(task._id, { title, description });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-center">Update Task</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Update Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateModal;