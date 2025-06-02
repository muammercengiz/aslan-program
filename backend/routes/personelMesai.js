const express = require("express");
const router = express.Router();
const db = require("../db");

// 1. Aylık genel mesai raporu - önce gelmeli
router.get("/aylik-genel", async (req, res) => {
  const { yil, ay } = req.query;
  if (!yil || !ay) return res.status(400).json({ error: "Yıl ve ay zorunlu." });

  try {
    const personelQuery = await db.query("SELECT id, isim FROM personeller WHERE durum IN ('Aktif', 'İzinli')");
    const personeller = personelQuery.rows;
    const result = [];

    for (const personel of personeller) {
      const mesaiQuery = await db.query(
        `SELECT tarih, mesai_turu FROM personel_mesai
         WHERE personel_id = $1
           AND EXTRACT(YEAR FROM tarih) = $2
           AND EXTRACT(MONTH FROM tarih) = $3`,
        [personel.id, yil, ay]
      );

      result.push({
        personel_id: personel.id,
        isim: personel.isim,
        mesailer: mesaiQuery.rows,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Genel aylık mesai sorgusu hatası:", err);
    res.status(500).json({ error: "Veri alınamadı." });
  }
});

// 2. Belirli personelin tüm mesai kayıtları
router.get("/:personelId", async (req, res) => {
  const { personelId } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM personel_mesai WHERE personel_id = $1 ORDER BY tarih DESC",
      [personelId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Mesai listeleme hatası:", err);
    res.status(500).json({ error: "Mesailer getirilemedi" });
  }
});

// 3. Yeni mesai kaydı ekle
router.post("/:personelId", async (req, res) => {
  const { personelId } = req.params;
  const { tarih, mesai_turu, aciklama } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO personel_mesai (personel_id, tarih, mesai_turu, aciklama)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [personelId, tarih, mesai_turu, aciklama || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Mesai ekleme hatası:", err);
    res.status(500).json({ error: "Mesai eklenemedi" });
  }
});

// 4. Mesai kaydı silme
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM personel_mesai WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Mesai silme hatası:", err);
    res.status(500).json({ error: "Mesai silinemedi" });
  }
});

module.exports = router;