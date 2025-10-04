import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function UserDashboard({ user, setSelectedKos, onLogout }) {
  const [search, setSearch] = useState("");
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter harga (default)
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20000000);

  // Input sementara sebelum disimpan
  const [tempMin, setTempMin] = useState(0);
  const [tempMax, setTempMax] = useState(20000000);

  // Toggle filter harga
  const [showFilter, setShowFilter] = useState(false);

  // Sorting
  const [sortOption, setSortOption] = useState("recommended");

  useEffect(() => {
    const fetchKos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/kos");
        const mapped = res.data.map((k) => ({
          ...k,
          availableRooms: k.available_rooms,
          price: Number(k.price),
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

  // Filter + Search
  let filtered = kosList.filter(
    (k) =>
      k.name.toLowerCase().includes(search.toLowerCase()) &&
      k.price >= minPrice &&
      k.price <= maxPrice
  );

  // Sorting
  if (sortOption === "lowest") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortOption === "highest") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">KoKost</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 hidden sm:block">
              Halo, <span className="font-semibold">{user?.username}</span>
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
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Cari kos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Dropdown Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="recommended">Paling direkomendasikan</option>
            <option value="lowest">Harga terendah</option>
            <option value="highest">Harga tertinggi</option>
          </select>
        </div>

        {/* Tombol toggle filter harga */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {showFilter ? "Tutup Filter Harga" : "Filter Harga"}
        </button>

        {/* Filter Harga */}
        {showFilter && (
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-2">Filter Harga</h2>
            <div className="flex gap-4 items-center mb-3">
              <div className="flex flex-col">
                <label className="text-sm text-gray-500">Minimal</label>
                <input
                  type="number"
                  value={tempMin}
                  onChange={(e) => setTempMin(Number(e.target.value))}
                  className="border rounded px-3 py-1"
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex flex-col">
                <label className="text-sm text-gray-500">Maksimal</label>
                <input
                  type="number"
                  value={tempMax}
                  onChange={(e) => setTempMax(Number(e.target.value))}
                  className="border rounded px-3 py-1"
                />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <button
                onClick={() => {
                  setTempMin(0);
                  setTempMax(20000000);
                  setMinPrice(0);
                  setMaxPrice(20000000);
                }}
                className="text-red-500"
              >
                Hapus
              </button>
              <button
                onClick={() => {
                  setMinPrice(tempMin);
                  setMaxPrice(tempMax);
                  setShowFilter(false);
                }}
                className="text-green-600 font-semibold"
              >
                Simpan
              </button>
            </div>
          </div>
        )}

        {loading && <p className="text-gray-500">Memuat data kos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading &&
          !error &&
          (filtered.length === 0 ? (
            <p className="text-gray-500">
              Tidak ada kos yang cocok dengan pencarian atau filter.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((k) => (
                <Link
                  key={k.id}
                  to={`/kos/${k.id}`}
                  onClick={() => setSelectedKos && setSelectedKos(k)}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={`http://localhost:3001${k.image_url}`}
                      alt={k.name}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                    {k.availableRooms === 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Full booked
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        {k.name}
                      </h2>
                      <p className="text-gray-500 mb-1">{k.location}</p>
                      <p className="text-sm text-gray-400 mb-2">
                        {k.description}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-semibold mb-1">
                        Rp {k.price.toLocaleString()} / bulan
                      </p>
                      {k.availableRooms > 0 && (
                        <p className="text-sm text-gray-600">
                          Tersedia: {k.availableRooms} kamar
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
      </main>
    </div>
  );
}
