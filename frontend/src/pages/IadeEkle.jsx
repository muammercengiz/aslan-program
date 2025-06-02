import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const IadeEkle = () => {
  const navigate = useNavigate();
  const [musteriler, setMusteriler] = useState([]);
  const [siparisler, setSiparisler] = useState([]);
  const [siparisDetay, setSiparisDetay] = useState(null);
  const [formData, setFormData] = useState({
    musteri_id: "",
    siparis_id: "",
    miktar: "",
    aciklama: "",
    durum: "Talep Edildi"
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/musteriler").then((res) => {
      setMusteriler(res.data);
    });
  }, []);

  const fetchSiparisler = async (musteriId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/siparisler?musteri_id=${musteriId}`
      );
      const teslimEdilenler = res.data.filter(s => s.durum === "Teslim Edildi");
      setSiparisler(teslimEdilenler);
    } catch (err) {
      console.error("Siparişler alınamadı:", err);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "musteri_id") {
      fetchSiparisler(value);
    }

    if (name === "siparis_id") {
      try {
        const res = await axios.get(`http://localhost:5000/api/siparisler/${value}`);
        setSiparisDetay(res.data);
      } catch (err) {
        console.error("Sipariş detayı alınamadı:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/iade", formData);
      alert("İade kaydı oluşturuldu.");
      navigate("/iade-islemleri");
    } catch (err) {
      console.error("İade ekleme hatası:", err);
      alert("İade eklenemedi.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Yeni İade Ekle</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Müşteri</label>
              <select
                name="musteri_id"
                value={formData.musteri_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Seçiniz</option>
                {musteriler.map((m) => (
                  <option key={m.id} value={m.id}>{m.firma_unvani}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Teslim Edilmiş Sipariş</label>
              <select
                name="siparis_id"
                value={formData.siparis_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Seçiniz</option>
                {siparisler.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.urun} - {s.miktar} {s.birim} ({s.dagitim_tarihi?.split("T")[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>İade Miktarı</label>
              <input
                type="number"
                name="miktar"
                value={formData.miktar}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {siparisDetay && (
              <div className="grid grid-cols-2 gap-4 mt-4 bg-white p-4 border rounded">
                <div>
                  <label>Paketleme</label>
                  <input type="text" readOnly value={siparisDetay.paketleme || ""} className="w-full border p-2 rounded bg-gray-100" />
                </div>
                <div>
                  <label>Birim</label>
                  <input type="text" readOnly value={siparisDetay.birim || ""} className="w-full border p-2 rounded bg-gray-100" />
                </div>
                <div>
                  <label>Paketleme Türü</label>
                  <input type="text" readOnly value={siparisDetay.paketleme_turu || ""} className="w-full border p-2 rounded bg-gray-100" />
                </div>
                <div>
                  <label>Fiyat</label>
                  <input type="text" readOnly value={siparisDetay.fiyat || ""} className="w-full border p-2 rounded bg-gray-100" />
                </div>
              </div>
            )}

            <div>
              <label>Açıklama</label>
              <textarea
                name="aciklama"
                value={formData.aciklama}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IadeEkle;
