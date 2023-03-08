const express = require("express")

const {
  findVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  createVehicleRating,
} = require("./vehicleControllers")

const { auth } = require("../../middleware/auth")
const { admin } = require("../../middleware/admin")

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

vehicleRouter.post("/", auth, async (request, response) => {
  console.log(request.ownerId)
  const vehicle = await createVehicle({
    type: request.body.type,
    owner_id: request.body.ownerId,
    price_per_day: request.body.price_per_day,
    location: request.body.location,
    availability: request.body.availability,
    description: request.body.description,
    features: request.body.features,
    picture_url: request.body.picture_url,
  })
  response.json(vehicle)
})

vehicleRouter.put("/:vehicleId", auth, async (request, response) => {
  console.log(request.ownerId)
  const updatedVehicle = await updateVehicle(request.params.vehicleId, {
    type: request.body.type,
    owner_id: request.body.ownerId,
    price_per_day: request.body.price_per_day,
    location: request.body.location,
    availability: request.body.availability,
    description: request.body.description,
    features: request.body.features,
    picture_url: request.body.picture_url,
  })
  response.json(updatedVehicle)
})

vehicleRouter.delete("/:vehicleId", auth, admin, async (request, response) => {
  const vehicle = await deleteVehicle(request.params.vehicleId)
  response.json(vehicle)
})

vehicleRouter.post("/:vehicleId/rating", auth, async (request, response) => {
  const vehicleRating = await createVehicleRating(request.params.vehicleId, {
    rating: request.body.rating,
  })
  response.json(vehicleRating)
})

module.exports = vehicleRouter
