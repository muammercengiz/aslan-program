const express = require("express");
const router = express.Router();
const db = require("../db");

// 1) Tüm personellerin bir ay içindeki devam durumları
router.get("/aylik-genel", async (req, res) => {
  const { yil, ay } = req.query;

  if (!yil || !ay) {
    return res.status(400).json({ error: "Yıl ve ay zorunludur." });
  }

  try {
    const personelQuery = await db.query("SELECT id, isim FROM personeller WHERE durum IN ('Aktif', 'İzinli')");
    const personeller = personelQuery.rows;

    const result = [];

    for (const personel of personeller) {
      const devamQuery = await db.query(
        `SELECT tarih, durum FROM personel_devam 
         WHERE personel_id = $1 
           AND EXTRACT(YEAR FROM tarih) = $2 
           AND EXTRACT(MONTH FROM tarih) = $3`,
        [personel.id, yil, ay]
      );

      result.push({
        personel_id: personel.id,
        isim: personel.isim,
        devamlar: devamQuery.rows,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Genel aylık devam sorgusu hatası:", err);
    res.status(500).json({ error: "Veri alınamadı." });
  }
});

// 2) Belirli personelin aylık devam verileri
router.get("/:personelId/aylik", async (req, res) => {
  const { personelId } = req.params;
  const { yil, ay } = req.query;

  try {
    const result = await db.query(
      `SELECT * FROM personel_devam 
       WHERE personel_id = $1 
         AND EXTRACT(YEAR FROM tarih) = $2 
         AND EXTRACT(MONTH FROM tarih) = $3 
       ORDER BY tarih ASC`,
      [personelId, yil, ay]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Aylık devam listesi alınamadı:", err);
    res.status(500).json({ error: "Veri alınamadı" });
  }
});

// 3) Belirli personelin tüm devam kayıtları
router.get("/:personelId", async (req, res) => {
  const { personelId } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM personel_devam WHERE personel_id = $1 ORDER BY tarih DESC",
      [personelId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Devam kayıtları alınamadı:", err);
    res.status(500).json({ error: "Devam durumu alınamadı" });
  }
});

// 4) Yeni devam kaydı ekle
router.post("/:personelId", async (req, res) => {
  const { personelId } = req.params;
  const { tarih, durum, aciklama } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO personel_devam 
        (personel_id, tarih, durum, aciklama) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [personelId, tarih, durum, aciklama || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Devam kaydı ekleme hatası:", err);
    res.status(500).json({ error: "Devam kaydı eklenemedi" });
  }
});

// 5) Belirli devam kaydını sil
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM personel_devam WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Devam silme hatası:", err);
    res.status(500).json({ error: "Devam kaydı silinemedi" });
  }
});

module.exports = router;
