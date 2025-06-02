import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SiparisArsiv = () => {
  const [arsiv, setArsiv] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArsiv();
  }, []);

  const fetchArsiv = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/siparisler");
      const arsivlenmis = response.data.filter(s => s.arsiv === true);
      setArsiv(arsivlenmis);
    } catch (error) {
      console.error("Arşiv siparişleri alınamadı:", error);
    }
  };

  const handleSil = async (id) => {
  if (!window.confirm("Bu siparişi silmek istiyor musunuz?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/siparisler/${id}`);
    setArsiv(prev => prev.filter(s => s.id !== id));
  } catch (error) {
    alert("Silme işlemi başarısız oldu.");
    console.error("Silme hatası:", error);
  }
};


  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Arşivlenmiş Siparişler</h2>
          <table className="min-w-max w-full table-auto bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Tarih</th>
                <th className="py-2 px-4">Müşteri</th>
                <th className="py-2 px-4">Ürün</th>
                <th className="py-2 px-4">Miktar</th>
                <th className="py-2 px-4">Durum</th>
                <th className="py-2 px-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {arsiv.map((s, index) => (
                <tr key={s.id} className="border-t text-sm">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{s.siparis_tarihi?.split("T")[0]}</td>
                  <td className="py-2 px-4">{s.musteri}</td>
                  <td className="py-2 px-4">{s.urun}</td>
                  <td className="py-2 px-4">{s.miktar}</td>
                  <td className="py-2 px-4">{s.durum}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => navigate(`/siparis/${s.id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Detay
                    </button>
                    <button
                      onClick={() => handleSil(s.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ml-2"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {arsiv.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">Henüz arşivlenmiş sipariş yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SiparisArsiv;
