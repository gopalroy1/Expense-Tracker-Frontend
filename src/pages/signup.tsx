import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import { useApi } from "../hooks/useApi";
import { setAuthData } from "../utils/setAuth";
import { signupSchema } from "../validation/signUpSchema";

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
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
      setAuthData(data.token, data.user);
      navigate("/dashboard");
    } catch {
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
