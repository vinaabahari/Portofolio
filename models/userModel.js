const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nama_user: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);