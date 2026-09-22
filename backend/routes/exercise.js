const express = require("express");
const router = express.Router();
const {
    getExercises,
    createExercise,
    getExercise, 
    updateExercise,
    deleteExercise
    } = require("../controller/exercise");

router.route("/").get(getExercises).post(createExercise);
router.route("/:id").get(getExercise).put(updateExercise).delete(deleteExercise);

module.exports = router;    