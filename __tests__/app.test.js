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
//need to write more tests, clean up existing tests; fix titles, delete repeats/not needed
describe("General endpoint errors", () => {
  test("400: send a 400 status and error message when given an invalid endpoint", () => {
    return request(app)
      .get("/api/topi")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Endpoint Not Found");
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
describe("GET /api/articles/", () => {
  test("200: Responds with all the articles sorted by date in desc order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Responds with all the articles ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([
          {
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          },
          {
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 1,
          },
          {
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          },
          {
            article_id: 12,
            title: "Moustache",
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          },
          {
            article_id: 13,
            title: "Another article about Mitch",
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          },
          {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          },
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 11,
          },
          {
            article_id: 9,
            title: "They're not exactly dogs, are they?",
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-06-06T09:10:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          },
          {
            article_id: 10,
            title: "Seven inspirational thought leaders from Manchester UK",
            topic: "mitch",
            author: "rogersop",
            created_at: "2020-05-14T04:15:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          },
          {
            article_id: 4,
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            created_at: "2020-05-06T01:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          },
          {
            article_id: 8,
            title: "Does Mitch predate civilisation?",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-04-17T01:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          },
          {
            article_id: 11,
            title: "Am I a cat?",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-01-15T22:21:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          },
          {
            article_id: 7,
            title: "Z",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          },
        ]);
      });
  });

  test("200: All articles have correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.forEach((element) => {
          expect(element).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  describe("Error handling", () => {
    test("404: send a 404 status and error message when given a non existent endpoint", () => {
      return request(app)
        .get("/api/wee")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Endpoint Not Found");
        });
    });
  });
});

describe("GET /api/articles/:article_id/commments", () => {
  test("200: Responds with the correct articles comments", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([
          {
            comment_id: 11,
            votes: 0,
            created_at: "2020-09-19T23:10:00.000Z",
            author: "icellusedkars",
            body: "Ambidextrous marsupial",
            article_id: 3,
          },
          {
            comment_id: 10,
            votes: 0,
            created_at: "2020-06-20T07:24:00.000Z",
            author: "icellusedkars",
            body: "git push origin master",
            article_id: 3,
          },
        ]);
      });
  });
  test("200: Comment response has correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        response.body.forEach((element) => {
          expect(element).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: Responds with all the comments sorted by date in desc order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe("Error handling", () => {
    test("404: send a 404 status and error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/1994/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Article not found for article_id: 1994"
          );
        });
    });
  });
});
describe("POST /api/articles/:article_id/commments", () => {
  test("201: Responds with the correct posted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "butter_bridge",
        body: "this is a test",
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject([
          {
            comment_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "this is a test",
            article_id: 3,
          },
        ]);
      });
  });
  test("201: Responds with all the comments with the new comment added", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "butter_bridge",
        body: "this is a test",
      })
      .then(() => {
        return request(app)
          .get("/api/articles/3/comments")
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual([
              {
                article_id: 3,
                author: "butter_bridge",
                body: "this is a test",
                comment_id: 19,
                created_at: expect.any(String),
                votes: 0,
              },
              {
                article_id: 3,
                author: "icellusedkars",
                body: "Ambidextrous marsupial",
                comment_id: 11,
                created_at: "2020-09-19T23:10:00.000Z",
                votes: 0,
              },
              {
                article_id: 3,
                author: "icellusedkars",
                body: "git push origin master",
                comment_id: 10,
                created_at: "2020-06-20T07:24:00.000Z",
                votes: 0,
              },
            ]);
          });
      });
  });
  describe("Error handling", () => {
    test("404: send a 404 status and error message if article does not exist", () => {
      return request(app)
        .post("/api/articles/1994/comments")
        .send({
          username: "butter_bridge",
          body: "this is a test",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Article not found for article_id: 1994"
          );
        });
    });
    test("400: send a 400 status and a Bad request error message if article_id is not valid (NAN)", () => {
      return request(app)
        .post("/api/articles/-/comments")
        .send({
          username: "butter_bridge",
          body: "this is a test",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("400: send a 400 status and a Missing fields required: username and body error message if body or username field is mising from post", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          username: "butter_bridge",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Missing fields required: username and body"
          );
        });
    });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the amended article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({
        inc_votes: 50,
      })
      .expect(200)
      .then((response) => {
        console.log(response.body);

        expect(response.body).toMatchObject([
          {
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 50,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        ]);
      });
  });
  describe("Error handling", () => {
    test("400: should return an error when inc_votes is mising", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Bad request: inc_votes must be a number"
          );
        });
    });
    test("400: should return an error when inc_votes is not a number", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: "nan" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Bad request: inc_votes must be a number"
          );
        });
    });
    test("400: sends a 400 status and a Bad request error message if article_id is not valid (NAN)", () => {
      return request(app)
        .patch("/api/articles/-")
        .send({
          inc_votes: 1,
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: sends a 404 status and bad request error when article_id does not exist", () => {
      return request(app)
        .patch("/api/articles/999")
        .send({
          inc_votes: 1,
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Article not found for article_id: 999"
          );
        });
    });
  });
});
