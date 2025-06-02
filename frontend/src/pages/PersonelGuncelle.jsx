import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const PersonelGuncelle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isim, setIsim] = useState("");
  const [tc, setTc] = useState("");
  const [iseBaslama, setIseBaslama] = useState("");
  const [telefon, setTelefon] = useState("");
  const [adres, setAdres] = useState("");
  const [gorev, setGorev] = useState("");
  const [durum, setDurum] = useState("Aktif");
  const [pasifTarihi, setPasifTarihi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [maas, setMaas] = useState("");
  const rol = localStorage.getItem("rol");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/api/personeller/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const p = res.data;
        setIsim(p.isim || "");
        setTc(p.tc || "");
        setIseBaslama(p.ise_baslama || "");
        setTelefon(p.telefon || "");
        setAdres(p.adres || "");
        setGorev(p.gorev || "");
        setDurum(p.durum || "Aktif");
        setPasifTarihi(p.pasif_tarihi || "");
        setAciklama(p.aciklama || "");
        setMaas(p.maas || "");
      })
      .catch((err) => {
        console.error("Veri alınamadı:", err);
        alert("Personel bilgisi getirilemedi.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/personeller/${id}`,
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
      alert("Personel güncellendi.");
      navigate("/personel");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert("Personel güncellenemedi.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Personel Güncelle</h2>
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
                <option>İzinli</option>
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
            >
              Güncelle
            </button>
          </form>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => navigate(`/personel/${id}/izinler`)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              İzinler
            </button>
            <button
              onClick={() => navigate(`/personel/${id}/devam`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Devam Durumu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonelGuncelle;