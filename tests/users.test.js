const { app } = require("../src/server")
const request = require("supertest")
const mongoose = require("mongoose")
require("dotenv").config()

let cookie

beforeAll(async () => {
  mongoose.set("strictQuery", false)
  await mongoose.connect(process.env.MONGO_URI)

  const response = await request(app).post("/users/login").send({
    username: "user",
    password: "password",
  })

  cookie = response.get("Set-Cookie")
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe("GET /users/profile", () => {
  it("should return a JSON payload of authenticated user", async () => {
    const response = await request(app)
      .get("/users/profile")
      .set("Cookie", cookie)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body.hasOwnProperty("password")).toBe(false)
    expect(response.body.hasOwnProperty("username")).toBe(true)
    expect(response.body.hasOwnProperty("_id")).toBe(true)
  })
})

describe("GET /users/:userId/reservations", () => {
  it("should return a list of reservations", async () => {
    const profileResponse = await request(app)
      .get("/users/profile")
      .set("Cookie", cookie)
      .send()
    const response = await request(app)
      .get("/users/" + profileResponse.body._id + "/reservations")
      .set("Cookie", cookie)
      .send()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})

describe("POST /users/:userId/rating", () => {
  it("should add a new rating for user", async () => {
    const profileResponse = await request(app)
      .get("/users/profile")
      .set("Cookie", cookie)
      .send()
    const userId = profileResponse.body._id
    const response = await request(app)
      .post("/users/" + userId + "/rating")
      .set("Cookie", cookie)
      .send({ user_id: userId, rating: 4 })
    expect(response.statusCode).toBe(200)
  })
})

describe("GET /users/:userId/rating", () => {
  it("should get an average rating for user", async () => {
    const profileResponse = await request(app)
      .get("/users/profile")
      .set("Cookie", cookie)
      .send()
    const userId = profileResponse.body._id
    const response = await request(app)
      .get("/users/" + userId + "/rating")
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body.hasOwnProperty("rating")).toBe(true)
    const rating = parseFloat(response.body.rating)
    expect(rating).toBeCloseTo(4.0)
  })
})

describe("GET /users/:ownerId/vehicles", () => {
  it("should return a list of owner vehicles", async () => {
    const profileResponse = await request(app)
      .get("/users/profile")
      .set("Cookie", cookie)
      .send()
    const userId = profileResponse.body._id
    const response = await request(app)
      .get("/users/" + userId + "/vehicles")
      .send()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})

describe("POST /users/register", () => {
  it("should return an error if the user name already exists", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({ username: "user", password: "password" })
    expect(response.statusCode).toBe(400)
  })

  it("should return a JWT on success", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({ username: "userNew", password: "password" })
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeTruthy()
  })
})
