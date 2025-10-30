const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  foto: { type: String, required: true },
  bulan: { type: String, required: true },
  keterangan: { type: String }, 
  link: { type: String }, 
  detail: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model("Image", imageSchema);
