const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../../models/user")
const Vehicle = require("../../models/vehicle")
const UserRating = require("../../models/user_rating")
const Reservation = require("../../models/reservations")

// Register a new user
async function registerUser(user) {
  // Check if username exists
  const existingUser = await User.findOne({ username: user.username })
  if (existingUser) {
    return { error: "Username already exists" }
  }
  // Create a hash password for the user
  const hashedPassword = await bcrypt.hash(user.password, 10)
  const userCreated = await User.create({
    username: user.username,
    password: hashedPassword,
  })
  // Create the token
  const payload = {
    id: userCreated._id,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  // Return the token
  return token
}

// Login a user
async function loginUser(user) {
  // Check if username exists
  const existingUser = await User.findOne({ username: user.username })
  if (!existingUser) {
    return { error: "username or password is incorrect" }
  }
  // Match the password
  const isMatch = await bcrypt.compare(user.password, existingUser.password)
  if (!isMatch) {
    return { error: "username or password is incorrect" }
  }
  // Create the token
  const payload = {
    id: existingUser._id,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  // Return the token
  return token
}

// Delete a user
async function deleteUser(userId) {
  const deletedUser = await User.findByIdAndDelete(userId)
  return deletedUser
}

// Join reservations and vehicle
async function aggregateReservations(filter) {
  // create aggregate over Reservation collection
  const reservations = await Reservation.aggregate()
    // select reservation documents matching filter
    .match(filter)
    // add temporary field vehicleId converting vehicle_id string to ObjectId
    .addFields({
      vehicleId: { $convert: { input: "$vehicle_id", to: "objectId", onError: "", onNull: "" } },
    })
    // find vehicle documents with corresponding vehicleId
    // result of the lookup - an array of maximum 1 element
    .lookup({
      from: "vehicles",
      localField: "vehicleId",
      foreignField: "_id",
      as: "vehicle",
    })
    // deconstruct array of vehicle documents into document field
    .unwind("vehicle")
  return reservations
}

// Get all user reservations
async function listUserReservations(userId) {
  return aggregateReservations({ renter_id: userId })
}

// Get all owner reservations
async function listOwnerReservations(ownerId) {
  return aggregateReservations({ owner_id: ownerId })
}

// Get all owner vehicles
async function listOwnerVehicles(ownerId) {
  const ownerVehicles = await Vehicle.find({ owner_id: ownerId })

  return ownerVehicles
}

// Get an average user rating
async function getAverageUserRating(userId) {
  // create aggregate over UserRating collection
  const avg = await UserRating.aggregate()
    // select user rating documents with user_id == userId
    .match({ user_id: userId })
    // calculate average rating across matching documents
    .group({ _id: null, avgRating: { $avg: "$rating" } })
  return avg[0].avgRating
}

// Create user rating
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
