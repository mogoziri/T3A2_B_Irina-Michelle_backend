const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 4,
  },
  password: String,
})

const User = mongoose.model("User", UserSchema)

module.exports = User
