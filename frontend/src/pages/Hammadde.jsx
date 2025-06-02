// src/pages/Hammadde.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Hammadde = () => {
  const [stoklar, setStoklar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/hammadde/stok', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setStoklar(res.data))
      .catch((err) => console.error('Hammadde listesi alınamadı:', err));
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Hammadde Stokları</h2>
            <button
              onClick={() => navigate('/hammadde-ekle')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              + Hammadde Ekle
            </button>
          </div>

          <table className="min-w-max w-full table-auto bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Menşe</th>
                <th className="py-2 px-4">Cinsi</th>
                <th className="py-2 px-4">Toplam Miktar (kg)</th>
                <th className="py-2 px-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {stoklar.map((item, index) => (
                <tr key={index} className="border-t text-sm">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{item.mense}</td>
                  <td className="py-2 px-4">{item.cins}</td>
                  <td className="py-2 px-4">{Number(item.toplam_miktar).toLocaleString('tr-TR')}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => navigate(`/hammadde/${item.mense}/${item.cins}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
              {stoklar.length === 0 && (
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

export default Hammadde;
