import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Personel = () => {
  const [personeller, setPersoneller] = useState([]);
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/personeller", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const aktifler = res.data.filter(
          (p) => p.durum === "Aktif" || p.durum === "İzinli"
        );
        setPersoneller(aktifler);
      })
      .catch((err) => console.error("Personeller alınamadı:", err));
  }, []);

  const handleSil = async (id) => {
    if (window.confirm("Bu personeli silmek istediğinize emin misiniz?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:5000/api/personeller/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPersoneller((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Silme hatası:", err);
        alert("Personel silinemedi.");
      }
    }
  };

  const exportPDF = async () => {
  const fontUrl = "/fonts/DejaVuSans.ttf";

  try {
    const fontResponse = await fetch(fontUrl);
    const fontData = await fontResponse.arrayBuffer();
    const fontBinary = new Uint8Array(fontData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    );

    const doc = new jsPDF();
    doc.addFileToVFS("DejaVuSans.ttf", btoa(fontBinary));
    doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
    doc.setFont("DejaVuSans");
    doc.setFontSize(12);
    doc.text("Personel Listesi", 14, 15);

    const head = rol === "admin"
      ? [["Ad Soyad", "Görev", "Durum", "Telefon", "Maaş"]]
      : [["Ad Soyad", "Görev", "Durum", "Telefon"]];

    const body = personeller.map((p) => {
      const row = [p.isim, p.gorev, p.durum, p.telefon];
      if (rol === "admin") row.push(p.maas ? `${Number(p.maas).toLocaleString("tr-TR")} ₺` : "-");
      return row;
    });

    autoTable(doc, {
      head,
      body,
      startY: 20,
      styles: {
        font: "DejaVuSans",
        fontStyle: "normal",
        fontSize: 10,
      },
    });

    doc.save("personeller.pdf");
  } catch (err) {
    console.error("PDF oluşturulamadı:", err);
    alert("PDF oluşturulurken bir hata oluştu.");
  }
};


  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Personeller</h2>
            <div className="flex gap-2">
              <button
                onClick={exportPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                PDF'ye Aktar
              </button>
              <button
                onClick={() => navigate("/personel-arsiv")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Arşiv
              </button>
              <button
                onClick={() => navigate("/personel-ekle")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                + Personel Ekle
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                  <th className="py-2 px-4">Sıra</th>
                  <th className="py-2 px-4">Ad Soyad</th>
                  <th className="py-2 px-4">Görev</th>
                  <th className="py-2 px-4">Durum</th>
                  <th className="py-2 px-4">Telefon</th>
                  {rol === "admin" && <th className="py-2 px-4">Maaş</th>}
                  <th className="py-2 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {personeller.map((p, index) => (
                  <tr key={p.id} className="border-t text-sm">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{p.isim}</td>
                    <td className="py-2 px-4">{p.gorev}</td>
                    <td className="py-2 px-4">{p.durum}</td>
                    <td className="py-2 px-4">{p.telefon}</td>
                    {rol === "admin" && (
                      <td className="py-2 px-4">{p.maas ? `${Number(p.maas).toLocaleString("tr-TR")} ₺` : "-"}</td>
                    )}
                    <td className="py-2 px-4">
                      <button
                        onClick={() => navigate(`/personel/${p.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Detay
                      </button>
                      <button
                        onClick={() => handleSil(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ml-2"
                      >
                        Sil
                      </button>
                      <button
                        onClick={() => navigate(`/personel/${p.id}/izinler`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm ml-2"
                      >
                        İzin
                      </button>
                      <button
                        onClick={() => navigate(`/personel/${p.id}/devam`)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm ml-2"
                      >
                        Devam
                      </button>
                      <button
                        onClick={() => navigate(`/personel/${p.id}/mesai`)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm ml-2"
                      >
                        Mesai
                      </button>
                    </td>
                  </tr>
                ))}
                {personeller.length === 0 && (
                  <tr>
                    <td colSpan={rol === "admin" ? 7 : 6} className="text-center text-gray-500 py-4">
                      Kayıtlı personel bulunamadı.
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

export default Personel;