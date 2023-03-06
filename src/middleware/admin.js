const jwt = require("jsonwebtoken")

function admin(request, response, next) {
  if (!request.payload.is_admin) {
    return response.status(401).json({ data: "Unauthorized" })
  }
  next()
}

module.exports = { admin }
