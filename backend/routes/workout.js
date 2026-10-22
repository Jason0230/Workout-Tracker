const express = require("express");
const router = express.Router();
const {
    getWorkouts,
    createWorkout,
    getWorkout, 
    updateWorkout,
    deleteWorkout
    } = require("../controller/workout");

const {
    addExerciseToWorkout
} = require("../controller/workoutExercise");

router.route("/").get(getWorkouts).post(createWorkout);
router.route("/:id").get(getWorkout).put(updateWorkout).delete(deleteWorkout);
router.route("/:workoutId/exercise").post(addExerciseToWorkout);

module.exports = router;    