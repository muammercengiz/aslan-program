import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const MusteriDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firmaUnvani: "",
    yetkiliAdSoyad: "",
    vergiNo: "",
    sehir: "",
    adres: "",
    telefon: "",
    tur: "",
  });

  useEffect(() => {
    fetchMusteri();
  }, []);

  const fetchMusteri = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/musteriler/${id}`);
      const data = response.data;

      setFormData({
        firmaUnvani: data.firma_unvani || "",
        yetkiliAdSoyad: data.yetkili_ad_soyad || "",
        vergiNo: data.vergi_no || "",
        sehir: data.sehir || "",
        adres: data.adres || "",
        telefon: data.telefon || "",
        tur: data.tur || "",
      });
    } catch (error) {
      console.error("Müşteri bilgisi alınamadı:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/musteriler/${id}`, formData);
      navigate("/musteriler");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Müşteri Güncelle</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Firma Unvanı</label>
              <input
                type="text"
                name="firmaUnvani"
                value={formData.firmaUnvani}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Yetkili Ad Soyad</label>
              <input
                type="text"
                name="yetkiliAdSoyad"
                value={formData.yetkiliAdSoyad}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Vergi No</label>
              <input
                type="text"
                name="vergiNo"
                value={formData.vergiNo}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Şehir</label>
              <input
                type="text"
                name="sehir"
                value={formData.sehir}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Adres</label>
              <textarea
                name="adres"
                value={formData.adres}
                onChange={handleChange}
                rows="3"
                className="w-full border p-2 rounded"
              ></textarea>
            </div>

            <div>
              <label className="block mb-1 font-medium">Telefon</label>
              <input
                type="text"
                name="telefon"
                value={formData.telefon}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Tür</label>
              <input
                type="text"
                name="tur"
                value={formData.tur}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Örn: Helvacı, Simitçi"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Güncelle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MusteriDetay;
