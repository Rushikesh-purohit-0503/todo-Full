import React from "react";
import { Trash2 } from "lucide-react";

const UserTable = ({ users, onDeleteUser }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="px-4 py-3 text-left">Username</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">{user.userName}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onDeleteUser(user._id)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;