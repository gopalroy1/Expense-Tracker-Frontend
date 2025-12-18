import { motion } from "framer-motion";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { API } from "../api";
import { MENU_ITEMS } from "../constants/constant";
import { useApi } from "../hooks/useApi";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { callApi, loading } = useApi();

  const handleLogout = async () => {
    await callApi(() => API.logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 text-gray-100 flex flex-col justify-between">
      {/* Top */}
      <div>
        {/* Logo */}
        <Link to="/dashboard">
        <div className="px-6 py-5 text-xl font-semibold tracking-tight">
          <span className="text-blue-400">💸</span> Expense Tracker
        </div>
        </Link>

        {/* Menu */}
        <nav className="px-3 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 h-full w-[3px] bg-blue-500 rounded-r-md"
                      />
                    )}

                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gray-800 text-red-400 hover:bg-red-500 hover:text-white transition"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};
