const Vehicle = require("../../models/vehicle")
const VehicleRating = require("../../models/vehicle_rating")

async function findVehicles(filter) {
  const vehicles = await Vehicle.find({ availability: true })
  return vehicles
}

async function getVehicle(id) {
  const vehicle = await Vehicle.findById(id).exec()
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

async function deleteVehicle(vehicleId) {
  const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId)
  return deletedVehicle
}

async function createVehicleRating(vehicleRating) {
  const newVehicleRating = await VehicleRating.create(vehicleRating)
  return newVehicleRating
}

// TODO: implement
async function getAverageVehicleRating(vehicleId) {
  return 5.0
}

module.exports = {
  findVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  createVehicleRating,
  getAverageVehicleRating,
}
