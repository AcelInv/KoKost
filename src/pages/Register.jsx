import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // cegah reload
    try {
      await onRegister(username, email, password);
      window.alert("Registrasi berhasil! Silakan login.");
      navigate("/"); // arahkan ke login
    } catch (err) {
      window.alert("Registrasi gagal. Coba lagi.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-5xl overflow-hidden">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">KoKost</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-1">Register Now</h2>
          <p className="text-gray-500 mb-6">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Sign In.
            </Link>
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="yourusername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="youremail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            {/* Password + toggle */}
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              SIGN UP
            </button>
            <p className="text-xs text-gray-400 text-center">
              By clicking the Sign Up button, you agree to the Privacy Policy.
            </p>
          </form>
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center">
          <img src="/images/kos.jpg" alt="Illustration" className="max-w-lg" />
        </div>
      </div>
    </div>
  );
}
