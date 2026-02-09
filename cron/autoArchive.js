import cron from "node-cron";
import Barang from "../models/DataBarang.js";

// Jalan tiap hari jam 00:00
cron.schedule("*/1 * * *", async () => {
  try {
    await Barang.autoArchive();
    console.log("[CRON] Auto archive barang berhasil");
  } catch (error) {
    console.error("[CRON] Auto archive gagal:", error.message);
  }
});
