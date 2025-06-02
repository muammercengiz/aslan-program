import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Onaylar = () => {
  const [siparisler, setSiparisler] = useState([]);
  const navigate = useNavigate();

  const fetchSiparisler = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/siparisler");
      const bekleyenler = res.data.filter(s => s.durum === "Onay Bekliyor");
      setSiparisler(bekleyenler);
    } catch (err) {
      console.error("Onay bekleyen siparişler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchSiparisler();
  }, []);

  const handleOnayla = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/siparisler/${id}`, {
        durum: "Hazırlanıyor"
      });
      alert("✅ Sipariş onaylandı.");
      fetchSiparisler();
    } catch (err) {
      console.error("Onaylama hatası:", err);
      alert("❌ Sipariş onaylanamadı.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Onay Bekleyen Siparişler</h2>

          <table className="min-w-full table-auto bg-white border rounded shadow text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Tarih</th>
                <th className="py-2 px-4">Müşteri</th>
                <th className="py-2 px-4">Ürün</th>
                <th className="py-2 px-4">Miktar</th>
                <th className="py-2 px-4">Oluşturan</th>
                <th className="py-2 px-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {siparisler.map((s, index) => (
                <tr key={s.id} className="border-t">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{s.siparis_tarihi?.split("T")[0]}</td>
                  <td className="py-2 px-4">{s.musteri}</td>
                  <td className="py-2 px-4">{s.urun}</td>
                  <td className="py-2 px-4">{s.miktar}</td>
                  <td className="py-2 px-4">{s.olusturan_kullanici}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => navigate(`/siparis/${s.id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Detay
                    </button>
                    <button
                      onClick={() => handleOnayla(s.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Onayla
                    </button>
                  </td>
                </tr>
              ))}
              {siparisler.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    Onay bekleyen sipariş yok.
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

export default Onaylar;
