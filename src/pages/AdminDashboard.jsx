import React, { useState, useEffect } from "react";
import { Home, Users, Building2, Plus, Edit, Trash } from "lucide-react";
import axios from "axios";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("kos");
  const [kosList, setKosList] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Form kos
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [availableRooms, setAvailableRooms] = useState("");
  const [image, setImage] = useState(null); // file input
  const [editingId, setEditingId] = useState(null);

  // Riwayat booking per user
  const [expandedUserId, setExpandedUserId] = useState(null);

  // Fetch data dari API
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

  // Tambah / Update Kos
  const saveKos = async () => {
    if (!name || !location || !price || !availableRooms || !image) {
      alert("Lengkapi semua field!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("available_rooms", availableRooms);
      formData.append("image", image);

      if (editingId) {
        await axios.put(`http://localhost:3001/api/kos/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:3001/api/kos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Refresh data kos
      const res = await axios.get("http://localhost:3001/api/kos");
      setKosList(res.data);

      // Reset form
      setName("");
      setLocation("");
      setPrice("");
      setAvailableRooms("");
      setImage(null);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan kos!");
    }
  };

  // Edit Kos
  const editKos = (k) => {
    setName(k.name);
    setLocation(k.location);
    setPrice(k.price);
    setAvailableRooms(k.available_rooms);
    setEditingId(k.id);
  };

  // Hapus Kos
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

  // Hapus User
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

  // Upload gambar kos
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="px-6 py-4 text-2xl font-bold text-blue-700 border-b">KoKost</div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 w-full text-left"
            >
              <Home size={18} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 w-full text-left"
            >
              <Users size={18} /> Users
            </button>
            <button
              onClick={() => setActiveTab("kos")}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 w-full text-left"
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
      <main className="flex-1 p-8">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <h1 className="text-3xl font-semibold text-gray-800">
            Selamat datang di Admin Dashboard
          </h1>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Daftar Users</h1>
            {users.length === 0 ? (
              <p className="text-gray-600">Belum ada user.</p>
            ) : (
              <div className="space-y-4">
                {users.map((u) => {
                  const userBookings = bookings.filter((b) => b.userId === u.id);
                  const isExpanded = expandedUserId === u.id;

                  return (
                    <div key={u.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-blue-700 mb-1">{u.email}</h2>
                          <p className="text-gray-600 mb-2">Role: {u.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setExpandedUserId(isExpanded ? null : u.id)}
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
                            <p className="text-gray-600 text-sm">Belum pernah booking.</p>
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
                                  const kos = kosList.find((k) => k.id === b.kosId);
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
              <h1 className="text-3xl font-semibold text-gray-800">Daftar Kos</h1>
              <button
                onClick={saveKos}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={18} /> {editingId ? "Update Kos" : "Tambah Kos"}
              </button>
            </div>

            {/* Form input */}
            <div className="grid grid-cols-5 gap-4 bg-white p-4 rounded-xl shadow mb-8">
              <input
                className="border rounded p-2"
                placeholder="Nama Kos"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="border rounded p-2"
                placeholder="Lokasi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                className="border rounded p-2"
                type="number"
                placeholder="Harga / bulan"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                className="border rounded p-2"
                type="number"
                placeholder="Jumlah Kamar"
                value={availableRooms}
                onChange={(e) => setAvailableRooms(e.target.value)}
              />
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* List Kos */}
            {kosList.length === 0 ? (
              <p className="text-gray-600">Belum ada kos.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {kosList.map((k) => (
                  <div key={k.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <div className="flex-1">
                      {k.image_url && (
                        <img
                          src={`http://localhost:3001${k.image_url}`}
                          alt={k.name}
                          className="w-full h-40 object-cover rounded mb-2"
                        />
                      )}
                      <h2 className="text-xl font-bold text-blue-700 mb-1">{k.name}</h2>
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
                        onClick={() => editKos(k)}
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
