const mongoose = require("mongoose")

const ReservationSchema = new mongoose.Schema({
  renter_id: { type: String, required: true },
  vehicle_id: { type: String, required: true },
  owner_id: { type: String, required: true },
  date: { type: Date, default: Date.now },
})

const Reservation = mongoose.model("Reservation", ReservationSchema)

module.exports = Reservation
