const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each with the correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(testData.topicData);
        expect(response.body.length).toBe(testData.topicData.length);
      });
  });
});
describe("general endpoint errors", () => {
  test("400: send a 400 status and error message when given an invalid endpoint", () => {
    return request(app)
      .get("/api/topi")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Endpoint Not Found");
      });
  });
});
