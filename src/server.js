const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")

const app = express()

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

module.exports = {
  app,
  PORT,
}
