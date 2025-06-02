const express = require('express');
const router = express.Router();
const db = require('../db');

// Tüm ürün tanımları
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM urun_tanimlari ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Veriler alınamadı' });
  }
});

// Yeni ürün tanımı ekle
router.post('/', async (req, res) => {
  const { ad, cins } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO urun_tanimlari (ad, cins) VALUES ($1, $2) RETURNING *',
      [ad, cins]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Ekleme başarısız' });
  }
});

// Ürün tanımı sil
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM urun_tanimlari WHERE id = $1', [req.params.id]);
    res.json({ mesaj: 'Silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Silme başarısız' });
  }
});

module.exports = router;
