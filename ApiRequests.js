const express = require("express");
const router = express.Router();
const { getPing, getPosts } = require("./ApiHandlers");

router.get("/ping", getPing);
router.get("/posts", getPosts);

module.exports = router;
