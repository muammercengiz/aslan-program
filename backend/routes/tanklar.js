
const express = require('express');
const router = express.Router();
const db = require('../db');

// Tank ekle
router.post('/', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { ad, kapasite } = req.body;

    const result = await client.query(
      `INSERT INTO tanklar (ad, kapasite) VALUES ($1, $2) RETURNING *`,
      [ad, kapasite]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Tank eklenemedi:', err.message);
    res.status(500).json({ error: 'Tank eklenemedi' });
  } finally {
    client.release();
  }
});

// Tankları listele
router.get('/', async (req, res) => {
  const client = await db.connect();
  try {
    const result = await client.query(`
      SELECT id, ad, kapasite, urun_adi, urun_cinsi, stok, birim
      FROM tanklar
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Tanklar alınamadı' });
  } finally {
    client.release();
  }
});

// Tank sil
router.delete('/:id', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM tanklar WHERE id = $1', [req.params.id]);
    await client.query('COMMIT');
    res.json({ mesaj: 'Tank silindi' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Silme hatası' });
  } finally {
    client.release();
  }
});

// Tank güncelle
router.put('/:id', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { ad, kapasite } = req.body;

    const result = await client.query(
      `UPDATE tanklar SET ad = $1, kapasite = $2 WHERE id = $3 RETURNING *`,
      [ad, kapasite, req.params.id]
    );

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Tank güncellenemedi:', err.message);
    res.status(500).json({ error: 'Tank güncellenemedi' });
  } finally {
    client.release();
  }
});

// Belirli bir tankı getir
router.get('/:id', async (req, res) => {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT * FROM tanklar WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tank bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Tank alınamadı:', err.message);
    res.status(500).json({ error: 'Tank alınamadı' });
  } finally {
    client.release();
  }
});

module.exports = router;
