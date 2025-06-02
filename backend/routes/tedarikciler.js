const express = require('express');
const router = express.Router();
const db = require('../db');

// Tüm tedarikçileri getir
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tedarikciler ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Tedarikçi listesi hatası:', err.message);
    res.status(500).json({ error: 'Tedarikçiler alınamadı.' });
  }
});

// Tek tedarikçiyi getir
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tedarikciler WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Tedarikçi getirme hatası:', err.message);
    res.status(500).json({ error: 'Tedarikçi alınamadı.' });
  }
});

// Yeni tedarikçi ekle
router.post('/', async (req, res) => {
  const { firma_unvani, yetkili_adi, telefon, adres, urunler, aciklama } = req.body;
  try {
    await db.query(
      `INSERT INTO tedarikciler (firma_unvani, yetkili_adi, telefon, adres, urunler, aciklama)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [firma_unvani, yetkili_adi, telefon, adres, urunler, aciklama]
    );
    res.status(201).json({ message: 'Tedarikçi eklendi.' });
  } catch (err) {
    console.error('Tedarikçi ekleme hatası:', err.message);
    res.status(500).json({ error: 'Tedarikçi eklenemedi.' });
  }
});

// Tedarikçiyi güncelle
router.put('/:id', async (req, res) => {
  const { firma_unvani, yetkili_adi, telefon, adres, urunler, aciklama } = req.body;
  try {
    await db.query(
      `UPDATE tedarikciler
       SET firma_unvani=$1, yetkili_adi=$2, telefon=$3, adres=$4, urunler=$5, aciklama=$6
       WHERE id=$7`,
      [firma_unvani, yetkili_adi, telefon, adres, urunler, aciklama, req.params.id]
    );
    res.json({ message: 'Tedarikçi güncellendi.' });
  } catch (err) {
    console.error('Tedarikçi güncelleme hatası:', err.message);
    res.status(500).json({ error: 'Tedarikçi güncellenemedi.' });
  }
});

// Tedarikçiyi sil
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM tedarikciler WHERE id = $1', [req.params.id]);
    res.json({ message: 'Tedarikçi silindi.' });
  } catch (err) {
    console.error('Tedarikçi silme hatası:', err.message);
    res.status(500).json({ error: 'Tedarikçi silinemedi.' });
  }
});

module.exports = router;
