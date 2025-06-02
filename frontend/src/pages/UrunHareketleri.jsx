import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UrunHareketleri = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hareketler, setHareketler] = useState([]);
  const [urunAdi, setUrunAdi] = useState('');

  useEffect(() => {
    const fetchHareketler = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/urun-hareketleri/${id}`);
        const data = await res.json();
        setHareketler(data);
      } catch (err) {
        console.error('Hareketler alınamadı', err);
      }
    };

    const fetchUrunAdi = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/urunler`);
        const data = await res.json();
        const urun = data.find(u => u.id === parseInt(id));
        setUrunAdi(urun ? `${urun.ad} – ${urun.cins}` : 'Bilinmeyen Ürün');
      } catch (err) {
        console.error('Ürün adı alınamadı', err);
      }
    };

    fetchHareketler();
    fetchUrunAdi();
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ürün Hareketleri – {urunAdi}</h2>

      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Geri Dön
      </button>

      {hareketler.length === 0 ? (
        <p>Bu ürüne ait hareket kaydı bulunamadı.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Tarih</th>
              <th className="border px-4 py-2">İşlem Tipi</th>
              <th className="border px-4 py-2">Miktar</th>
              <th className="border px-4 py-2">Açıklama</th>
            </tr>
          </thead>
          <tbody>
            {hareketler.map((h) => (
              <tr key={h.id}>
                <td className="border px-4 py-2">{new Date(h.tarih).toLocaleString('tr-TR')}</td>
                <td className="border px-4 py-2">{h.islem_tipi}</td>
                <td className="border px-4 py-2">{h.miktar}</td>
                <td className="border px-4 py-2">{h.aciklama}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UrunHareketleri;
