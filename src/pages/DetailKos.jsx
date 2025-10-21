import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";

// Import icon
import { FiWifi } from "react-icons/fi";
import { FaParking, FaBath, FaUserFriends } from "react-icons/fa";
import { MdTv, MdBlock } from "react-icons/md";
import { GiBabyBottle } from "react-icons/gi";

export default function DetailKos({ user, onBook }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kos, setKos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState(1);
  const [date, setDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch kos data
  useEffect(() => {
    const fetchKos = async () => {
      try {
        const res = await axios.get(`https://kokost-backend.vercel.app/api/kos`);
        const kosData = res.data.find((k) => k.id === Number(id));
        setKos(kosData || null);
      } catch (err) {
        console.error(err);
        setKos(null);
      } finally {
        setLoading(false);
      }
    };
    fetchKos();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-700">Memuat data kos...</p>;
  if (!kos) return <p className="p-6 text-gray-700">Kos tidak ditemukan</p>;

  const handleBooking = async () => {
    if (!date) {
      alert("Pilih tanggal mulai sewa terlebih dahulu");
      return;
    }

    const today = new Date();
    const selectedDate = new Date(date + "T00:00:00");
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Tanggal mulai sewa tidak boleh tanggal yang sudah lewat");
      return;
    }

    if (!user) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    const result = await onBook(kos, rooms, date);
    if (result.success) {
      // update available_rooms di frontend
      setKos((prev) => ({
        ...prev,
        available_rooms: prev.available_rooms - rooms,
      }));
      setShowModal(true);
    } else {
      alert(result.error || "Booking gagal, coba lagi nanti.");
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bukti Booking KoKost", 105, 20, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(20, 28, 190, 28);

    doc.setFontSize(12);
    doc.text(`Nama Kos     : ${kos.name}`, 20, 40);
    doc.text(`Lokasi       : ${kos.location}`, 20, 50);
    doc.text(
      `Harga        : Rp ${Number(kos.price).toLocaleString()} / bulan`,
      20,
      60
    );
    doc.text(`Jumlah Kamar : ${rooms}`, 20, 70);
    doc.text(`Mulai Sewa   : ${date}`, 20, 80);

    doc.setFontSize(10);
    doc.text("Terima kasih telah menggunakan layanan KoKost.", 105, 100, {
      align: "center",
    });

    doc.save(`BuktiBooking-${kos.name}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            KoKost
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: gambar & deskripsi */}
        <div className="lg:col-span-2">
          <div className="aspect-video w-full rounded-xl overflow-hidden mb-4">
            <img
              src={`https://kokost-backend.vercel.app${kos.image_url}`}
              alt={kos.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
            <p className="text-gray-700 leading-relaxed">
              {kos.description || "Belum ada deskripsi untuk kos ini."}
            </p>
          </div>

          {/* Fasilitas */}
          <div className="bg-white rounded-xl shadow p-5 mt-6">
            <h2 className="text-xl font-semibold mb-4">Fasilitas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700">
              <div className="flex items-center gap-2">
                <FiWifi className="text-blue-500 text-xl" />
                <span>WiFi Gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <FaParking className="text-blue-500 text-xl" />
                <span>Parkir</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBath className="text-blue-500 text-xl" />
                <span>Kamar Mandi</span>
              </div>
              <div className="flex items-center gap-2">
                <MdTv className="text-blue-500 text-xl" />
                <span>TV Kabel</span>
              </div>
            </div>
          </div>

          {/* Peraturan */}
          <div className="bg-white rounded-xl shadow p-5 mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Peraturan khusus tipe kamar ini
            </h2>
            <div className="flex flex-col gap-3 text-gray-700">
              <div className="flex items-center gap-2">
                <FaUserFriends className="text-blue-500 text-xl" />
                <span>Tipe ini bisa diisi maks. 2 orang/ kamar</span>
              </div>
              <div className="flex items-center gap-2">
                <MdBlock className="text-red-500 text-xl" />
                <span>Tidak untuk pasutri</span>
              </div>
              <div className="flex items-center gap-2">
                <GiBabyBottle className="text-pink-500 text-xl" />
                <span>Tidak boleh bawa anak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: info & booking */}
        <div className="bg-white shadow-md rounded-xl p-6 h-fit">
          <h1 className="text-2xl font-bold mb-2">{kos.name}</h1>
          <p className="text-gray-600 mb-1">{kos.location}</p>
          <p className="text-blue-500 text-xl font-semibold mb-4">
            Rp {Number(kos.price).toLocaleString()} / bulan
          </p>

          {kos.available_rooms === 0 ? (
            <p className="text-red-500 font-semibold mb-4">Full booked</p>
          ) : (
            <>
              <p className="text-gray-700 mb-4">
                Tersedia: {kos.available_rooms} kamar
              </p>

              <label className="block text-sm text-gray-700 mb-1">
                Jumlah Kamar
              </label>
              <input
                type="number"
                min="1"
                max={kos.available_rooms}
                value={rooms}
                onChange={(e) =>
                  setRooms(
                    Math.min(
                      Math.max(1, Number(e.target.value)),
                      kos.available_rooms
                    )
                  )
                }
                className="border rounded w-full px-3 py-2 mb-4"
              />

              <label className="block text-sm text-gray-700 mb-1">
                Mulai Sewa
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded w-full px-3 py-2 mb-6"
              />

              <button
                onClick={handleBooking}
                className="bg-blue-500 hover:bg-blue-600 text-white w-full py-3 rounded-lg font-semibold"
              >
                Ajukan Sewa
              </button>
            </>
          )}
        </div>
      </main>

      {/* Modal sukses */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-96 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Booking Sukses!
            </h2>
            <p className="text-gray-700 mb-6">
              Terima kasih, booking Anda untuk <b>{kos.name}</b> berhasil.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Unduh Bukti Booking
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/dashboard");
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
