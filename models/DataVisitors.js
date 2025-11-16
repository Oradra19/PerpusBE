import db from "../db/config.js";

const VisitorStats = {
  async incrementDaily() {
    const today = new Date().toISOString().split("T")[0];

    await db.execute(
      `INSERT INTO visitors_daily (date, count) 
       VALUES (?, 1) 
       ON DUPLICATE KEY UPDATE count = count + 1`,
      [today]
    );
  },

  async incrementWeekly() {
    const date = new Date();
    const year = date.getFullYear();
    const week = getWeekNumber(date);

    await db.execute(
      `INSERT INTO visitors_weekly (year, week, count)
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE count = count + 1`,
      [year, week]
    );
  },

  async incrementMonthly() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    await db.execute(
      `INSERT INTO visitors_monthly (year, month, count)
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE count = count + 1`,
      [year, month]
    );
  },

  // GET DATA
  async getDaily(limit = 30) {
    const [rows] = await db.execute(
      `SELECT * FROM visitors_daily ORDER BY date DESC LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async getWeekly(limit = 12) {
    const [rows] = await db.execute(
      `SELECT * FROM visitors_weekly ORDER BY year DESC, week DESC LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async getMonthly(limit = 12) {
    const [rows] = await db.execute(
      `SELECT * FROM visitors_monthly ORDER BY year DESC, month DESC LIMIT ?`,
      [limit]
    );
    return rows;
  }
};

// Function cari week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

export default VisitorStats;
