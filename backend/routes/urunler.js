const express = require('express');
const router = express.Router();
const db = require('../db');

// Ürün ekle
router.post('/', async (req, res) => {
  const { ad, cins, adet, kapasite, dara, daralik, paketleme_turu, depo } = req.body;

  const temizKapasite = !kapasite || kapasite === '0' ? null : Number(kapasite);
  const temizDara = !dara ? 0 : Number(dara);
  const temizDaralik = daralik || 'Daralı';

  // Tank güncelleme (tank deposu değilse)
  if (!['Meydan', 'Hammadde'].includes(depo)) {
    const stok = Number(adet || 0);

    try {
      const tankResult = await db.query('SELECT * FROM tanklar WHERE ad = $1', [depo]);

      if (tankResult.rows.length === 0) {
        return res.status(404).json({ error: 'Tank bulunamadı.' });
      }

      const tank = tankResult.rows[0];
      const tankId = tank.id;
      const mevcutStok = tank.stok || 0;
      const kapasiteTank = tank.kapasite || 0;

      if (mevcutStok + stok > kapasiteTank) {
        return res.status(400).json({
          error: `Tank kapasitesi aşılamaz. Kalan kapasite: ${kapasiteTank - mevcutStok} kg.`,
        });
      }

      if (tank.urun_adi && tank.urun_adi !== ad) {
        return res.status(400).json({
          error: `Tankta farklı bir ürün var: ${tank.urun_adi}`,
        });
      }
      if (tank.urun_cinsi && tank.urun_cinsi !== cins) {
        return res.status(400).json({
          error: `Tankta farklı bir cins var: ${tank.urun_cinsi}`,
        });
      }

      await db.query(
        `UPDATE tanklar SET urun_id = NULL, stok = $1, urun_adi = $2, urun_cinsi = $3 WHERE id = $4`,
        [mevcutStok + stok, ad, cins, tankId]
      );

      await db.query(
        `INSERT INTO tank_hareketleri (tank_id, islem_tipi, miktar, aciklama)
         VALUES ($1, $2, $3, $4)`,
        [tankId, 'Giriş', stok, 'Sistemden ürün girişi']
      );

      return res.status(201).json({ mesaj: 'Tank stoğu güncellendi.' });
    } catch (err) {
      console.error('Tank güncellenemedi:', err.message, err.stack);
      return res.status(500).json({ error: err.message });
    }
  }

  // Meydan ve Hammadde depo ürün ekleme
  if ((depo === 'Meydan' || depo === 'Hammadde') && (temizKapasite === null || !paketleme_turu)) {
    return res.status(400).json({ error: 'Meydan veya Hammadde için kapasite ve paketleme türü zorunludur.' });
  }

  // Stok hesabı daralık durumuna göre
  const stok = temizDaralik === 'Daralı'
    ? Number(adet || 0) * temizKapasite + Number(adet || 0) * temizDara
    : Number(adet || 0) * temizKapasite;

  try {
    const result = await db.query(
      `INSERT INTO urunler 
       (ad, cins, adet, kapasite, dara, daralik, paketleme_turu, depo, stok)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [ad, cins, adet, temizKapasite, temizDara, temizDaralik, paketleme_turu, depo, stok]
    );

    const urunId = result.rows[0].id;

    await db.query(
      `INSERT INTO urun_hareketleri (urun_id, islem_tipi, miktar, aciklama)
       VALUES ($1, $2, $3, $4)`,
      [urunId, 'Giriş', stok, 'Ürün eklendi']
    );

    // Ambalaj stoğundan düşme (Meydan veya Hammadde için)
    if ((depo === 'Meydan' || depo === 'Hammadde') && paketleme_turu && Number(adet)) {
      const kullanilacakAmbalaj = Number(adet);

      const stokSorgu = await db.query(
        'SELECT miktar FROM ambalajlar WHERE ad = $1',
        [paketleme_turu]
      );

      if (stokSorgu.rows.length === 0) {
        throw new Error('Ambalaj bulunamadı.');
      }

      const mevcutStok = Number(stokSorgu.rows[0].miktar);

      if (mevcutStok < kullanilacakAmbalaj) {
        throw new Error(`Ambalaj stoğu yetersiz: mevcut ${mevcutStok}, gereken ${kullanilacakAmbalaj}`);
      }

      await db.query(
        'UPDATE ambalajlar SET miktar = miktar - $1 WHERE ad = $2',
        [kullanilacakAmbalaj, paketleme_turu]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ürün eklenemedi:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

// Tüm ürünleri getir
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM urunler ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Ürünler alınamadı' });
  }
});

// Ürün sil
router.delete('/:id', async (req, res) => {
  try {
    await db.query('BEGIN');
    await db.query('DELETE FROM urun_hareketleri WHERE urun_id = $1', [req.params.id]);
    await db.query('DELETE FROM urunler WHERE id = $1', [req.params.id]);
    await db.query('COMMIT');
    res.json({ mesaj: 'Ürün silindi' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Ürün silinemedi:', err.message);
    res.status(500).json({ error: 'Ürün silinemedi' });
  }
});

// Ürün detay
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM urunler WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ürün bulunamadı' });
    console.log(result.rows);  // Bu satırı ekle, verilerin doğru geldiğini konsolda kontrol et
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Detay alınamadı' });
  }
});

// Ürün güncelle
router.put('/:id', async (req, res) => {
  const { ad, cins, adet, kapasite, dara, daralik, paketleme_turu, depo } = req.body;

  const temizKapasite = !kapasite || kapasite === '0' ? null : Number(kapasite);
  const temizDara = !dara ? 0 : Number(dara);
  const temizDaralik = daralik || 'Daralı';

  const stok = temizDaralik === 'Daralı'
    ? Number(adet || 0) * temizKapasite + Number(adet || 0) * temizDara
    : Number(adet || 0) * temizKapasite;

  try {
    const result = await db.query(
      `UPDATE urunler SET
        ad=$1, cins=$2, adet=$3, kapasite=$4, dara=$5, daralik=$6,
        paketleme_turu=$7, depo=$8, stok=$9
       WHERE id = $10 RETURNING *`,
      [ad, cins, adet, temizKapasite, temizDara, temizDaralik, paketleme_turu, depo, stok, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Güncelleme hatası:', err.message);
    res.status(500).json({ error: 'Güncelleme başarısız' });
  }
});

module.exports = router;
