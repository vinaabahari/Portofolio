const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");
const uploadImage = require("../middleware/uploadImage");
const checkSession = require('../middleware/checkSession');
const checkRole = require('../middleware/checkRole');

router.use(checkSession);

// Lihat semua gambar (halaman admin)
router.get("/",checkRole('admin'), imageController.getAll);

// Tambah gambar 
router.post("/add",checkRole('admin'),  uploadImage.single("foto"), imageController.addImage);

// Update gambar
router.post("/update/:id",checkRole('admin'), uploadImage.single("foto"), imageController.updateImage);

// Hapus gambar
router.post("/delete/:id",checkRole('admin'), imageController.deleteImage);

// Lihat gambar berdasarkan bulan (untuk admin)
router.get("/bulan/:bulan",checkRole('admin'), imageController.getByMonth);

// Halaman publik kegiatan per bulan
router.get("/kegiatan/:bulan",checkRole('admin'), imageController.getKegiatanByMonth);

module.exports = router;
