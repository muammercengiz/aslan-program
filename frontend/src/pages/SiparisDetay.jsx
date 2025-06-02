import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SiparisDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [musteriler, setMusteriler] = useState([]);
  const [urunler, setUrunler] = useState([]);
  const [stokMiktari, setStokMiktari] = useState(0);
  const [stokUyarisi, setStokUyarisi] = useState(false);

  const durumlar = [
    "Hazırlanıyor",
    "Yüklendi",
    "Dağıtım Bekliyor",
    "Dağıtımda",
    "Teslim Edildi",
  ];

  useEffect(() => {
    const fetchSiparis = async () => {
      const res = await axios.get(`http://localhost:5000/api/siparisler/${id}`);
      setFormData(res.data);
    };

    const fetchMusteriler = async () => {
      const res = await axios.get("http://localhost:5000/api/musteriler");
      setMusteriler(res.data);
    };

    const fetchUrunler = async () => {
      const res = await axios.get("http://localhost:5000/api/urunler");
      setUrunler(res.data);
    };

    fetchSiparis();
    fetchMusteriler();
    fetchUrunler();
  }, [id]);

  // Ürün seçildiğinde stok bilgisi getir
  useEffect(() => {
    if (formData?.urun_id && urunler.length > 0) {
      const seciliUrun = urunler.find((u) => u.id === parseInt(formData.urun_id));
      if (seciliUrun) {
        setStokMiktari(seciliUrun.adet || 0);
      }
    }
  }, [formData?.urun_id, urunler]);

  // Miktar değiştiğinde stok kontrolü yap
  useEffect(() => {
    if (formData?.miktar && stokMiktari > 0) {
      setStokUyarisi(formData.miktar > stokMiktari);
    } else {
      setStokUyarisi(false);
    }
  }, [formData?.miktar, stokMiktari]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["miktar", "paketleme", "fiyat"].includes(name)
        ? value === "" ? "" : parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.miktar > stokMiktari) {
      alert("❗ Sipariş miktarı stoktan fazla, güncelleme yapılmadı.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/siparisler/${id}`, formData);
      alert("✅ Sipariş başarıyla güncellendi.");
      navigate("/siparisler");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("❌ Güncelleme başarısız.");
    }
  };

  if (!formData) return <div className="p-6">Yükleniyor...</div>;

  const araToplam = (formData.miktar || 0) * (formData.paketleme || 0) * (formData.fiyat || 0);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Sipariş Detay (#{id})</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Sipariş Tarihi</label>
              <input
                type="date"
                name="siparis_tarihi"
                value={formData.siparis_tarihi ? formData.siparis_tarihi.split("T")[0] : ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label>Müşteri</label>
              <select
                name="musteri_id"
                value={formData.musteri_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                {musteriler.map((m) => (
                  <option key={m.id} value={m.id}>{m.firma_unvani}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Ürün</label>
              <select
                name="urun_id"
                value={formData.urun_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                {urunler.map((u) => (
                  <option key={u.id} value={u.id}>{u.ad}</option>
                ))}
              </select>
              {stokMiktari > 0 && (
                <p className="text-sm text-gray-700">
                  Stokta mevcut: <strong>{stokMiktari}</strong> adet
                </p>
              )}
              {stokUyarisi && (
                <p className="text-sm text-red-600">❗ Sipariş miktarı stoktan fazla!</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Miktar</label>
                <input
                  type="number"
                  name="miktar"
                  value={formData.miktar}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label>Paketleme</label>
                <input
                  type="number"
                  name="paketleme"
                  value={formData.paketleme}
                  readOnly
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Birim</label>
                <input
                  type="text"
                  name="birim"
                  value={formData.birim}
                  readOnly
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>
              <div>
                <label>Paketleme Türü</label>
                <input
                  type="text"
                  name="paketleme_turu"
                  value={formData.paketleme_turu}
                  readOnly
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label>Fiyat</label>
              <input
                type="number"
                name="fiyat"
                value={formData.fiyat}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label>Dağıtım Tarihi</label>
              <input
                type="date"
                name="dagitim_tarihi"
                value={formData.dagitim_tarihi ? formData.dagitim_tarihi.split("T")[0] : ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label>Açıklama</label>
              <textarea
                name="aciklama"
                value={formData.aciklama}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows={3}
              ></textarea>
            </div>

            <div>
              <label>Durum</label>
              <select
                name="durum"
                value={formData.durum}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                {["Hazırlanıyor", "Yüklendi", "Dağıtım Bekliyor", "Dağıtımda", "Teslim Edildi"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="bg-white p-4 border rounded">
              <h3 className="font-bold mb-2">Hesaplama</h3>
              <p>
                Ara Toplam: <strong>{araToplam.toFixed(2)} TL</strong>
              </p>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={stokUyarisi}
            >
              Güncelle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SiparisDetay;
