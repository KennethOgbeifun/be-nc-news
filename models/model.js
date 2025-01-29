const endPoints = require("../endpoints.json");
const db = require("../db/connection");

function fetchAllTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function fetchArticle(id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          error: "Article not found",
          msg: `Article not found for article_id: ${id}`,
        });
      } else {
        return rows[0];
      }
    });
}

module.exports = { fetchAllTopics, fetchArticle };
