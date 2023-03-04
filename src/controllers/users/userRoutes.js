const express = require("express")

const {
  registerUser,
  loginUser,
  listUserReservations,
} = require("./userControllers")
const { auth } = require("../../middleware/auth")

const userRouter = express.Router()

userRouter.post("/register", async (request, response) => {
  const token = await registerUser({
    username: request.body.username,
    password: request.body.password,
  })
  if (token.error) {
    response.status(400).json({ data: token.error })
  }
  response.json(token)
})

userRouter.post("/login", async (request, response) => {
  const token = await loginUser({
    username: request.body.username,
    password: request.body.password,
  })
  if (!token.error) {
    response.cookie("accessToken", token)
  }
  return response.json(token)
})

userRouter.get("/:userId/reservations", auth, async (request, response) => {
  if (request.user._id != request.params.userId) {
    return response.sendStatus(401)
  }
  const reservations = await listUserReservations(request.params.userId)
  return response.json(reservations)
})

module.exports = userRouter
