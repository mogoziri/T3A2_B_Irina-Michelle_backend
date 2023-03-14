const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (request, response, next) => {
  const token = request.body.token
  if (!token) {
    return response.sendStatus(401)
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    request.user = await User.findById(data.id).select("-password")
    return next()
  } catch {
    return response.sendStatus(401)
  }
}
module.exports = { auth }
