const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
require("dotenv").config()

const userRouter = require("./controllers/users/userRoutes")
const vehicleRouter = require("./controllers/vehicles/vehicleRoutes")

const app = express()

app.use(helmet())
app.use(express.json())

const corsOption = {
  // the origin that we want to accept, i.e. our frontend
  origin: [
    "http://localhost:3000",
    "https://carental-irina-michelle.netlify.app",
    /\.netlify\.app$/,
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOption))

const PORT = process.env.PORT || 5000

app.get("/", (request, response) => {
  response.json({
    data: "Hello World",
  })
})

app.use("/users", userRouter)
app.use("/vehicles", vehicleRouter)

module.exports = {
  app,
  PORT,
}
