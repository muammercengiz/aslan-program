import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Siparisler = () => {
  const [siparisler, setSiparisler] = useState([]);
  const navigate = useNavigate();

  // 🔹 Veritabanından siparişleri çek
  const fetchSiparisler = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/siparisler");
    const aktifSiparisler = response.data.filter(s => s.arsiv !== true && s.arsiv !== "true");
    setSiparisler(aktifSiparisler);
  } catch (error) {
    console.error("Sipariş verileri alınamadı:", error);
  }
};


  useEffect(() => {
    fetchSiparisler();
  }, []);

  // 🔹 Sipariş sil (veritabanından)
  const handleSil = async (id) => {
    if (window.confirm("Bu siparişi silmek istiyor musunuz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/siparisler/${id}`);
        fetchSiparisler(); // Listeyi yenile
      } catch (error) {
        console.error("Silme hatası:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold">Siparişler</h2>
  <div className="space-x-2">
    <button
      onClick={() => navigate("/siparis-arsiv")}
      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
    >
      Arşiv
    </button>
    <button
      onClick={() => navigate("/siparis-ekle")}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      + Sipariş Ekle
    </button>
  </div>
</div>

          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Sipariş Tarihi</th>
                  <th className="py-2 px-4">Oluşturan</th>
                  <th className="py-2 px-4">Son Güncelleme</th>
                  <th className="py-2 px-4">Müşteri</th>
                  <th className="py-2 px-4">Ürün</th>
                  <th className="py-2 px-4">Miktar</th>
                  <th className="py-2 px-4">Paketleme</th>
                  <th className="py-2 px-4">Birim</th>
                  <th className="py-2 px-4">Dağıtım Tarihi</th>
                  <th className="py-2 px-4">Durum</th>
                  <th className="py-2 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {siparisler.map((s, index) => (
                  <tr key={s.id} className="border-t text-sm">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{s.siparis_tarihi?.split("T")[0]}</td>
                    <td className="py-2 px-4">{s.olusturan_kullanici}</td>
                    <td className="py-2 px-4">{s.guncelleme_tarihi}</td>
                    <td className="py-2 px-4">{s.musteri}</td>
                    <td className="py-2 px-4">{s.urun}</td>
                    <td className="py-2 px-4">{s.miktar}</td>
                    <td className="py-2 px-4">{s.paketleme}</td>
                    <td className="py-2 px-4">{s.birim}</td>
                    <td className="py-2 px-4">{s.dagitim_tarihi?.split("T")[0]}</td>
                    <td className="py-2 px-4">{s.durum}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => navigate(`/siparis/${s.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Detay
                      </button>
                      <button
                        onClick={() => handleSil(s.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {siparisler.length === 0 && (
                  <tr>
                    <td colSpan="12" className="text-center text-gray-500 py-4">
                      Henüz sipariş yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Siparisler;
