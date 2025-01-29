const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const { string } = require("pg-format");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("General endpoint errors", () => {
  test("400: send a 400 status and error message when given an invalid endpoint", () => {
    return request(app)
      .get("/api/topi")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Endpoint Not Found");
      });
  });
});
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
describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: Responds with the correct article", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("200: Article response has correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  describe("Error handling", () => {
    test("404: send a 404 status and error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/2025")
        .expect(404)
        .then((response) => {
          console.log(response.body);

          expect(response.body.msg).toBe(
            "Article not found for article_id: 2025"
          );
        });
    });
    test("400: send a 400 status and error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/-")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("400: send a 400 status and error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/notanarticle")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });
});
