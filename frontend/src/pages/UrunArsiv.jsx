import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const UrunArsiv = () => {
  const [urunler, setUrunler] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/urunler', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUrunler(res.data))
      .catch((err) => console.error('Ürünler alınamadı:', err));
  }, []);

  const handleSil = async (id) => {
    if (!window.confirm("Bu ürünü kalıcı olarak silmek istiyor musunuz?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/urunler/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUrunler((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Ürün silinemedi.");
    }
  };

  const arsivUrunler = urunler.filter(u => Number(u.stok) === 0);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Arşivlenmiş Ürünler</h2>

          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-200 text-left text-sm font-medium text-gray-700">
              <tr>
                <th className="py-2 px-4">Ürün Adı</th>
                <th className="py-2 px-4">Cinsi</th>
                <th className="py-2 px-4">Birim</th>
                <th className="py-2 px-4">Depo</th>
                <th className="py-2 px-4">Durum</th>
                <th className="py-2 px-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {arsivUrunler.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                    Arşivde ürün yok.
                  </td>
                </tr>
              ) : (
                arsivUrunler.map((u) => (
                  <tr key={u.id} className="border-t text-sm">
                    <td className="py-2 px-4">{u.ad}</td>
                    <td className="py-2 px-4">{u.cins}</td>
                    <td className="py-2 px-4">{u.birim}</td>
                    <td className="py-2 px-4">{u.depo}</td>
                    <td className="py-2 px-4 text-red-600 font-medium">Stok Yok</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleSil(u.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UrunArsiv;
