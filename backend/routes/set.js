const express = require("express");
const router = express.Router({ mergeParams: true });

const { getSets, createSet } = require("../controller/set");


router.route("/").get(getSets).post(createSet);

module.exports = router;