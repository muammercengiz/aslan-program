import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TankHareketleri = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hareketler, setHareketler] = useState([]);
  const [tankAdi, setTankAdi] = useState('');

  useEffect(() => {
    const fetchHareketler = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tank-hareketleri/${id}`);
        const data = await res.json();
        setHareketler(data);
      } catch (err) {
        console.error('Hareketler alınamadı', err);
      }
    };

    const fetchTankAdi = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tanklar`);
        const data = await res.json();
        const tank = data.find(t => t.id === parseInt(id));
        setTankAdi(tank?.ad || 'Bilinmeyen Tank');
      } catch (err) {
        console.error('Tank adı alınamadı', err);
      }
    };

    fetchHareketler();
    fetchTankAdi();
  }, [id]);

  const handleSil = async (hareket) => {
    if (!window.confirm("Bu hareket kaydını silmek istiyor musunuz?")) return;

    try {
      if (hareket.aktarim_id) {
        const res = await fetch(`http://localhost:5000/api/tank-aktarim/aktarim/${hareket.aktarim_id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setHareketler((prev) => prev.filter(h => h.aktarim_id !== hareket.aktarim_id));
        } else {
          alert("Silme işlemi başarısız.");
        }
      } else {
        const res = await fetch(`http://localhost:5000/api/tank-hareketleri/${hareket.id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setHareketler((prev) => prev.filter(h => h.id !== hareket.id));
        } else {
          alert("Silme işlemi başarısız.");
        }
      }
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Hareket silinemedi.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tank Hareketleri – {tankAdi}</h2>

      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Geri Dön
      </button>

      {hareketler.length === 0 ? (
        <p>Bu tanka ait hareket kaydı bulunamadı.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Tarih</th>
              <th className="border px-4 py-2">İşlem Tipi</th>
              <th className="border px-4 py-2">Miktar (kg)</th>
              <th className="border px-4 py-2">Açıklama</th>
              <th className="py-2 px-4">Oluşturan</th>
              <th className="border px-4 py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {hareketler.map((h) => (
              <tr key={h.id}>
                <td className="border px-4 py-2">{new Date(h.tarih).toLocaleString('tr-TR')}</td>
                <td className="border px-4 py-2">{h.islem_tipi}</td>
                <td className="border px-4 py-2">{h.miktar}</td>
                <td className="border px-4 py-2">{h.aciklama}</td>
                <td className="py-2 px-4">{h.kullanici}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleSil(h)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm rounded"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TankHareketleri;
