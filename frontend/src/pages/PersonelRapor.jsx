import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PersonelRapor = () => {
  const [personeller, setPersoneller] = useState([]);
  const [secilenPersonel, setSecilenPersonel] = useState("");
  const [ay, setAy] = useState("5");
  const [yil, setYil] = useState("2025");
  const [gorunum, setGorunum] = useState("genel");
  const [raporTuru, setRaporTuru] = useState("devam");
  const [veri, setVeri] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/personeller", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPersoneller(res.data))
      .catch((err) => console.error("Personel listesi alınamadı:", err));
  }, []);

  const getGunSayisi = (yil, ay) => new Date(yil, ay, 0).getDate();

  const handleSorgula = () => {
    const token = localStorage.getItem("token");
    let url = "";

    if (gorunum === "genel") {
      if (raporTuru === "devam") url = `/api/devam/aylik-genel?yil=${yil}&ay=${ay}`;
      if (raporTuru === "izin") url = `/api/izinler/aylik-genel?yil=${yil}&ay=${ay}`;
      if (raporTuru === "mesai") url = `/api/mesai/aylik-genel?yil=${yil}&ay=${ay}`;
    } else {
      if (!secilenPersonel) return;
      if (raporTuru === "devam") url = `/api/devam/${secilenPersonel}/aylik?yil=${yil}&ay=${ay}`;
      if (raporTuru === "izin") url = `/api/izinler/${secilenPersonel}`;
      if (raporTuru === "mesai") url = `/api/mesai/${secilenPersonel}`;
    }

    axios
      .get(`http://localhost:5000${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVeri(res.data))
      .catch((err) => console.error("Veri alınamadı:", err));
  };

  const exportPDF = async () => {
  const fontUrl = "/fonts/DejaVuSans.ttf";
  const fontResponse = await fetch(fontUrl);
  const fontData = await fontResponse.arrayBuffer();
  const fontBinary = new Uint8Array(fontData).reduce((data, byte) => data + String.fromCharCode(byte), "");

  const doc = new jsPDF({ orientation: "landscape" });
  doc.addFileToVFS("DejaVuSans.ttf", btoa(fontBinary));
  doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
doc.addFont("DejaVuSans.ttf", "DejaVuSans", "bold");
  doc.setFont("DejaVuSans");
  doc.setFontSize(12);

  const baslik = `Personel ${raporTuru.toUpperCase()} Raporu - ${yil}/${String(ay).padStart(2, "0")}`;
  doc.text(baslik, 14, 10);

  if (raporTuru === "devam") {
    const head = ["Ad Soyad", ...Array(getGunSayisi(yil, ay)).fill(0).map((_, i) => String(i + 1).padStart(2, "0"))];
    const body = veri.map((p) => {
      const gunluk = Array(getGunSayisi(yil, ay)).fill("");
      p.devamlar.forEach((d) => {
        const gun = new Date(d.tarih).getDate();
        gunluk[gun - 1] = d.durum === "Geldi" ? "G" : d.durum === "Gelmedi" ? "-" : "R";
      });
      return [p.isim, ...gunluk];
    });
    
    autoTable(doc, {
      head: [head],
      body,
      startY: 20,
      styles: {
        font: "DejaVuSans",
        fontStyle: "normal",
        fontSize: 7,
        minCellHeight: 8
      },
      headStyles: {
        font: "DejaVuSans",
        fontStyle: "bold",
        fontSize: 7,
        fillColor: [41, 128, 185],
        textColor: 255
      },
      columnStyles: {
        0: { cellWidth: 70, overflow: 'linebreak' }
      }
    });

  } else if (raporTuru === "izin") {
    autoTable(doc, {
      head: [["Ad Soyad", "Başlangıç", "Bitiş", "İzin Türü"]],
      body: veri.flatMap((p) =>
  (p.izinler || []).map((i) => [
    p.isim,
    new Date(i.baslangic_tarihi).toLocaleDateString("tr-TR"),
    new Date(i.bitis_tarihi).toLocaleDateString("tr-TR"),
    i.izin_turu,
  ])
),
     startY: 20,
  styles: {
    font: "DejaVuSans",
    fontStyle: "normal",
    fontSize: 7,
    minCellHeight: 8
  },
  headStyles: {
    font: "DejaVuSans",
    fontStyle: "bold",
    fontSize: 7,
    fillColor: [41, 128, 185],
    textColor: 255
  },
  columnStyles: {
    0: { cellWidth: 70, overflow: 'linebreak' }
  }
});
  } else if (raporTuru === "mesai") {
    autoTable(doc, {
      head: [["Ad Soyad", "Tarih", "Mesai Türü"]],
      body: veri.flatMap((p) =>
        p.mesailer.map((m) => [
          p.isim,
          new Date(m.tarih).toLocaleDateString("tr-TR"),
          m.mesai_turu,
        ])
      ),
    styles: { font: "DejaVuSans", fontStyle: "normal", fontSize: 10 },
  headStyles: { font: "DejaVuSans", fontStyle: "bold", fontSize: 10, fillColor: [41, 128, 185], textColor: 255 },
    });
  }

  doc.save(`personel_${raporTuru}_raporu_${yil}_${ay}.pdf`);
};


  const renderGenelDevam = () => {
    const gunSayisi = getGunSayisi(yil, ay);
    return (
      <table className="min-w-full bg-white rounded shadow text-xs">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-2">Ad Soyad</th>
            {[...Array(gunSayisi)].map((_, i) => (
              <th key={i} className="py-2 px-2 text-center">{String(i + 1).padStart(2, "0")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {veri.map((p) => {
            const gunluk = Array(gunSayisi).fill("");
            p.devamlar?.forEach((d) => {
              const gun = new Date(d.tarih).getDate();
              gunluk[gun - 1] = d.durum === "Geldi" ? "G" : d.durum === "Gelmedi" ? "-" : "R";
            });
            return (
              <tr key={p.personel_id} className="border-t">
                <td className="py-2 px-2 font-medium whitespace-nowrap">{p.isim}</td>
                {gunluk.map((g, i) => (
                  <td key={i} className="py-1 px-2 text-center">{g || ""}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderGenelIzin = () => (
    <table className="min-w-full bg-white rounded shadow text-sm">
      <thead>
        <tr className="bg-gray-200 text-gray-700">
          <th className="py-2 px-4">Ad Soyad</th>
          <th className="py-2 px-4">Başlangıç</th>
          <th className="py-2 px-4">Bitiş</th>
          <th className="py-2 px-4">İzin Türü</th>
        </tr>
      </thead>
      <tbody>
        {veri.map((p) =>
          (p.izinler || []).map((i, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4">{p.isim}</td>
              <td className="py-2 px-4">{new Date(i.baslangic_tarihi).toLocaleDateString("tr-TR")}</td>
              <td className="py-2 px-4">{new Date(i.bitis_tarihi).toLocaleDateString("tr-TR")}</td>
              <td className="py-2 px-4">{i.izin_turu}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  const renderGenelMesai = () => (
    <table className="min-w-full bg-white rounded shadow text-sm">
      <thead>
        <tr className="bg-gray-200 text-gray-700">
          <th className="py-2 px-4">Ad Soyad</th>
          <th className="py-2 px-4">Tarih</th>
          <th className="py-2 px-4">Mesai Türü</th>
        </tr>
      </thead>
      <tbody>
        {veri.map((p) =>
          (p.mesailer || []).map((m, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4">{p.isim}</td>
              <td className="py-2 px-4">{new Date(m.tarih).toLocaleDateString("tr-TR")}</td>
              <td className="py-2 px-4">{m.mesai_turu}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-100 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Aylık Personel Raporları</h2>
          <div className="flex flex-wrap gap-4 items-end mb-6">
            <div>
              <label className="block text-sm font-medium">Görünüm</label>
              <select className="border px-3 py-2 rounded" value={gorunum} onChange={(e) => setGorunum(e.target.value)}>
                <option value="genel">Aylık Tüm Personel</option>
                <option value="kisi">Kişiye Özel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Rapor Türü</label>
              <select className="border px-3 py-2 rounded" value={raporTuru} onChange={(e) => setRaporTuru(e.target.value)}>
                <option value="devam">Devam</option>
                <option value="izin">İzin</option>
                <option value="mesai">Mesai</option>
              </select>
            </div>
            {gorunum === "kisi" && (
              <div>
                <label className="block text-sm font-medium">Personel</label>
                <select className="border px-3 py-2 rounded w-60" value={secilenPersonel} onChange={(e) => setSecilenPersonel(e.target.value)}>
                  <option value="">Seçiniz</option>
                  {personeller.map((p) => (
                    <option key={p.id} value={p.id}>{p.isim}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">Ay</label>
              <select className="border px-3 py-2 rounded" value={ay} onChange={(e) => setAy(e.target.value)}>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{`${i + 1}`.padStart(2, "0")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Yıl</label>
              <input type="number" className="border px-3 py-2 rounded w-28" value={yil} onChange={(e) => setYil(e.target.value)} />
            </div>
            <button onClick={handleSorgula} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Sorgula
            </button>
            {veri.length > 0 && (
              <button onClick={exportPDF} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                PDF Olarak Dışa Aktar
              </button>
            )}
          </div>

          {raporTuru === "devam" && gorunum === "genel" && renderGenelDevam()}
          {raporTuru === "izin" && gorunum === "genel" && renderGenelIzin()}
          {raporTuru === "mesai" && gorunum === "genel" && renderGenelMesai()}
        </div>
      </div>
    </div>
  );
};

export default PersonelRapor;