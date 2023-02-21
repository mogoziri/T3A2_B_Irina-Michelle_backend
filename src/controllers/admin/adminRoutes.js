const express = require("express")

const { loginAdmin } = require("./adminControllers")

const userRouter = express.Router()

userRouter.post("/admin/login", async (request, response) => {
  const token = await loginAdmin({
    username: request.body.username,
    password: request.body.password,
  })
  return response.json(token)
})

module.exports = userRouter
