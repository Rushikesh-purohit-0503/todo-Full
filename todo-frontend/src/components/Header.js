import React, { useState } from "react";
// import { LogOut, User, Edit, Save } from "lucide-react";
import UserProfile from "./Header/UserProfile";
import { useNavigate } from "react-router-dom";



const Header = ({ user, onLogout, onUpdateUser }) => {
  const navigate = useNavigate()
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* App Title */}
      <button className="text-xl text-blue-500 font-bold hover:cursor-pointer" onClick={()=>(navigate('/main'))}>TaskMaster</button>

      {/* User Profile */}
      {user && (
        <UserProfile
          user={user}
          onLogout={onLogout}
          onUpdateUser={onUpdateUser}
        />
      )}
    </header>
  );
};

export default Header;
 