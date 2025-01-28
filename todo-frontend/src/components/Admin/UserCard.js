import React from "react";
import { UserCircle,Edit,Trash2 } from "lucide-react";
const UserCard = ({ user, onClick, isSelected, onEdit, onDelete }) => (
    <div 
      onClick={onClick}
      className={`p-4 border rounded-lg mb-2 cursor-pointer transition-all ${
        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <UserCircle className="mr-3 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-800">{user.userName}</h3>
            <p className="text-sm text-blue-600">{user.email}</p>
            
          </div>
        </div>
        {/* <div className="flex space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
            className="text-blue-600 hover:bg-blue-200 p-1 rounded"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(user._id);
            }}
            className="text-red-600 hover:bg-red-200 p-1 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div> */}
      </div>
    </div>
  );

  export default UserCard;