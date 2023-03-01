const express = require("express")

const { registerOwner, loginOwner } = require("./ownerControllers")

const ownerRouter = express.Router()

ownerRouter.post("/register", async (request, response) => {
  const token = await registerOwner({
    username: request.body.username,
    password: request.body.password,
  })
  if (token.error) {
    response.status(400).json({ data: token.error })
  }
  response.json(token)
})

ownerRouter.post("/login", async (request, response) => {
  const token = await loginOwner({
    username: request.body.username,
    password: request.body.password,
  })
  return response.json(token)
})

module.exports = ownerRouter
