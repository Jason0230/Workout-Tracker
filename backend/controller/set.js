// nested under workouts
// api/workouts/:workoutid/sets/
const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");


//@desc Get All Sets for a Workout
//@route GET /api/workout-exercise/:workoutIdExercise/set
//@access private
const getSets = asyncHandler(async (req, res) => {
    const sets = await prisma.set.findMany({
            where : { workoutExerciseId : Number(req.params.workoutExerciseId) },
    });

    res.status(200).json(sets);
});


//@desc Add a Set to a Workout
//@route POST /api/workout-exercise/:workoutExerciseId/set
//@access private
//@param {Number} reps - Number of repeitions in that set
//@param {Number} weight - Weight of that set 
//@param {string} weight_unit - Unit of weight that was used in that set
const createSet = asyncHandler(async (req, res) => {
    const { reps, weight, weight_unit } = req.body;

    //-----------------------------------------------------------------
    // Error handling

    if (!reps || !weight || !weight_unit) {
        res.status(400);
        throw new Error("All fields are Mandatory");
    }

    // find associated workout exercise
    const workoutExercise = await prisma.workoutexercise.findUnique({
        where: { 
            id: Number(req.params.workoutExerciseId),
            workoutExercise: {workout: { userId: req.user.id }}
        },
    });

    if (!workoutExercise) {
        res.status(404);
        throw new Error("Workout Exercise not found");
    }

    //-----------------------------------------------------------------

    const newSet = await prisma.set.create({
        data : {
            reps,
            weight,
            weight_unit,
            workoutExerciseId: Number(req.params.workoutExerciseId),
        },
    });

    res.status(201).json(newSet);
});


module.exports = { getSets, createSet };