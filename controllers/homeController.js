const Photo = require("../models/imageModel");

const homeController = {
  // 🔹 Halaman utama
  getHome: async (req, res) => {
    try {
      const photos = await Photo.find().sort({ createdAt: -1 });
      res.render("home", { photos });
    } catch (error) {
      console.error("❌ Gagal memuat halaman utama:", error);
      res.status(500).send("Terjadi kesalahan saat memuat halaman utama.");
    }
  },

  // 🔹 Halaman berdasarkan bulan (1–4)
  getByMonth: async (req, res) => {
    try {
      const month = req.params.month;
      const photos = await Photo.find({ bulan: month }).sort({ createdAt: -1 });
      res.render("bulan", { images: photos, month });
    } catch (error) {
      console.error("❌ Gagal memuat data berdasarkan bulan:", error);
      res.status(500).send("Terjadi kesalahan saat memuat data bulan.");
    }
  }
};

module.exports = homeController;
