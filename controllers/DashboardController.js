import db from "../db/config.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Query jumlah barang berdasarkan status
    const [lost] = await db.query("SELECT COUNT(*) AS total FROM barang WHERE status = 'hilang'");
    const [found] = await db.query("SELECT COUNT(*) AS total FROM barang WHERE status = 'ditemukan'");
    const [archived] = await db.query("SELECT COUNT(*) AS total FROM barang WHERE status = 'arsip'");

    // Kirim data ke frontend
    res.json({
      lost: lost[0].total,
      found: found[0].total,
      archived: archived[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data dashboard" });
  }
};
