import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Musteriler = () => {
  const [musteriler, setMusteriler] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMusteriler();
  }, []);

  const fetchMusteriler = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/musteriler");
      setMusteriler(response.data);
    } catch (error) {
      console.error("Müşteriler alınamadı:", error);
    }
  };

  const handleSil = async (id) => {
    if (window.confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/musteriler/${id}`);
        fetchMusteriler();
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
            <h2 className="text-xl font-semibold">Müşteriler</h2>
            <button
              onClick={() => navigate("/musteri-ekle")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              + Müşteri Ekle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Firma Unvanı</th>
                  <th className="py-2 px-4">Telefon</th>
                  <th className="py-2 px-4">Tür</th>
                  <th className="py-2 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {musteriler.map((m, index) => (
                  <tr key={m.id} className="border-t text-sm">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{m.firma_unvani}</td>
                    <td className="py-2 px-4">{m.telefon}</td>
                    <td className="py-2 px-4">{m.tur}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => navigate(`/musteri/${m.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Detay
                      </button>
                      <button
                        onClick={() => handleSil(m.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {musteriler.length === 0 && (
                  <tr>
                    <td className="py-4 px-4 text-center text-gray-500" colSpan="5">
                      Kayıtlı müşteri bulunamadı.
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

export default Musteriler;
