const Image = require("../models/imageModel");
const path = require("path");
const fs = require("fs");

const imageController = {
  // Admin – tampil semua foto
  getAll: async (req, res) => {
    try {
      const images = await Image.find().sort({ createdAt: -1 });
      res.render("admin", { images, filter: "Semua" });
    } catch (error) {
      console.error("❌ Gagal memuat halaman admin:", error);
      res.status(500).send("Terjadi kesalahan saat memuat data gambar.");
    }
  },

  addImage: async (req, res) => {
    try {
      const { judul, bulan, keterangan, link, detail } = req.body; // ✅ tambahkan detail
      const foto = "/img/" + req.file.filename;

      await Image.create({ judul, foto, bulan, keterangan, link, detail }); // ✅ simpan detail juga
      console.log("✅ Gambar berhasil disimpan:", judul);
      res.redirect(`/admin/foto/${bulan}`);
    } catch (error) {
      console.error("❌ Gagal menambah gambar:", error);
      res.status(500).send("Gagal menambah gambar.");
    }
  },

  editImageForm: async (req, res) => {
    try {
      const image = await Image.findById(req.params.id);
      if (!image) return res.status(404).send("Gambar tidak ditemukan");
      res.render("edit", { image });
    } catch (error) {
      console.error("❌ Gagal memuat form edit:", error);
      res.status(500).send("Terjadi kesalahan saat memuat form edit.");
    }
  },

  updateImage: async (req, res) => {
    try {
      const { judul, bulan, keterangan, link, detail } = req.body; // ✅ tambahkan detail
      const id = req.params.id;

      const image = await Image.findById(id);
      if (!image) return res.status(404).send("Gambar tidak ditemukan");

      let fotoPath = image.foto;

      if (req.file) {
        const oldPath = path.join(__dirname, "..", "public", image.foto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        fotoPath = "/img/" + req.file.filename;
      }

      await Image.findByIdAndUpdate(id, { judul, bulan, keterangan, link, detail, foto: fotoPath }); // ✅ update detail juga
      console.log("✅ Gambar diperbarui:", judul);

      res.redirect("/admin/foto");
    } catch (error) {
      console.error("❌ Gagal memperbarui gambar:", error);
      res.status(500).send("Gagal memperbarui gambar.");
    }
  },

  deleteImage: async (req, res) => {
    try {
      const id = req.params.id;
      const image = await Image.findById(id);
      if (!image) return res.status(404).send("Gambar tidak ditemukan.");

      const filePath = path.join(__dirname, "..", "public", image.foto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      await Image.findByIdAndDelete(id);
      console.log("🗑️ Gambar dihapus:", image.judul);

      res.redirect("/admin/foto");
    } catch (error) {
      console.error("❌ Gagal menghapus gambar:", error);
      res.status(500).send("Terjadi kesalahan saat menghapus gambar.");
    }
  },

  // Halaman bulan publik 
  getKegiatanByMonth: async (req, res) => {
    try {
      const month = req.params.bulan;
      const images = await Image.find({ bulan: month }).sort({ createdAt: -1 });
      res.render("bulan", { images, month });
    } catch (error) {
      console.error("❌ Gagal memuat halaman kegiatan publik:", error);
      res.status(500).send("Gagal memuat halaman kegiatan publik.");
    }
  },
};

module.exports = imageController;
