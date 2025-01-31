const endPoints = require("../endpoints.json");
const db = require("../db/connection");
const { commentData } = require("../db/data/development-data");
const comments = require("../db/data/development-data/comments");

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

function fetchAllArticles() {
  return db
    .query(
      `
    SELECT articles.article_id,
    title,
    topic,
    articles.author,
    articles.created_at,
    articles.votes,
    article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
}

function fetchArticleComments(article_id) {
  if (isNaN(Number(article_id))) {
    return Promise.reject({
      status: 400,
      error: "Bad request",
      msg: "Bad request",
    });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          error: "Article not found",
          msg: `Article not found for article_id: ${article_id}`,
        });
      }
    })
    .then(() => {
      return db
        .query(
          `SELECT 
          comment_id,
          comments.votes,
          comments.created_at,
          comments.author,
          comments.body,
          comments.article_id FROM comments WHERE article_id = $1
          ORDER BY comments.created_at DESC;`,
          [article_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    });
}

function handleComment(article_id, username, body) {
  //need to make into function
  if (isNaN(Number(article_id))) {
    return Promise.reject({
      status: 400,
      error: "Bad request",
      msg: "Bad request",
    });
  }
  //need to make into function
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      error: "Missing fields",
      msg: "Missing fields required: username and body",
    });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          error: "Article not found",
          msg: `Article not found for article_id: ${article_id}`,
        });
      }
    })
    .then(() => {
      return db.query(
        `INSERT INTO comments (author, body, article_id)
        VALUES ($1,$2,$3)
        RETURNING comment_id, votes, created_at, author, body, article_id;`,
        [username, body, article_id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
}

function handleArticle(article_id, inc_votes) {
  // wrap bottom two if clauses into a fucntion, takes parameter and checks if param is a number if not returns suitable rejected promise
  if (isNaN(Number(article_id))) {
    return Promise.reject({
      status: 400,
      error: "Bad request",
      msg: "Bad request",
    });
  }

  if (isNaN(inc_votes)) {
    return Promise.reject({
      status: 400,
      error: "Bad request inc_votes",
      msg: "Bad request: inc_votes must be a number",
    });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          error: "Article not found",
          msg: `Article not found for article_id: ${article_id}`,
        });
      }
    })
    .then(() => {
      return db
        .query(
          `UPDATE articles
         SET votes = votes + $1
         WHERE article_id = $2
         RETURNING *;`,
          [inc_votes, article_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    });
}

function removeComment(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
}

function fetchUsers() {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Users not found" });
    }
    return rows;
  });
}

module.exports = {
  fetchAllTopics,
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  handleComment,
  handleArticle,
  removeComment,
  fetchUsers,
};
