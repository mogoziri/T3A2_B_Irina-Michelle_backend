const Vehicle = require("../../models/vehicle")

async function findVehicles(filter) {
  const vehicles = await Vehicle.find({ availability: true })
  return vehicles
}

async function getVehicle(id) {
  const vehicle = await Vehicle.findById(id).exec()
  return vehicle
}

module.exports = {
  findVehicles,
  getVehicle,
}
