import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const AmbalajEkle = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ad: '',
    miktar: '',
    kapasite_kg: '',
    dara: '',
    aciklama: '',
    tedarikci_id: '',
  });

  const [tedarikciler, setTedarikciler] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/tedarikciler', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTedarikciler(res.data))
      .catch((err) => console.error('Tedarikçiler alınamadı:', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/ambalajlar', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/ambalajlar');
    } catch (err) {
      console.error('Ambalaj eklenemedi:', err);
      alert('Ambalaj eklenirken bir hata oluştu.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 bg-gray-100 overflow-x-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Yeni Ambalaj Ekle</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full">
            <div>
              <label className="block font-medium">Ambalaj Adı</label>
              <input type="text" name="ad" value={form.ad || ''} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="block font-medium">Miktar</label>
              <input type="number" name="miktar" value={form.miktar || ''} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="block font-medium">Kapasite (kg)</label>
              <input type="number" name="kapasite_kg" value={form.kapasite_kg || ''} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="block font-medium">Dara (kg)</label>
              <input type="number" name="dara" value={form.dara || ''} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="block font-medium">Tedarikçi</label>
              <select name="tedarikci_id" value={form.tedarikci_id} onChange={handleChange} required className="w-full border p-2 rounded">
                <option value="">Tedarikçi seçiniz</option>
                {tedarikciler.map((t) => (
                  <option key={t.id} value={t.id}>{t.firma_unvani}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Açıklama</label>
              <textarea name="aciklama" value={form.aciklama || ''} onChange={handleChange} className="w-full border p-2 rounded"></textarea>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AmbalajEkle;
