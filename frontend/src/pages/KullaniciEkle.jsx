import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const KullaniciEkle = () => {
  const [form, setForm] = useState({
    isim: '',
    soyisim: '',
    email: '',
    telefon: '',
    kullanici_adi: '',
    sifre: '',
    rol: 'operator',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/kullanicilar', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Kullanıcı başarıyla eklendi.');
      navigate('/kullanicilar');
    } catch (err) {
      console.error('Ekleme hatası:', err);
      alert('Kullanıcı eklenemedi!');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Yeni Kullanıcı Ekle</h1>
          <div className="bg-white shadow-md rounded p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {['isim', 'soyisim', 'email', 'telefon', 'kullanici_adi', 'sifre'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize mb-1">{field}</label>
                  <input
                    type={field === 'sifre' ? 'password' : 'text'}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="operator">Operatör</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
              >
                Kaydet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KullaniciEkle;