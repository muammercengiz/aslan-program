// src/pages/HammaddeDetay.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const HammaddeDetay = () => {
  const { mense, cins } = useParams();
  const [kayitlar, setKayitlar] = useState([]);

  useEffect(() => {
    fetchKayitlar();
  }, [mense, cins]);

  const fetchKayitlar = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(
        `http://localhost:5000/api/hammadde/kayitlar?mense=${mense}&cins=${cins}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setKayitlar(res.data);
    } catch (err) {
      console.error('Detaylar alınamadı:', err);
    }
  };

  const handleSil = async (id) => {
    if (!window.confirm("Bu hammadde kaydını silmek istiyor musunuz?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/hammadde/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKayitlar(prev => prev.filter(k => k.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Silme işlemi başarısız.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 bg-gray-100 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            Hammadde Detayı: {mense} / {cins}
          </h1>

          <table className="min-w-max w-full table-auto bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                <th className="py-2 px-4">Miktar (kg)</th>
                <th className="py-2 px-4">Kantar No</th>
                <th className="py-2 px-4">Plaka</th>
                <th className="py-2 px-4">Giriş Tarihi</th>
                <th className="py-2 px-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {kayitlar.map((k, index) => (
                <tr key={index} className="border-t text-sm">
                  <td className="py-2 px-4">{Number(k.miktar).toLocaleString('tr-TR')}</td>
                  <td className="py-2 px-4">{k.kantar_no}</td>
                  <td className="py-2 px-4">{k.plaka}</td>
                  <td className="py-2 px-4">
                    {new Date(k.giris_tarihi).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleSil(k.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {kayitlar.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                    Kayıt bulunamadı.
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

export default HammaddeDetay;
