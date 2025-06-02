import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const Kullanicilar = () => {
  const [kullanicilar, setKullanicilar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/kullanicilar', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Gelen kullanıcılar:", res.data);
        setKullanicilar(res.data);
      })
      .catch((err) => console.error('Kullanıcılar alınamadı:', err));
  }, []);

  const handleSil = async (id) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/kullanicilar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKullanicilar((prev) => prev.filter((k) => k.id !== id));
      } catch (err) {
        console.error('Silme hatası:', err);
        alert('Kullanıcı silinemedi.');
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
            <h2 className="text-xl font-semibold">Kullanıcılar</h2>
            <button
              onClick={() => navigate('/kullanici-ekle')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              + Kullanıcı Ekle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                  <th className="py-2 px-4">Ad Soyad</th>
                  <th className="py-2 px-4">Kullanıcı Adı</th>
                  <th className="py-2 px-4">Rol</th>
                  <th className="py-2 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {kullanicilar.map((k) => (
                  <tr key={k.id} className="border-t text-sm">
                    <td className="py-2 px-4">{k.ad_soyad || `${k.ad || k.isim || ''} ${k.soyad || k.soyisim || ''}`.trim() || '-'}</td>
                    <td className="py-2 px-4">{k.kullanici_adi}</td>
                    <td className="py-2 px-4">{k.rol}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => navigate(`/kullanicilar/${k.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Detay
                      </button>
                      <button
                        onClick={() => handleSil(k.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ml-2"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {kullanicilar.length === 0 && (
                  <tr>
                    <td className="py-4 px-4 text-center text-gray-500" colSpan="4">
                      Kayıtlı kullanıcı bulunamadı.
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

export default Kullanicilar;