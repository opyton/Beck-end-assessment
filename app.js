const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const ApiRequests = require("./ApiRequests");
app.use("/api", ApiRequests);

module.exports = app;
