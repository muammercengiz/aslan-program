import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Islemler from "./pages/Islemler";

import Urunler from "./pages/Urunler";
import UrunEkle from "./pages/UrunEkle";
import UrunDetay from "./pages/UrunDetay";
import UrunHareketleri from './pages/UrunHareketleri';
import UrunTanımla from "./pages/UrunTanımla"; 
import UrunArsiv from "./pages/UrunArsiv";

import Kullanicilar from "./pages/Kullanicilar";
import KullaniciEkle from "./pages/KullaniciEkle";
import KullaniciGuncelle from "./pages/KullaniciGuncelle";
import Araclar from "./pages/Araclar";
import AracEkle from "./pages/AracEkle";
import AracGuncelle from "./pages/AracGuncelle";
import DagitimOlustur from "./pages/DagitimOlustur";
import DagitimListesi from "./pages/DagitimListesi";
import DagitimDetay from "./pages/DagitimDetay";

import Personel from "./pages/Personel";
import PersonelEkle from "./pages/PersonelEkle";
import PersonelGuncelle from "./pages/PersonelGuncelle";
import PersonelArsiv from "./pages/PersonelArsiv";
import PersonelIzinleri from "./pages/PersonelIzinleri";
import PersonelDevam from "./pages/PersonelDevam";
import PersonelMesai from "./pages/PersonelMesai";

import Musteriler from './pages/Musteriler'; // varsa
import MusteriEkle from "./pages/MusteriEkle";
import MusteriDetay from "./pages/MusteriDetay";

import Siparisler from "./pages/Siparisler";
import SiparisOlustur from "./pages/SiparisOlustur";
import SiparisDetay from "./pages/SiparisDetay";
import SiparisArsiv from "./pages/SiparisArsiv";


import PersonelRapor from "./pages/PersonelRapor";
import IadeIslemleri from "./pages/IadeIslemleri";
import IadeEkle from "./pages/IadeEkle";
import IadeDetay from "./pages/IadeDetay";
import IadeArsiv from "./pages/IadeArsiv";


import UretimPlanla from "./pages/UretimPlanla";
import UretimKayitlari from "./pages/UretimKayitlari";

import Hammadde from "./pages/Hammadde";
import HammaddeEkle from "./pages/HammaddeEkle";
import HammaddeDetay from "./pages/HammaddeDetay";

import Ambalajlar from "./pages/Ambalajlar";
import AmbalajEkle from "./pages/AmbalajEkle";
import AmbalajDetay from './pages/AmbalajDetay';

import TedarikciDetay from './pages/TedarikciDetay';
import Tedarikciler from './pages/Tedarikciler';
import TedarikciEkle from './pages/TedarikciEkle';

import Onaylar from "./pages/Onaylar";
import AdminRoute from "./components/AdminRoute";

import TankDetay from './pages/TankDetay';
import TankHareketleri from './pages/TankHareketleri';
import TankTanimla from './pages/TankTanimla';
import TankAktarim from "./pages/TankAktarim";
import TanktanCikis from './pages/TanktanCikis';







function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/islemler" element={<Islemler />} />
      <Route path="/urunler" element={<Urunler />} />
      <Route path="/urun-ekle" element={<UrunEkle />} />
      <Route path="/urun/:id" element={<UrunDetay />} />
      <Route path="/urun-tanimla" element={<UrunTanımla />} />
      <Route path="/kullanicilar" element={<Kullanicilar />} />
      <Route path="/kullanici-ekle" element={<KullaniciEkle />} />
      <Route path="/kullanicilar/:id" element={<KullaniciGuncelle />} />
      <Route path="/araclar" element={<Araclar />} />
      <Route path="/arac-ekle" element={<AracEkle />} />
      <Route path="/arac/:id" element={<AracGuncelle />} />
      <Route path="/dagitim-ekle" element={<DagitimOlustur />} />
      <Route path="/dagitimlistesi" element={<DagitimListesi />} />
      <Route path="/dagitim/:id" element={<DagitimDetay />} />
      <Route path="/personel" element={<Personel />} />
      <Route path="/personel-ekle" element={<PersonelEkle />} />
      <Route path="/personel/:id" element={<PersonelGuncelle />} />
      <Route path="/personel-arsiv" element={<PersonelArsiv />} />
      <Route path="/personel/:id/izinler" element={<PersonelIzinleri />} />
      <Route path="/personel/:id/devam" element={<PersonelDevam />} />
      <Route path="/personel/:id/mesai" element={<PersonelMesai />} />
      <Route path="/musteriler" element={<Musteriler />} />
      <Route path="/musteri-ekle" element={<MusteriEkle />} />
      <Route path="/musteri/:id" element={<MusteriDetay />} />
      <Route path="/siparisler" element={<Siparisler />} />
      <Route path="/siparis-ekle" element={<SiparisOlustur />} />
      <Route path="/siparis/:id" element={<SiparisDetay />} />
      <Route path="/siparis-arsiv" element={<SiparisArsiv />} />
      <Route path="/onaylar" element={ <AdminRoute> <Onaylar /> </AdminRoute> } />      
      <Route path="/raporlama" element={<PersonelRapor />} />
      <Route path="/iade-islemleri" element={<IadeIslemleri />} />
      <Route path="/iade-ekle" element={<IadeEkle />} />
      <Route path="/iade/:id" element={<IadeDetay />} />
      <Route path="/iade-arsiv" element={<IadeArsiv />} />
      <Route path="/uretim-planla" element={<UretimPlanla />} />
      <Route path="/uretim-kayitlari" element={<UretimKayitlari />} />
      <Route path="/hammadde" element={<Hammadde />} />
      <Route path="/hammadde-ekle" element={<HammaddeEkle />} />
      <Route path="/hammadde/:mense/:cins" element={<HammaddeDetay />} />
      <Route path="/ambalajlar" element={<Ambalajlar />} />
      <Route path="/ambalaj-ekle" element={<AmbalajEkle />} />
      <Route path="/ambalaj/:id" element={<AmbalajDetay />} />
      <Route path="/tedarikci/:id" element={<TedarikciDetay />} />
      <Route path="/tedarikciler" element={<Tedarikciler />} />
      <Route path="/tedarikci-ekle" element={<TedarikciEkle />} />
      <Route path="/tank/:id" element={<TankDetay />} />
      <Route path="/tank-hareket/:id" element={<TankHareketleri />} />
      <Route path="/urun-hareket/:id" element={<UrunHareketleri />} />
      <Route path="/urun-arsiv" element={<UrunArsiv />} />
      <Route path="/tank-tanimla" element={<TankTanimla />} />
      <Route path="/tank-aktarim" element={<TankAktarim />} />
      <Route path="/tanktan-cikis" element={<TanktanCikis />} />
    </Routes>
  );
}

export default App;
