const { fetchListOfEndPoints } = require("../models/model");

function getListOfEndpoints(req, res, next) {
  return fetchListOfEndPoints()
    .then((data) => {
      res.status(200).send({ endpoints: data });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getListOfEndpoints,
};
