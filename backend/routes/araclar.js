const express = require('express');
const router = express.Router();
const db = require('../db');

// Tüm araçları listele
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM araclar ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Veri alınamadı' });
  }
});

// Yeni araç ekle
router.post('/', async (req, res) => {
  const { plaka, tip, kapasite, muayene_tarihi, marka, model, durum } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO araclar (plaka, tip, kapasite, muayene_tarihi, marka, model, durum)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [plaka, tip, kapasite || null, muayene_tarihi || null, marka || null, model || null, durum]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Araç ekleme hatası:', err);
    res.status(500).json({ error: 'Araç eklenemedi' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await db.query('DELETE FROM araclar WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('Araç silme hatası:', err);
    res.status(500).json({ error: 'Araç silinemedi' });
  }
});

// Tek bir aracı getir
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query('SELECT * FROM araclar WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Araç getirme hatası:', err);
    res.status(500).json({ error: 'Araç getirilemedi' });
  }
});

// Aracı güncelle
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { plaka, tip, kapasite, muayene_tarihi, marka, model, durum } = req.body;

  try {
    await db.query(
      `UPDATE araclar
       SET plaka = $1, tip = $2, kapasite = $3, muayene_tarihi = $4,
           marka = $5, model = $6, durum = $7
       WHERE id = $8`,
      [plaka, tip, kapasite || null, muayene_tarihi || null, marka || null, model || null, durum, id]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Araç güncelleme hatası:', err);
    res.status(500).json({ error: 'Araç güncellenemedi' });
  }
});


module.exports = router;
