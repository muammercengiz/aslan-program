import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const DagitimOlustur = () => {
  const [tarih, setTarih] = useState('');
  const [aracId, setAracId] = useState('');
  const [soforId, setSoforId] = useState('');
  const [yardimciId, setYardimciId] = useState('');
  const [guzergah, setGuzergah] = useState('');

  const [araclar, setAraclar] = useState([]);
  const [personeller, setPersoneller] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/araclar', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setAraclar(res.data));

    axios.get('http://localhost:5000/api/personeller', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setPersoneller(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const payload = { tarih, aracId, soforId, yardimciId, guzergah };

    try {
      await axios.post('http://localhost:5000/api/dagitimlar', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Dağıtım planı oluşturuldu');
    } catch (err) {
      console.error('Dağıtım oluşturulamadı:', err);
      alert('Hata oluştu');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Yeni Dağıtım Planı</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Tarih</label>
              <input type="date" value={tarih} onChange={e => setTarih(e.target.value)} className="w-full border px-3 py-2 rounded" required />
            </div>

            <div>
              <label className="block mb-1 font-medium">Araç</label>
              <select value={aracId} onChange={e => setAracId(e.target.value)} className="w-full border px-3 py-2 rounded" required>
                <option value="">Seçiniz</option>
                {araclar.map(arac => <option key={arac.id} value={arac.id}>{arac.plaka}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Şoför</label>
              <select value={soforId} onChange={e => setSoforId(e.target.value)} className="w-full border px-3 py-2 rounded" required>
                <option value="">Seçiniz</option>
                {personeller.map(p => <option key={p.id} value={p.id}>{p.isim} {p.soyisim}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Yardımcı</label>
              <select value={yardimciId} onChange={e => setYardimciId(e.target.value)} className="w-full border px-3 py-2 rounded">
                <option value="">Seçiniz</option>
                {personeller.map(p => <option key={p.id} value={p.id}>{p.isim} {p.soyisim}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Güzergah</label>
              <input type="text" value={guzergah} onChange={e => setGuzergah(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Örn: İstanbul + Adapazarı" required />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Oluştur
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DagitimOlustur;
