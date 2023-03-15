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
  // delete the user that was just created for test (userNew)
  const userLoginResponse = await request(app)
    .post("/users/login")
    .send({ username: "userNew", password: "password" })
  const profileResponse = await request(app).post("/users/profile").send({token: userLoginResponse.body})
  const userId = profileResponse.body._id

  const loginResponse = await request(app)
    .post("/users/login")
    .send({ username: "admin", password: "password" })

  const deleteResponse = await request(app)
    .delete("/users/" + userId)
    .send({token: loginResponse.body})
  expect(deleteResponse.statusCode).toBe(200)

  await mongoose.connection.close()
})

describe("GET /users/profile", () => {
  it("should return a JSON payload of authenticated user", async () => {
    const response = await request(app).post("/users/profile").send({token: token})
    expect(response.statusCode).toBe(200)
    expect(response.body.hasOwnProperty("password")).toBe(false)
    expect(response.body.hasOwnProperty("username")).toBe(true)
    expect(response.body.hasOwnProperty("_id")).toBe(true)
  })
})

describe("GET /users/:userId/reservations", () => {
  it("should return a list of reservations", async () => {
    const profileResponse = await request(app).post("/users/profile").send({token: token})
    const response = await request(app)
      .get("/users/" + profileResponse.body._id + "/reservations")
      .send({token: token})
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})

describe("POST /users/:userId/rating", () => {
  it("should add a new rating for user", async () => {
    const profileResponse = await request(app).post("/users/profile").send({token: token})
    const userId = profileResponse.body._id
    const response = await request(app)
      .post("/users/" + userId + "/rating")
      .send({ user_id: userId, rating: 4, token: token })
    expect(response.statusCode).toBe(200)
  })
})

describe("GET /users/:userId/rating", () => {
  it("should get an average rating for user", async () => {
    const profileResponse = await request(app).post("/users/profile").send({token: token})
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
    const profileResponse = await request(app).post("/users/profile").send({token: token})
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
