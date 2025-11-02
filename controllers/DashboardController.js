import db from "../db/config.js";

export const getDashboardData = async (req, res) => {
  try {
    const [lost] = await db.query("SELECT COUNT(*) AS total FROM barang WHERE status = 'hilang'");
    const [found] = await db.query("SELECT COUNT(*) AS total FROM barang WHERE status = 'ditemukan'");
    const [archived] = await db.query("SELECT COUNT(*) AS total FROM barang WHERE status = 'arsip'");

    return res.status(200).json({
      success: true,
      data: {
        totalHilang: lost[0]?.total || 0,
        totalDitemukan: found[0]?.total || 0,
        totalArsip: archived[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("❌ Error di DashboardController:", error);
    res.status(500).json({ message: "Gagal mengambil data dashboard" });
  }
};
