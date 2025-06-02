const express = require("express");
const router = express.Router();
const db = require("../db");

// 1) GENEL AYLIK İZİN RAPORU
router.get("/aylik-genel", async (req, res) => {
  const { yil, ay } = req.query;
  if (!yil || !ay) return res.status(400).json({ error: "Yıl ve ay zorunlu." });

  try {
    const personelQuery = await db.query("SELECT id, isim FROM personeller WHERE durum IN ('Aktif', 'İzinli')");
    const personeller = personelQuery.rows;
    const result = [];

    for (const personel of personeller) {
      const izinQuery = await db.query(
        `SELECT baslangic_tarihi, bitis_tarihi, izin_turu FROM personel_izinleri
         WHERE personel_id = $1
           AND EXTRACT(YEAR FROM baslangic_tarihi) = $2
           AND EXTRACT(MONTH FROM baslangic_tarihi) = $3`,
        [personel.id, yil, ay]
      );

      result.push({
        personel_id: personel.id,
        isim: personel.isim,
        izinler: izinQuery.rows,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Genel aylık izin sorgusu hatası:", err);
    res.status(500).json({ error: "Veri alınamadı." });
  }
});

// 2) Belirli personelin izinleri
router.get("/:personelId", async (req, res) => {
  const { personelId } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM personel_izinleri WHERE personel_id = $1 ORDER BY baslangic_tarihi DESC",
      [personelId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("İzin listeleme hatası:", err);
    res.status(500).json({ error: "İzinler getirilemedi" });
  }
});

// 3) Yeni izin ekle
router.post("/:personelId", async (req, res) => {
  const { personelId } = req.params;
  const { izin_turu, baslangic_tarihi, bitis_tarihi, aciklama } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO personel_izinleri 
        (personel_id, izin_turu, baslangic_tarihi, bitis_tarihi, aciklama)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [personelId, izin_turu, baslangic_tarihi, bitis_tarihi, aciklama || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("İzin ekleme hatası:", err);
    res.status(500).json({ error: "İzin eklenemedi" });
  }
});

// 4) Belirli izin kaydını sil
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM personel_izinleri WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("İzin silme hatası:", err);
    res.status(500).json({ error: "İzin kaydı silinemedi" });
  }
});

module.exports = router;
