import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const AracGuncelle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    plaka: '',
    tip: '',
    kapasite: '',
    muayene_tarihi: '',
    marka: '',
    model: '',
    durum: 'Aktif'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:5000/api/araclar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setForm(res.data))
      .catch((err) => {
        console.error('Araç getirilemedi:', err);
        alert('Araç bilgileri alınamadı.');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/araclar/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/araclar');
    } catch (err) {
      console.error('Araç güncellenemedi:', err);
      alert('Araç güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Araç Güncelle</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full">
            <div className="mb-4">
              <label className="block font-medium mb-1">Plaka</label>
              <input
                type="text"
                name="plaka"
                value={form.plaka}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Tip</label>
              <select
                name="tip"
                value={form.tip}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Seçiniz</option>
                <option value="Kamyon & Kamyonet">Kamyon & Kamyonet</option>
                <option value="Panelvan">Panelvan</option>
                <option value="Otobüs & Minibüs">Otobüs & Minibüs</option>
                <option value="Minivan">Minivan</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Kapasite</label>
              <input
                type="number"
                name="kapasite"
                value={form.kapasite}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Muayene Tarihi</label>
              <input
                type="date"
                name="muayene_tarihi"
                value={form.muayene_tarihi}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Marka</label>
              <input
                type="text"
                name="marka"
                value={form.marka}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Model</label>
              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Durumu</label>
              <select
                name="durum"
                value={form.durum}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Aktif">Aktif</option>
                <option value="Pasif">Pasif</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Güncelle
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AracGuncelle;