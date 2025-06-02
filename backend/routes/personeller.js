const express = require("express");
const router = express.Router();
const db = require("../db"); // db bağlantın burada tanımlı olmalı

// Tüm personelleri getir
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM personeller ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Personel listeleme hatası:", err);
    res.status(500).json({ error: "Personel listesi alınamadı" });
  }
});

// Tek personeli getir
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM personeller WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Detay getirme hatası:", err);
    res.status(500).json({ error: "Personel bulunamadı" });
  }
});

// Yeni personel ekle
router.post("/", async (req, res) => {
  const {
    isim,
    tc,
    ise_baslama,
    telefon,
    adres,
    gorev,
    durum,
    pasif_tarihi,
    aciklama,
    maas,
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO personeller 
        (isim, tc, ise_baslama, telefon, adres, gorev, durum, pasif_tarihi, aciklama, maas) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        isim,
        tc,
        ise_baslama,
        telefon,
        adres,
        gorev,
        durum,
        pasif_tarihi || null,
        aciklama || null,
        maas || null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Ekleme hatası:", err);
    res.status(500).json({ error: "Personel eklenemedi" });
  }
});

// Güncelle
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    isim,
    tc,
    ise_baslama,
    telefon,
    adres,
    gorev,
    durum,
    pasif_tarihi,
    aciklama,
    maas,
  } = req.body;

  try {
    await db.query(
      `UPDATE personeller 
       SET isim = $1, tc = $2, ise_baslama = $3, telefon = $4, adres = $5,
           gorev = $6, durum = $7, pasif_tarihi = $8, aciklama = $9, maas = $10
       WHERE id = $11`,
      [
        isim,
        tc,
        ise_baslama,
        telefon,
        adres,
        gorev,
        durum,
        pasif_tarihi || null,
        aciklama || null,
        maas || null,
        id,
      ]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Güncelleme hatası:", err);
    res.status(500).json({ error: "Personel güncellenemedi" });
  }
});

// Sil
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM personeller WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Silme hatası:", err);
    res.status(500).json({ error: "Personel silinemedi" });
  }
});


module.exports = router;
