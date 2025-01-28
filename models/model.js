const endPoints = require("../endpoints.json");
const db = require("../db/connection");

function fetchAllTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function fetchArticle(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id=1;`)
    .then(({ rows }) => {
      console.log(rows, ",,,,,, response");

      return rows[0];
    });
}

module.exports = { fetchAllTopics, fetchArticle };
