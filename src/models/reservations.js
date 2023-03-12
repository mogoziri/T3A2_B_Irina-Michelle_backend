const mongoose = require("mongoose")

const ReservationSchema = new mongoose.Schema({
  renter_id: { type: String, required: true },
  vehicle_id: { type: String, required: true },
  owner_id: { type: String, required: true },
  reserve_from: { type: Date, required: true },
  reserve_to: { type: Date, required: true },
  status: {
    type: String,
    enum: {
      values: ["created", "confirmed", "declined", "completed"],
      message: "{VALUE} is not supported",
    },
    default: "created",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
})

const Reservation = mongoose.model("Reservation", ReservationSchema)

module.exports = Reservation
