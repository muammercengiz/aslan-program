// backend/routes/dagitimlar.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { tarih, aracId, soforId, yardimciId, guzergah } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO dagitimlar (tarih, arac_id, sofor_id, yardimci_id, guzergah)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [tarih, aracId, soforId, yardimciId, guzergah]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Dağıtım ekleme hatası:', err);
    res.status(500).json({ error: 'Dağıtım eklenemedi' });
  }
});

// Tüm dağıtımları listele
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.*, 
             a.plaka AS arac_plaka, 
             s.isim AS sofor_adi, 
             y.isim AS yardimci_adi
      FROM dagitimlar d
      LEFT JOIN araclar a ON d.arac_id = a.id
      LEFT JOIN personeller s ON d.sofor_id = s.id
      LEFT JOIN personeller y ON d.yardimci_id = y.id
      ORDER BY d.tarih DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Dağıtım listesi hatası:', err);
    res.status(500).json({ error: 'Liste alınamadı' });
  }
});

// Tek bir dağıtımı getir
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(`
      SELECT d.*, 
             a.plaka AS arac_plaka, 
             s.isim AS sofor_adi, 
             y.isim AS yardimci_adi
      FROM dagitimlar d
      LEFT JOIN araclar a ON d.arac_id = a.id
      LEFT JOIN personeller s ON d.sofor_id = s.id
      LEFT JOIN personeller y ON d.yardimci_id = y.id
      WHERE d.id = $1
    `, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Detay çekme hatası:', err);
    res.status(500).json({ error: 'Detay alınamadı' });
  }
});

// Dağıtım sil
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM dagitimlar WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('Silme hatası:', err);
    res.status(500).json({ error: 'Silinemedi' });
  }
});


module.exports = router;
