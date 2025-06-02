import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const TankDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ad: '', kapasite: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/api/tanklar/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setForm(res.data))
    .catch(err => {
      console.error('Tank bilgisi alınamadı:', err);
      alert('Tank bilgisi alınamadı');
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/tanklar/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Tank başarıyla güncellendi');
      navigate('/urunler');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert('Tank güncellenemedi');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">Tank Detay</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Tank Adı</label>
              <input
                type="text"
                name="ad"
                value={form.ad}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Kapasite (kg)</label>
              <input
                type="number"
                name="kapasite"
                value={form.kapasite}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
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

export default TankDetay;