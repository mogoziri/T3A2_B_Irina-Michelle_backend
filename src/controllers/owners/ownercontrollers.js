const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Owner = require("../../models/owner")

async function registerOwner(owner) {
  const existingOwner = await Owner.findOne({ username: owner.username })
  if (existingOwner) {
    return { error: "Username already exists" }
  }
  const hashedPassword = await bcrypt.hash(owner.password, 10)
  const ownerCreated = await Owner.create({
    username: owner.username,
    password: hashedPassword,
  })
  const payload = {
    id: ownerCreated._id,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}

async function loginOwner(owner) {
  //check if username exists
  const existingOwner = await Owner.findOne({ username: owner.username })
  if (!existingOwner) {
    return { error: "username or password is incorrect" }
  }
  //match the password
  const isMatch = await bcrypt.compare(owner.password, existingOwner.password)
  if (!isMatch) {
    return { error: "username or password is incorrect" }
  }
  //create the token
  const payload = {
    id: existingOwner._id,
    // is_admin: undefined which translates to false
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  //return the token
  return token
}

module.exports = {
  registerOwner,
  loginOwner,
}
