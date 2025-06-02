import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SiparisOlustur = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    siparis_tarihi: "",
    musteriId: "",
    urunId: "",
    miktar: "",
    paketleme: "",
    birim: "",
    paketlemeTuru: "",
    fiyat: "",
    dagitimTarihi: "",
    aciklama: "",
    kdvOrani: 1,
    kdvDahil: true,
    stokMiktari: 0,
  });

  const [musteriler, setMusteriler] = useState([]);
  const [urunler, setUrunler] = useState([]);
  const [urunSecildi, setUrunSecildi] = useState(false);
  const [stokUyarisi, setStokUyarisi] = useState(false);

  useEffect(() => {
    fetchMusteriler();
    fetchUrunler();
  }, []);

  const fetchMusteriler = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/musteriler");
      setMusteriler(response.data);
    } catch (error) {
      console.error("Müşteriler alınamadı:", error);
    }
  };

  const fetchUrunler = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/urunler");
      setUrunler(response.data);
    } catch (error) {
      console.error("Ürünler alınamadı:", error);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    const updatedValue =
      type === "checkbox"
        ? checked
        : ["miktar", "paketleme", "fiyat", "kdvOrani"].includes(name)
        ? value === "" ? "" : parseFloat(value)
        : value;

    const updatedForm = {
      ...formData,
      [name]: updatedValue,
    };

    if (name === "urunId") {
      const seciliUrun = urunler.find((u) => u.id === parseInt(value));
      if (seciliUrun) {
        updatedForm.birim = seciliUrun.birim;
        updatedForm.paketlemeTuru = seciliUrun.paketleme_turu;
        updatedForm.paketleme = seciliUrun.paketleme;
        updatedForm.stokMiktari = seciliUrun.adet;
        setUrunSecildi(true);
      } else {
        updatedForm.birim = "";
        updatedForm.paketlemeTuru = "";
        updatedForm.paketleme = 0;
        updatedForm.stokMiktari = 0;
        setUrunSecildi(false);
      }
    }

    setStokUyarisi(updatedForm.miktar > updatedForm.stokMiktari);
    setFormData(updatedForm);
  };

  const hesaplaToplam = () => {
    const araToplam = (formData.miktar || 0) * (formData.paketleme || 0) * (formData.fiyat || 0);
    const kdv = formData.kdvDahil ? (araToplam * (formData.kdvOrani || 0)) / 100 : 0;
    return {
      araToplam,
      kdv,
      toplam: araToplam + kdv,
    };
  };

  const { araToplam, kdv, toplam } = hesaplaToplam();

 const handleSubmit = async (e) => {
  e.preventDefault();

  const toplamSiparis = formData.miktar;
  if (toplamSiparis > formData.stokMiktari) {
    alert("❗ Sipariş miktarı stoktan fazla. Lütfen kontrol edin.");
    return;
  }

  const kullanici = JSON.parse(localStorage.getItem("kullanici"));
  const durum = kullanici.rol === "admin" ? "Hazırlanıyor" : "Onay Bekliyor";

  const duzenliDagitimTarihi = formData.dagitimTarihi.includes(".")
    ? formData.dagitimTarihi.split(".").reverse().join("-")
    : formData.dagitimTarihi;

  const bugun = new Date();
  const siparisTarihi = `${bugun.getFullYear()}-${String(bugun.getMonth() + 1).padStart(2, "0")}-${String(bugun.getDate()).padStart(2, "0")}`;

  const veri = {
    siparis_tarihi: siparisTarihi,
    musteri_id: formData.musteriId,
    urun_id: formData.urunId,
    miktar: formData.miktar,
    fiyat: formData.fiyat,
    paketleme: formData.paketleme,
    birim: formData.birim,
    paketleme_turu: formData.paketlemeTuru,
    dagitim_tarihi: duzenliDagitimTarihi,
    aciklama: formData.aciklama,
    durum, // <-- işte burası kritik
    kullanici_rol: kullanici.rol,
    olusturan_kullanici: kullanici.kullanici_adi || kullanici.isim || "Bilinmiyor"
  };
console.log("Gönderilen veri:", veri);

  try {
    await axios.post("http://localhost:5000/api/siparisler", veri);
    alert("✅ Sipariş başarıyla kaydedildi.");
    navigate("/siparisler");
  } catch (error) {
    console.error("❌ Sipariş gönderim hatası:", error);
    alert("Sipariş kaydedilemedi.");
  }
};

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Sipariş Oluştur</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Sipariş Tarihi</label>
              <input type="date" name="siparis_tarihi" value={formData.siparis_tarihi} onChange={handleChange} className="w-full border p-2 rounded" required />
            </div>

            <div>
              <label>Müşteri</label>
              <select name="musteriId" value={formData.musteriId} onChange={handleChange} className="w-full border p-2 rounded" required>
                <option value="">Seçiniz</option>
                {musteriler.map((m) => (
                  <option key={m.id} value={m.id}>{m.firma_unvani}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Ürün</label>
              <select name="urunId" value={formData.urunId} onChange={handleChange} className="w-full border p-2 rounded" required>
                <option value="">Seçiniz</option>
                {urunler.map((u) => (
                  <option key={u.id} value={u.id}>{u.ad}</option>
                ))}
              </select>
              {urunSecildi && (
                <p className="text-sm text-gray-700 mt-1">
                  Stokta mevcut: <strong>{formData.stokMiktari}</strong> adet
                </p>
              )}
              {!urunSecildi && formData.urunId && (
                <p className="text-sm text-red-600 mt-1">Bu ürün için üretim planlanmalı!</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Miktar</label>
                <input type="number" name="miktar" value={formData.miktar} onChange={handleChange} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label>Paketleme</label>
                <input type="number" name="paketleme" value={formData.paketleme} readOnly className="w-full border p-2 rounded bg-gray-100" />
              </div>
            </div>

            {stokUyarisi && (
              <p className="text-sm text-red-600">❗ Sipariş miktarı stoktan fazla!</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Birim</label>
                <input type="text" name="birim" value={formData.birim} readOnly className="w-full border p-2 rounded bg-gray-100" />
              </div>
              <div>
                <label>Paketleme Türü</label>
                <input type="text" name="paketlemeTuru" value={formData.paketlemeTuru} readOnly className="w-full border p-2 rounded bg-gray-100" />
              </div>
            </div>

            <div>
              <label>Fiyat</label>
              <input type="number" name="fiyat" value={formData.fiyat} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>

            <div>
              <label>Dağıtım Tarihi</label>
              <input type="date" name="dagitimTarihi" value={formData.dagitimTarihi} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>

            <div>
              <label>Açıklama</label>
              <textarea name="aciklama" value={formData.aciklama} onChange={handleChange} className="w-full border p-2 rounded" rows={3}></textarea>
            </div>

            <div className="bg-white p-4 border rounded space-y-2">
              <h3 className="font-bold">Fatura Hesaplama</h3>
              <div>Ara Toplam: {araToplam.toFixed(2)} TL</div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" name="kdvDahil" checked={formData.kdvDahil} onChange={handleChange} />
                <label>KDV Uygula</label>

                {formData.kdvDahil && (
                  <>
                    <span>KDV Oranı (%):</span>
                    <input
                      type="number"
                      name="kdvOrani"
                      value={formData.kdvOrani}
                      onChange={handleChange}
                      className="border p-1 rounded w-20"
                      min="0"
                    />
                  </>
                )}
              </div>

              <div>KDV Tutarı: {kdv.toFixed(2)} TL</div>
              <div className="font-semibold">Genel Toplam: {toplam.toFixed(2)} TL</div>
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

export default SiparisOlustur;
