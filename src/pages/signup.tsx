import { loginSuccess } from "@/store/authSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API } from "../api";
import { googleSignIn } from "../constants/constant";
import { useApi } from "../hooks/useApi";
import { signupSchema } from "../validation/signUpSchema";

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
  
  const { callApi, loading, error } = useApi();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
    dob: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>(
    {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // clear error for that field
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate using Zod
const result = signupSchema.safeParse(form);

if (!result.success) {
  const fieldErrors: Record<string, string> = {};

  result.error.issues.forEach((issue) => {
    fieldErrors[issue.path[0] as string] = issue.message;
  });

  setValidationErrors(fieldErrors);
  return;
}

    // 2. If valid, call API
    try {
      const data = await callApi(() => API.signup(form));
      toast.success("Signup successful");
      // setAuthData(data.token, data.user);
            dispatch(loginSuccess({ user: data.data.user }));
            localStorage.setItem("user", JSON.stringify(data.data.user));
            console.log("The token saving in local storage",data.data.token)
            localStorage.setItem("token", data.data.token);
            console.log("Navigating to dashboard...");
            navigate("/dashboard");
      navigate("/dashboard");
    } catch {
      toast.error("Signup failed");
      // error from API is in `error`
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Create Account</h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Name */}
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 rounded w-full"
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs">{validationErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded w-full"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs">{validationErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 rounded w-full"
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs">{validationErrors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border p-2 rounded w-full"
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs">{validationErrors.password}</p>
            )}
          </div>

          {/* Other fields (no heavy validation) */}
          <div className="col-span-2 text-xs text-gray-400 text-center py-2">
  Optional details (can be added later)
</div>

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 rounded w-full"
          />

          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            className="border p-2 rounded w-full"
          />

          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="border p-2 rounded w-full"
          />

          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <textarea
          name="address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address"
          className="w-full border p-2 rounded"
        />

        {/* Global API Error */}
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-400">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={googleSignIn}
          className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded hover:bg-gray-50 transition"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.39 3.07 29.47 1 24 1 14.82 1 7.07 6.48 3.6 14.24l7.1 5.52C12.42 13.74 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.43-4.74H24v8.98h12.67c-.55 2.94-2.2 5.43-4.68 7.1l7.18 5.58C43.27 37.28 46.52 31.35 46.52 24.5z"/>
            <path fill="#FBBC05" d="M10.7 28.24A14.6 14.6 0 0 1 9.5 24c0-1.47.25-2.9.7-4.24l-7.1-5.52A23.94 23.94 0 0 0 0 24c0 3.87.93 7.53 2.6 10.76l7.1-5.52z" />
            <path fill="#34A853" d="M24 47c5.47 0 10.06-1.81 13.42-4.9l-7.18-5.58c-1.98 1.33-4.51 2.12-6.24 2.12-6.26 0-11.58-4.24-13.3-9.96l-7.1 5.52C7.07 41.52 14.82 47 24 47z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-sm mt-2">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};
