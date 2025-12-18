import type { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const DemoLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("DemoLayout user:", {user});

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Bar */}
      <div className="h-14 bg-white/80 backdrop-blur border-b border-gray-200 flex items-center justify-between px-6">
        {/* Left */}
        <Link
          to="/home"
          className="flex items-center gap-2 font-semibold text-gray-800 hover:opacity-80"
        >
          <span className="text-lg">💸</span>
          <span>
            Expense Tracker{" "}
            <span className="text-sm text-gray-500">Demo</span>
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-500">
                Viewing demo as {user.name}
              </span>

              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Demo Context Banner */}
      <div className="bg-blue-50 border-b border-blue-100 text-blue-800 text-sm px-6 py-2">
        This is a demo using sample data. No changes you make here are saved.
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
};

export default DemoLayout;
