const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, isim, soyisim, email, telefon, kullanici_adi, rol FROM kullanicilar');
    res.json(result.rows);
  } catch (err) {
    console.error('Kullanıcı listesi hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Belirli bir kullanıcıyı ID ile getir
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT id, isim, soyisim, email, telefon, kullanici_adi, rol FROM kullanicilar WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Kullanıcı getirme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});


// Kullanıcı silme
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM kullanicilar WHERE id = $1', [id]);
    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (err) {
    console.error('Kullanıcı silinirken hata:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;

