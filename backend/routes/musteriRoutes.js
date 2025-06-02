const express = require("express");
const router = express.Router();
const pool = require("../db");

// 🔹 Tüm müşterileri getir
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, firma_unvani, telefon, tur FROM musteriler ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Veritabanı hatası" });
  }
});

// 🔹 Tek müşteriyi getir
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM musteriler WHERE id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Veritabanı hatası" });
  }
});

// 🔹 Yeni müşteri ekle
router.post("/", async (req, res) => {
  const {
    firmaUnvani,
    yetkiliAdSoyad,
    vergiNo,
    sehir,
    adres,
    telefon,
    tur,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO musteriler 
      (firma_unvani, yetkili_ad_soyad, vergi_no, sehir, adres, telefon, tur)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [firmaUnvani, yetkiliAdSoyad, vergiNo, sehir, adres, telefon, tur]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Kayıt eklenemedi" });
  }
});

// 🔹 Müşteri güncelle
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    firmaUnvani,
    yetkiliAdSoyad,
    vergiNo,
    sehir,
    adres,
    telefon,
    tur,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE musteriler SET 
        firma_unvani = $1,
        yetkili_ad_soyad = $2,
        vergi_no = $3,
        sehir = $4,
        adres = $5,
        telefon = $6,
        tur = $7
      WHERE id = $8 RETURNING *`,
      [firmaUnvani, yetkiliAdSoyad, vergiNo, sehir, adres, telefon, tur, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Güncelleme başarısız" });
  }
});

// 🔹 Müşteri sil
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM musteriler WHERE id = $1", [id]);
    res.json({ message: "Silme başarılı" });
  } catch (err) {
    res.status(500).json({ error: "Silme başarısız" });
  }
});

module.exports = router;
