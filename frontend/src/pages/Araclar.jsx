import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Araclar = () => {
  const [araclar, setAraclar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/araclar', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAraclar(res.data))
      .catch((err) => console.error('Araçlar alınamadı:', err));
  }, []);

  const handleSil = async (id) => {
    if (window.confirm('Bu aracı silmek istediğinize emin misiniz?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/araclar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAraclar((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error('Silme hatası:', err);
        alert('Araç silinemedi.');
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
            <h2 className="text-xl font-semibold">Araçlar</h2>
            <button
              onClick={() => navigate('/arac-ekle')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              + Araç Ekle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                  <th className="py-2 px-4">Plaka</th>
                  <th className="py-2 px-4">Tip</th>
                  <th className="py-2 px-4">Kapasite</th>
                  <th className="py-2 px-4">Muayene</th>
                  <th className="py-2 px-4">Marka</th>
                  <th className="py-2 px-4">Model</th>
                  <th className="py-2 px-4">Durum</th>
                  <th className="py-2 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {araclar.map((a) => (
                  <tr key={a.id} className="border-t text-sm">
                    <td className="py-2 px-4">{a.plaka}</td>
                    <td className="py-2 px-4">{a.tip}</td>
                    <td className="py-2 px-4">{a.kapasite}</td>
                    <td className="py-2 px-4">
                      {a.muayene_tarihi
                        ? new Date(a.muayene_tarihi).toLocaleDateString('tr-TR')
                        : '-'}
                    </td>
                    <td className="py-2 px-4">{a.marka || '-'}</td>
                    <td className="py-2 px-4">{a.model || '-'}</td>
                    <td className="py-2 px-4">{a.durum}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => navigate(`/arac/${a.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Detay
                      </button>
                      <button
                        onClick={() => handleSil(a.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ml-2"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {araclar.length === 0 && (
                  <tr>
                    <td className="py-4 px-4 text-center text-gray-500" colSpan="8">
                      Kayıtlı araç bulunamadı.
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

export default Araclar;
