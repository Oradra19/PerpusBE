import Barang from '../models/DataBarang.js';
import FotoBarang from '../models/DataFotoBarang.js';

class BarangController {
  static async create(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Minimal satu file gambar harus diupload'
        });
      }

      console.log('Files uploaded:', req.files);

      const dataBarang = {
        ...req.body,
        status_barang: req.body.status_barang || 'ditemukan',
        kategori: req.body.kategori || ''
      };
      console.log('Data Barang:', dataBarang);

      // Simpan data barang terlebih dahulu
      const item = await Barang.save(dataBarang);

      // Simpan semua foto yang diupload ke tabel item_photos
      const fotoPromises = req.files.map((file, index) => {
        return FotoBarang.save({
          item_id: item.id,
          url_foto: file.path,
          is_utama: index === 0 // foto pertama jadi foto utama
        });
      });

      await Promise.all(fotoPromises);

      res.status(201).json({
        success: true,
        message: 'Data barang dan semua foto berhasil ditambahkan',
        data: item
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan server'
      });
    }
  }

  static async getAll(req, res) {
    try {
      const items = await Barang.getAll();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
  try {
    const { id } = req.params;
    const item = await Barang.getById(id);
    const fotoList = await Barang.getPhotosByItemId(id);

    res.status(200).json({
      ...item,
      foto: fotoList,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


  static async update(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    // Update data barang dulu
    await Barang.update(id, data);

    // Jika ada file foto baru yang diupload
    if (req.files && req.files.length > 0) {
      // Opsional: hapus dulu semua foto lama terkait barang ini
      await FotoBarang.deleteByItemId(id);

      // Simpan semua foto baru
      const fotoPromises = req.files.map((file, index) => {
        return FotoBarang.save({
          item_id: id,
          url_foto: file.path,
          is_utama: index === 0 // foto pertama jadi foto utama
        });
      });
      await Promise.all(fotoPromises);
    }

    res.status(200).json({
      message: 'Item berhasil diperbarui.',
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}


  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Hapus semua foto terkait
      await FotoBarang.deleteByItemId(id);

      // Hapus barangnya
      await Barang.delete(id);

      res.status(200).json({
        message: 'Item dan semua fotonya berhasil dihapus.',
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async searchByName(req, res) {
    try {
      const { nama_barang } = req.query;
      const results = await Barang.searchByName(nama_barang);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getByStatus(req, res) {
    const { status } = req.params;
    try {
      const barang = await Barang.getByStatus(status);
      res.status(200).json(barang);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching items', error });
    }
  }
static async updateNoPengambil(req, res) {
  try {
    const { id } = req.params;
    const { no_pengambil, status_barang } = req.body;

    if (!no_pengambil) {
      return res.status(400).json({ message: "no_pengambil harus diisi." });
    }

    await Barang.updateNoPengambil(id, no_pengambil, status_barang || 'Ditemukan');

    res.status(200).json({
      message: 'no_pengambil dan status_barang berhasil diperbarui.',
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}


}

export default BarangController;
