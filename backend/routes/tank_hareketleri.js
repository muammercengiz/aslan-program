const express = require('express');
const router = express.Router();
const db = require('../db'); // senin veritabanı bağlantın

// Belirli bir tankın hareketlerini getir
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM tank_hareketleri WHERE tank_id = $1 ORDER BY tarih DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Hareketler alınamadı:', err.message);
    res.status(500).json({ error: 'Hareketler alınamadı' });
  }
});

// Belirli bir hareketi sil ve tank stok bilgisini güncelle
router.delete('/:hareket_id', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const hareket = await client.query(
      'SELECT * FROM tank_hareketleri WHERE id = $1',
      [req.params.hareket_id]
    );

    if (hareket.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Hareket bulunamadı' });
    }

    const { tank_id, miktar, islem_tipi } = hareket.rows[0];

    if (islem_tipi === 'Giriş') {
      await client.query(
        'UPDATE tanklar SET stok = stok - $1 WHERE id = $2',
        [miktar, tank_id]
      );
    } else if (islem_tipi === 'Çıkış') {
      await client.query(
        'UPDATE tanklar SET stok = stok + $1 WHERE id = $2',
        [miktar, tank_id]
      );
    }

    await client.query(
      'DELETE FROM tank_hareketleri WHERE id = $1',
      [req.params.hareket_id]
    );

    await client.query('COMMIT');
    res.json({ mesaj: 'Hareket silindi ve stok güncellendi' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Hareket silme hatası:', err.message);
    res.status(500).json({ error: 'Silme hatası' });
  } finally {
    client.release();
  }
});



module.exports = router;
