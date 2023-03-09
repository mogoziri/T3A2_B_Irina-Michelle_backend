const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
require("dotenv").config()

const User = require("./models/user")
const Vehicle = require("./models/vehicle")

async function createUser(username, isAdmin) {
  const hashedPassword = await bcrypt.hash("password", 10)
  const user = await User.create({
    username: username,
    password: hashedPassword,
    is_admin: isAdmin,
  })
  return user
}

mongoose.connect(process.env.MONGO_URI, async () => {
  await User.deleteMany({})
  const user = await createUser("user")
  await createUser("admin", true)
  await Vehicle.deleteMany({})
  const vehicle = await Vehicle.create({
    type: "SUV",
    owner_id: user._id,
    price_per_day: 90,
    location: "Summer Hill, NSW",
    availability: true,
    description: "Volkswagen Tiguan 2018",
  })
  console.log(vehicle)

  // optional: add user rating, vehicle rating and reservation
  mongoose.connection.close()
})
