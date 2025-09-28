import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { loadData, saveData } from "./data/storage";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import DetailKos from "./pages/DetailKos";
import AdminDashboard from "./pages/AdminDashboard";
import EditKosPage from "./pages/EditKosPage";

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [user, setUser] = useState(null);

  // Ambil user dari localStorage saat load halaman
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Simpan data ke localStorage setiap data berubah
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Fungsi login
  const handleLogin = (email, password) => {
    const u = data.users.find((x) => x.email === email && x.password === password);
    if (u) {
      setUser(u);
      localStorage.setItem("currentUser", JSON.stringify(u));
    } else alert("Email atau password salah");
  };

  // Fungsi register
  const handleRegister = (email, password) => {
    if (data.users.some((u) => u.email === email))
      return alert("Email sudah terdaftar");
    const newUser = { id: `u${Date.now()}`, email, password, role: "user" };
    setData({ ...data, users: [...data.users, newUser] });
    alert("Registrasi berhasil. Silakan login.");
  };

  // Fungsi booking kos
  const handleBooking = (kos, rooms, date) => {
    if (rooms > kos.availableRooms) return alert("Jumlah kamar tidak cukup");

    const booking = { id: `b${Date.now()}`, userId: user.id, kosId: kos.id, rooms, date };

    setData({
      ...data,
      bookings: [...data.bookings, booking],
      kosList: data.kosList.map((k) =>
        k.id === kos.id ? { ...k, availableRooms: k.availableRooms - rooms } : k
      ),
    });
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user
              ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />
              : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={<Register onRegister={handleRegister} />}
        />
        <Route
          path="/dashboard"
          element={
            user
              ? <UserDashboard data={data} user={user} onLogout={handleLogout} />
              : <Navigate to="/" />
          }
        />
        <Route
          path="/kos/:id"
          element={<DetailKos data={data} user={user} onBook={handleBooking} />}
        />
        <Route
  path="/admin"
  element={
    user && user.role === "admin"
      ? <AdminDashboard data={data} setData={setData} onLogout={handleLogout} />
      : <Navigate to="/" />
  }
/>

<Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/kos" element={<AdminDashboard />} />
        <Route path="/admin/edit-kos/:id" element={<EditKosPage />} />
        {/* <Route path="/admin/add-kos" element={<AddKosPage />} /> */}
        <Route path="*" element={<Navigate to="/admin/kos" replace />} />

      </Routes>
    </Router>
  );
}
