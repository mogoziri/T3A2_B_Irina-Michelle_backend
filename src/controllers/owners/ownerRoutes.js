const express = require("express")

const {
  registerOwner,
  loginOwner,
  listOwnerVehicles,
} = require("./ownerControllers")

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

// TODO: make sure only logged in owner is allowed
ownerRouter.get("/:ownerId/vehicles", async (request, response) => {
  return response.json(await listOwnerVehicles(request.params.ownerId))
})

module.exports = ownerRouter
