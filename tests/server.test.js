const request = require("supertest")
const { app } = require("../src/server")

//1.
describe("server main route", () => {
  it("shows hello world message", async () => {
    const response = await request(app).get("/")
    //assertion
    expect(response.statusCode).toBe(200)
    expect(response.text).toEqual(expect.stringContaining("Hello World"))
  })

  it("returns not found for non-existing routes", async () => {
    const response = await request(app).get("/does-not-exist")
    //assertion
    expect(response.statusCode).toBe(404)
  })
})
