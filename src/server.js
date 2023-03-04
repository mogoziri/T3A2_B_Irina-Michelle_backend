const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
require("dotenv").config()

const adminRouter = require("./controllers/admin/adminRoutes")
const userRouter = require("./controllers/users/userRoutes")
const vehicleRouter = require("./controllers/vehicles/vehicleRoutes")
const ownerRouter = require("./controllers/owners/ownerRoutes")

const app = express()

app.use(cookieParser())
app.use(helmet())
app.use(express.json())

const corsOption = {
  origin: ["http://localhost:3000"], // the origin that we want to accept, i.e. our frontend
  optionsSuccessStatus: 200,
}

app.use(cors(corsOption))

const PORT = process.env.PORT || 5000

app.get("/", (request, response) => {
  response.json({
    data: "Hello World",
  })
})

app.use("/admin", adminRouter)
app.use("/users", userRouter)
app.use("/vehicles", vehicleRouter)
app.use("/owners", ownerRouter)

module.exports = {
  app,
  PORT,
}
