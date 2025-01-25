import React, { useState, useEffect } from 'react';
import {
    fetchUsers,
    fetchUserTasks,
    deleteUser,
    deleteTodo,
    updateUser,
    updateTodo,
    logOut
} from '../api/api';
import { UserCircle, Clock, CheckCircle, Edit, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import UserCard from '../components/Admin/UserCard';
import TaskList from '../components/Admin/AdminnTaskList';
import EditModal from '../components/Admin/EditModel';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';


const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userTasks, setUserTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState(null); // State for modal data
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate()
    let user = useSelector((state) => state.auth.userData)
    const dispatch = useDispatch()
    useEffect(() => {
        user = JSON.parse(localStorage.getItem('userInfo'))
        dispatch(login(user))
    }, [dispatch])

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const response = await fetchUsers();
                // console.log(response)
                setUsers(response.data?.data || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleUserSelect = async (user) => {
        setLoading(true);
        try {
            const tasksResponse = await fetchUserTasks(user._id);
            setSelectedUser(user);
            setUserTasks(tasksResponse.data?.data || []);
        } catch (error) {
            console.error('Error fetching user tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers(users.filter(user => user._id !== userId));
            if (selectedUser?._id === userId) {
                setSelectedUser(null);
                setUserTasks([]);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTodo(taskId);
            setUserTasks(userTasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEditUser = (user) => {
        setModalData(user); // Set user data for modal
        setIsModalOpen(true); // Open modal
    };

    const handleEditTask = (task) => {
        setModalData(task); // Set task data for modal
        setIsModalOpen(true); // Open modal
    };

    const handleSaveEdit = async (data) => {
        if (data.userName) {
            // Handle user update
            const updatedUser = await updateUser(data); // API call to update user
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user._id === data._id ? { ...user, ...updatedUser?.data?.data } : user))
            );
        } else {
            // Handle task update
            await updateTodo(data); // API call to update task
            setUserTasks((prevTasks) =>
                prevTasks.map((task) => (task._id === data._id ? { ...task, ...data } : task))
            );
        }
    };
    const handleUpdateUser = async (updatedUserData, closeModalCallback) => {
        try {
            const updatedUser = (await updateUser(updatedUserData)).data;

            localStorage.setItem("userInfo", JSON.stringify(updatedUser.data.updatedInfo)); // Update local storage
            
            if (closeModalCallback) {
                closeModalCallback(); // Close modal or dropdown
            }
        } catch (error) {
            console.error("Error updating user profile:", error);
            setErrorMessage("Failed to update user profile.");
        }
    };
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
    return (
        <div className="min-h-screen bg-blue-50 ">
            <Header user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
            <div className=" mt-5 grid grid-cols-3 gap-6">
                <div className="col-span-1 space-y-4">
                    <h2 className="text-2xl font-bold mb-4 text-blue-900">Users</h2>
                    {loading ? (
                        <div className="text-center text-blue-600">Loading...</div>
                    ) : (
                        users.map(user => (
                            <UserCard
                                key={user._id}
                                user={user}
                                onClick={() => handleUserSelect(user)}
                                isSelected={selectedUser?._id === user._id}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                            />
                        ))
                    )}
                </div>

                <div className="col-span-2 bg-white rounded-lg p-6 shadow-lg border border-blue-200">
                    {selectedUser ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <UserCircle size={48} className="mr-4 text-blue-600" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-blue-900">{selectedUser.userName}</h2>
                                        <p className="text-blue-700">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditUser(selectedUser)}
                                        className="text-blue-600 hover:bg-blue-200 p-2 rounded"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(selectedUser._id)}
                                        className="text-red-600 hover:bg-red-200 p-2 rounded"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-blue-800">Tasks</h3>
                                {userTasks.length > 0 ? (
                                    <TaskList
                                        tasks={userTasks}
                                        onEditTask={handleEditTask}
                                        onDeleteTask={handleDeleteTask}
                                    />
                                ) : (
                                    <p className="text-blue-600">No tasks found for this user</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-blue-600">
                            Select a user to view details
                        </div>
                    )}

                </div>
            </div>
            {/* Modal for editing user or task */}
            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={modalData}
                onSave={handleSaveEdit}
            />
        </div>
    );
};

export default AdminPanel;