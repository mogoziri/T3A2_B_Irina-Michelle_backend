const express = require("express")

const { findVehicles, getVehicle } = require("./vehicleControllers")

const vehicleRouter = express.Router()

vehicleRouter.get("/", async (request, response) => {
  const vehicles = await findVehicles({})
  return response.json(vehicles)
})

vehicleRouter.get("/:vehicleId", async (request, response) => {
  try {
    const vehicleId = request.params.vehicleId
    const vehicle = await getVehicle(vehicleId)
    console.log(vehicle)
    return response.json(vehicle)
  } catch (err) {
    response.sendStatus(404)
  }
})

module.exports = vehicleRouter
