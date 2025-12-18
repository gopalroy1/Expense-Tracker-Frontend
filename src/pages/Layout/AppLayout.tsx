// src/layouts/AppLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/NavBar";
import { Sidebar } from "../../components/SideBar";

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
