import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const AmbalajDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ad: '',
    miktar: '',
    kapasite_kg: '',
    dara: '',
    aciklama: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/api/ambalajlar/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setForm(res.data))
      .catch((err) => {
        console.error('Ambalaj bilgisi alınamadı:', err);
        alert('Ambalaj bilgisi alınamadı.');
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/ambalajlar/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Ambalaj başarıyla güncellendi.');
      navigate('/ambalajlar');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert('Ambalaj güncellenemedi.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 bg-gray-100 overflow-x-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Ambalaj Detay</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full">
            
            <div>
              <label className="block font-medium">Ambalaj Adı</label>
              <input
                type="text"
                name="ad"
                value={form.ad || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Miktar</label>
              <input
                type="number"
                name="miktar"
                value={form.miktar || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Kapasite (kg)</label>
              <input
                type="number"
                name="kapasite_kg"
                value={form.kapasite_kg || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Dara (kg)</label>
              <input
                type="number"
                name="dara"
                value={form.dara || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Açıklama</label>
              <textarea
                name="aciklama"
                value={form.aciklama || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
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

export default AmbalajDetay;
