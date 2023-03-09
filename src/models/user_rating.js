const mongoose = require("mongoose")

const UserRatingSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  date: { type: Date, default: Date.now },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
})

const UserRating = mongoose.model("UserRating", UserRatingSchema)

module.exports = UserRating
