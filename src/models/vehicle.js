const mongoose = require("mongoose")

const VehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    minLength: 3,
  },
  host: {},
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
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: String,
  },
})

const Vehicle = mongoose.model("Vehicle", VehicleSchema)

module.exports = Vehicle
