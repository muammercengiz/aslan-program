import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Users, Truck, Package, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="h-screen bg-gray-800 text-white p-4 w-64 flex flex-col justify-between">
      <div>
        {/* PANEL BAŞLIĞI */}
        <div className="text-2xl font-bold mb-6">Aslan Panel</div>

        {/* YETKİLİ İŞLEMLERİ */}
        <div className="mb-6 border-t border-gray-600 pt-4">
          <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2 flex items-center gap-2">
            <LayoutDashboard size={16} /> Yetkili İşlemleri
          </h3>
          <div className="flex flex-col gap-2">
            <Link to="/islemler" className="hover:text-gray-300">İşlemler</Link>
            <Link to="/onaylar" className="hover:text-gray-300">Onaylar</Link>
            <Link to="/kullanicilar" className="hover:text-gray-300">Kullanıcılar</Link>
          </div>
        </div>

        {/* HAMMADDE / ÜRETİM */}
<       div className="mb-6 border-t border-gray-600 pt-4">
          <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2 flex items-center gap-2">
            <Package size={16} /> Hammadde / Üretim
          </h3>
        <div className="flex flex-col gap-2">
            <Link to="/hammadde" className="hover:text-gray-300">Hammadde</Link>
            <Link to="/uretim-kayitlari" className="hover:text-gray-300">Üretim</Link> {/* Bu satır */}
            <Link to="/urunler" className="hover:text-gray-300">Ürünler</Link>
            <Link to="/ambalajlar" className="hover:text-gray-300">Ambalajlar</Link>
        </div>
      </div>


        {/* SİPARİŞ / DAĞITIM */}
        <div className="mb-6 border-t border-gray-600 pt-4">
          <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2 flex items-center gap-2">
            <Truck size={16} /> Sipariş / Dağıtım
          </h3>
          <div className="flex flex-col gap-2">
            <Link to="/siparisler" className="hover:text-gray-300">Siparişler</Link>
            <Link to="/iade-islemleri" className="hover:text-gray-300">İadeler</Link>
            <Link to="/musteriler" className="hover:text-gray-300">Müşteriler</Link>
            <Link to="/araclar" className="hover:text-gray-300">Araçlar</Link>
            <Link to="/dagitimlistesi" className="hover:text-gray-300">Dağıtım Listesi</Link>
          </div>
        </div>

        {/* SATIN ALMA */}
        <div className="mb-6 border-t border-gray-600 pt-4">
          <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2 flex items-center gap-2">
            <Package size={16} /> Satın Alma
          </h3>
          <div className="flex flex-col gap-2">
            <Link to="/tedarikciler" className="hover:text-gray-300">Tedarikçiler</Link>
          </div>
        </div>

        {/* PERSONEL */}
        <div className="mb-6 border-t border-gray-600 pt-4">
          <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2 flex items-center gap-2">
            <Users size={16} /> Personel
          </h3>
          <div className="flex flex-col gap-2">
            <Link to="/personel" className="hover:text-gray-300">Personeller</Link>
          </div>
        </div>

        {/* RAPORLAMA */}
        <div className="mb-6 border-t border-gray-600 pt-4">
          <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2 flex items-center gap-2">
            <Settings size={16} /> Raporlama
          </h3>
          <div className="flex flex-col gap-2">
            <Link to="/raporlama" className="hover:text-gray-300">Devam / İzin / Mesai</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
