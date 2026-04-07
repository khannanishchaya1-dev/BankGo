import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/authSlice";
import { useEffect } from "react";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
const { loading, error, isAuthenticated } = useSelector(
  (state) => state.auth
);

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    console.error("Passwords do not match");
    return;
  }
  dispatch(
    registerUser({
      name: form.name,
      address: form.address,
      email: form.email,
      password: form.password,
    })
  );
};
useEffect(() => {
  if (isAuthenticated) {
    navigate("/dashboard");
  }
}, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 px-6 py-10 text-white">

      {/* Logo Section */}
      <div className="text-center mt-6 mb-10">
        <div className="inline-block bg-white/10 px-8 py-4 rounded-3xl shadow-xl">
          <h1 className="text-3xl font-bold tracking-wide">
            Bank<span className="text-pink-400">Go</span>
          </h1>
        </div>
        <p className="text-indigo-200 text-sm mt-4">
          Create your secure banking account
        </p>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-5"
      >

        {/* Name */}
        <div>
          <label className="text-sm text-indigo-200">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-indigo-300"
            placeholder="Enter your full name"
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm text-indigo-200">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
            className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-indigo-300"
            placeholder="Enter your address"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-indigo-200">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-indigo-300"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-indigo-200">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-indigo-300"
            placeholder="Create a password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-indigo-200">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
            className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border ${
              error ? "border-red-400" : "border-white/20"
            } focus:outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-indigo-300`}
            placeholder="Confirm your password"
          />
          {error && (
            <p className="text-red-400 text-xs mt-1">{error}</p>
          )}
        </div>

        {/* Button */}
        <button
  type="submit"
  disabled={loading}
  className="w-full mt-6 bg-pink-500 py-3.5 rounded-2xl font-semibold shadow-lg text-sm disabled:opacity-60"
>
  {loading ? "Creating Account..." : "Register"}
</button>

      </form>

      {/* Login Link */}
      <div className="text-center mt-8 text-sm text-indigo-200">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-pink-400 cursor-pointer hover:underline"
        >
          Login
        </span>
      </div>
    </div>
  );
}