import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const PersonelDevam = () => {
  const { id } = useParams();
  const [devamlar, setDevamlar] = useState([]);
  const [yeniKayit, setYeniKayit] = useState({
    tarih: "",
    durum: "Geldi",
    aciklama: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/api/devam/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDevamlar(res.data))
      .catch((err) => console.error("Devam durumu alınamadı:", err));
  }, [id]);

  const handleChange = (e) => {
    setYeniKayit({ ...yeniKayit, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/devam/${id}`,
        yeniKayit,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Devam durumu eklendi.");
      setDevamlar([...devamlar, response.data]);
      setYeniKayit({ tarih: "", durum: "Geldi", aciklama: "" });
    } catch (err) {
      console.error("Devam ekleme hatası:", err);
      alert("Devam durumu eklenemedi.");
    }
  };

  const handleSil = async (devamId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Bu devam kaydını silmek istiyor musunuz?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/devam/${devamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevamlar((prev) => prev.filter((d) => d.id !== devamId));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Kayıt silinemedi.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Personel Devam Durumu</h2>

          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium">Tarih</label>
              <input
                type="date"
                name="tarih"
                value={yeniKayit.tarih}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Durum</label>
              <select
                name="durum"
                value={yeniKayit.durum}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option>Geldi</option>
                <option>Gelmedi</option>
                <option>Raporlu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Açıklama</label>
              <textarea
                name="aciklama"
                value={yeniKayit.aciklama}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
            >
              Devam Ekle
            </button>
          </form>

          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-700">
                <th className="py-2 px-4">Tarih</th>
                <th className="py-2 px-4">Durum</th>
                <th className="py-2 px-4">Açıklama</th>
                <th className="py-2 px-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {devamlar.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="py-2 px-4">
                    {new Date(d.tarih).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="py-2 px-4">{d.durum}</td>
                  <td className="py-2 px-4">{d.aciklama}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleSil(d.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {devamlar.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    Kayıtlı devam verisi yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonelDevam;
