import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const TankTanimla = () => {
  const [ad, setAd] = useState('');
  const [kapasite, setKapasite] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tanklar', {
        ad,
        kapasite
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/urunler');
    } catch (err) {
      console.error('Tank eklenemedi:', err);
      alert('Tank eklenemedi.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-4">Tank Tanımlama</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Tank Adı</label>
              <input
                type="text"
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Kapasite (kg)</label>
              <input
                type="number"
                value={kapasite}
                onChange={(e) => setKapasite(e.target.value)}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Tank Ekle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TankTanimla;