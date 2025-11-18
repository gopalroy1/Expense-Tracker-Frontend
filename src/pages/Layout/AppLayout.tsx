// src/layouts/AppLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/NavBar";
import { Sidebar } from "../../components/SideBar";

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Right section: navbar + content */}
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
