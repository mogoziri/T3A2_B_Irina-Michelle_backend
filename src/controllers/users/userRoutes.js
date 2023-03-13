const express = require("express")

const {
  registerUser,
  loginUser,
  deleteUser,
  listUserReservations,
  listOwnerVehicles,
  getAverageUserRating,
  createUserRating,
} = require("./userControllers")
const { auth } = require("../../middleware/auth")
const { admin } = require("../../middleware/admin")

const userRouter = express.Router()

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

userRouter.post("/login", async (request, response) => {
  const token = await loginUser({
    username: request.body.username,
    password: request.body.password,
  })
  if (token.error) {
    return response.status(401).json({ data: token.error })
  }
  response.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  })
  return response.json(token)
})

userRouter.delete("/:userId", auth, admin, async (request, response) => {
  try {
    const user = await deleteUser(request.params.userId)
    return response.json(user)
  } catch (error) {
    return response.sendStatus(404)
  }
})

userRouter.get("/profile", auth, async (request, response) => {
  return response.json(request.user)
})

userRouter.get("/:userId/reservations", auth, async (request, response) => {
  if (request.user._id != request.params.userId) {
    return response.sendStatus(401)
  }
  const reservations = await listUserReservations(request.params.userId)
  return response.json(reservations)
})

userRouter.post("/:userId/rating", auth, async (request, response) => {
  const userRating = await createUserRating({
    user_id: request.body.user_id,
    rating: request.body.rating,
  })
  return response.json(userRating)
})

userRouter.get("/:userId/rating", async (request, response) => {
  const userRating = await getAverageUserRating(request.params.userId)
  return response.json({ rating: userRating })
})

userRouter.get("/:ownerId/vehicles", async (request, response) => {
  return response.json(await listOwnerVehicles(request.params.ownerId))
})

module.exports = userRouter
