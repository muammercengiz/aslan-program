import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const DagitimListesi = () => {
  const [dagitimlar, setDagitimlar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/dagitimlar', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setDagitimlar(res.data));
  }, []);

  const handleSil = async (id) => {
    if (window.confirm('Bu dağıtım planını silmek istediğinize emin misiniz?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/dagitimlar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDagitimlar(prev => prev.filter(d => d.id !== id));
      } catch (err) {
        console.error('Silme hatası:', err);
        alert('Dağıtım silinemedi.');
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
            <h2 className="text-xl font-bold">Dağıtım Listesi</h2>
            <button
              onClick={() => navigate('/dagitim-ekle')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              + Dağıtım Oluştur
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-2 px-4 text-left">Tarih</th>
                  <th className="py-2 px-4 text-left">Araç</th>
                  <th className="py-2 px-4 text-left">Şoför</th>
                  <th className="py-2 px-4 text-left">Yardımcı</th>
                  <th className="py-2 px-4 text-left">Güzergah</th>
                  <th className="py-2 px-4 text-left">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {dagitimlar.map((d) => (
  <tr key={d.id} className="border-t">
    <td className="py-2 px-4">
      {d.tarih ? new Date(d.tarih).toLocaleDateString('tr-TR') : '-'}
    </td>
    <td className="py-2 px-4">{d.arac_plaka}</td>
    <td className="py-2 px-4">{d.sofor_adi}</td>
    <td className="py-2 px-4">{d.yardimci_adi || '-'}</td>
    <td className="py-2 px-4">{d.guzergah}</td>
    <td className="py-2 px-4">
      <button
        onClick={() => navigate(`/dagitim/${d.id}`)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        Detay
      </button>
      <button
        onClick={() => handleSil(d.id)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ml-2"
      >
        Sil
      </button>
    </td>
  </tr>
))}

                {dagitimlar.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">Kayıtlı dağıtım bulunamadı.</td>
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

export default DagitimListesi;