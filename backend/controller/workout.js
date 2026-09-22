const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");

//@desc Get All Exercises
//@route GET /api/exercise
//@access public
const getWorkout = asyncHandler(async (req, res) => {
    const workouts = await prisma.workout.findMany({
            include: {
            sets: {
                include: { exercise: true },
            },
        }});

    res.status(200).json(workouts);
});

const createWorkout = asyncHandler(async ())

module.exports = { getWorkouts, createWorkout, getWorkout,  updateWorkout, deleteWorkout };