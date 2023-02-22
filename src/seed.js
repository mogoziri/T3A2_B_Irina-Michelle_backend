const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
require("dotenv").config()

const Admin = require("./models/admin")
const User = require("./models/user")
const Owner = require("./models/owner")
const Vehicle = require("./models/vehicle")

mongoose.connect(process.env.MONGO_URI, async () => {
  await Admin.deleteMany({})
  const adminHashedPassword = await bcrypt.hash("password", 10)
  const admin = await Admin.create({
    username: "admin",
    password: adminHashedPassword,
  })
  console.log(admin)
  await User.deleteMany({})
  const userHashedPassword = await bcrypt.hash("password", 10)
  const user = await User.create({
    username: "user",
    password: userHashedPassword,
  })
  console.log(user)
  await Owner.deleteMany({})
  const ownerHashedPassword = await bcrypt.hash("password", 10)
  const owner = await Owner.create({
    username: "owner",
    password: ownerHashedPassword,
  })
  console.log(owner)
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
