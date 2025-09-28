import React, { useState, useEffect } from "react";
import { Home, Users, Building2, Plus, Edit, Trash } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("kos");
  const [kosList, setKosList] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kosRes, usersRes, bookingsRes] = await Promise.all([
          axios.get("http://localhost:3001/api/kos"),
          axios.get("http://localhost:3001/api/users"),
          axios.get("http://localhost:3001/api/bookings"),
        ]);

        setKosList(kosRes.data);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data dari server");
      }
    };

    fetchData();
  }, []);

  const deleteKos = async (id) => {
    if (!window.confirm("Apakah yakin ingin menghapus kos ini?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/kos/${id}`);
      setKosList(kosList.filter((k) => k.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus kos!");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Apakah yakin ingin menghapus user ini?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus user!");
    }
  };

  // Data untuk visualisasi management kos (dashboard)
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const totalKos = kosList.length;
  const totalAvailableRooms = kosList.reduce((acc, k) => acc + k.available_rooms, 0);
  const totalBookedRooms = bookings.reduce((acc, b) => acc + b.rooms, 0);
  const totalRooms = totalAvailableRooms + totalBookedRooms;

  const roomStatusData = [
    { name: "Tersedia", value: totalAvailableRooms },
    { name: "Terisi", value: totalBookedRooms },
  ];

  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 text-2xl font-bold text-blue-700 border-b">
            KoKost
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 p-2 rounded-md w-full text-left ${
                activeTab === "dashboard"
                  ? "bg-blue-100 font-semibold border-l-4 border-blue-600"
                  : "hover:bg-gray-200"
              }`}
            >
              <Home size={18} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 p-2 rounded-md w-full text-left ${
                activeTab === "users"
                  ? "bg-blue-100 font-semibold border-l-4 border-blue-600"
                  : "hover:bg-gray-200"
              }`}
            >
              <Users size={18} /> Users
            </button>
            <button
              onClick={() => setActiveTab("kos")}
              className={`flex items-center gap-3 p-2 rounded-md w-full text-left ${
                activeTab === "kos"
                  ? "bg-blue-100 font-semibold border-l-4 border-blue-600"
                  : "hover:bg-gray-200"
              }`}
            >
              <Building2 size={18} /> Kos
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white w-full px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              Dashboard Admin
            </h1>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Total Kos</h2>
                <p className="text-3xl font-bold text-blue-700">{totalKos}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Total Kamar</h2>
                <p className="text-3xl font-bold text-blue-700">{totalRooms}</p>
                <p className="text-gray-500 text-sm">
                  (Tersedia: {totalAvailableRooms} | Terisi: {totalBookedRooms})
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Rata-rata Harga</h2>
                <p className="text-3xl font-bold text-blue-700">
                  Rp{" "}
                  {(
                    kosList.reduce((acc, k) => acc + Number(k.price), 0) /
                      totalKos || 0
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Status Kamar
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={roomStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {roomStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              Daftar Users
            </h1>
            {users.length === 0 ? (
              <p className="text-gray-600">Belum ada user.</p>
            ) : (
              <div className="space-y-4">
                {users.map((u) => {
                  const userBookings = bookings.filter((b) => b.userId === u.id);
                  const isExpanded = expandedUserId === u.id;

                  return (
                    <div
                      key={u.id}
                      className="bg-white rounded-xl shadow p-4 flex flex-col"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-blue-700 mb-1">
                            {u.email}
                          </h2>
                          <p className="text-gray-600 mb-2">Role: {u.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setExpandedUserId(isExpanded ? null : u.id)
                            }
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Info
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                          >
                            <Trash size={16} /> Hapus
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 overflow-x-auto">
                          {userBookings.length === 0 ? (
                            <p className="text-gray-600 text-sm">
                              Belum pernah booking.
                            </p>
                          ) : (
                            <table className="min-w-full border border-gray-300">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="px-3 py-2 border">Nama Kos</th>
                                  <th className="px-3 py-2 border">Jumlah Kamar</th>
                                  <th className="px-3 py-2 border">Tanggal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {userBookings.map((b) => {
                                  const kos = kosList.find(
                                    (k) => k.id === b.kosId
                                  );
                                  return (
                                    <tr key={b.id} className="text-center">
                                      <td className="px-3 py-2 border">
                                        {kos ? kos.name : "Kos telah dihapus"}
                                      </td>
                                      <td className="px-3 py-2 border">{b.rooms}</td>
                                      <td className="px-3 py-2 border">{b.date}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Kos */}
        {activeTab === "kos" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">
                Management Kos
              </h1>
              <button
                onClick={() => navigate("/admin/add-kos")}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                <Plus size={16} /> Tambah Kos
              </button>
            </div>

            {kosList.length === 0 ? (
              <p className="text-gray-600">Belum ada kos.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {kosList.map((k) => (
                  <div
                    key={k.id}
                    className="bg-white rounded-xl shadow p-4 flex flex-col"
                  >
                    <div className="flex-1">
                      {k.image_url && (
                        <img
                          src={`http://localhost:3001${k.image_url}`}
                          alt={k.name}
                          className="w-full h-40 object-cover rounded mb-2"
                        />
                      )}
                      <h2 className="text-xl font-bold text-blue-700 mb-1">
                        {k.name}
                      </h2>
                      <p className="text-gray-600">{k.location}</p>
                      <p className="font-semibold mt-2">
                        Rp {Number(k.price).toLocaleString()} / bulan
                      </p>
                      <p className="text-sm text-gray-500">
                        Tersedia: {k.available_rooms} kamar
                      </p>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => navigate(`/admin/edit-kos/${k.id}`)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => deleteKos(k.id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        <Trash size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
