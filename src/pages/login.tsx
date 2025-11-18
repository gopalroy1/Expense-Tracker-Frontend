import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import { useApi } from "../hooks/useApi";
import { loginSuccess } from "../store/authSlice";
import { loginSchema } from "../validation/logInSchema";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { callApi, loading, error } = useApi();

  const [form, setForm] = useState({ email: "", password: "" });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>(
    {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Remove field-specific validation errors as user types
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate with Zod
    const parsed = loginSchema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};

      parsed.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });

      setValidationErrors(fieldErrors);
      return;
    }

    // 2. API call only if validation passes
    try {
      const data = await callApi(() => API.login(form));
      console.log("Login successful:", data);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      console.log("Navigating to dashboard...");
      navigate("/dashboard");
    } catch(error) {
      console.error(error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Sign In</h2>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs">{validationErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border p-2 rounded"
          />
          {validationErrors.password && (
            <p className="text-red-500 text-xs">{validationErrors.password}</p>
          )}
        </div>

        {/* API Error */}
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 w-full rounded hover:bg-green-700 transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm mt-2">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
