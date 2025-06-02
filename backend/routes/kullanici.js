// routes/kullanici.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Yeni kullanıcı ekleme
router.post('/', async (req, res) => {
  try {
    const { isim, soyisim, email, telefon, kullanici_adi, sifre, rol } = req.body;

    const hashedPassword = await bcrypt.hash(sifre, 10);

    const yeniKullanici = await db.query(
      `INSERT INTO kullanicilar (isim, soyisim, email, telefon, kullanici_adi, sifre, rol)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [isim, soyisim, email, telefon, kullanici_adi, hashedPassword, rol]
    );

    res.status(201).json(yeniKullanici.rows[0]);
  } catch (err) {
    console.error('Kullanıcı eklenirken hata:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcı güncelle
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { isim, soyisim, email, telefon, kullanici_adi, sifre, rol } = req.body;

  try {
    if (sifre) {
      const hashedPassword = await bcrypt.hash(sifre, 10);
      await db.query(
        `UPDATE kullanicilar
         SET isim=$1, soyisim=$2, email=$3, telefon=$4, kullanici_adi=$5, sifre=$6, rol=$7
         WHERE id=$8`,
        [isim, soyisim, email, telefon, kullanici_adi, hashedPassword, rol, id]
      );
    } else {
      await db.query(
        `UPDATE kullanicilar
         SET isim=$1, soyisim=$2, email=$3, telefon=$4, kullanici_adi=$5, rol=$6
         WHERE id=$7`,
        [isim, soyisim, email, telefon, kullanici_adi, rol, id]
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Kullanıcı güncelleme hatası:', err);
    res.status(500).json({ error: 'Güncelleme başarısız' });
  }
});


module.exports = router;
