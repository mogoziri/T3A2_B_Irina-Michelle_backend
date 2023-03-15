const { app } = require("../src/server")
const request = require("supertest")
const mongoose = require("mongoose")
require("dotenv").config()

let token

beforeAll(async () => {
  mongoose.set("strictQuery", false)
  await mongoose.connect(process.env.MONGO_URI_TEST)

  const response = await request(app).post("/users/login").send({
    username: "user",
    password: "password",
  })

  token = response.body
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe("GET /vehicles", () => {
  it("should return a list of all available vehicles", async () => {
    const response = await request(app).get("/vehicles").send()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it("should filter vehicles based on location", async () => {
    const response = await request(app).get("/vehicles?location=Surry+Hills,+NSW").send()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it("should filter vehicles based on transmission", async () => {
    const response = await request(app).get("/vehicles?transmission=Automatic").send()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
  })
})

describe("POST /vehicles", () => {
  it("should create a new vehicle", async () => {
    const profileResponse = await request(app).post("/users/profile").send({token: token})
    const userId = profileResponse.body._id
    const response = await request(app).post("/vehicles").send({
      transmission: "Automatic",
      owner_id: userId,
      price_per_day: 90,
      location: "Surry Hills, NSW",
      availability: true,
      description: "Best",
      token: token
    })

    expect(response.statusCode).toBe(200)
  })
})

describe("GET /vehicles/:vehicleId", () => {
  it("should return details of a vehicle", async () => {
    const profileResponse = await request(app).post("/users/profile").send({token: token})
    const userId = profileResponse.body._id
    const createResponse = await request(app).post("/vehicles").send({
      transmission: "Automatic",
      owner_id: userId,
      price_per_day: 90,
      location: "Surry Hills, NSW",
      availability: true,
      description: "Best",
      token: token
    })
    const response = await request(app)
      .get("/vehicles/" + createResponse.body._id)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body.owner_id).toBe(userId)
  })

  it("should return 404 if the vehicle does not exist", async () => {
    const response = await request(app).get("/vehicles/does-not-exist").send()
    expect(response.statusCode).toBe(404)
  })
})

describe("PUT /vehicles/:vehicleId", () => {
  it("should return 404 if the vehicle does not exist", async () => {
    const response = await request(app).put("/vehicles/does-not-exist").send({token: token})
    expect(response.statusCode).toBe(404)
  })

  it("should return details of updated vehicle", async () => {
    const profileResponse = await request(app).post("/users/profile").send({token: token})
    const userId = profileResponse.body._id
    const createResponse = await request(app).post("/vehicles").send({
      transmission: "Manual",
      owner_id: userId,
      price_per_day: 90,
      location: "Surry Hills, NSW",
      availability: true,
      description: "Best",
      token: token
    })
    const response = await request(app)
      .put("/vehicles/" + createResponse.body._id)
      .send({token: token})
    expect(response.statusCode).toBe(200)
  })
})

describe("POST /vehicles/:vehicleId/rating", () => {
  it("should add a new rating for vehicle", async () => {
    const vehiclesResponse = await request(app).get("/vehicles").send()
    const vehicleId = vehiclesResponse.body[0]._id

    const response = await request(app)
      .post("/vehicles/" + vehicleId + "/rating")
      .send({ vehicle_id: vehicleId, rating: 3, token: token })
    expect(response.statusCode).toBe(200)
  })
})

describe("GET /vehicles/:vehicleId/rating", () => {
  it("should get an average rating for vehicle", async () => {
    const vehiclesResponse = await request(app).get("/vehicles").send()
    const vehicleId = vehiclesResponse.body[0]._id

    const response = await request(app)
      .get("/vehicles/" + vehicleId + "/rating")
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body.hasOwnProperty("rating")).toBe(true)
    const rating = parseFloat(response.body.rating)
    expect(rating).toBeCloseTo(3.0)
  })
})

describe("POST /vehicles/:vehicleId/reservation", () => {
  it("should return 404 if the vehicle does not exist", async () => {
    const response = await request(app)
      .post("/vehicles/does-not-exist/reservation")
      .send({token: token})
    expect(response.statusCode).toBe(404)
  })

  it("should create a new reservation", async () => {
    const profileResponse = await request(app).post("/users/profile").send({token: token})
    const userId = profileResponse.body._id
    const vehiclesResponse = await request(app).get("/vehicles").send()
    const vehicleId = vehiclesResponse.body[0]._id
    const response = await request(app)
      .post("/vehicles/" + vehicleId + "/reservation")
      .send({
        renterId: userId,
        reserveFrom: new Date("2023-03-25"),
        reserveTo: new Date("2023-03-28"),
        token: token
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe("created")
    expect(response.body.owner_id).toBe(vehiclesResponse.body[0].owner_id)
  })
})

describe("PUT /vehicles/reservation/:reservationId", () => {
  it("should return 404 if the reservation does not exist", async () => {
    const response = await request(app)
      .put("/vehicles/reservation/does-not-exist")
      .send({token: token})
    expect(response.statusCode).toBe(404)
  })

  it("should update a reservation", async () => {
    const profileResponse = await request(app).post("/users/profile").send({token: token})
    const reservationResponse = await request(app)
      .get("/users/" + profileResponse.body._id + "/reservations")
      .send({token: token})
    const reservationId = reservationResponse.body[0]._id
    const response = await request(app)
      .put("/vehicles/reservation/" + reservationId)
      .send({
        status: "confirmed",
        token: token
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe("confirmed")
  })
})
