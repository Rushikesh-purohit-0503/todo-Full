import React, { useEffect, useState } from "react";
import {
    fetchUsers,
    fetchAllTodos,
    createTodo,
    updateUser,
    deleteUser, 
    logOut
} from "../api/api";
import { logout } from "../store/authSlice";
import Header from "../components/Header";
import UserTable from "../components/Admin/UserTable";
import TaskTable from "../components/Admin/TaskTable";
import AddTaskButton from "../components/Admin/AddTaskButton";
import AddTaskModal from "../components/AddTaskFormModel";
import ErrorMessage from "../components/Admin/ErrorMessage";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";



const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.userData)


    useEffect(() => {
        const userData = localStorage.getItem("userInfo");
        if (userData) {
            dispatch(login(JSON.parse(userData)));
        }
    }, [dispatch]);
    // Fetch Users
    useEffect(() => {
        const fetchAllUsers = async () => {
            setLoading(true);
            try {
                const response = await fetchUsers();
                setUsers(response.data?.data || []);
            } catch (error) {
                console.error("Error fetching users:", error);
                setErrorMessage("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, []);

    // Fetch All Tasks
    useEffect(() => {
        const fetchAllTasks = async () => {
            setLoading(true);
            try {
                const response = await fetchAllTodos();
                setTasks(response.data?.data || []);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setErrorMessage("Failed to load tasks.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllTasks();
    }, []);

    // Delete User
    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers((prev) => prev.filter((user) => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            setErrorMessage("Failed to delete user.");
        }
    };

    // Add Task and Assign
    const handleAddTask = async (data) => {
        if (data) {
            try {
                const response = await createTodo({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    assignedTo: data.assignedTo,
                });
                setTasks((prev) => [...prev, response.data]);
                setModalOpen(false);
            } catch (error) {
                console.error("Error creating task:", error);
                setErrorMessage("Failed to create task.");
            }
        }
    };
    const handleUpdateUser = async (updatedUserData, closeModalCallback) => {
        try {
            const updatedUser = (await updateUser(updatedUserData)).data;
            console.log(updatedUser);

            localStorage.setItem("userInfo", JSON.stringify(updatedUser.data.updatedInfo)); // Update local storage

            if (closeModalCallback) {
                closeModalCallback(); // Close modal or dropdown
            }
        } catch (error) {
            console.error("Error updating user profile:", error);
            setErrorMessage("Failed to update user profile.");
        }
    };
    const onLogout = async () => {
        try {
            await logOut();
            dispatch(logout());
            localStorage.clear();
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }
    return (
        <div className="min-h-screen bg-gray-100">
            {loading && (<div>Loading...</div>)}
            <Header user={user} onLogout={onLogout} onUpdateUser={handleUpdateUser} />
            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl  font-bold text-gray-700">Admin Panel</h1>
                </div>
                <ErrorMessage message={errorMessage} />

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">All Users</h2>
                    <UserTable users={users} onDeleteUser={handleDeleteUser} />
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-700">All Tasks</h2>
                        <AddTaskButton onClick={() => setModalOpen(true)} />
                    </div>
                    <TaskTable tasks={tasks} users={users} />
                </section>
            </main>

            {isModalOpen && (
                <AddTaskModal
                    users={users}
                    onClose={() => setModalOpen(false)}
                    onAddTask={handleAddTask}
                />
            )}
        </div>
    );
};

export default AdminPanel;
