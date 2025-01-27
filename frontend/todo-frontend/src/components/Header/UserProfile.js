import React, { useState } from "react";
import { Edit, LogOut } from "lucide-react";
import UserInfo from "./UserInfo";
import EditProfileForm from "./EditProfileForm";
import profile from "../../assets/user-circle.svg";

const UserProfile = ({ user, onLogout, onUpdateUser }) => {
    const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const username = user.userName
    const userName = username.charAt(0).toUpperCase() + username.slice(1);
    const toggleUserInfo = () => setIsUserInfoOpen((prev) => !prev);
    const handleEditToggle = () => setIsEditing((prev) => !prev);
    const handleUpdateUser = (updatedUser) => {
        onUpdateUser(updatedUser, () => {
            setIsEditing(false); // Close editing form
            setIsUserInfoOpen(false); // Close dropdown
        });
    };
    return (
        <div className="relative">
            {/* Profile Image */}
            <div
                onClick={toggleUserInfo}
                className="flex items-center border cursor-pointer hover:bg-gray-100 p-2 rounded-full"
            >
                <img
                    src={user.profilePicture || profile}
                    alt="User Profile"
                    className="w-8 h-8 rounded mr-2"
                />
                <span className="text-blue-700 mr-2">{userName || "User"}</span>
            </div>

            {/* Dropdown Menu */}
            {isUserInfoOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-4">
                    {!isEditing ? (
                        <UserInfo user={user} onEdit={handleEditToggle} />
                    ) : (
                        <EditProfileForm
                            user={user}
                            onUpdateUser={handleUpdateUser}
                            onCancel={handleEditToggle}
                        />
                    )}

                    <button
                        onClick={onLogout}
                        className="w-full mt-4 flex items-center justify-center bg-sky-500 text-white  hover:bg-blue-600 p-2 rounded"
                    >
                        <LogOut size={18} className="mr-2 " /> Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
