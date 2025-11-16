import VisitorStats from "../models/VisitorStats.js";

export const countVisitor = async (req, res) => {
  try {
    await VisitorStats.incrementDaily();
    await VisitorStats.incrementWeekly();
    await VisitorStats.incrementMonthly();

    res.json({ success: true, message: "Visitor counted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getVisitorStats = async (req, res) => {
  try {
    const daily = await VisitorStats.getDaily();
    const weekly = await VisitorStats.getWeekly();
    const monthly = await VisitorStats.getMonthly();

    res.json({
      success: true,
      daily,
      weekly,
      monthly
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
