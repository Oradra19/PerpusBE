import FotoBarang from '../models/DataFotoBarang.js';

class FotoController {
  static async uploadMany(req, res) {
    const { item_id } = req.params;
    const { thumbnailIndex } = req.body; 

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
      }

      const promises = req.files.map((file, index) => {
        const is_utama = Number(thumbnailIndex) === index;
        return FotoBarang.save({
          item_id,
          url_foto: file.path, // <-- Gunakan file.path dari Cloudinary (URL)
          is_utama
        });
      });

      const result = await Promise.all(promises);
      res.status(201).json({ message: 'Foto berhasil diunggah.', data: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Gagal mengunggah foto.' });
    }
  }
}

export default FotoController;
