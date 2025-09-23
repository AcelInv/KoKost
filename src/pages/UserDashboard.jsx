import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function UserDashboard({ user, setSelectedKos, onLogout }) {
  const [search, setSearch] = useState("");
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari backend
  useEffect(() => {
    const fetchKos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/kos"); // URL diperbarui
        const mapped = res.data.map(k => ({
          ...k,
          availableRooms: k.available_rooms,
          price: Number(k.price)
        }));
        setKosList(mapped);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data kos.");
        setLoading(false);
      }
    };

    fetchKos();
  }, []);

  const filtered = kosList.filter((k) =>
    k.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">KoKost</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 hidden sm:block">
              Halo, <span className="font-semibold">{user?.email}</span>
            </span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Pencarian */}
        <div className="mb-6">
          <input
            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Cari kos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="text-gray-500">Memuat data kos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          filtered.length === 0 ? (
            <p className="text-gray-500">Tidak ada kos yang cocok dengan pencarian.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((k) => (
                <Link
                  key={k.id}
                  to={`/kos/${k.id}`}
                  onClick={() => setSelectedKos && setSelectedKos(k)}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={`http://localhost:3001${k.image_url}`}
                      alt={k.name}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        {k.name}
                      </h2>
                      <p className="text-gray-500 mb-1">{k.location}</p>
                      <p className="text-sm text-gray-400 mb-2">{k.description}</p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-semibold mb-1">
                        Rp {k.price.toLocaleString()} / bulan
                      </p>
                      <p className="text-sm text-gray-600">
                        Tersedia: {k.availableRooms} kamar
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
