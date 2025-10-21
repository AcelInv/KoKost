import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import DetailKos from "./pages/DetailKos";
import AdminDashboard from "./pages/AdminDashboard";
import EditKosPage from "./pages/EditKosPage";
import AddKos from "./pages/AddKos";

export default function App() {
  const [user, setUser] = useState(null);

  // Cek user login dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Login
  const handleLogin = async (username, password) => {
    try {
      const res = await axios.post("https://kokost-backend.vercel.app/api/users/login", {
        username,
        password,
      });

      const data = res.data;
      if (!res.status === 200) {
        alert(data.error || "Login gagal");
        return;
      }

      setUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
    } catch (err) {
      console.error(err);
      alert("Terjadi error koneksi ke server");
    }
  };

  // Register
  const handleRegister = async (username, email, password) => {
    try {
      const res = await axios.post("https://kokost-backend.vercel.app/api/users/register", {
        username,
        email,
        password,
      });

      const data = res.data;
      if (res.status !== 201 && !data.success) {
        throw new Error(data.error || "Registrasi gagal");
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  // Booking handler untuk DetailKos
  const handleBook = async (kos, rooms, date) => {
    try {
      if (!user) {
        return { success: false, error: "Silakan login terlebih dahulu" };
      }

      const res = await axios.post("https://kokost-backend.vercel.app/api/bookings", {
        user_id: user.id,
        kos_id: kos.id,
        rooms,
        start_date: date,
      });

      const data = res.data;

      if (!res.status === 201 || !data.success) {
        return { success: false, error: data.error || "Booking gagal" };
      }

      // Update jumlah available_rooms di frontend
      return { success: true, available_rooms: data.available_rooms };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: "Gagal mengajukan booking, coba lagi nanti.",
      };
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={<Register onRegister={handleRegister} />}
        />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <UserDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Detail Kos */}
        <Route
          path="/kos/:id"
          element={
            user ? (
              <DetailKos user={user} onBook={handleBook} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Admin Edit Kos */}
        <Route
          path="/admin/edit-kos/:id"
          element={
            user && user.role === "admin" ? (
              <EditKosPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/admin/add-kos" element={<AddKos />} />
      </Routes>
    </Router>
  );
}
