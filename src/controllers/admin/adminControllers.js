const bcrypt = require("bcrypt")
const jwt = require("jwt")

const Admin = require("../../models/admin")

async function loginAdmin(user) {
  //check if username exists
  const existingUser = await Admin.findOne({ username: user.username })
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
    is_admin: true,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  //return the token
  return token
}

module.exports = { loginAdmin }
