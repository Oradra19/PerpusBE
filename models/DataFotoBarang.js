import db from "../db/config.js";

class FotoBarang {
  constructor(data) {
    this.id = data.id || null;
    this.item_id = data.item_id || null; // FK ke items.id
    this.url_foto = data.url_foto || "";
    this.is_utama = data.is_utama || 0; // 1 = utama, 0 = bukan utama
  }

  static async save(data) {
    const query = `
      INSERT INTO item_photos (item_id, url_foto, is_utama)
      VALUES (?, ?, ?)
    `;
    try {
      const [result] = await db.execute(query, [
        data.item_id,
        data.url_foto,
        data.is_utama || 0,
      ]);
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error("Error saat menyimpan FotoBarang:", error.message);
      throw new Error("Gagal menyimpan foto barang.");
    }
  }

  static async getByItemId(item_id) {
    const query = `
      SELECT * FROM item_photos WHERE item_id = ? ORDER BY is_utama DESC, id ASC
    `;
    try {
      const [results] = await db.execute(query, [item_id]);
      return results;
    } catch (error) {
      console.error("Error saat mengambil foto berdasarkan item_id:", error.message);
      throw new Error("Gagal mengambil foto barang.");
    }
  }

  static async deleteByItemId(item_id) {
    const query = `DELETE FROM item_photos WHERE item_id = ?`;
    try {
      const [result] = await db.execute(query, [item_id]);
      return result;
    } catch (error) {
      console.error("Error saat menghapus foto berdasarkan item_id:", error.message);
      throw new Error("Gagal menghapus foto barang.");
    }
  }

  static async updateIsUtama(id, is_utama) {
    const query = `
      UPDATE item_photos SET is_utama = ? WHERE id = ?
    `;
    try {
      const [result] = await db.execute(query, [is_utama, id]);
      return result;
    } catch (error) {
      console.error("Error saat update is_utama foto:", error.message);
      throw new Error("Gagal mengupdate status utama foto.");
    }
  }
}

export default FotoBarang;
