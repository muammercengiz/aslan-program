// routes/tanktan-cikis.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const {
    tank_id, miktar, hedef_depo,
    paketleme_turu, daralik, adet,
    kapasite, dara, kullanici
  } = req.body;

  
  const urunStok = daralik === 'Daralı'
    ? adet * (kapasite + dara)
    : adet * kapasite;

  const tankCikis = daralik === 'Daralı'
    ? adet * kapasite
    : adet * (kapasite - dara);


  const kullaniciIsmi = typeof kullanici === 'string'
    ? kullanici
    : kullanici?.isim || kullanici?.ad || 'Bilinmiyor';

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const tank = await client.query('SELECT * FROM tanklar WHERE id = $1', [tank_id]);
    if (tank.rows.length === 0) throw new Error("Tank bulunamadı.");

    const tankVeri = tank.rows[0];
    if (tankVeri.stok < tankCikis) {
      throw new Error(`Tankta yeterli stok yok. Mevcut: ${tankVeri.stok}, Gerekli: ${toplamStok}`);
    }

    // Tanktan stok düş
    await client.query(
      'UPDATE tanklar SET stok = stok - $1 WHERE id = $2',
      [tankCikis, tank_id]
    );

    // Tank hareketi kaydı
    await client.query(`
      INSERT INTO tank_hareketleri (tank_id, islem_tipi, miktar, aciklama, kullanici)
      VALUES ($1, 'Çıkış', $2, $3, $4)
    `, [tank_id, tankCikis, `Depoya aktarım (${hedef_depo})`, kullaniciIsmi]);

    // Ambalaj düş
    const ambalajSorgu = await client.query('SELECT miktar FROM ambalajlar WHERE ad = $1', [paketleme_turu]);
    if (ambalajSorgu.rows.length === 0) throw new Error('Ambalaj bulunamadı');
    if (ambalajSorgu.rows[0].miktar < adet) throw new Error('Ambalaj stoğu yetersiz');

    await client.query(
      'UPDATE ambalajlar SET miktar = miktar - $1 WHERE ad = $2',
      [adet, paketleme_turu]
    );

    // Ürün ekle
    const stok = urunStok;
    const urunEkle = await client.query(`
      INSERT INTO urunler (ad, cins, adet, kapasite, dara, daralik, paketleme_turu, depo, stok)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
    `, [
      tankVeri.urun_adi, tankVeri.urun_cinsi, adet, kapasite,
      dara, daralik, paketleme_turu, hedef_depo, stok
    ]);

    await client.query(`
      INSERT INTO urun_hareketleri (urun_id, islem_tipi, miktar, aciklama)
      VALUES ($1, 'Giriş', $2, $3)
    `, [urunEkle.rows[0].id, stok, `Tanktan ${hedef_depo} deposuna aktarım`]);

    await client.query('COMMIT');
    res.status(201).json({ mesaj: 'Tanktan çıkış ve ürün aktarımı başarıyla tamamlandı.' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Çıkış hatası:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
