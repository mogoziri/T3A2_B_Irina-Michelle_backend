const Vehicle = require("../../models/vehicle")
const VehicleRating = require("../../models/vehicle_rating")
const Reservation = require("../../models/reservations")

async function findVehicles(filter) {
  const vehicles = await Vehicle.find(filter)
  return vehicles
}

async function getVehicle(id) {
  const vehicle = await Vehicle.findById(id)
  return vehicle
}

async function createVehicle(vehicle) {
  const newVehicle = await Vehicle.create(vehicle)
  return newVehicle
}

async function updateVehicle(vehicleId, vehicle) {
  const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, vehicle, {
    new: true,
    upsert: true,
  })
  return updatedVehicle
}

async function createVehicleRating(vehicleRating) {
  const newVehicleRating = await VehicleRating.create(vehicleRating)
  return newVehicleRating
}

async function getAverageVehicleRating(vehicleId) {
  // create aggregate over VehicleRating collection
  const avg = await VehicleRating.aggregate()
    // select vehicle rating documents with vehicle_id == vehicleId
    .match({ vehicle_id: vehicleId })
    // calculate average rating across matching documents
    .group({ _id: null, avgRating: { $avg: "$rating" } })
  return avg[0].avgRating
}

async function createReservation(reservation) {
  const vehicle = await getVehicle(reservation.vehicle_id)
  reservation.owner_id = vehicle.owner_id
  const newReservation = await Reservation.create(reservation)
  return newReservation
}

async function updateReservationStatus(reservationId, reservation) {
  const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, reservation, {
    new: true,
    upsert: true,
  })
  if (updatedReservation.status === "complete") {
    await Vehicle.findByIdAndUpdate(updatedReservation.vehicle_id, { availability: true })
  } else if (updatedReservation.status === "confirmed") {
    await Vehicle.findByIdAndUpdate(updatedReservation.vehicle_id, { availability: false })
  }
  return updatedReservation
}

module.exports = {
  findVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  createVehicleRating,
  getAverageVehicleRating,
  createReservation,
  updateReservationStatus,
}
