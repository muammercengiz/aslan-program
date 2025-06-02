const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { kullanici_adi, sifre } = req.body;

  try {
    console.log("Giriş denemesi:", kullanici_adi);

    const result = await db.query(
      'SELECT * FROM kullanicilar WHERE kullanici_adi = $1',
      [kullanici_adi]
    );

    if (result.rows.length === 0) {
      console.log("Kullanıcı bulunamadı:", kullanici_adi);
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const user = result.rows[0];
    console.log("Kullanıcı bulundu:", user.kullanici_adi);

    const isMatch = await bcrypt.compare(sifre, user.sifre);
    if (!isMatch) {
      console.log("Şifre uyuşmadı");
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("Giriş başarılı:", user.kullanici_adi);
    res.json({
      token,
      user: {
        id: user.id,
        isim: user.isim,
        rol: user.rol
      }
    });

  } catch (err) {
    console.error("Login hatası:", err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

module.exports = { login };
