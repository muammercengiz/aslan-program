import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TanktanCikis = () => {
  const navigate = useNavigate();
  const [tanklar, setTanklar] = useState([]);
  const [ambalajlar, setAmbalajlar] = useState([]);

  const [formData, setFormData] = useState({
    tank_id: '',
    hedef_depo: 'Meydan',
    paketleme_turu: '',
    adet: '',
    daralik: 'Daralı'
  });

  const [secilenTank, setSecilenTank] = useState(null);
  const [secilenAmbalaj, setSecilenAmbalaj] = useState(null);
  const [hesaplananCikis, setHesaplananCikis] = useState(null);
  const [tanktanDusulecek, setTanktanDusulecek] = useState(null);
  const [kalanStok, setKalanStok] = useState(null);

  useEffect(() => {
    const fetchTanklar = async () => {
      const res = await axios.get(`http://localhost:5000/api/tanklar`);
      setTanklar(res.data);
    };

    const fetchAmbalajlar = async () => {
      const res = await axios.get(`http://localhost:5000/api/ambalajlar`);
      setAmbalajlar(res.data);
    };

    fetchTanklar();
    fetchAmbalajlar();
  }, []);

  useEffect(() => {
    if (!secilenTank || !secilenAmbalaj || !formData.adet) {
      setHesaplananCikis(null);
      setKalanStok(null);
      return;
    }

    const kapasite = Number(secilenAmbalaj.kapasite_kg);
    const dara = Number(secilenAmbalaj.dara || 0);
    const adet = Number(formData.adet);
    const daralik = formData.daralik;

    const urunStok = daralik === 'Daralı'
      ? adet * (kapasite + dara)
      : adet * kapasite;

    const tanktanDusulecek = daralik === 'Daralı'
      ? adet * kapasite
      : adet * (kapasite - dara);

    const kalan = secilenTank.stok - tanktanDusulecek;

    setTanktanDusulecek(tanktanDusulecek);

    setHesaplananCikis(urunStok);
    setKalanStok(kalan);
  }, [formData, secilenTank, secilenAmbalaj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'tank_id') {
      const tank = tanklar.find(t => t.id.toString() === value);
      setSecilenTank(tank || null);
    }
    if (name === 'paketleme_turu') {
      const ambalaj = ambalajlar.find(a => a.ad === value);
      setSecilenAmbalaj(ambalaj || null);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('kullanici'));

  try {
    const payload = {
      ...formData,
      tank_id: Number(formData.tank_id),
      adet: Number(formData.adet),
      kapasite: secilenAmbalaj?.kapasite_kg,
      dara: secilenAmbalaj?.dara || 0,
      kullanici: user?.isim || 'Bilinmiyor'
    };

    await axios.post('http://localhost:5000/api/tanktan-cikis', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Tanktan çıkış başarıyla yapıldı');
    navigate('/urunler');
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || 'İşlem sırasında hata oluştu');
  }
};


  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Tanktan Ürün Çıkışı</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tank Seç</label>
          <select name="tank_id" value={formData.tank_id} onChange={handleChange} className="border p-2 rounded w-full" required>
            <option value="">Seçiniz</option>
            {tanklar.map((t) => (
              <option key={t.id} value={t.id}>{t.ad} ({t.urun_adi || '-'} / {t.urun_cinsi || '-'})</option>
            ))}
          </select>
        </div>

        {secilenTank && (
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Ürün Adı:</strong> {secilenTank.urun_adi}</p>
            <p><strong>Cinsi:</strong> {secilenTank.urun_cinsi}</p>
            <p><strong>Tanktaki Stok:</strong> {secilenTank.stok} kg</p>
          </div>
        )}

        <div>
          <label className="block font-medium">Hedef Depo</label>
          <select name="hedef_depo" value={formData.hedef_depo} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="Meydan">Meydan</option>
            <option value="Hammadde">Hammadde</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Ambalaj Türü</label>
          <select name="paketleme_turu" value={formData.paketleme_turu} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Seçiniz</option>
            {ambalajlar.map((a) => (
              <option key={a.id} value={a.ad}>{a.ad}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Adet (ambalaj sayısı)</label>
          <input
            type="number"
            name="adet"
            value={formData.adet}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Daralık</label>
          <select name="daralik" value={formData.daralik} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="Daralı">Daralı</option>
            <option value="Darasız">Darasız</option>
          </select>
        </div>

        {secilenAmbalaj && (
          <div className="bg-yellow-100 p-3 rounded text-yellow-800 mt-2">
            <p><strong>Ambalaj Stok Miktarı:</strong> {secilenAmbalaj.miktar} adet</p>
          </div>
        )}

       {hesaplananCikis !== null && (
  <div className="p-4 bg-blue-100 rounded text-blue-800 space-y-1">
    <p><strong>Stoktan Düşülecek Miktar (kg):</strong> {tanktanDusulecek.toFixed(2)} kg</p>
    <p><strong>Toplam Çıkış (Ürün + Ambalaj):</strong> {hesaplananCikis.toFixed(2)} kg</p>
    <p><strong>Kalan Tank Stoku:</strong> {kalanStok.toFixed(2)} kg</p>
  </div>
)}


        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default TanktanCikis;