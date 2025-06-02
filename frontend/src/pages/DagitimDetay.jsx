import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const DagitimDetay = () => {
  const { id } = useParams();
  const [dagitim, setDagitim] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/api/dagitimlar/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setDagitim(res.data))
      .catch(err => {
        console.error('Detay alınamadı:', err);
        alert('Detay bilgisi getirilemedi.');
      });
  }, [id]);

  if (!dagitim) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="flex min-h-screen">
      <div className="w-64 shrink-0 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Dağıtım Detayı</h2>
          <ul className="space-y-2 text-sm">
  <li><strong>Tarih:</strong> {dagitim.tarih ? new Date(dagitim.tarih).toLocaleDateString('tr-TR') : '-'}</li>
  <li><strong>Araç:</strong> {dagitim.arac_plaka}</li>
  <li><strong>Şoför:</strong> {dagitim.sofor_adi}</li>
  <li><strong>Yardımcı:</strong> {dagitim.yardimci_adi || '-'}</li>
  <li><strong>Güzergah:</strong> {dagitim.guzergah}</li>
</ul>
        </div>
      </div>
    </div>
  );
};

export default DagitimDetay;
