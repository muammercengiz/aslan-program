import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setHata("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        kullanici_adi: kullaniciAdi,
        sifre,
      });

     const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("kullanici", JSON.stringify(user));


    // ROL bilgisini localStorage'a ekle
    const payload = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem("rol", payload.rol);

    navigate("/islemler");
    } catch (err) {
      setHata("Kullanıcı adı veya şifre hatalı.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/Logo.png" alt="Logo" className="mx-auto mb-6 max-h-32" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              value={kullaniciAdi}
              onChange={(e) => setKullaniciAdi(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Kullanıcı Adı"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Şifre"
              required
            />
          </div>

          {hata && <p className="text-red-500 text-sm">{hata}</p>}

          <button
            type="submit"
            className="w-full bg-[#804040] text-white py-2 rounded hover:bg-[#5e2e2e] transition"
          >
            Giriş
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
