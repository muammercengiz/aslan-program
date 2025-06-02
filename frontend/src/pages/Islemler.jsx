import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';

const Islemler = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">İşlem Paneline Hoş Geldiniz</h1>
        <p>Buradan sipariş, ürün, kullanıcı gibi işlemlere erişebilirsiniz.</p>
      </div>
    </div>
  );
};

export default Islemler;
