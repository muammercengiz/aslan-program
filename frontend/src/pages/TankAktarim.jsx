import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const TankAktarim = () => {
  const [tanklar, setTanklar] = useState([]);
  const [kaynakId, setKaynakId] = useState("");
  const [hedefId, setHedefId] = useState("");
  const [miktar, setMiktar] = useState("");
  const [kullanici, setKullanici] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
  const fetchTanklar = async () => {
    const res = await axios.get("http://localhost:5000/api/tanklar");
    setTanklar(res.data);
  };
  fetchTanklar();

  const kullaniciBilgi = JSON.parse(localStorage.getItem("kullanici"));
  setKullanici(kullaniciBilgi?.isim || "Bilinmiyor"); // ✅ doğru kullanım
}, []);


  const kaynak = tanklar.find((t) => t.id === parseInt(kaynakId));
  const hedef = tanklar.find((t) => t.id === parseInt(hedefId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kaynak || !hedef || !miktar) return alert("Tüm alanlar zorunludur");
    if (kaynak.id === hedef.id) return alert("Aynı tank seçilemez");
    if (parseFloat(miktar) > kaynak.stok)
      return alert("Kaynak tankta yeterli stok yok");

    try {
      await axios.post("http://localhost:5000/api/tank-aktarim", {
        kaynak_id: kaynak.id,
        hedef_id: hedef.id,
        miktar,
        olusturan_kullanici: kullanici,
      });
      alert("Aktarım başarılı");
      navigate("/urunler");
    } catch (err) {
      console.error(err);
      alert("Aktarım başarısız");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Tanklar Arası Aktarım</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Kaynak Tank</label>
              <select
                value={kaynakId}
                onChange={(e) => setKaynakId(e.target.value)}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Seçiniz</option>
                {tanklar.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.ad} ({t.urun_adi} - {t.urun_cinsi}) [Stok: {t.stok}]
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Hedef Tank</label>
              <select
                value={hedefId}
                onChange={(e) => setHedefId(e.target.value)}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Seçiniz</option>
                {tanklar.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.ad} ({t.urun_adi} - {t.urun_cinsi}) [Stok: {t.stok}]
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Aktarılacak Miktar (kg)</label>
              <input
                type="number"
                value={miktar}
                onChange={(e) => setMiktar(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Aktarımı Gerçekleştir
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TankAktarim;