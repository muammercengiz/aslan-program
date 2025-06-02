import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const UrunEkle = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ad: '',
    cins: '',
    adet: '',
    daralik: '',
    paketleme_turu: '',
    depo: '',
  });

  const [ambalajlar, setAmbalajlar] = useState([]);
  const [seciliAmbalaj, setSeciliAmbalaj] = useState(null);
  const [tanklar, setTanklar] = useState([]);
  const [urunTanimlari, setUrunTanimlari] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/ambalajlar', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAmbalajlar(res.data))
      .catch((err) => console.error('Ambalajlar alınamadı:', err));

    axios.get('http://localhost:5000/api/tanklar', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setTanklar(res.data))
      .catch((err) => console.error('Tanklar alınamadı:', err));

    axios.get('http://localhost:5000/api/urun-tanimlari', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUrunTanimlari(res.data))
      .catch((err) => console.error('Tanımlar alınamadı:', err));
  }, []);

  useEffect(() => {
    if (!form.paketleme_turu) return;
    const bulunan = ambalajlar.find((a) => a.ad === form.paketleme_turu);
    setSeciliAmbalaj(bulunan || null);
  }, [form.paketleme_turu, ambalajlar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const isTank = tanklar.some(t => t.ad === form.depo);
    const veri = {
      ad: form.ad,
      cins: form.cins,
      adet: Number(form.adet),
      daralik: form.daralik,
      depo: form.depo,
      ...(isTank ? {} : {
        kapasite: Number(seciliAmbalaj?.kapasite_kg || 0),
        paketleme_turu: form.paketleme_turu
      })
    };

    try {
      await axios.post('http://localhost:5000/api/urunler', veri, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/urunler');
    } catch (err) {
      console.error('Ürün eklenemedi:', err);
      alert('Ürün eklenirken bir hata oluştu.');
    }
  };

  const isTankDeposu = tanklar.some((tank) => tank.ad === form.depo);

  const hesaplananStok = () => {
    const adet = Number(form.adet || 0);
    const kapasite = Number(seciliAmbalaj?.kapasite_kg || 0);
    const dara = Number(seciliAmbalaj?.dara || 0);
    if (form.daralik === 'Daralı') {
      return adet * kapasite + adet * dara;
    }
    return adet * kapasite;
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 bg-gray-100 overflow-x-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>

          {/* Depo Seçimi */}
          <div>
            <label className="block font-medium">Depo</label>
            <select
              name="depo"
              value={form.depo}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">-- Depo Seçin --</option>
              <option value="Meydan">Meydan</option>
              <option value="Hammadde">Hammadde</option>
              {tanklar.map((tank) => (
                <option key={tank.id} value={tank.ad}>{tank.ad}</option>
              ))}
            </select>
          </div>

          {/* Ürün Seçimi */}
          <div>
            <label className="block font-medium">Ürün Seç</label>
            {(form.depo === 'Meydan' || form.depo === 'Hammadde' || tanklar.some(t => t.ad === form.depo)) && (
              <select
                required
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
            )}
          </div>

          {/* Ambalaj Seçimi (Tank değilse göster) */}
          {!isTankDeposu && (
            <div>
              <label className="block font-medium">Ambalaj Seç</label>
              <select
                name="paketleme_turu"
                value={form.paketleme_turu}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Seçiniz</option>
                {ambalajlar.map((a) => (
                  <option key={a.id} value={a.ad}>{a.ad}</option>
                ))}
              </select>

              {seciliAmbalaj && (
                <p className="text-sm text-gray-600 mt-2">
                  Seçilen ambalajın kapasitesi: <strong>{seciliAmbalaj.kapasite_kg}</strong> kg<br />
                  Dara: <strong>{seciliAmbalaj.dara}</strong> kg<br />
                  Mevcut stok: <strong>{seciliAmbalaj.miktar}</strong> adet
                </p>
              )}
            </div>
          )}

          {/* Adet */}
          <div>
            <label className="block font-medium">Adet</label>
            <input
              type="number"
              name="adet"
              value={form.adet}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Daralık (Sadece Meydan veya Hammadde için) */}
          {(form.depo === 'Meydan' || form.depo === 'Hammadde') && (
            <div>
              <label className="block font-medium">Daralık</label>
              <select
                name="daralik"
                value={form.daralik}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Seçiniz</option>
                <option value="Daralı">Daralı</option>
                <option value="Darasız">Darasız</option>
              </select>
            </div>
          )}

          {/* Hesaplanan stok */}
          {form.depo && seciliAmbalaj && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded mt-2 text-sm">
              Hesaplanan Stok: <strong>{hesaplananStok()} kg</strong>
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrunEkle;
