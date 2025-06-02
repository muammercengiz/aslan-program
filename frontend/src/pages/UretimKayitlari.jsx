// src/pages/UretimKayitlari.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const UretimKayitlari = () => {
  const [uretimler, setUretimler] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/uretim', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUretimler(res.data))
      .catch((err) => console.error('Üretim kayıtları alınamadı:', err));
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Üretim Kayıtları</h1>
            <button
              onClick={() => navigate('/uretim-planla')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              + Üretim Planla
            </button>
          </div>

          <table className="min-w-max w-full table-auto bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Hazırlık Tarihi</th>
                <th className="py-2 px-4">Üretim Tarihi</th>
                <th className="py-2 px-4">Menşe</th>
                <th className="py-2 px-4">Cinsi</th>
                <th className="py-2 px-4">Miktar</th>
                <th className="py-2 px-4">Ürün</th>
                <th className="py-2 px-4">Ürün Cinsi</th>
                <th className="py-2 px-4">Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {uretimler.map((u, index) => (
                <tr key={u.id} className="border-t text-sm">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{new Date(u.hazirlik_tarihi).toLocaleDateString('tr-TR')}</td>
                  <td className="py-2 px-4">{new Date(u.uretim_tarihi).toLocaleDateString('tr-TR')}</td>
                  <td className="py-2 px-4">{u.mense}</td>
                  <td className="py-2 px-4">{u.cins}</td>
                  <td className="py-2 px-4">{Number(u.miktar).toLocaleString('tr-TR')} kg</td>
                  <td className="py-2 px-4">{u.urun_adi}</td>
                  <td className="py-2 px-4">{u.urun_cinsi}</td>
                  <td className="py-2 px-4">{u.aciklama || '-'}</td>
                </tr>
              ))}
              {uretimler.length === 0 && (
                <tr>
                  <td className="py-4 px-4 text-center text-gray-500" colSpan="9">
                    Kayıtlı üretim bulunamadı.
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

export default UretimKayitlari;