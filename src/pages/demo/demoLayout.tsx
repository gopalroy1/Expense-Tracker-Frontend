import React from "react";
import { Link } from "react-router-dom";

 const DemoLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Bar */}
      <div className="h-14 bg-white border-b flex items-center justify-between px-6">
                  <Link to="/home">

        <div className="font-semibold text-gray-800">
          💸 Expense Tracker <span className="text-sm text-gray-500">Demo</span>
          </div>
                    </Link>


        <div className="flex gap-3">
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
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
};
export default DemoLayout;