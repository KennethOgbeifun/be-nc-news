const {
  fetchAllTopics,
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  handleComment,
  handleArticle,
  removeComment,
  fetchUsers,
} = require("../models/model");
const endpoints = require("../endpoints.json");
const data = require("../db/data/development-data/index");

function getListOfEndpoints(req, res, next) {
  try {
    res.status(200).send({ endpoints: endpoints });
  } catch (err) {
    next(err);
  }
}

function getListOfTopics(req, res, next) {
  return fetchAllTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
}

function getArticle(req, res, next) {
  const id = req.params.article_id;

  return fetchArticle(id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => next(err));
}

function getAllArticles(req, res, next) {
  return fetchAllArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleComments(req, res, next) {
  const id = req.params.article_id;

  return fetchArticleComments(id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
}

function postComment(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return handleComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticle(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  return handleArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

function getUsers(req, res, next) {
  return fetchUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getListOfEndpoints,
  getListOfTopics,
  getArticle,
  getAllArticles,
  getArticleComments,
  postComment,
  patchArticle,
  deleteComment,
  getUsers,
};
