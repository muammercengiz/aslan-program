
const express = require('express');
const router = express.Router();
const db = require('../db');

// Hammadde ekle
router.post('/', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { mense, cins, miktar, kantar_no, plaka, giris_tarihi } = req.body;

    const result = await client.query(
      `INSERT INTO hammadde_giris (mense, cins, miktar, kantar_no, plaka, giris_tarihi)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [mense, cins, miktar, kantar_no, plaka, giris_tarihi]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Hammadde ekleme hatası:', err.message);
    res.status(500).json({ error: 'Hammadde kaydedilemedi.' });
  } finally {
    client.release();
  }
});

// Gruplanmış stok verisi
router.get('/stok', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT mense, cins, SUM(miktar) as toplam_miktar
      FROM hammadde_giris
      GROUP BY mense, cins
      ORDER BY mense, cins
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Hammadde stok listeleme hatası:', err.message);
    res.status(500).json({ error: 'Stoklar alınamadı.' });
  }
});

// Belirli menşe ve cins için geçmiş kayıtlar
router.get('/kayitlar', async (req, res) => {
  const { mense, cins } = req.query;
  try {
    const result = await db.query(
      `SELECT * FROM hammadde_giris
       WHERE mense = $1 AND cins = $2
       ORDER BY giris_tarihi DESC`,
      [mense, cins]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Hammadde geçmiş kayıt hatası:', err.message);
    res.status(500).json({ error: 'Kayıtlar alınamadı.' });
  }
});

// Belirli hammadde kaydını sil
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM hammadde_giris WHERE id = $1', [req.params.id]);
    res.json({ mesaj: 'Hammadde kaydı silindi.' });
  } catch (err) {
    console.error('Hammadde silme hatası:', err.message);
    res.status(500).json({ error: 'Silme işlemi başarısız.' });
  }
});


module.exports = router;
