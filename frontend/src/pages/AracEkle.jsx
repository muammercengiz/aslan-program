import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AracEkle() {
  const [plaka, setPlaka] = useState("");
  const [tip, setTip] = useState("");
  const [kapasite, setKapasite] = useState("");
  const [muayeneTarihi, setMuayeneTarihi] = useState("");
  const [marka, setMarka] = useState("");
  const [model, setModel] = useState("");
  const [durum, setDurum] = useState("Aktif");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/araclar", {
        plaka,
        tip,
        kapasite,
        muayene_tarihi: muayeneTarihi,
        marka,
        model,
        durum,
      });
      navigate("/araclar");
    } catch (err) {
      console.error("Araç eklenemedi", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Yeni Araç Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Plaka</label>
              <input
                type="text"
                value={plaka}
                onChange={(e) => setPlaka(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Tip</label>
              <select
                value={tip}
                onChange={(e) => setTip(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Seçiniz</option>
                <option value="Kamyon & Kamyonet">Kamyon & Kamyonet</option>
                <option value="Panelvan">Panelvan</option>
                <option value="Otobüs & Minibüs">Otobüs & Minibüs</option>
                <option value="Minivan">Minivan</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Kapasite</label>
              <input
                type="text"
                value={kapasite}
                onChange={(e) => setKapasite(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Muayene Tarihi</label>
              <input
                type="date"
                value={muayeneTarihi}
                onChange={(e) => setMuayeneTarihi(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Marka</label>
              <input
                type="text"
                value={marka}
                onChange={(e) => setMarka(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Durumu</label>
              <select
                value={durum}
                onChange={(e) => setDurum(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="Aktif">Aktif</option>
                <option value="Pasif">Pasif</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AracEkle;