const jwt = require("jsonwebtoken")

function admin(request, response, next) {
  if (!request.user.is_admin) {
    return response.status(401).json({ data: "Unauthorized" })
  }
  next()
}

module.exports = { admin }
