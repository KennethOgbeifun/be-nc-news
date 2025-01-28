const endPoints = require("../endpoints.json");

function fetchListOfEndPoints() {
  return Promise.resolve(endPoints);
}

module.exports = { fetchListOfEndPoints };
