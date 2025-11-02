import db from "../db/config.js";

export const getDashboardData = async (req, res) => {
  try {
    const [lost] = await db.query("SELECT COUNT(*) AS total FROM items WHERE status_barang = 'hilang'");
    const [found] = await db.query("SELECT COUNT(*) AS total FROM items WHERE status_barang = 'ditemukan'");
    const [archived] = await db.query("SELECT COUNT(*) AS total FROM items WHERE status_barang = 'arsip'");

    const [monthlyStats] = await db.query(`
      SELECT 
        MONTH(created_at) AS bulan,
        SUM(CASE WHEN status_barang = 'hilang' THEN 1 ELSE 0 END) AS hilang,
        SUM(CASE WHEN status_barang = 'ditemukan' THEN 1 ELSE 0 END) AS ditemukan
      FROM items
      WHERE YEAR(created_at) = YEAR(CURDATE())
      GROUP BY MONTH(created_at)
      ORDER BY bulan
    `);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];

    const monthlyData = monthNames.map((name, i) => {
      const foundMonth = monthlyStats.find((m) => m.bulan === i + 1);
      return {
        month: name,
        hilang: foundMonth ? foundMonth.hilang : 0,
        ditemukan: foundMonth ? foundMonth.ditemukan : 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalHilang: lost[0]?.total || 0,
        totalDitemukan: found[0]?.total || 0,
        totalArsip: archived[0]?.total || 0,
        monthlyData,
      },
    });
  } catch (error) {
    console.error("❌ Error di DashboardController:", error);
    res.status(500).json({ message: "Gagal mengambil data dashboard" });
  }
};
