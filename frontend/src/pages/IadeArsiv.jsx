import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const IadeArsiv = () => {
  const [arsiv, setArsiv] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArsiv();
  }, []);

  const fetchArsiv = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/iade");
      const arsivlenmisler = res.data.filter(i => i.arsiv === true);
      setArsiv(arsivlenmisler);
    } catch (err) {
      console.error("Arşiv verileri alınamadı:", err);
    }
  };

  const handleSil = async (id) => {
    if (window.confirm("Bu arşivlenmiş iadeyi silmek istiyor musunuz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/iade/${id}`);
        fetchArsiv();
      } catch (err) {
        console.error("Silme hatası:", err);
      }
    }
  };

  const durumRenk = (durum) => {
    switch (durum) {
      case "Talep Edildi": return "bg-yellow-200 text-yellow-800";
      case "Onaylandı": return "bg-blue-200 text-blue-800";
      case "Teslim Alındı": return "bg-green-200 text-green-800";
      case "Red Edildi": return "bg-red-200 text-red-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">İade Arşivleri</h2>

          <table className="min-w-max w-full table-auto bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Müşteri</th>
                <th className="py-2 px-4">Ürün</th>
                <th className="py-2 px-4">Miktar</th>
                <th className="py-2 px-4">Tarih</th>
                <th className="py-2 px-4">Durum</th>
                <th className="py-2 px-4">Açıklama</th>
                <th className="py-2 px-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {arsiv.map((iade, index) => (
                <tr key={iade.id} className="border-t text-sm">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{iade.musteri}</td>
                  <td className="py-2 px-4">{iade.urun}</td>
                  <td className="py-2 px-4">{iade.miktar}</td>
                  <td className="py-2 px-4">{iade.tarih?.split("T")[0]}</td>
                  <td className={`py-2 px-4 font-semibold rounded ${durumRenk(iade.durum)}`}>{iade.durum}</td>
                  <td className="py-2 px-4">{iade.aciklama}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => navigate(`/iade/${iade.id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Detay
                    </button>
                    <button
                      onClick={() => handleSil(iade.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {arsiv.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                    Henüz arşivlenmiş iade yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IadeArsiv;