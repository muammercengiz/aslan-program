const express = require('express');
const router = express.Router();
const db = require('../db');

// Üretim planlama kaydı oluştur
router.post('/', async (req, res) => {
  const {
    hazirlik_tarihi,
    uretim_tarihi,
    mense,
    cins,
    miktar,
    urun_id,
    urun_cinsi
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO uretim (
        hazirlik_tarihi, uretim_tarihi, mense, cins, miktar, urun_id, urun_cinsi
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [hazirlik_tarihi, uretim_tarihi, mense, cins, miktar, urun_id, urun_cinsi]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Üretim kaydı hatası:', err.message);
    res.status(500).json({ error: 'Üretim planlaması kaydedilemedi.' });
  }
});

// Üretim kayıtlarını listele
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.*, urunler.ad AS urun_adi
       FROM uretim u
       LEFT JOIN urunler ON u.urun_id = urunler.id
       ORDER BY u.uretim_tarihi DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Üretim listesi hatası:', err.message);
    res.status(500).json({ error: 'Üretim kayıtları alınamadı.' });
  }
});

module.exports = router;
