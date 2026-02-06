import db from "../db/config.js";

class Barang {
  constructor(data) {
    this.id = data.id || null;
    this.nama_barang = data.nama_barang || "";
    this.deskripsi = data.deskripsi || "";
    this.lokasi_ditemukan = data.lokasi_ditemukan || "";
    this.tanggal_ditemukan = data.tanggal_ditemukan || null;
    this.status_barang = data.status_barang || "";
    this.kategori = data.kategori || "";
    this.no_pengambil = data.no_pengambil || null;

    this.nama_pengambil = data.nama_pengambil || null;
    this.foto_pengambil_url = data.foto_pengambil_url || null;
    this.tanggal_diambil = data.tanggal_diambil || null;

    this.is_utama = data.is_utama || null;
    this.created_at = data.created_at || new Date();
  }

  // CREATE
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
      (field) => !data[field]?.toString().trim(),
    );

    if (missingFields.length > 0) {
      throw new Error(`Field yang harus diisi: ${missingFields.join(", ")}`);
    }

    const query = `
      INSERT INTO items 
      (
        nama_barang,
        deskripsi,
        lokasi_ditemukan,
        tanggal_ditemukan,
        status_barang,
        kategori,
        no_pengambil,
        created_at
      )
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

  // READ
  static async getAll() {
    const query = `
      SELECT 
        items.*,
        ip.url_foto AS is_utama
      FROM items
      LEFT JOIN item_photos ip 
        ON items.id = ip.item_id AND ip.is_utama = 1
      ORDER BY items.created_at DESC
    `;

    const [results] = await db.execute(query);
    return results;
  }

  static async getById(id) {
    const query = `
      SELECT 
        items.*,
        ip.url_foto AS is_utama
      FROM items
      LEFT JOIN item_photos ip 
        ON items.id = ip.item_id AND ip.is_utama = 1
      WHERE items.id = ?
    `;

    const [results] = await db.execute(query, [id]);
    if (results.length === 0) {
      throw new Error(`Item dengan ID ${id} tidak ditemukan.`);
    }
    return results[0];
  }

  static async getByStatus(status) {
    const query = `
      SELECT 
        items.*,
        ip.url_foto AS is_utama
      FROM items
      LEFT JOIN item_photos ip 
        ON items.id = ip.item_id AND ip.is_utama = 1
      WHERE items.status_barang = ?
      ORDER BY items.created_at DESC
    `;

    const [results] = await db.execute(query, [status]);
    return results;
  }

  static async searchByName(nama_barang) {
    const query = `
      SELECT 
        items.*,
        ip.url_foto AS is_utama
      FROM items
      LEFT JOIN item_photos ip 
        ON items.id = ip.item_id AND ip.is_utama = 1
      WHERE items.nama_barang LIKE ?
    `;

    const [results] = await db.execute(query, [`%${nama_barang}%`]);
    return results;
  }

  // UPDATE UMUM
  static async update(id, data) {
    const query = `
      UPDATE items
      SET 
        nama_barang = ?,
        deskripsi = ?,
        lokasi_ditemukan = ?,
        tanggal_ditemukan = ?,
        status_barang = ?,
        kategori = ?,
        no_pengambil = ?
      WHERE id = ?
    `;

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
      throw new Error(`Item dengan ID ${id} tidak ditemukan.`);
    }

    return result;
  }

  // SERAH TERIMA BARANG
  static async serahTerima(id, data) {
    let query = `
    UPDATE items
    SET
      nama_pengambil = ?,
      nim_pengambil = ?,
      no_pengambil = ?,
      status_barang = ?,
      tanggal_diambil = NOW()
  `;

    const values = [
      data.nama_pengambil,
      data.nim_pengambil,
      data.no_pengambil,
      data.status_barang || "arsip",
    ];

    if (data.foto_pengambil_url) {
      query += `, foto_pengambil_url = ?`;
      values.push(data.foto_pengambil_url);
    }

    query += ` WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      throw new Error(`Item dengan ID ${id} tidak ditemukan.`);
    }

    return result;
  }

  // UPDATE NO PENGAMBIL
  static async updateNoPengambil(
    id,
    no_pengambil,
    status_barang = "ditemukan",
  ) {
    const query = `
      UPDATE items
      SET no_pengambil = ?, status_barang = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [no_pengambil, status_barang, id]);

    if (result.affectedRows === 0) {
      throw new Error(`Item dengan ID ${id} tidak ditemukan.`);
    }

    return result;
  }

  // AUTO ARSIP 30 HARI
  static async autoArchive() {
    const query = `
      UPDATE items
      SET status_barang = 'arsip'
      WHERE status_barang != 'arsip'
      AND created_at <= NOW() - INTERVAL 30 DAY
    `;

    await db.execute(query);
  }

  // DELETE
  static async delete(id) {
    const query = "DELETE FROM items WHERE id = ?";

    const [result] = await db.execute(query, [id]);
    if (result.affectedRows === 0) {
      throw new Error(`Item dengan ID ${id} tidak ditemukan.`);
    }

    return result;
  }

  // FOTO
  static async getPhotosByItemId(item_id) {
    const query = `
      SELECT id, url_foto, is_utama
      FROM item_photos
      WHERE item_id = ?
      ORDER BY is_utama DESC, id ASC
    `;

    const [results] = await db.execute(query, [item_id]);
    return results;
  }
}

export default Barang;
