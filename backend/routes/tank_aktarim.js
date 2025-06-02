const express = require("express");
const router = express.Router();
const db = require("../db");

// TANKLAR ARASI AKTARIM
router.post("/", async (req, res) => {
  const client = await db.connect();
  const { kaynak_id, hedef_id, miktar, olusturan_kullanici } = req.body;

  try {
    await client.query("BEGIN");

    // Kaynak tankı ve hedef tankı getir
    const kaynakTankRes = await client.query("SELECT * FROM tanklar WHERE id = $1", [kaynak_id]);
    const hedefTankRes = await client.query("SELECT * FROM tanklar WHERE id = $1", [hedef_id]);

    if (kaynakTankRes.rows.length === 0 || hedefTankRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Tank(lar) bulunamadı." });
    }

    const kaynak = kaynakTankRes.rows[0];
    const hedef = hedefTankRes.rows[0];

    if (kaynak.stok < miktar) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Kaynak tankta yeterli stok yok." });
    }

    // Kaynak tanktan stok düş
    await client.query("UPDATE tanklar SET stok = stok - $1 WHERE id = $2", [miktar, kaynak_id]);

    // Hedef tankın ürün adı ve cinsi aynıysa stok artır, değilse önce kontrol et
    if (
      hedef.urun_adi === kaynak.urun_adi &&
      hedef.urun_cinsi === kaynak.urun_cinsi
    ) {
      await client.query("UPDATE tanklar SET stok = stok + $1 WHERE id = $2", [miktar, hedef_id]);
    } else if (hedef.stok === 0) {
      // Ürün uyumsuz ama hedef tank boşsa uyumlu hale getirip aktar
      await client.query(
        "UPDATE tanklar SET stok = $1, urun_adi = $2, urun_cinsi = $3 WHERE id = $4",
        [miktar, kaynak.urun_adi, kaynak.urun_cinsi, hedef_id]
      );
    } else {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Hedef tankta farklı ürün var." });
    }

    const tarih = new Date();

    const aciklamaCikis = `${kaynak.ad} tankından ${hedef.ad} tankına aktarım`;
    const aciklamaGiris = `${kaynak.ad} tankından gelen aktarım`;

    // Ortak aktarim_id
    const aktarimId = Date.now();

    // Hareketleri kaydet
    await client.query(
      `INSERT INTO tank_hareketleri (tank_id, miktar, islem_tipi, tarih, aciklama, kullanici, aktarim_id)
       VALUES ($1, $2, 'Çıkış', $3, $4, $5, $6)`,
      [kaynak_id, miktar, tarih, aciklamaCikis, olusturan_kullanici, aktarimId]
    );

    await client.query(
      `INSERT INTO tank_hareketleri (tank_id, miktar, islem_tipi, tarih, aciklama, kullanici, aktarim_id)
       VALUES ($1, $2, 'Giriş', $3, $4, $5, $6)`,
      [hedef_id, miktar, tarih, aciklamaGiris, olusturan_kullanici, aktarimId]
    );

    await client.query("COMMIT");
    res.json({ mesaj: "Tank aktarımı başarıyla tamamlandı.", aktarim_id: aktarimId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Aktarım hatası:", err.message);
    res.status(500).json({ error: "Aktarım işlemi başarısız." });
  } finally {
    client.release();
  }
});

// AKTARIM SİLME
router.delete("/aktarim/:aktarim_id", async (req, res) => {
  const client = await db.connect();
  const aktarim_id = req.params.aktarim_id;

  try {
    await client.query("BEGIN");

    const hareketlerRes = await client.query(
      "SELECT * FROM tank_hareketleri WHERE aktarim_id = $1",
      [aktarim_id]
    );

    const hareketler = hareketlerRes.rows;
    if (hareketler.length !== 2) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "İlgili aktarım hareketleri bulunamadı." });
    }

    for (let hareket of hareketler) {
      const operator = hareket.islem_tipi === "Giriş" ? -1 : 1;
      await client.query("UPDATE tanklar SET stok = stok + $1 WHERE id = $2", [operator * hareket.miktar, hareket.tank_id]);
    }

    await client.query("DELETE FROM tank_hareketleri WHERE aktarim_id = $1", [aktarim_id]);

    await client.query("COMMIT");
    res.json({ mesaj: "Aktarım silindi ve stoklar güncellendi." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Aktarım silme hatası:", err.message);
    res.status(500).json({ error: "Aktarım silme başarısız." });
  } finally {
    client.release();
  }
});

module.exports = router;