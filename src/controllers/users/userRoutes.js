const express = require("express")

const { registerUser, loginUser } = require("./userControllers")

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
  return response.json(token)
})

module.exports = userRouter
