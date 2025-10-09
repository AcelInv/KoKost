import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AddKos() {
  const navigate = useNavigate();

  // State untuk input form
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    availableRooms: "",
    description: "",
  });
  const [image, setImage] = useState(null);

  // Handle perubahan teks input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("price", formData.price);
      data.append("availableRooms", formData.availableRooms);
      data.append("description", formData.description);
      if (image) data.append("image", image);

      await axios.post("http://localhost:3001/api/kos", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Kos berhasil ditambahkan!");
      navigate("/admin"); // kembali ke dashboard
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan kos!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2" size={20} />
            <span>Kembali</span>
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
          Tambah Kos Baru
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700">Nama Kos</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Lokasi</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-700">Harga (Rp)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Kamar Tersedia</label>
              <input
                type="number"
                name="availableRooms"
                value={formData.availableRooms}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Deskripsi</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Gambar Kos</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border rounded-md p-2"
            />
            {image && (
              <p className="text-sm text-gray-500 mt-1">
                File: {image.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Simpan
          </button>
        </form>
      </div>
    </div>
  );
}
