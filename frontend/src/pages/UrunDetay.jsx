// src/pages/UrunDetay.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const UrunDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ad: '',
    cins: '',
    adet: '',
    kapasite: '',
    dara: '',
    daralik: 'Daralı',  // Varsayılan değer
    birim: '',
    paketleme_turu: '',
    depo: '',
  });

  const [urunTanimlari, setUrunTanimlari] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:5000/api/urunler/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setForm(res.data))
      .catch((err) => {
        console.error('Ürün bilgisi alınamadı:', err);
        alert('Ürün bilgisi alınamadı.');
      });

    axios.get('http://localhost:5000/api/urun-tanimlari', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUrunTanimlari(res.data))
      .catch((err) => {
        console.error('Tanımlar alınamadı:', err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/urunler/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Ürün başarıyla güncellendi.');
      navigate('/urunler');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert('Ürün güncellenemedi.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 bg-gray-100 overflow-x-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Ürün Detay</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full">

            <div>
              <label className="block font-medium">Ürün Seç</label>
              <select
                className="w-full border p-2 rounded"
                value={`${form.ad}|${form.cins}`}
                onChange={(e) => {
                  const [ad, cins] = e.target.value.split('|');
                  setForm({ ...form, ad, cins });
                }}
              >
                <option value="">-- Ürün Seçin --</option>
                {urunTanimlari.map((u) => (
                  <option key={u.id} value={`${u.ad}|${u.cins}`}>
                    {u.ad} – {u.cins}
                  </option>
                ))}
              </select>
            </div>

            {[  
              { label: 'Adet', name: 'adet', type: 'number' },
              { label: 'Kapasite', name: 'kapasite', type: 'number' },
              { label: 'Dara', name: 'dara', type: 'number' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block font-medium">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name] || ''}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                  min="0"
                  step="any"
                />
              </div>
            ))}

            <div>
              <label className="block font-medium">Daralık</label>
              <select
                name="daralik"
                value={form.daralik || 'Daralı'}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="Daralı">Daralı</option>
                <option value="Darasız">Darasız</option>
              </select>
            </div>

            {[  
              { label: 'Birim', name: 'birim' },
              { label: 'Paketleme Türü', name: 'paketleme_turu' },
              { label: 'Depo', name: 'depo' },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block font-medium">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={form[name] || ''}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UrunDetay;
