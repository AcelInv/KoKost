import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; // ikon mata

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // kontrol lihat/simpan

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-5xl overflow-hidden">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">KoKost</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
          <p className="text-gray-500 mb-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password + toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => onLogin(email, password)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center">
          <img
            src="/images/kos.jpg"
            alt="Illustration"
            className="max-w-md"
          />
        </div>
      </div>
    </div>
  );
}
