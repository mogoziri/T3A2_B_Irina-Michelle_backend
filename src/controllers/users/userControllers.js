const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../../models/user")
const Vehicle = require("../../models/vehicle")
const UserRating = require("../../models/user_rating")
const Reservation = require("../../models/reservations")

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

async function deleteUser(userId) {
  const deletedUser = await User.findByIdAndDelete(userId)
  return deletedUser
}

async function aggregateReservations(filter) {
  const reservations = await Reservation.aggregate()
    .match(filter)
    .addFields({
      vehicleId: { $convert: { input: "$vehicle_id", to: "objectId", onError: "", onNull: "" } },
    })
    .lookup({
      from: "vehicles",
      localField: "vehicleId",
      foreignField: "_id",
      as: "vehicle",
    })
    .unwind("vehicle")
  return reservations
}

async function listUserReservations(userId) {
  return aggregateReservations({ renter_id: userId })
}

async function listOwnerReservations(ownerId) {
  return aggregateReservations({ owner_id: ownerId })
}

async function listOwnerVehicles(ownerId) {
  const ownerVehicles = await Vehicle.find({ owner_id: ownerId })

  return ownerVehicles
}

async function getAverageUserRating(userId) {
  // create aggregate over UserRating collection
  const avg = await UserRating.aggregate()
    // select user rating documents with user_id == userId
    .match({ user_id: userId })
    // calculate average rating across matching documents
    .group({ _id: null, avgRating: { $avg: "$rating" } })
  return avg[0].avgRating
}

async function createUserRating(userRating) {
  const newUserRating = await UserRating.create(userRating)
  return newUserRating
}

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  listUserReservations,
  listOwnerReservations,
  listOwnerVehicles,
  getAverageUserRating,
  createUserRating,
}
