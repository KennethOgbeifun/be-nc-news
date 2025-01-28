const express = require("express");
const app = express();
const {
  getListOfEndpoints,
  getListOfTopics,
} = require("./controllers/controller");
const port = 3000;
app.use(express.json());

app.get("/api", getListOfEndpoints);

app.get("/api/topics", getListOfTopics);

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint Not Found" });
});

app.use((err, req, res, next) => {
  console.log(err, "You have not accounted for this error yet!");
  response.status(500).send({ msg: "Internal Server error" });
});

module.exports = app;
