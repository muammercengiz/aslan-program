const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const kullaniciRoute = require('./routes/kullanici'); // ✅ Yeni kullanıcı ekleme işlemleri için
const urunlerRoute = require('./routes/urunler');
const dagitimlarRoute = require('./routes/dagitimlar');
const araclarRoute = require('./routes/araclar');
const personelRoutes = require("./routes/personeller");
const personelIzinRoutes = require("./routes/personelIzin");
const personelDevamRoutes = require("./routes/personelDevam");
const personelMesaiRoutes = require("./routes/personelMesai");
const musteriRoutes = require("./routes/musteriRoutes");
const siparisRoutes = require("./routes/siparisRoutes");
const iadeRoutes = require("./routes/iadeRoutes");
const hammaddeRoutes = require('./routes/hammadde');
const uretimRoutes = require('./routes/uretim');
const ambalajlarRoute = require('./routes/ambalajlar');
const tedarikcilerRoute = require('./routes/tedarikciler');
const tanklarRoute = require('./routes/tanklar');
const tankHareketleriRoute = require('./routes/tank_hareketleri');
const urunHareketleri = require('./routes/urun_hareketleri');
const urunTanimlariRoute = require('./routes/urun_tanimlari');
const tankAktarimRoute = require('./routes/tank_aktarim');
const tanktanCikisRoute = require('./routes/tanktan-cikis');



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Backend çalışıyor mu test endpoint
app.get('/', (req, res) => {
  res.send('Aslan Gıda Sipariş Backend Çalışıyor!');
});

// Veritabanı bağlantı testi
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Route'ları
app.use('/api', authRoutes); // /api/login, /api/register vs.
app.use('/api/kullanicilar', userRoutes); // GET, DELETE işlemleri
app.use('/api/kullanicilar', kullaniciRoute); // ✅ POST (yeni kullanıcı ekleme)
app.use('/api/urunler', urunlerRoute);
app.use('/api/dagitimlar', dagitimlarRoute);
app.use('/api/araclar', araclarRoute);
app.use("/api/personeller", personelRoutes);
app.use("/api/izinler", personelIzinRoutes);
app.use("/api/devam", personelDevamRoutes);
app.use("/api/mesai", personelMesaiRoutes);
app.use("/api/musteriler", musteriRoutes);
app.use("/api/siparisler", siparisRoutes);
app.use("/api/iade", iadeRoutes);
app.use('/api/hammadde', hammaddeRoutes);
app.use('/api/uretim', uretimRoutes);
app.use('/api/ambalajlar', ambalajlarRoute);
app.use('/api/tedarikciler', tedarikcilerRoute);
app.use('/api/tanklar', tanklarRoute);
app.use('/api/tank-hareketleri', tankHareketleriRoute);
app.use('/api/urun-hareketleri', urunHareketleri);
app.use('/api/urun-tanimlari', urunTanimlariRoute);
app.use('/api/tank-aktarim', tankAktarimRoute);
app.use('/api/tanktan-cikis', tanktanCikisRoute);







app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
