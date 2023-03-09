const mongoose = require("mongoose")

const VehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    minLength: 3,
  },
  owner_id: {
    type: String,
    required: true,
  },
  price_per_day: {
    type: Number,
    required: true,
    min: [0, "No Negative Price"],
  },
  location: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: String,
  },
  picture_url: {
    type: String,
  },
})

const Vehicle = mongoose.model("Vehicle", VehicleSchema)

module.exports = Vehicle
