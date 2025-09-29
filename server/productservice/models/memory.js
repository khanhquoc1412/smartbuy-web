const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    ram: {
      type: String,
      default: null,
    },
    rom: {
      type: String,
      default: null,
    },
    chipset: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Memory", memorySchema);