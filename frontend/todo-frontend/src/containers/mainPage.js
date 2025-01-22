import React, { useState } from 'react';
import { PlusCircle, LogOut, Search, CheckCircle, Trash2, Edit } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import profile from '../assets/user-circle.svg'
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../api/api';
const MainPage = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [searchQuery, setSearchQuery] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => (state.auth.userData))
    console.log("Current User:", useSelector((state) => state.auth.userData));
    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            setTasks([
                ...tasks,
                {
                    id: Date.now(),
                    title: newTask,
                    completed: false,
                    createdAt: new Date().toISOString()
                }
            ]);
            setNewTask('');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await logOut();
            console.log(response)
            if (response) {

                dispatch(logout());
                navigate('/')
            }
        } catch (error) {
            console.error(error)
        }
    };

    const toggleTaskStatus = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-blue-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="flex justify-between items-center px-2 py-4">
                    <h1 className="text-2xl font-bold text-blue-600">TaskMaster</h1>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="flex items-center">
                                <div className="flex items-center gap-2 border-2 border-blue-500 rounded-lg px-3 py-1.5">
                                    <span className="text-gray-700">
                                        {user?.userName || 'User'}
                                    </span>
                                    <img
                                        src={profile}
                                        alt="Profile"
                                        className="w-6 h-6 object-cover"
                                    />
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-1.5 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="h-5 w-5 absolute left-3 top-3 text-blue-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className=" pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a new task..."
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <PlusCircle className="h-5 w-5" />
                            Add Task
                        </button>
                    </div>
                </form>



                {/* Tasks List */}
                <div className="space-y-4">
                    {filteredTasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No tasks found. Add some tasks to get started!
                        </div>
                    )}
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className={`bg-white p-4 rounded-lg shadow-sm border ${task.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <button
                                        onClick={() => toggleTaskStatus(task.id)}
                                        className={`p-1 rounded-full ${task.completed ? 'text-green-500' : 'text-blue-500'
                                            }`}
                                    >
                                        <CheckCircle className="h-6 w-6" />
                                    </button>
                                    <span className={`flex-1 ${task.completed ? 'line-through text-blue-500' : ''}`}>
                                        {task.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {/* Handle edit */ }}
                                        className="p-1 text-blue-500 hover:text-gray-600"
                                    >
                                        <Edit className="h-5 w-5 " />
                                    </button>
                                    {/* <button
                                        onClick={() => deleteTask(task.id)}
                                        className="p-1 text-gray-400 hover:text-red-600"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button> */}
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Created: {new Date(task.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MainPage;