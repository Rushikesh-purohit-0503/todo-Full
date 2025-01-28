import React, { useState } from "react";
import { Save } from "lucide-react";

const EditProfileForm = ({ user, onUpdateUser, onCancel }) => {
    const [editedUser, setEditedUser] = useState({
        userName: user?.userName || "",
        email: user?.email || "",
        quote: user?.quote || "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveUser = () => {
        if (onUpdateUser) {
            onUpdateUser(editedUser);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <div className="space-y-2">
                <input
                    name="userName"
                    value={editedUser.userName}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className="w-full p-2 border-blue-500 border rounded"
                />
                <input
                    name="quote"
                    value={editedUser.quote}
                    onChange={handleInputChange}
                    placeholder="Quote"
                    className="w-full p-2 border border-blue-500 rounded"
                />
                <div className="flex flex-col justify-between mt-2">
                    <button
                        onClick={handleSaveUser}
                        className="flex items-center bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                        <Save size={18} className="mr-2 mx-20" /> Save
                    </button>
                    <button
                        onClick={onCancel}
                        className="text-white bg-sky-500 mt-2 hover:bg-blue-600 p-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileForm;
