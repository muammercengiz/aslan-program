const express = require("express");
const router = express.Router();
const pool = require("../db"); // sadece pool kullanılıyor

// ✅ SIPARIŞ OLUŞTUR
router.post("/", async (req, res) => {
  console.log("🟡 Gelen sipariş verisi:", req.body);

  const {
    siparis_tarihi,
    musteri_id,
    urun_id,
    miktar,
    fiyat,
    paketleme,
    birim,
    paketleme_turu,
    dagitim_tarihi,
    aciklama,
    kullanici_rol,
    olusturan_kullanici
  } = req.body;

  const durum = kullanici_rol === "admin" ? "Hazırlanıyor" : "Onay Bekliyor";

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
  `INSERT INTO siparisler (
    siparis_tarihi, musteri_id, urun_id, miktar, fiyat,
    paketleme, birim, paketleme_turu, dagitim_tarihi,
    aciklama, durum, olusturan_kullanici
  ) VALUES (
    $1, $2, $3, $4, $5,
    $6, $7, $8, $9, $10,
    $11, $12
  )`,
  [
    siparis_tarihi,
    musteri_id,
    urun_id,
    miktar,
    fiyat,
    paketleme,
    birim,
    paketleme_turu,
    dagitim_tarihi,
    aciklama,
    durum,
    olusturan_kullanici
  ]
);


    res.status(200).json({ mesaj: "✅ Sipariş başarıyla kaydedildi." });
  } catch (err) {
    console.error("❌ Sipariş oluşturma hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası" });
  } finally {
    client.release();
  }
});



// ✅ SIPARIŞ GÜNCELLE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    musteri_id,
    urun_id,
    miktar,
    fiyat,
    paketleme,
    birim,
    paketleme_turu,
    dagitim_tarihi,
    aciklama,
    durum
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const eskiSiparis = await client.query("SELECT urun_id, miktar, durum FROM siparisler WHERE id = $1", [id]);
    if (eskiSiparis.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Sipariş bulunamadı." });
    }

    const eskiUrunId = eskiSiparis.rows[0].urun_id;
    const eskiMiktar = eskiSiparis.rows[0].miktar;
    const eskiDurum = eskiSiparis.rows[0].durum;
    console.log("🔎 Güncelleme DURUMLARI → önceki:", eskiDurum, "yeni:", durum);


    await client.query(
      "UPDATE urunler SET rezerve = rezerve - $1 WHERE id = $2",
      [eskiMiktar, eskiUrunId]
    );

    await client.query(
      "UPDATE urunler SET rezerve = rezerve + $1 WHERE id = $2",
      [miktar, urun_id]
    );

    if (durum === "Yüklendi" && eskiDurum !== "Yüklendi") {
      await client.query(
        "UPDATE urunler SET adet = adet - $1, rezerve = rezerve - $1 WHERE id = $2",
        [miktar, urun_id]
      );
    }

    await client.query(
      `UPDATE siparisler
       SET musteri_id = $1,
           urun_id = $2,
           miktar = $3,
           fiyat = $4,
           paketleme = $5,
           birim = $6,
           paketleme_turu = $7,
           dagitim_tarihi = $8,
           aciklama = $9,
           durum = $10,
           guncelleme_tarihi = NOW()
       WHERE id = $11`,
      [
        musteri_id,
        urun_id,
        miktar,
        fiyat,
        paketleme,
        birim,
        paketleme_turu,
        dagitim_tarihi,
        aciklama,
        durum,
        id
      ]
    );

    // 🔁 Arşiv kontrolü: Teslim Edildi'ye geçildiyse arşive al
if (
  durum.trim() === "Teslim Edildi" &&
  eskiDurum.trim() !== "Teslim Edildi"
) {
  console.log("✅ Arşive geçiş şartları sağlandı, güncelleniyor...");
  await client.query("UPDATE siparisler SET arsiv = true WHERE id = $1", [id]);
}

console.log("🔎 Güncelleme DURUMLARI → önceki:", eskiDurum, "yeni:", durum);



    await client.query("COMMIT");
    res.json({ message: "Sipariş ve stok başarıyla güncellendi." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Güncelleme hatası:", err);
    res.status(500).json({ error: "Sipariş güncellenemedi." });
  } finally {
    client.release();
  }
});


// ✅ SIPARIŞ LİSTELE
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, m.firma_unvani AS musteri, u.ad AS urun
      FROM siparisler s
      LEFT JOIN musteriler m ON s.musteri_id = m.id
      LEFT JOIN urunler u ON s.urun_id = u.id
      ORDER BY s.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Sipariş listeleme hatası:", err);
    res.status(500).json({ error: "Siparişler alınamadı." });
  }
});


// ✅ SIPARIŞ DETAY
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT s.*, m.firma_unvani AS musteri, u.ad AS urun
      FROM siparisler s
      LEFT JOIN musteriler m ON s.musteri_id = m.id
      LEFT JOIN urunler u ON s.urun_id = u.id
      WHERE s.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sipariş bulunamadı" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Detay hatası:", err);
    res.status(500).json({ error: "Detay alınamadı." });
  }
});


// ✅ SIPARIŞ SILME
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const siparisRes = await client.query(
      "SELECT urun_id, miktar, durum FROM siparisler WHERE id = $1",
      [id]
    );

    if (siparisRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Sipariş bulunamadı." });
    }

    const { urun_id, miktar, durum } = siparisRes.rows[0];

    if (durum === "Yüklendi") {
      await client.query(
        "UPDATE urunler SET adet = adet + $1 WHERE id = $2",
        [miktar, urun_id]
      );
    } else {
      await client.query(
        "UPDATE urunler SET rezerve = rezerve - $1 WHERE id = $2",
        [miktar, urun_id]
      );
    }

    await client.query("DELETE FROM siparisler WHERE id = $1", [id]);

    await client.query("COMMIT");
    res.json({ message: "Sipariş silindi, stok/rezerv iade edildi." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Sipariş silme hatası:", err);
    res.status(500).json({ error: "Sipariş silinemedi." });
  } finally {
    client.release();
  }
});

module.exports = router;
