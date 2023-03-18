const express = require("express")

const {
  registerUser,
  loginUser,
  deleteUser,
  listUserReservations,
  listOwnerReservations,
  listOwnerVehicles,
  getAverageUserRating,
  createUserRating,
} = require("./userControllers")
const { auth } = require("../../middleware/auth")
const { admin } = require("../../middleware/admin")

const userRouter = express.Router()

// Create a new user
userRouter.post("/register", async (request, response) => {
  const token = await registerUser({
    username: request.body.username,
    password: request.body.password,
  })
  if (token.error) {
    return response.status(400).json({ data: token.error })
  }
  return response.json(token)
})

// Login a user
userRouter.post("/login", async (request, response) => {
  const token = await loginUser({
    username: request.body.username,
    password: request.body.password,
  })
  if (token.error) {
    return response.status(401).json({ data: token.error })
  }
  return response.json(token)
})

// Delete a specific user
userRouter.delete("/:userId", auth, admin, async (request, response) => {
  try {
    const user = await deleteUser(request.params.userId)
    return response.json(user)
  } catch (error) {
    return response.sendStatus(404)
  }
})

// Get details of logged in user
userRouter.get("/profile", auth, async (request, response) => {
  return response.json(request.user)
})

// Get information about user reservations
userRouter.get("/:userId/reservations", auth, async (request, response) => {
  const reservations = await listUserReservations(request.params.userId)
  return response.json(reservations)
})

// Get information about owner reservations
userRouter.get("/owner/:ownerId/reservations", auth, async (request, response) => {
  const reservations = await listOwnerReservations(request.params.ownerId)
  return response.json(reservations)
})

// Create user rating
userRouter.post("/:userId/rating", auth, async (request, response) => {
  const userRating = await createUserRating({
    user_id: request.body.user_id,
    rating: request.body.rating,
  })
  return response.json(userRating)
})

// Get an average user rating
userRouter.get("/:userId/rating", async (request, response) => {
  const userRating = await getAverageUserRating(request.params.userId)
  return response.json({ rating: userRating })
})

// Get all owner vehicles
userRouter.get("/:ownerId/vehicles", async (request, response) => {
  return response.json(await listOwnerVehicles(request.params.ownerId))
})

module.exports = userRouter
