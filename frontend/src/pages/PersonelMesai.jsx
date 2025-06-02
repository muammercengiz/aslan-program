import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const PersonelMesai = () => {
  const { id } = useParams();
  const [mesailer, setMesailer] = useState([]);
  const [yeniMesai, setYeniMesai] = useState({
    tarih: "",
    mesai_turu: "Tam Gün",
    aciklama: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/api/mesai/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMesailer(res.data))
      .catch((err) => console.error("Mesai verileri alınamadı:", err));
  }, [id]);

  const handleChange = (e) => {
    setYeniMesai({ ...yeniMesai, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/mesai/${id}`,
        yeniMesai,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Mesai eklendi.");
      setMesailer([...mesailer, response.data]);
      setYeniMesai({
        tarih: "",
        mesai_turu: "Tam Gün",
        aciklama: "",
      });
    } catch (err) {
      console.error("Mesai ekleme hatası:", err);
      alert("Mesai eklenemedi.");
    }
  };

  const handleSil = async (mesaiId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Bu mesai kaydını silmek istiyor musunuz?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/mesai/${mesaiId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMesailer((prev) => prev.filter((m) => m.id !== mesaiId));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Mesai silinemedi.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Personel Mesai Takibi</h2>

          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium">Tarih</label>
              <input
                type="date"
                name="tarih"
                value={yeniMesai.tarih}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mesai Türü</label>
              <select
                name="mesai_turu"
                value={yeniMesai.mesai_turu}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option>Tam Gün</option>
                <option>Yarım Gün</option>
                <option>Ek Mesai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Açıklama</label>
              <textarea
                name="aciklama"
                value={yeniMesai.aciklama}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
              Mesai Kaydet
            </button>
          </form>

          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-700">
                <th className="py-2 px-4">Tarih</th>
                <th className="py-2 px-4">Mesai Türü</th>
                <th className="py-2 px-4">Açıklama</th>
                <th className="py-2 px-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {mesailer.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="py-2 px-4">{new Date(m.tarih).toLocaleDateString("tr-TR")}</td>
                  <td className="py-2 px-4">{m.mesai_turu}</td>
                  <td className="py-2 px-4">{m.aciklama}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleSil(m.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {mesailer.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    Kayıtlı mesai bulunamadı.
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

export default PersonelMesai;
