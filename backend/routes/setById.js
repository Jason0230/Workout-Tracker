const express = require("express");
const router = express.Router({ mergeParams: true });

const { getSet, updateSet, deleteSet } = require("../controller/setById");


router.route("/:id").get(getSet).put(updateSet).delete(deleteSet);

module.exports = router;