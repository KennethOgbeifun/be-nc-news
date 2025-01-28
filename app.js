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

app.use((err, req, res, next) => {
  console.log(err, "You have not accounted for this error yet!");
  response.status(500).send({ msg: "Internal Server error" });
});

app.listen(port, () => {
  console.log("server listening on port 3000");
});
module.exports = app;
