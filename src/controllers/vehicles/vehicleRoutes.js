const express = require("express")

const {
  findVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  createVehicleRating,
  getAverageVehicleRating,
  createReservation,
  updateReservationStatus,
} = require("./vehicleControllers")

const { auth } = require("../../middleware/auth")
const { admin } = require("../../middleware/admin")

const vehicleRouter = express.Router()

vehicleRouter.get("/", async (request, response) => {
  const vehicles = await findVehicles({
    availability: true,
    ...request.query.params,
  })
  return response.json(vehicles)
})

vehicleRouter.get("/:vehicleId", async (request, response) => {
  try {
    const vehicleId = request.params.vehicleId
    const vehicle = await getVehicle(vehicleId)
    return response.json(vehicle)
  } catch (error) {
    response.sendStatus(404)
  }
})

vehicleRouter.post("/", auth, async (request, response) => {
  const vehicle = await createVehicle({
    transmission: request.body.transmission,
    owner_id: request.body.owner_id,
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
  try {
    const updatedVehicle = await updateVehicle(request.params.vehicleId, {
      transmission: request.body.transmission,
      owner_id: request.body.ownerId,
      price_per_day: request.body.price_per_day,
      location: request.body.location,
      availability: request.body.availability,
      description: request.body.description,
      features: request.body.features,
      picture_url: request.body.picture_url,
    })
    return response.json(updatedVehicle)
  } catch (error) {
    return response.sendStatus(404)
  }
})

vehicleRouter.post("/:vehicleId/rating", auth, async (request, response) => {
  const vehicleRating = await createVehicleRating({
    vehicle_id: request.params.vehicleId,
    rating: request.body.rating,
  })
  return response.json(vehicleRating)
})

vehicleRouter.get("/:vehicleId/rating", async (request, response) => {
  const vehicleRating = await getAverageVehicleRating(request.params.vehicleId)
  return response.json({ rating: vehicleRating })
})

// Create new reservation.
vehicleRouter.post("/:vehicleId/reservation", auth, async (request, response) => {
  try {
    const reservation = await createReservation({
      vehicle_id: request.params.vehicleId,
      renter_id: request.user._id,
      reserve_from: request.body.reserveFrom,
      reserve_to: request.body.reserveTo,
    })

    return response.json(reservation)
  } catch (error) {
    return response.sendStatus(404)
  }
})

// Update reservation status.
vehicleRouter.put("/reservation/:reservationId", auth, async (request, response) => {
  try {
    const reservation = await updateReservationStatus(request.params.reservationId, {
      status: request.body.status,
    })

    return response.json(reservation)
  } catch (error) {
    return response.sendStatus(404)
  }
})

module.exports = vehicleRouter
