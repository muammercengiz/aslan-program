import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UretimPlanla = () => {
  const navigate = useNavigate();
  const [urunler, setUrunler] = useState([]);
  const [hammaddeler, setHammaddeler] = useState([]);

  const [form, setForm] = useState({
    hazirlik_tarihi: '',
    uretim_tarihi: '',
    mense: '',
    cins: '',
    miktar: '',
    aciklama: '',
    urun_adi: '',
    urun_cinsi: '',
    birim: '',
    paketleme: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/urun-tanimlari', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setUrunler(res.data));

    axios.get('http://localhost:5000/api/hammadde/stok', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setHammaddeler(res.data));
  }, []);

  // Benzersiz ürün adları
  const uniqueUrunAdlari = [...new Set(urunler.map(u => u.ad))];

  
// Seçilen ürün adına göre benzersiz cinsler
  const selectedProductCinsler = urunler
    .filter(u => u.ad === form.urun_adi)
    .map(u => u.cins)
    .filter((c, i, arr) => arr.indexOf(c) === i);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'urun_adi') {
      setForm(prev => ({
        ...prev,
        urun_adi: value,
        urun_cinsi: '' // ürün değişince cins sıfırlanır
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/uretim', {
        hazirlik_tarihi: form.hazirlik_tarihi,
        uretim_tarihi: form.uretim_tarihi,
        mense: form.mense,
        cins: form.urun_cinsi,
        miktar: form.miktar,
        aciklama: form.aciklama,
        urun_adi: form.urun_adi,
        urun_cinsi: form.urun_cinsi
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Üretim planlaması kaydedildi.");
      navigate('/uretim-kayitlari');
    } catch (err) {
      console.log("🔴 Detaylı Hata:", err);
      alert("Planlama yapılamadı:\n" + (err?.response?.data?.error || err?.message || "Bilinmeyen hata"));
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 bg-gray-100 overflow-x-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Üretim Planlama</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Hazırlık Tarihi</label>
                <input type="date" name="hazirlik_tarihi" value={form.hazirlik_tarihi} onChange={handleChange} required className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium">Üretim Tarihi</label>
                <input type="date" name="uretim_tarihi" value={form.uretim_tarihi} onChange={handleChange} required className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium">Hammadde Seç</label>
                <select name="mense_cins" onChange={handleChange} className="w-full border p-2 rounded" required>
                  <option value="">-- Menşe / Cins Seç --</option>
                  {hammaddeler.map((h, index) => (
                    <option key={index} value={h.mense + '_' + h.cins}>{h.mense} / {h.cins}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">Miktar (kg)</label>
                <input type="number" name="miktar" value={form.miktar} onChange={handleChange} required className="w-full border p-2 rounded" />
              </div>
            </div>

            <div>
              <label className="block font-medium">Açıklama</label>
              <textarea name="aciklama" value={form.aciklama} onChange={handleChange} rows="3" className="w-full border p-2 rounded" />
            </div>

            <hr className="my-4" />

            <div>
              <label className="block font-medium">Ürün Adı</label>
              <select name="urun_adi" value={form.urun_adi} onChange={handleChange} required className="w-full border p-2 rounded">
                <option value="">-- Ürün Seçiniz --</option>
                {uniqueUrunAdlari.map((ad, i) => (
                  <option key={i} value={ad}>{ad}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Cinsi</label>
              <select name="urun_cinsi" value={form.urun_cinsi} onChange={handleChange} required className="w-full border p-2 rounded" disabled={!form.urun_adi || selectedProductCinsler.length === 0}>
                <option value="">-- Cins Seçiniz --</option>
                {selectedProductCinsler.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={!form.urun_adi || !form.urun_cinsi}>
              Planlamayı Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UretimPlanla;
