const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/dbConnection");

//@desc Add an Exercise to a Workout
//@route POST /api/workout/:workoutId/exercise
//@param {Number} exerciseId - connects the exercise to the WorkoutExercise
const addExerciseToWorkout = asyncHandler (async (req, res) => {
    const { exerciseId } = req.body;

    if (!exerciseId) {
        res.status(400);
        throw new Error("exerciseId is required");
    }

    const workout = await prisma.workout.findFirst( {
        where: { 
            id: Number(req.params.workoutId), 
            userId: req.user.id
        } 
    });

    if (!workout) {
        res.status(404);
        throw new Error("Workout is not found")
    }

    const exercise = await prisma.exercise.findUnique({
        where: { id: Number(exerciseId) },
    });
    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not Found");
    }


    const workoutExercise = await prisma.workoutExercise.create({
        data: {
            workoutId: workout.id,
            exerciseId: exercise.id,
        },
        include: { exercise: true, sets: true },
    });

    res.status(201).json(workoutExercise);
});

//@desc Get all Exercises from a Workout
//@route GET /api/workout/:workoutId/exercise
const getExerciseFromWorkout = asyncHandler(async (req, res) => {
    const workoutId = Number(req.params.workoutId);

    const workout = await prisma.workout.findFirst({
        where: { id: workoutId, userId: req.user.id },
    });

    if (!workout) {
        res.status(404);
        throw new Error("Workout not found");
    }

    const exercises = await prisma.workoutExercise.findMany( {
        where: { workoutId,
                 workout: { userId: req.user.id }},
        include: { exercise: true, sets: true },
    });

    res.status(200).json(exercises);
});

//@desc Remove an Exercise from a Workout (cascade deletes its sets)
//@route DELETE /api/workout/:workoutId/exercise/:workoutExerciseId
const removeExerciseFromWorkout = asyncHandler(async (req, res) => {
    const existing = await prisma.workoutExercise.findFirst( { 
        where: {
            id: Number(req.params.workoutExerciseId),
            workoutId: Number(req.params.workoutId),
            workout: { userId: req.user.id },
        },
    } );

    if (!existing) {
        res.status(404);
        throw new Error("Workout exercise not Found");
    }

    await prisma.workoutExercise.delete({
        where: { id: existing.id },
    });

    res.status(200).json(existing);
});

// Changes the exericise of a workout
//@route PUT /api/workout/:workoutId/exercise/:workoutExerciseId
const updateExerciseWorkout = asyncHandler(async (req, res) => {

    console.log("BODY:", req.body, "PARAMS:", req.params);
    const workoutExercise = await prisma.workoutExercise.findFirst( { 
        where: {
            id: Number(req.params.workoutExerciseId),
            workoutId: Number(req.params.workoutId),
            workout: { userId: req.user.id },
        },
    } );

    if (!workoutExercise) {
        res.status(404);
        throw new Error("Workout exercise not Found");
    }

    const { exerciseId } = req.body;

    if (!exerciseId) {
        res.status(400);
        throw new Error("All Fields are mandatory");
    }

    const updatedWorkoutExercise = await prisma.workoutExercise.update( {
        where: {
            id: Number(req.params.workoutExerciseId),
            workoutId: Number(req.params.workoutId),
            workout: { userId: req.user.id },
        },

        data: { exerciseId: Number(exerciseId) },
        include: { exercise: true },
    });

    res.status(201).json(updatedWorkoutExercise);
})

module.exports = { addExerciseToWorkout, getExerciseFromWorkout, removeExerciseFromWorkout, updateExerciseWorkout };