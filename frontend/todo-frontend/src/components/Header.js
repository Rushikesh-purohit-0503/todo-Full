import React, { useState } from "react";
// import { LogOut, User, Edit, Save } from "lucide-react";
import UserProfile from "./Header/UserProfile";

// import React, { useState } from "react";
import { LogOut } from "lucide-react";
// import UserProfile from "./UserProfile";

const Header = ({ user, onLogout, onUpdateUser }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* App Title */}
      <div className="text-xl text-blue-500 font-bold">TaskMaster</div>

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
 