import { motion } from "framer-motion";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { API } from "../api";
import { MENU_ITEMS } from "../constants/constant";
import { useApi } from "../hooks/useApi";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { callApi, loading } = useApi();

  const handleLogout = async () => {
    try {
      await callApi(() => API.logout());
      localStorage.clear()
      navigate("/login");
    } catch {
      // errors handled inside the hook
    }
  };

  return (
    <div className="w-64 bg-white h-screen flex flex-col justify-between shadow-md border-r border-gray-100">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold text-xl tracking-tight px-6 py-5">
          💸 Expense Tracker
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200 my-2" />

        {/* Menu Items */}
        <nav className="px-3 py-3 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 font-medium transition-all duration-150 ease-in-out relative ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 h-full w-[3px] bg-blue-600 rounded-r-md"
                      />
                    )}

                    <Icon
                      className={`w-5 h-5 transition-transform duration-150 ${
                        isActive
                          ? "text-blue-600 scale-110"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="w-full">
        {/* Logout Button */}
        <div className="px-3 py-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all disabled:opacity-50"
          >
            🚪 {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};
