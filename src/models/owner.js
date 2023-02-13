const mongoose = require("mongoose")

const OwnerSchema = new mongoose.Schema({
  username: String,
  password: String,
})

const Owner = mongoose.model("Owner", OwnerSchema)

module.exports = Owner
