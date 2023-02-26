const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
require("dotenv").config()

const Admin = require("./models/admin")
const User = require("./models/user")
const Owner = require("./models/owner")
const Vehicle = require("./models/vehicle")

async function initializeCollection(collection, username) {
  await collection.deleteMany({})
  const hashedPassword = await bcrypt.hash("password", 10)
  const user = await collection.create({
    username: username,
    password: hashedPassword,
  })
  console.log(user)
  return user
}

mongoose.connect(process.env.MONGO_URI, async () => {
  const admin = await initializeCollection(Admin, "admin")
  const owner = await initializeCollection(Owner, "owner")
  const user = await initializeCollection(User, "user")
  await Vehicle.deleteMany({})
  const vehicle = await Vehicle.create({
    type: "SUV",
    owner_id: owner._id,
    price_per_day: 90,
    location: "Summer Hill, NSW",
    availability: true,
    description: "Volkswagen Tiguan 2018",
  })
  console.log(vehicle)

  // optional: add user rating, vehicle rating and reservation
  mongoose.connection.close()
})
