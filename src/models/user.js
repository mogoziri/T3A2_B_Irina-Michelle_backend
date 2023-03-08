const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 4,
  },
  password: {
    type: String,
    minLength: 6,
    required: true,
  },
  is_admin: {
    type: Boolean,
    default: false,
    required: true,
  },
})

const User = mongoose.model("User", UserSchema)

module.exports = User
