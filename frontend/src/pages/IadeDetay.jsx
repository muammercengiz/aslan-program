import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const IadeDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    musteri: "",
    urun: "",
    miktar: "",
    aciklama: "",
    durum: ""
  });

  useEffect(() => {
    fetchIadeDetay();
  }, []);

  const fetchIadeDetay = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/iade/${id}`);

      const tumIadeler = await axios.get("http://localhost:5000/api/iade");
      const detay = tumIadeler.data.find(i => i.id == id);

      setFormData({
        musteri: detay?.musteri || "",
        urun: detay?.urun || "",
        miktar: res.data.miktar,
        aciklama: res.data.aciklama,
        durum: res.data.durum,
      });
    } catch (err) {
      console.error("İade detayı alınamadı:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/iade/${id}`, {
        durum: formData.durum,
        aciklama: formData.aciklama,
        miktar: formData.miktar
      });
      alert("İade güncellendi.");
      navigate("/iade-islemleri");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert("Güncelleme başarısız.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">İade Detay / Güncelle</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Müşteri</label>
              <input type="text" readOnly value={formData.musteri} className="w-full border p-2 rounded bg-gray-100" />
            </div>
            <div>
              <label>Ürün</label>
              <input type="text" readOnly value={formData.urun} className="w-full border p-2 rounded bg-gray-100" />
            </div>
            <div>
              <label>İade Miktarı</label>
              <input
                type="number"
                name="miktar"
                value={formData.miktar}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Durum</label>
              <select
                name="durum"
                value={formData.durum}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="Talep Edildi">Talep Edildi</option>
                <option value="Onaylandı">Onaylandı</option>
                <option value="Teslim Alındı">Teslim Alındı</option>
                <option value="Red Edildi">Red Edildi</option>
              </select>
            </div>
            <div>
              <label>Açıklama</label>
              <textarea
                name="aciklama"
                value={formData.aciklama}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Güncelle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IadeDetay;
