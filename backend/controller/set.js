// nested under workouts
// api/workouts/:workoutid/sets/
const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");


//@desc Get All Sets for a Workout
//@route GET /api/workout/:workoutId/set
//@access public
const getSets = asyncHandler(async (req, res) => {
    const sets = await prisma.set.findMany({
            where : {workoutID : Number(req.params.workoutID)},
            include: { exercise: true }
        });

    res.status(200).json(sets);
});


//@desc Add a Set to a Workout
//@route POST /api/workout/:workoutId/set
//@access public
const createSet = asyncHandler(async (req, res) => {
    const { exerciseId, reps, weight, weight_unit } = req.body;

    //-----------------------------------------------------------------
    // Error handling

    if (!exerciseId || !reps || !weight || !weight_unit) {
        res.status(400);
        throw new Error("All fields are Mandatory");
    }

    // find associated workout
    const workout = await prisma.workout.findUnique({
        where: { id: Number(req.params.workoutId) },
    });

    if (!workout) {
        res.status(404);
        throw new Error("Workout not found");
    }

    // find associated exercise
     const exercise = await prisma.exercise.findUnique({
        where: { id: Number(exerciseId) },
    });

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not Found");
    }
    //-----------------------------------------------------------------

    const newSet = await prisma.set.create({
        data : {
            reps,
            weight,
            weight_unit,
            workoutId: Number(req.params.workoutId),
            exerciseId: Number(exerciseId)
        },
        include: {exercise: true}
    });

    res.status(201).json(newSet);
});


module.exports = { getSets, createSet };