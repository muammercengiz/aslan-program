const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ İADE EKLE
router.post("/", async (req, res) => {
  const { musteri_id, siparis_id, miktar, aciklama, durum } = req.body;

  try {
        await client.query(
      `INSERT INTO iade_kayitlari (musteri_id, siparis_id, miktar, aciklama, durum, tarih)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [musteri_id, siparis_id, miktar, aciklama, durum]
    );
    res.status(201).send("İade kaydı oluşturuldu.");
  } catch (err) {
    console.error("İade ekleme hatası:", err);
    res.status(500).send("İade kaydı eklenemedi.");
  }
});

// ✅ TÜM İADELERI GETİR
router.get("/", async (req, res) => {
  try {
    const result =     await client.query(`
      SELECT i.*, m.firma_unvani AS musteri, u.ad AS urun
      FROM iade_kayitlari i
      LEFT JOIN musteriler m ON i.musteri_id = m.id
      LEFT JOIN siparisler s ON i.siparis_id = s.id
      LEFT JOIN urunler u ON s.urun_id = u.id
      ORDER BY i.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("İadeler alınamadı:", err);
    res.status(500).send("İadeler getirilemedi.");
  }
});

// ✅ TEK İADE GETİR
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result =     await client.query(
      `SELECT * FROM iade_kayitlari WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("İade bulunamadı.");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("İade detay hatası:", err);
    res.status(500).send("Detay alınamadı.");
  }
});

// ✅ İADE SİL
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
        await client.query("DELETE FROM iade_kayitlari WHERE id = $1", [id]);
        await client.query("COMMIT");
    res.send("İade silindi.");
  } catch (err) {
    console.error("İade silme hatası:", err);
    res.status(500).send("İade silinemedi.");
  }
});

// ✅ İADE GÜNCELLE ve stok giriş işlemi
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { durum, aciklama } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Mevcut iade bilgisi alınır
    const result = await client.query(
      "SELECT * FROM iade_kayitlari WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "İade bulunamadı." });
    }

    const iade = result.rows[0];

    // 2. Eğer yeni durum 'Teslim Alındı' ve önceki durum farklıysa → stok artır
    if (durum === "Teslim Alındı" && iade.durum !== "Teslim Alındı") {
      // siparis_id üzerinden ürün id'yi bul
      const siparis = await client.query(
        "SELECT urun_id FROM siparisler WHERE id = $1",
        [iade.siparis_id]
      );
      const urun_id = siparis.rows[0].urun_id;

      await client.query(
        "UPDATE urunler SET adet = adet + $1 WHERE id = $2",
        [iade.miktar, urun_id]
      );
    }

 // 3. İade kaydını güncelle
await client.query(
  "UPDATE iade_kayitlari SET durum = $1, aciklama = $2 WHERE id = $3",
  [durum, aciklama, id]
);

// 4. Arşivleme kontrolü
const arsivlikDurumlar = ["Teslim Alındı", "Red Edildi"];
if (arsivlikDurumlar.includes(durum)) {
  await client.query(
    "UPDATE iade_kayitlari SET arsiv = true WHERE id = $1",
    [id]
  );
}

await client.query("COMMIT");
res.json({ message: "İade güncellendi." });

} catch (err) {
  await client.query("ROLLBACK");
  console.error("İade güncelleme hatası:", err);
  res.status(500).send("İade güncellenemedi.");
} finally {
  client.release();
}
});







module.exports = router;
