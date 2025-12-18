import React from "react";

export const Navbar: React.FC = () => {
  return (
    <div className="h-14 backdrop-blur bg-white/70 border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold text-gray-700">
        Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          Hello, Gopal
        </span>
        <img
          src="https://api.dicebear.com/7.x/initials/svg?seed=Gopal"
          className="w-8 h-8 rounded-full border"
          alt="avatar"
        />
      </div>
    </div>
  );
};
