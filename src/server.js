const express = require("express")
const helmet = require("helmet")

const app = express()

app.use(helmet())

app.use(express.json())

const PORT = process.env.PORT || 5000

app.get("/", (request, response) => {
    response.json({
        data: "Hello World",
    })
})

module.exports = {
    app,
    PORT
}