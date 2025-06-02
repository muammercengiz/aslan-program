import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const PersonelEkle = () => {
  const [isim, setIsim] = useState("");
  const [tc, setTc] = useState("");
  const [iseBaslama, setIseBaslama] = useState("");
  const [telefon, setTelefon] = useState("");
  const [adres, setAdres] = useState("");
  const [gorev, setGorev] = useState("Şoför");
  const [durum, setDurum] = useState("Aktif");
  const [pasifTarihi, setPasifTarihi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [maas, setMaas] = useState("");

  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/personeller",
        {
          isim,
          tc,
          ise_baslama: iseBaslama,
          telefon,
          adres,
          gorev,
          durum,
          pasif_tarihi: durum === "Pasif" ? pasifTarihi : null,
          aciklama: durum === "Pasif" ? aciklama : null,
          maas: rol === "admin" ? maas : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Personel başarıyla eklendi.");
      navigate("/personel");
    } catch (err) {
      console.error("Ekleme hatası:", err);
      alert("Personel eklenemedi.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Yeni Personel Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Ad Soyad</label>
              <input
                type="text"
                value={isim}
                onChange={(e) => setIsim(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">T.C. Kimlik No</label>
              <input
                type="text"
                value={tc}
                onChange={(e) => setTc(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                maxLength={11}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">İşe Başlama Tarihi</label>
              <input
                type="date"
                value={iseBaslama}
                onChange={(e) => setIseBaslama(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Telefon</label>
              <input
                type="text"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Adres</label>
              <textarea
                value={adres}
                onChange={(e) => setAdres(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Görev</label>
              <select
                value={gorev}
                onChange={(e) => setGorev(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option>Şoför</option>
                <option>Yardımcı</option>
                <option>Yükleme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Durum</label>
              <select
                value={durum}
                onChange={(e) => setDurum(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option>Aktif</option>
                <option>Pasif</option>
              </select>
            </div>
            {durum === "Pasif" && (
              <>
                <div>
                  <label className="block text-sm font-medium">Pasif Olma Tarihi</label>
                  <input
                    type="date"
                    value={pasifTarihi}
                    onChange={(e) => setPasifTarihi(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Açıklama</label>
                  <textarea
                    value={aciklama}
                    onChange={(e) => setAciklama(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </>
            )}
            {rol === "admin" && (
              <div>
                <label className="block text-sm font-medium">Maaş (₺)</label>
                <input
                  type="number"
                  value={maas}
                  onChange={(e) => setMaas(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="örn. 15000"
                />
              </div>
            )}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonelEkle;