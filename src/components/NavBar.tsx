// src/components/Navbar.tsx
import React from "react";

export const Navbar: React.FC = () => {
  return (
    <div className="h-14 bg-white shadow-sm flex items-center justify-between px-6 border-b border-gray-200">
      <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>

      <div className="flex items-center gap-3">
        <span className="text-gray-500 text-sm">Hello, Gopal 👋</span>
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=Gopal`}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
  );
};
