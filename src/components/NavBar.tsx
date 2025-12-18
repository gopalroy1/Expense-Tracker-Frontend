import type { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

type NavbarProps = {
  title?: string;
};

export const Navbar: React.FC<NavbarProps> = ({
  title = "Expense Tracker",
}) => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="h-14 backdrop-blur bg-white/80 border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: App Identity */}
      <div className="flex items-center gap-3">
        <span className="text-lg">💸</span>
        <h1 className="text-sm font-semibold text-gray-800">
          {title}
        </h1>
      </div>

      {/* Right: User / CTA */}
      <div className="flex items-center gap-4">
        {user ? (
          // Logged-in state
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Hi, {user.name}
            </span>

            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              className="w-8 h-8 rounded-full border bg-white"
              alt="avatar"
            />
          </div>
        ) : (
          // Guest / Demo state
          <>
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="text-sm px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Create account
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
