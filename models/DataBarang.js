import db from "../db/config.js";

class Barang {
  constructor(data) {
    this.id = data.id || null;
    this.nama_barang = data.nama_barang || "";
    this.deskripsi = data.deskripsi || "";
    this.lokasi_ditemukan = data.lokasi_ditemukan || "";
    this.tanggal_ditemukan = data.tanggal_ditemukan || null;
    this.status_barang = data.status_barang || "ditemukan";
    this.kategori = data.kategori || "";
    this.no_pengambil = data.no_pengambil || null;
    this.is_utama = data.is_utama || null; // dari tabel item_photos
    this.created_at = data.created_at || new Date();
  }

  static async save(data) {
    const requiredFields = [
      "nama_barang",
      "deskripsi",
      "lokasi_ditemukan",
      "tanggal_ditemukan",
      "status_barang",
      "kategori",
    ];
    const missingFields = requiredFields.filter(
      (field) => !data[field]?.toString().trim()
    );

    if (missingFields.length > 0) {
      throw new Error(`Field yang harus diisi: ${missingFields.join(", ")}`);
    }

    const query = `
      INSERT INTO items 
      (nama_barang, deskripsi, lokasi_ditemukan, tanggal_ditemukan, status_barang, kategori, no_pengambil, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      data.nama_barang,
      data.deskripsi,
      data.lokasi_ditemukan,
      data.tanggal_ditemukan,
      data.status_barang,
      data.kategori,
      data.no_pengambil || null,
      new Date(),
    ]);

    return { id: result.insertId, ...data };
  }

  static async getAll() {
    const query = `
      SELECT 
        items.*,
        ip.url_foto AS is_utama
      FROM items
      LEFT JOIN item_photos ip ON items.id = ip.item_id AND ip.is_utama = 1
      ORDER BY items.created_at DESC
    `;
    try {
      const [results] = await db.execute(query);
      return results;
    } catch (error) {
      console.error("Error saat mengambil semua data Item:", error.message);
      throw new Error("Gagal mengambil data Item.");
    }
  }

  static async getById(id) {
    const query = `
      SELECT 
        items.*,
        ip.url_foto AS is_utama
      FROM items
      LEFT JOIN item_photos ip ON items.id = ip.item_id AND ip.is_utama = 1
      WHERE items.id = ?
    `;
    try {
      const [results] = await db.execute(query, [id]);
      if (results.length === 0) {
        throw new Error(`Item dengan ID ${id} tidak ditemukan.`);
      }
      return results[0];
    } catch (error) {
      console.error(
        "Error saat mengambil data Item berdasarkan ID:",
        error.message
      );
      throw new Error(`Gagal mengambil data Item dengan ID ${id}.`);
    }
  }

  static async update(id, data) {
    const query = `
      UPDATE items
      SET nama_barang = ?, deskripsi = ?, lokasi_ditemukan = ?, tanggal_ditemukan = ?, status_barang = ?, kategori = ?, no_pengambil = ?
      WHERE id = ?
    `;
    try {
      const [result] = await db.execute(query, [
        data.nama_barang,
        data.deskripsi,
        data.lokasi_ditemukan,
        data.tanggal_ditemukan,
        data.status_barang,
        data.kategori,
        data.no_pengambil || null,
        id,
      ]);
      if (result.affectedRows === 0) {
        throw new Error(
          `Item dengan ID ${id} tidak ditemukan untuk diperbarui.`
        );
      }
      return result;
    } catch (error) {
      console.error("Error saat memperbarui Item:", error.message);
      throw new Error(`Gagal memperbarui data Item dengan ID ${id}.`);
    }
  }

  static async delete(id) {
    const query = "DELETE FROM items WHERE id = ?";
    try {
      const [result] = await db.execute(query, [id]);
      if (result.affectedRows === 0) {
        throw new Error(`Item dengan ID ${id} tidak ditemukan untuk dihapus.`);
      }
      return result;
    } catch (error) {
      console.error("Error saat menghapus Item:", error.message);
      throw new Error(`Gagal menghapus data Item dengan ID ${id}.`);
    }
  }

  static async searchByName(nama_barang) {
    const query = `
      SELECT 
        items.*,
        ip.url_foto AS is_utama
      FROM items
      LEFT JOIN item_photos ip ON items.id = ip.item_id AND ip.is_utama = 1
      WHERE items.nama_barang LIKE ?
    `;
    try {
      const [results] = await db.execute(query, [`%${nama_barang}%`]);
      return results;
    } catch (error) {
      console.error("Error saat mencari Item berdasarkan nama:", error.message);
      throw new Error("Gagal mencari Item.");
    }
  }

  static async getByStatus(status) {
    const query = `
      SELECT 
  items.*,
  ip.url_foto AS is_utama
FROM items
LEFT JOIN (
  SELECT item_id, url_foto
  FROM item_photos
  WHERE is_utama = 1
) ip ON items.id = ip.item_id
WHERE items.status_barang = ?

    `;
    try {
      const [results] = await db.execute(query, [status]);
      console.log("Results:", results);
      return results;
    } catch (error) {
      console.error(
        "Error saat mengambil data berdasarkan status:",
        error.message
      );
      throw new Error("Gagal mengambil data berdasarkan status.");
    }
  }

  static async updateNoPengambil(id, no_pengambil, status_barang = "diambil") {
    const query = `
    UPDATE items
    SET no_pengambil = ?, status_barang = ?
    WHERE id = ?
  `;
    try {
      const [result] = await db.execute(query, [
        no_pengambil,
        status_barang,
        id,
      ]);
      if (result.affectedRows === 0) {
        throw new Error(
          `Item dengan ID ${id} tidak ditemukan untuk diperbarui.`
        );
      }
      return result;
    } catch (error) {
      console.error(
        "Error saat update no_pengambil dan status_barang:",
        error.message
      );
      throw new Error("Gagal update data pengambil.");
    }
  }
  static async getPhotosByItemId(item_id) {
    const query = `
    SELECT id, url_foto, is_utama
    FROM item_photos
    WHERE item_id = ?
    ORDER BY is_utama DESC, id ASC
  `;
    try {
      const [results] = await db.execute(query, [item_id]);
      return results;
    } catch (error) {
      console.error("Gagal mengambil foto item:", error.message);
      throw new Error("Gagal mengambil foto item.");
    }
  }
}

export default Barang;
