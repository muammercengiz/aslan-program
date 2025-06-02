import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const TedarikciEkle = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firma_unvani: '',
    yetkili_adi: '',
    telefon: '',
    adres: '',
    urunler: '',
    aciklama: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tedarikciler', form);
      navigate('/tedarikciler');
    } catch (err) {
      console.error('Tedarikçi eklenemedi:', err);
      alert('Tedarikçi eklenirken bir hata oluştu.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 bg-gray-100 overflow-x-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Yeni Tedarikçi Ekle</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full">
            <div>
              <label className="block font-medium">Firma Unvanı</label>
              <input type="text" name="firma_unvani" value={form.firma_unvani} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-medium">Yetkili Adı</label>
              <input type="text" name="yetkili_adi" value={form.yetkili_adi} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-medium">Telefon</label>
              <input type="text" name="telefon" value={form.telefon} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-medium">Adres</label>
              <textarea name="adres" value={form.adres} onChange={handleChange} className="w-full border p-2 rounded"></textarea>
            </div>
            <div>
              <label className="block font-medium">Aldığımız Ürünler</label>
              <textarea name="urunler" value={form.urunler} onChange={handleChange} className="w-full border p-2 rounded"></textarea>
            </div>
            <div>
              <label className="block font-medium">Açıklama</label>
              <textarea name="aciklama" value={form.aciklama} onChange={handleChange} className="w-full border p-2 rounded"></textarea>
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

export default TedarikciEkle;
