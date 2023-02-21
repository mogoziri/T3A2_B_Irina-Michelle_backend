const mongoose = require("mongoose")

const VehicleRatingSchema = new mongoose.Schema({
  user_id: {type: String, required: true},
  vehicle_id: {type: String, required: true},
  date: { type: Date, default: Date.now },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
})

const VehicleRating = mongoose.model("VehicleRating", VehicleRatingSchema)

module.exports = VehicleRating
