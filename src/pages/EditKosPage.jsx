import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditKosPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [availableRooms, setAvailableRooms] = useState("");
  const [image, setImage] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState(null);

  useEffect(() => {
    const fetchKos = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/kos/${id}`);
        const kos = res.data;

        setName(kos.name);
        setLocation(kos.location);
        setPrice(kos.price);
        setAvailableRooms(kos.available_rooms);
        setOldImageUrl(kos.image_url);
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data kos");
      }
    };

    fetchKos();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const saveKos = async () => {
    if (!name || !location || !price || !availableRooms) {
      alert("Lengkapi semua field!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("available_rooms", availableRooms);
      if (image) formData.append("image", image);

      await axios.put(`http://localhost:3001/api/kos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Berhasil update kos");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Gagal update kos");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Kos</h1>

      <input
        className="border rounded p-2 mb-3 w-full"
        placeholder="Nama Kos"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border rounded p-2 mb-3 w-full"
        placeholder="Lokasi"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        className="border rounded p-2 mb-3 w-full"
        type="number"
        placeholder="Harga / bulan"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        className="border rounded p-2 mb-3 w-full"
        type="number"
        placeholder="Jumlah Kamar"
        value={availableRooms}
        onChange={(e) => setAvailableRooms(e.target.value)}
      />

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Gambar</label>
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="w-40 h-40 object-cover rounded mb-2"
          />
        ) : oldImageUrl ? (
          <img
            src={`http://localhost:3001${oldImageUrl}`}
            alt="Existing"
            className="w-40 h-40 object-cover rounded mb-2"
          />
        ) : null}
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <button
        onClick={saveKos}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Simpan
      </button>
      <button
        onClick={() => navigate("/admin/kos")}
        className="ml-4 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
      >
        Batal
      </button>
    </div>
  );
}
