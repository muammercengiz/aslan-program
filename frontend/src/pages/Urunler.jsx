import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../components/Sidebar';

const Urunler = () => {
  const [urunler, setUrunler] = useState([]);
  const [tanklar, setTanklar] = useState([]);
  const navigate = useNavigate();

  const [filtreAd, setFiltreAd] = useState('');
  const [filtreCins, setFiltreCins] = useState('');
  const urunAdlari = [...new Set(urunler.map(u => u.ad))];
  const urunCinsleri = [...new Set(urunler.map(u => u.cins))];

  const fetchTanklar = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/tanklar', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTanklar(res.data);
    } catch (err) {
      console.error('Tanklar alınamadı:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/urunler', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUrunler(res.data))
      .catch((err) => console.error('Ürünler alınamadı:', err));

    fetchTanklar();
  }, []);

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
    doc.text("Ürün Listesi", 14, 15);

    autoTable(doc, {
      head: [["Ürün Adı", "Cinsi", "Adet", "Kapasite", "Dara", "Daralık", "Stok", "Paketleme Türü", "Depo"]],
      body: urunler.map(u => {
        const kapasite = Number(u.kapasite || 0);
        const dara = Number(u.dara || 0);
        const adet = Number(u.adet || 0);
        const stok = u.daralik === 'Daralı'
          ? adet * kapasite + adet * dara
          : adet * kapasite;

        return [
          u.ad,
          u.cins,
          adet.toLocaleString("tr-TR"),
          kapasite.toLocaleString("tr-TR"),
          dara.toLocaleString("tr-TR"),
          u.daralik || '-',
          stok.toLocaleString("tr-TR"),
          u.paketleme_turu,
          u.depo,
        ];
      }),
      startY: 20,
      styles: {
        font: "DejaVuSans",
        fontStyle: "normal",
        fontSize: 10
      },
    });

    // Yeni sayfa: Tank listesi
    doc.addPage();
    doc.text("Tank Listesi", 14, 15);

    autoTable(doc, {
      head: [["Tank Adı", "Kapasite", "Ürün", "Cinsi", "Stok"]],
      body: tanklar.map(t => [
        t.ad,
        Number(t.kapasite).toLocaleString("tr-TR"),
        t.urun_adi || "-",
        t.urun_cinsi || "-",
        (t.stok || 0).toLocaleString("tr-TR") + " kg"
      ]),
      startY: 20,
      styles: {
        font: "DejaVuSans",
        fontStyle: "normal",
        fontSize: 10
      },
    });

    doc.save("urunler.pdf");
  };

  const handleSil = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/urunler/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUrunler((prev) => prev.filter((u) => u.id !== id));
      } catch (err) {
        console.error('Silme hatası:', err);
        alert('Ürün silinemedi.');
      }
    }
  };

  const handleTankSil = async (id) => {
    if (!window.confirm('Bu tankı silmek istiyor musunuz?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tanklar/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTanklar();
    } catch (err) {
      alert('Tank silinemedi.');
      console.error(err);
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
            <h2 className="text-xl font-semibold">Ürünler</h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/urun-arsiv')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Arşiv
              </button>
              <button
                onClick={() => navigate('/tank-tanimla')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Tank Tanımla
              </button>
              <button
                onClick={() => navigate('/urun-tanimla')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
              >
                Ürün Tanımla
              </button>
              <button
                onClick={() => navigate('/urun-ekle')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                + Ürün Ekle
              </button>
              <button
                onClick={exportPDF}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
              >
                PDF'ye Aktar
              </button>
            </div>
          </div>

          {/* Filtreleme Alanı */}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ürün Adı</label>
              <select
                className="border p-2 rounded w-48"
                value={filtreAd}
                onChange={(e) => setFiltreAd(e.target.value)}
              >
                <option value="">Hepsi</option>
                {urunAdlari.map((ad) => (
                  <option key={ad} value={ad}>{ad}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cinsi</label>
              <select
                className="border p-2 rounded w-48"
                value={filtreCins}
                onChange={(e) => setFiltreCins(e.target.value)}
              >
                <option value="">Hepsi</option>
                {urunCinsleri.map((cins) => (
                  <option key={cins} value={cins}>{cins}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                  <th className="py-2 px-4">Ürün Adı</th>
                  <th className="py-2 px-4">Cinsi</th>
                  <th className="py-2 px-4">Adet</th>
                  <th className="py-2 px-4">Kapasite</th>
                  <th className="py-2 px-4">Dara</th>
                  <th className="py-2 px-4">Daralık</th>
                  <th className="py-2 px-4">Stok</th>
                  <th className="py-2 px-4">Paketleme Türü</th>
                  <th className="py-2 px-4">Depo</th>
                  <th className="py-2 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {urunler
                  .filter(u => Number(u.stok) > 0)
                  .filter(u => (filtreAd ? u.ad === filtreAd : true))
                  .filter(u => (filtreCins ? u.cins === filtreCins : true))
                  .map((u) => {
                    console.log('Ürün:', u);
                    const kapasite = Number(u.kapasite) || 0;
                    const dara = Number(u.dara) || 0;
                    const adet = Number(u.adet) || 0;
                    const stok = u.daralik === 'Daralı'
                      ? adet * kapasite + adet * dara
                      : adet * kapasite;

                    return (
                      <tr key={u.id} className="border-t text-sm">
                        <td className="py-2 px-4">{u.ad}</td>
                        <td className="py-2 px-4">{u.cins}</td>
                        <td className="py-2 px-4">{adet.toLocaleString('tr-TR')}</td>
                        <td className="py-2 px-4">{kapasite.toLocaleString('tr-TR')}</td>
                        <td className="py-2 px-4">{dara.toLocaleString('tr-TR')}</td>
                        <td className="py-2 px-4">{u.daralik || '-'}</td>
                        <td className="py-2 px-4">{stok.toLocaleString('tr-TR')}</td>
                        <td className="py-2 px-4">{u.paketleme_turu}</td>
                        <td className="py-2 px-4">{u.depo}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => navigate(`/urun/${u.id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
                          >
                            Detay
                          </button>
                          <button
                            onClick={() => navigate(`/urun-hareket/${u.id}`)}
                            className="bg-indigo-500 text-white px-3 py-1 rounded text-sm mr-2"
                          >
                            Hareketler
                          </button>
                          <button
                            onClick={() => handleSil(u.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

<div className="mt-12">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Tanklar</h2>
    <div className="flex gap-2">
      <button
        onClick={() => navigate('/tanktan-cikis')}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm"
      >
        Tank Çıkış
      </button>
      <button
        onClick={() => navigate('/tank-aktarim')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
      >
        Tank Aktarım
      </button>
    </div>
  </div>

  <table className="min-w-max w-full table-auto bg-white border rounded shadow">
    <thead>
      <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
        <th className="py-2 px-4">Tank Adı</th>
        <th className="py-2 px-4">Kapasite (kg)</th>
        <th className="py-2 px-4">Ürün</th>
        <th className="py-2 px-4">Cinsi</th>
        <th className="py-2 px-4">Stok</th>
        <th className="py-2 px-4">İşlemler</th>
      </tr>
    </thead>
    <tbody>
      {tanklar.map((t) => (
        <tr key={t.id} className="border-t text-sm">
          <td className="py-2 px-4">{t.ad}</td>
          <td className="py-2 px-4">{t.kapasite}</td>
          <td className="py-2 px-4">{t.urun_adi || '-'}</td>
          <td className="py-2 px-4">{t.urun_cinsi || '-'}</td>
          <td className="py-2 px-4">{t.stok ? `${t.stok} kg` : '-'}</td>
          <td className="py-2 px-4">
            <button
              onClick={() => navigate(`/tank/${t.id}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
            >
              Detay
            </button>
            <button
              onClick={() => navigate(`/tank-hareket/${t.id}`)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm mr-2"
            >
              Hareketler
            </button>
            <button
              onClick={() => handleTankSil(t.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Sil
            </button>
          </td>
        </tr>
      ))}
      {tanklar.length === 0 && (
        <tr>
          <td colSpan="6" className="py-4 px-4 text-center text-gray-500">Kayıtlı tank bulunamadı.</td>
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

export default Urunler;
