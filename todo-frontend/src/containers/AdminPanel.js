import React, { useState, useEffect } from 'react';
import {
    fetchUsers,
    fetchUserTasks,
    deleteUser,
    deleteTodo,
    updateSelectedUser,
    updateUser,
    logOut,
    updateTodoAdmin,
    createTodoAdmin
} from '../api/api';
import { UserCircle, Plus, Edit, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import UserCard from '../components/Admin/UserCard';
import TaskList from '../components/Admin/AdminnTaskList';
import EditModal from '../components/Admin/EditModel';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import AddTaskModal from '../components/AddTaskFormModel';
const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    const [userTasks, setUserTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isInitializing, setIsInitializing] = useState(true);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);
    const dispatch = useDispatch();

    useEffect(() => {
        const userData = localStorage.getItem("userInfo");
        if (userData) {
            dispatch(login(JSON.parse(userData)));
        }
        setIsInitializing(false);
    }, [dispatch]);

    useEffect(() => {
        if (!isInitializing) {

            if (!authStatus || userData?.role !== 1) {
                dispatch(logout())
                navigate('/')
            }
        }
    }, [isInitializing, authStatus, dispatch, navigate]);

    useEffect(() => {
        let isComponentActive = true;
        const loadUsers = async () => {
            setLoading(true);
            try {
                const response = await fetchUsers();
                setUsers(response.data?.data || []);
                if (response.data.data.length > 0) {
                    const firstUser = response.data?.data[0];
                    setSelectedUser(firstUser);

                    // Fetch tasks for the first user
                    const tasksResponse = await fetchUserTasks(firstUser._id);
                    setUserTasks(tasksResponse.data?.data || []);
                }
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                if (isComponentActive) {
                    setLoading(false);
                }
            }
        };
        loadUsers();

        return () => {
            isComponentActive = false;
        };
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
        try {
            if (data.userName) {
                // Update user
                const response = await updateSelectedUser(data._id, data); // API call to update user
                const updatedUser = response.data?.data?.updatedInfo;
                // Update local state
                setUsers((prevUsers) =>
                    prevUsers.map((user) => (user._id === updatedUser._id ? { ...user, ...updatedUser } : user))
                );

                if (selectedUser?._id === updatedUser._id) {
                    setSelectedUser((prevSelectedUser) => ({
                        ...prevSelectedUser,
                        ...updatedUser,
                    }));
                }
            } else {
                // Update task
                let res = await updateTodoAdmin(data._id, data);
                console.log(res.data.data)
                setUserTasks((prevTasks) =>
                    prevTasks.map((task) => (task._id === data._id ? { ...task, ...res?.data?.data } : task))
                );
            }
        } catch (error) {
            console.error('Error updating data:', error);
            setErrorMessage('Failed to update data.');
        } finally {
            setIsModalOpen(false); // Close modal
        }
    };

    const handleAddTask = () => {
        setIsAddTaskModalOpen(true); // Open AddTaskModal
    };

    const handleAddTaskSubmit = async (taskData) => {
        try {
            const response = await createTodoAdmin(selectedUser._id, taskData); // API to add a task
            const newTask = response.data?.data;
            if (userTasks !== null) {
                setUserTasks((prevTasks) => [...prevTasks, newTask]); // Update tasks locally
            }
            setIsAddTaskModalOpen(false); // Close the modal
        } catch (error) {
            console.error("Error adding task:", error);
            setErrorMessage("Failed to add task.");
        }
    };
    const handleUpdateUser = async (updatedUserData, closeModalCallback) => {
        try {
            const updatedUser = (await updateUser(updatedUserData)).data;

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
    const handleLogout = () => {
        try {
            logOut();
            dispatch(logout());
            localStorage.clear();
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };


    return (
        <div className="min-h-screen  bg-blue-50 ">
            <Header user={userData} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
            <div className="mt-5 ml-1 grid grid-cols-3 gap-6">
                <div className="col-span-1 p-6 bg-white items-center rounded-lg shadow-lg border border-blue-200">
                    {errorMessage && (
                        <div className="bg-red-500 text-white p-4 rounded-md">
                            {errorMessage}
                        </div>
                    )}

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
                                        <p className="text-blue-700">{selectedUser.quote}</p>
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
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-blue-800">Tasks</h3>
                                    <button
                                        onClick={handleAddTask}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus size={18} />
                                        Add Task
                                    </button>
                                </div>
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
            {isAddTaskModalOpen && (
                <AddTaskModal
                    onClose={() => setIsAddTaskModalOpen(false)}
                    onAddTask={handleAddTaskSubmit}
                />
            )}
        </div>
    );
};

export default AdminPanel;
