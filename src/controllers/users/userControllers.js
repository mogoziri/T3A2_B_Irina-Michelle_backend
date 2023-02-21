const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../../models/user")
const Owner = require("../../models/owner")

async function registerUser(user) {
  const existingUser = await User.findOne({ username: user.username })
  if (existingUser) {
    return { error: "Username already exists" }
  }
  const hashedPassword = await bcrypt.hash(user.password, 10)
  const userCreated = await User.create({
    username: user.username,
    password: hashedPassword,
  })
  const payload = {
    id: userCreated._id,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}

async function loginUser(user) {
  //check if username exists
  const existingUser = await User.findOne({ username: user.username })
  if (!existingUser) {
    return { error: "username or password is incorrect" }
  }
  //match the password
  const isMatch = await bcrypt.compare(user.password, existingUser.password)
  if (!isMatch) {
    return { error: "username or password is incorrect" }
  }
  //create the token
  const payload = {
    id: existingUser._id,
    // is_admin: undefined which translates to false
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  //return the token
  return token
}

module.exports = {
  registerUser,
  loginUser,
}
