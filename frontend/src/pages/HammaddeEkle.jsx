// src/pages/HammaddeEkle.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const HammaddeEkle = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    mense: '',
    cins: '',
    miktar: '',
    kantar_no: '',
    plaka: '',
    giris_tarihi: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/hammadde', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Hammadde başarıyla eklendi.');
      navigate('/hammadde');
    } catch (err) {
      console.error('Kayıt hatası:', err);
      alert('Hammadde eklenemedi.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 bg-gray-100 overflow-x-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Yeni Hammadde Ekle</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full">
            <div>
              <label className="block font-medium">Menşe</label>
              <input type="text" name="mense" value={form.mense} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-medium">Cinsi</label>
              <input type="text" name="cins" value={form.cins} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-medium">Miktar (kg)</label>
              <input type="number" name="miktar" value={form.miktar} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-medium">Kantar No</label>
              <input type="text" name="kantar_no" value={form.kantar_no} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-medium">Plaka</label>
              <input type="text" name="plaka" value={form.plaka} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-medium">Giriş Tarihi</label>
              <input type="date" name="giris_tarihi" value={form.giris_tarihi} onChange={handleChange} required className="w-full border p-2 rounded" />
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

export default HammaddeEkle;
