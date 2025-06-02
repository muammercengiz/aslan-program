// Ambalajlar.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../components/Sidebar';

const Ambalajlar = () => {
  const [ambalajlar, setAmbalajlar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/ambalajlar', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAmbalajlar(res.data))
      .catch((err) => console.error('Ambalajlar alınamadı:', err));
  }, []);

  const handleSil = async (id) => {
    if (window.confirm('Bu ambalajı silmek istediğinize emin misiniz?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/ambalajlar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAmbalajlar((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error('Silme hatası:', err);
        alert('Ambalaj silinemedi.');
      }
    }
  };

const exportPDF = async () => {
  const fontUrl = "/fonts/DejaVuSans.ttf";
  const fontResponse = await fetch(fontUrl);
  const fontData = await fontResponse.arrayBuffer();

  const doc = new jsPDF();
  const fontBinary = new Uint8Array(fontData).reduce((data, byte) => data + String.fromCharCode(byte), '');
  doc.addFileToVFS("DejaVuSans.ttf", btoa(fontBinary));
  doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
  doc.setFont("DejaVuSans");
  doc.setFontSize(12);
  doc.text("Ambalaj Listesi", 14, 15);

  autoTable(doc, {
    head: [["Ambalaj Adı", "Miktar", "Kapasite (kg)", "Dara (kg)", "Açıklama"]],
    body: ambalajlar.map((a) => [
      a.ad,
      a.miktar,
      a.kapasite_kg,
      a.dara,
      a.aciklama
    ]),
    startY: 20,
    styles: {
      font: "DejaVuSans",
      fontStyle: "normal",
      fontSize: 10
    },
  });

  doc.save("ambalajlar.pdf");
};


  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ambalajlar</h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/ambalaj-ekle')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                + Ambalaj Ekle
              </button>
              <button
                onClick={exportPDF}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
              >
                PDF'ye Aktar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                  <th className="py-2 px-4">Ambalaj Adı</th>
                  <th className="py-2 px-4">Miktar</th>
                  <th className="py-2 px-4">Kapasite (kg)</th>
                  <th className="py-2 px-4">Dara (kg)</th>
                  <th className="py-2 px-4">Açıklama</th>
                  <th className="py-2 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {ambalajlar.map((a) => (
                  <tr key={a.id} className="border-t text-sm">
                    <td className="py-2 px-4">{a.ad}</td>
                    <td className="py-2 px-4">{a.miktar}</td>
                    <td className="py-2 px-4">{a.kapasite_kg}</td>
                    <td className="py-2 px-4">{a.dara}</td>
                    <td className="py-2 px-4">{a.aciklama}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => navigate(`/ambalaj/${a.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Detay
                      </button>
                      <button
                        onClick={() => handleSil(a.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ml-2"
                      >
                         Sil
                      </button>
                    </td>
                  </tr>
                ))}
                  {ambalajlar.length === 0 && (
                  <tr>
                    <td className="py-4 px-4 text-center text-gray-500" colSpan="6">
                      Kayıtlı ambalaj bulunamadı.
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

export default Ambalajlar;