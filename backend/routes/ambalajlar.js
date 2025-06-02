
const express = require('express');
const router = express.Router();
const db = require('../db');

// Tüm ambalajları getir
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, t.firma_unvani
      FROM ambalajlar a
      LEFT JOIN tedarikciler t ON a.tedarikci_id = t.id
      ORDER BY a.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Ambalaj listesi hatası:', err.message);
    res.status(500).json({ error: 'Ambalajlar alınamadı.' });
  }
});

// Tek ambalaj getir
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM ambalajlar WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ambalaj getirme hatası:', err.message);
    res.status(500).json({ error: 'Ambalaj alınamadı.' });
  }
});

// Ambalaj ekle
router.post('/', async (req, res) => {
  const { ad, miktar, kapasite_kg, dara, aciklama, tedarikci_id } = req.body;
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    if (Number(miktar) < 0) {
      throw new Error('Negatif miktar girilemez.');
    }

    await client.query(
      `INSERT INTO ambalajlar (ad, miktar, kapasite_kg, dara, aciklama, tedarikci_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [ad, miktar, kapasite_kg, dara, aciklama, tedarikci_id]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Ambalaj eklendi.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Ambalaj ekleme hatası:', err.message);
    res.status(500).json({ error: 'Ambalaj eklenemedi.' });
  } finally {
    client.release();
  }
});

// Ambalaj güncelle
router.put('/:id', async (req, res) => {
  const { ad, miktar, kapasite_kg, dara, aciklama, tedarikci_id } = req.body;
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    if (Number(miktar) < 0) {
      throw new Error('Negatif miktar girilemez.');
    }

    await client.query(
      `UPDATE ambalajlar
       SET ad=$1, miktar=$2, kapasite_kg=$3, dara=$4, aciklama=$5, tedarikci_id=$6
       WHERE id=$7`,
      [ad, miktar, kapasite_kg, dara, aciklama, tedarikci_id, req.params.id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Ambalaj güncellendi.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Ambalaj güncelleme hatası:', err.message);
    res.status(500).json({ error: 'Ambalaj güncellenemedi.' });
  } finally {
    client.release();
  }
});


// Ambalaj sil
router.delete('/:id', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM ambalajlar WHERE id = $1', [req.params.id]);

    await client.query('COMMIT');
    res.json({ message: 'Ambalaj silindi.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Ambalaj silme hatası:', err.message);
    res.status(500).json({ error: 'Ambalaj silinemedi.' });
  } finally {
    client.release();
  }
});

module.exports = router;
