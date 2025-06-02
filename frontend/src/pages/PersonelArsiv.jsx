import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const PersonelArsiv = () => {
  const [arsiv, setArsiv] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/personeller", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const pasifler = res.data.filter((p) => p.durum === "Pasif");
        setArsiv(pasifler);
      })
      .catch((err) => {
        console.error("Arşiv alınamadı:", err);
        alert("Veriler getirilemedi.");
      });
  };

  const handleGeriAl = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const { data: personel } = await axios.get(`http://localhost:5000/api/personeller/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.put(
        `http://localhost:5000/api/personeller/${id}`,
        {
          isim: personel.isim,
          tc: personel.tc,
          ise_baslama: personel.ise_baslama,
          telefon: personel.telefon,
          adres: personel.adres,
          gorev: personel.gorev,
          durum: "Aktif",
          pasif_tarihi: null,
          aciklama: null,
          maas: personel.maas || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Personel başarıyla geri alındı.");
      fetchData();
    } catch (err) {
      console.error("Geri alma hatası:", err);
      alert("Personel geri alınamadı.");
    }
  };

  const handleSil = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Bu personel tamamen silinecek. Devam edilsin mi?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/personeller/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Personel silindi.");
      fetchData();
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Personel silinemedi.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Personel Arşivi</h2>
          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                  <th className="py-2 px-4">Ad Soyad</th>
                  <th className="py-2 px-4">Görev</th>
                  <th className="py-2 px-4">Telefon</th>
                  <th className="py-2 px-4">Pasif Tarihi</th>
                  <th className="py-2 px-4">Açıklama</th>
                  <th className="py-2 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {arsiv.map((p) => (
                  <tr key={p.id} className="border-t text-sm">
                    <td className="py-2 px-4">{p.isim}</td>
                    <td className="py-2 px-4">{p.gorev}</td>
                    <td className="py-2 px-4">{p.telefon}</td>
                    <td className="py-2 px-4">
                      {p.pasif_tarihi
                        ? new Date(p.pasif_tarihi).toLocaleDateString("tr-TR")
                        : "-"}
                    </td>
                    <td className="py-2 px-4">{p.aciklama || "-"}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleGeriAl(p.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm mr-2"
                      >
                        Geri Al
                      </button>
                      <button
                        onClick={() => handleSil(p.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {arsiv.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-4">
                      Arşivde personel bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonelArsiv;
