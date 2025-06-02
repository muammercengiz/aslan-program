import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const PersonelIzinleri = () => {
  const { id } = useParams();
  const [izinler, setIzinler] = useState([]);
  const [yeniIzin, setYeniIzin] = useState({
    izin_turu: "Yıllık",
    baslangic_tarihi: "",
    bitis_tarihi: "",
    aciklama: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/api/izinler/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setIzinler(res.data))
      .catch((err) => console.error("İzinler alınamadı:", err));
  }, [id]);

  const handleChange = (e) => {
    setYeniIzin({ ...yeniIzin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/izinler/${id}`,
        yeniIzin,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("İzin eklendi.");
      setIzinler([...izinler, response.data]);
      setYeniIzin({
        izin_turu: "Yıllık",
        baslangic_tarihi: "",
        bitis_tarihi: "",
        aciklama: "",
      });
    } catch (err) {
      console.error("İzin ekleme hatası:", err);
      alert("İzin eklenemedi.");
    }
  };

  const handleSil = async (izinId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Bu izin kaydını silmek istiyor musunuz?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/izinler/${izinId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIzinler((prev) => prev.filter((i) => i.id !== izinId));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("İzin silinemedi.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Personel İzinleri</h2>

          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium">İzin Türü</label>
              <select
                name="izin_turu"
                value={yeniIzin.izin_turu}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option>Yıllık</option>
                <option>Hastalık</option>
                <option>Mazeret</option>
                <option>Diğer</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Başlangıç</label>
                <input
                  type="date"
                  name="baslangic_tarihi"
                  value={yeniIzin.baslangic_tarihi}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Bitiş</label>
                <input
                  type="date"
                  name="bitis_tarihi"
                  value={yeniIzin.bitis_tarihi}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Açıklama</label>
              <textarea
                name="aciklama"
                value={yeniIzin.aciklama}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
              İzin Ekle
            </button>
          </form>

          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-700">
                <th className="py-2 px-4">Tür</th>
                <th className="py-2 px-4">Başlangıç</th>
                <th className="py-2 px-4">Bitiş</th>
                <th className="py-2 px-4">Açıklama</th>
                <th className="py-2 px-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {izinler.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="py-2 px-4">{i.izin_turu}</td>
                  <td className="py-2 px-4">
                    {new Date(i.baslangic_tarihi).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(i.bitis_tarihi).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="py-2 px-4">{i.aciklama}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleSil(i.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {izinler.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    Kayıtlı izin bulunamadı.
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

export default PersonelIzinleri;
