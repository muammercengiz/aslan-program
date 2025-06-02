
const express = require('express');
const router = express.Router();
const db = require('../db');

// Ürün hareketlerini getir
router.get('/:id', async (req, res) => {
  const client = await db.connect();
  try {
    const result = await client.query(
      'SELECT * FROM urun_hareketleri WHERE urun_id = $1 ORDER BY tarih DESC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Hareketler alınamadı:', err.message);
    res.status(500).json({ error: 'Veriler alınamadı' });
  } finally {
    client.release();
  }
});

// Ürün hareket kaydını sil
router.delete('/:id', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM urun_hareketleri WHERE id = $1', [req.params.id]);

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Kayıt silinemedi:', err.message);
    res.status(500).json({ error: 'Silme işlemi başarısız' });
  } finally {
    client.release();
  }
});

module.exports = router;
