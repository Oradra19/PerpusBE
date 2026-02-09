import Barang from "../models/DataBarang.js";
import FotoBarang from "../models/DataFotoBarang.js";

class BarangController {
  // CREATE BARANG + FOTO
  static async create(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "Minimal 1 foto harus diupload",
        });
      }

      const dataBarang = {
        ...req.body,
        status_barang: req.body.status_barang || "hilang",
      };

      const item = await Barang.save(dataBarang);

      const fotoPromises = req.files.map((file, index) =>
        FotoBarang.save({
          item_id: item.id,
          url_foto: file.path,
          is_utama: index === 0,
        }),
      );

      await Promise.all(fotoPromises);

      res.status(201).json({
        message: "Barang berhasil ditambahkan",
        data: item,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET ALL
  static async getAll(req, res) {
    try {
      const items = await Barang.getAll();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET BY ID + FOTO
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const item = await Barang.getById(id);
      const fotos = await Barang.getPhotosByItemId(id);

      res.status(200).json({
        ...item,
        foto: fotos,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

 static async update(req, res) {
  try {
    const { id } = req.params;

    const payload = { ...req.body };

    if (req.file) {
      payload.foto_pengambil_url = req.file.path;
    }

    await Barang.update(id, payload);

    res.status(200).json({
      message: "Barang berhasil diperbarui",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
}


  // DELETE BARANG
  static async delete(req, res) {
    try {
      const { id } = req.params;

      await FotoBarang.deleteByItemId(id);
      await Barang.delete(id);

      res.status(200).json({
        message: "Barang berhasil dihapus",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // SEARCH BY NAME
  static async searchByName(req, res) {
    try {
      const { nama_barang } = req.query;
      const data = await Barang.searchByName(nama_barang);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET BY STATUS
  static async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const data = await Barang.getByStatus(status);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  

}

export default BarangController;
