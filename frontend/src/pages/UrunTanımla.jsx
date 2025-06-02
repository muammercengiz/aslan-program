import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const UrunTanımla = () => {
  const [urunler, setUrunler] = useState([]);
  const [form, setForm] = useState({ ad: '', cins: '' });

  const fetchUrunler = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/urun-tanimlari', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUrunler(res.data);
    } catch (err) {
      console.error('Veriler alınamadı:', err);
    }
  };

  useEffect(() => {
    fetchUrunler();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ad || !form.cins) return alert('Lütfen tüm alanları doldurun.');
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/urun-tanimlari', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ ad: '', cins: '' });
      fetchUrunler();
    } catch (err) {
      alert('Ekleme başarısız.');
    }
  };

  const handleSil = async (id) => {
    if (!window.confirm('Bu tanımı silmek istiyor musunuz?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/urun-tanimlari/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUrunler();
    } catch (err) {
      alert('Silinemedi.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Ürün Tanımlama</h1>

          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
            <div>
              <label className="block font-medium">Ürün Adı</label>
              <input
                type="text"
                value={form.ad}
                onChange={(e) => setForm({ ...form, ad: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Cinsi</label>
              <input
                type="text"
                value={form.cins}
                onChange={(e) => setForm({ ...form, cins: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              + Tanımla
            </button>
          </form>

          <table className="w-full bg-white border rounded shadow text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Ürün Adı</th>
                <th className="py-2 px-4">Cinsi</th>
                <th className="py-2 px-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {urunler.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2 px-4">{u.ad}</td>
                  <td className="py-2 px-4">{u.cins}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleSil(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {urunler.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">Henüz ürün tanımlanmadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UrunTanımla;
