const express = require("express");
const router = express.Router();
const {
    getWorkouts,
    createWorkout,
    getWorkout, 
    updateWorkout,
    deleteWorkout
    } = require("../controller/workout");

router.route("/").get(getWorkouts).post(createWorkout);
router.route("/:id").get(getWorkout).put(updateWorkout).delete(deleteWorkout);

module.exports = router;    