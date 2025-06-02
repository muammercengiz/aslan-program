// Tedarikciler.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Tedarikciler = () => {
  const [tedarikciler, setTedarikciler] = useState([]);
  const [arama, setArama] = useState("");
  const [filtreliTedarikciler, setFiltreliTedarikciler] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTedarikciler();
  }, []);

 useEffect(() => {
  const filtreli = tedarikciler.filter((t) =>
    t.firma_unvani.toLowerCase().includes(arama.toLowerCase()) ||
    t.urunler.toLowerCase().includes(arama.toLowerCase())
  );
  setFiltreliTedarikciler(filtreli);
}, [arama, tedarikciler]);


  const fetchTedarikciler = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tedarikciler");
      setTedarikciler(response.data);
    } catch (error) {
      console.error("Tedarikçiler alınamadı:", error);
    }
  };

  const handleSil = async (id) => {
    if (window.confirm("Bu tedarikçiyi silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tedarikciler/${id}`);
        fetchTedarikciler();
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
            <h2 className="text-xl font-semibold">Tedarikçiler</h2>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Tedarikçiye veya ürüne göre ara..."
                value={arama}
                onChange={(e) => setArama(e.target.value)}
                className="border px-3 py-1 rounded shadow-sm text-sm w-64"
              />
              <button
                onClick={() => navigate("/tedarikci-ekle")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                + Tedarikçi Ekle
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Firma Unvanı</th>
                  <th className="py-2 px-4">Telefon</th>
                  <th className="py-2 px-4">Yetkili</th>
                  <th className="py-2 px-4">Aldığımız Ürünler</th>
                  <th className="py-2 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtreliTedarikciler.map((t, index) => (
                  <tr key={t.id} className="border-t text-sm">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{t.firma_unvani}</td>
                    <td className="py-2 px-4">{t.telefon}</td>
                    <td className="py-2 px-4">{t.yetkili_adi}</td>
                    <td className="py-2 px-4">{t.urunler}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => navigate(`/tedarikci/${t.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Detay
                      </button>
                      <button
                        onClick={() => handleSil(t.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {filtreliTedarikciler.length === 0 && (
                  <tr>
                    <td className="py-4 px-4 text-center text-gray-500" colSpan="6">
                      Aramanızla eşleşen tedarikçi bulunamadı.
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

export default Tedarikciler;
