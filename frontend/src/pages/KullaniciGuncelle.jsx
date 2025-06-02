import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from '../components/Sidebar';

const KullaniciGuncelle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    isim: "",
    soyisim: "",
    email: "",
    telefon: "",
    kullanici_adi: "",
    sifre: "",
    rol: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/kullanicilar/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          isim: data.isim || "",
          soyisim: data.soyisim || "",
          email: data.email || "",
          telefon: data.telefon || "",
          kullanici_adi: data.kullanici_adi || "",
          sifre: "",
          rol: data.rol || "",
        });
      })
      .catch((err) => {
        console.error("Kullanıcı bilgileri alınamadı:", err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };
    if (!payload.sifre) {
      delete payload.sifre;
    }

    try {
      await axios.put(`http://localhost:5000/api/kullanicilar/${id}`, payload);
      navigate("/kullanicilar");
    } catch (err) {
      console.error("Güncelleme sırasında hata:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-8 overflow-x-auto">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded px-8 py-6">
          <h2 className="text-xl font-bold mb-4">Kullanıcı Güncelle</h2>
          <form onSubmit={handleSubmit}>
            {["isim", "soyisim", "email", "telefon", "kullanici_adi"].map((name) => (
              <div key={name} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">{name}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Şifre</label>
              <input
                type="password"
                name="sifre"
                placeholder="Değiştirmiyorsan boş bırak"
                value={formData.sifre}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Rol</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3"
              >
                <option value="">Seçiniz</option>
                <option value="admin">Admin</option>
                <option value="operator">Operatör</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Güncelle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KullaniciGuncelle;