const Photo = require("../models/imageModel");
const path = require("path");
const fs = require("fs");


const adminController = {
  getAdmin: async (req, res) => {
    try {
      const images = await Photo.find().sort({ createdAt: -1 });
      res.render("admin", { images, filter: null });
    } catch (error) {
      console.error("❌ Gagal memuat halaman admin:", error);
      res.status(500).send("Terjadi kesalahan saat memuat halaman admin.");
    }
  },


addPhoto: async (req, res) => {
    try {
      const { judul, bulan, keterangan, link, detail } = req.body;

      if (!req.file) return res.status(400).send("Foto wajib diupload");

      // Upload ke Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "portofolio", // folder di Cloudinary
      });

      // Hapus file sementara
      fs.unlinkSync(req.file.path);

      // Simpan ke MongoDB
      await Photo.create({
        judul,
        bulan,
        keterangan,
        link,
        detail,
        foto: result.secure_url,
      });

      console.log("✅ Foto berhasil ditambahkan:", judul);
      res.redirect("/admin/foto");
    } catch (error) {
      console.error("❌ Gagal menyimpan data foto:", error);
      res.status(500).send("Gagal menyimpan data foto");
    }
  },

  editForm: async (req, res) => {
    try {
      const photo = await Photo.findById(req.params.id);
      if (!photo) return res.status(404).send("Foto tidak ditemukan.");

      res.render("edit", { image: photo });
    } catch (error) {
      console.error("❌ Gagal memuat form edit:", error);
      res.status(500).send("Gagal memuat form edit.");
    }
  },


  updatePhoto: async (req, res) => {
    try {
      const { judul, bulan, keterangan, link, detail } = req.body;
      const id = req.params.id;

      const photo = await Photo.findById(id);
      if (!photo) return res.status(404).send("Foto tidak ditemukan");

      let fotoURL = photo.foto;

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "portofolio",
        });
        fs.unlinkSync(req.file.path);
        fotoURL = result.secure_url;
      }

      await Photo.findByIdAndUpdate(id, { judul, bulan, keterangan, link, detail, foto: fotoURL });

      console.log("✅ Foto berhasil diperbarui:", judul);
      res.redirect("/admin/foto");
    } catch (error) {
      console.error("❌ Gagal memperbarui foto:", error);
      res.status(500).send("Gagal memperbarui foto");
    }
  },


  deletePhoto: async (req, res) => {
    try {
      const photo = await Photo.findById(req.params.id);
      if (!photo) return res.status(404).send("Foto tidak ditemukan.");

      const filePath = path.join(__dirname, "..", "public", photo.foto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      await Photo.findByIdAndDelete(req.params.id);

      console.log("🗑️  Foto dihapus:", photo.judul);
      res.redirect("/admin/foto");
    } catch (error) {
      console.error("❌ Gagal menghapus foto:", error);
      res.status(500).send("Terjadi kesalahan saat menghapus foto.");
    }
  },
};

module.exports = adminController;
