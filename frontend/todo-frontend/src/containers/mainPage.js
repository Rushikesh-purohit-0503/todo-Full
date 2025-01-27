import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../store/authSlice";
import { logOut, fetchTodos, createTodo, updateTodo, deleteTodo, updateUser } from "../api/api";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskFormModel";
import UpdateModal from "../components/Updatemodel";

const MainPage = () => {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isInitializing, setIsInitializing] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        const userData = localStorage.getItem("userInfo");
        if (userData) {
            dispatch(login(JSON.parse(userData)));
        }
        setIsInitializing(false);
    }, [dispatch]);




    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await fetchTodos();
                setTasks(response.data?.data || []);

            } catch (error) {
                console.error("Error fetching todos:", error);
                setErrorMessage("Failed to load tasks.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTasks();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await logOut();
            dispatch(logout());
            localStorage.clear();
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleAddTask = async (data) => {
        if (data) {
            try {
                const response = await createTodo({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                });
                console.log("Task creation response:", response.data); // Debug API response

                const newTask = response.data.data;

                // Update the state immediately to reflect the new task
                setTasks((prev) => {

                    return [...prev, newTask]
                });

                setModalOpen(false);
            } catch (error) {
                console.error("Error creating task:", error);
                setErrorMessage("Failed to create task.");
            }
        }
    };

    const toggleTaskStatus = async (taskId, currentStatus) => {
        try {
            const updatedTask = (await updateTodo(taskId, { status: !currentStatus }))?.data;
            setTasks((prev) =>
                prev.map((task) =>
                    task._id === taskId ? { ...task, completed: updatedTask.data.completed } : task
                )
            );
        } catch (error) {
            console.error("Error updating task status:", error);
            setErrorMessage("Failed to update task status.");
        }
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setUpdateModalOpen(true);
    };

    const handleUpdateTask = async (taskId, updatedData) => {
        try {
            const response = await updateTodo(taskId, updatedData);
            setTasks((prev) =>
                prev.map((task) =>
                    task._id === taskId ? { ...task, ...response.data.data } : task
                )
            );
            setUpdateModalOpen(false);
        } catch (error) {
            setErrorMessage("Failed to update task.");
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await deleteTodo(taskId);
            setTasks((prev) => prev.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
            setErrorMessage("Failed to delete task.");
        }
    };

    const handleUpdateUser = async (updatedUserData, closeModalCallback) => {
        try {
            const updatedUser = (await updateUser(updatedUserData)).data;
            console.log(updatedUser);

            localStorage.setItem("userInfo", JSON.stringify(updatedUser.data.updatedInfo)); // Update local storage
            dispatch(login(updatedUser.data.updatedInfo))
            if (closeModalCallback) {
                closeModalCallback(); // Close modal or dropdown
            }
        } catch (error) {
            console.error("Error updating user profile:", error);
            setErrorMessage("Failed to update user profile.");
        }
    };

    const filteredTasks = tasks.filter((task) =>
        task.title?.toLowerCase().includes(searchQuery)
    );
    
    return (
        <div className="min-h-screen bg-blue-100">
            {/* Header Component */}
            <Header user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />

            {/* Main Content */}
            <main className="max-w-4xl mx-auto mt-2 px-4 py-8">
                {/* Search Bar Component */}
                <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />

                {/* Add Task Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        Add Task
                    </button>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="text-center text-red-500 py-2">{errorMessage}</div>
                )}

                {/* Task List */}
                {/* Task List */}
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading tasks...</div>
                ) : tasks.length > 0 ? (
                    <TaskList
                        tasks={filteredTasks}
                        onToggleStatus={toggleTaskStatus}
                        onDelete={deleteTask}
                        onEditTask={handleEditTask}
                    />
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        No tasks found. Start adding some!
                    </div>
                )}
            </main>

            {/* Add Task Modal */}
            {isModalOpen && (
                <AddTaskModal
                    onClose={() => setModalOpen(false)}
                    onAddTask={handleAddTask}
                />
            )}

            {/* Update Task Modal */}
            {updateModalOpen && (
                <UpdateModal
                    isOpen={updateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    task={selectedTask}
                    onUpdate={handleUpdateTask}
                />
            )}
        </div>
    );
};

export default MainPage;
