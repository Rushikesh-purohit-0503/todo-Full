import React from "react";
import { Edit } from "lucide-react";

const UserInfo = ({ user, onEdit }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-blue-500 font-semibold">User Profile</h3>
        <button
          onClick={onEdit}
          className="text-blue-500 hover:bg-blue-100 p-1 rounded"
        >
          <Edit size={18} />
        </button>
      </div>
      <p>
        <strong className="text-blue-500">Username: </strong> {user.userName}
      </p>
      <p>
        <strong className="text-blue-500">Email: </strong> {user.email}
      </p>
      {user.displayName && (
        <p>
          <strong className="text-blue-500">Display Name: </strong>
          {user.displayName}
        </p>
      )}
      {user.quote && (
        <p>
          <strong className="text-blue-500">Quote: </strong>
          "{user.quote}"
        </p>
      )}
    </div>
  );
};

export default UserInfo;
