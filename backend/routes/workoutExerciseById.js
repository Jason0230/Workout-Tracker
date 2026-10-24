const express = require("express");
const router = express.Router();

const {
    removeExerciseFromWorkout
} = require("../controller/workoutExercise");

router.route("/:id").delete(removeExerciseFromWorkout);

module.exports = router;