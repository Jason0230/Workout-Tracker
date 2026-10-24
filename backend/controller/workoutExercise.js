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

    const workout = await prisma.workout.findFirst( {where: {id: Number(req.params.workoutId)}});

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


    const workoutExercise = await prisma.workoutexercise.create({
        data: {
            workoutId: workout.id,
            exerciseId: exercise.id,
        },
        include: { exercise: true, sets: true },
    });

    res.status(201).json(workoutExercise);
});

//@desc Remove an Exercise from a Workout (cascade deletes its sets)
//@route DELETE /api/workout-exercise/:id
const removeExerciseFromWorkout = asyncHandler(async (req, res) => {
    const existing = await prisma.workoutexercise.findFirst( 
        { where: { id:Number(req.id), workout: { userId: req.user.id } } 
    });

    if (!existing) {
        res.status(404);
        throw new Error("Workout exercise not Found");
    }

    await prisma.workoutexercise.delete({
        where: { id: existing.id },
    });

    res.status(200).json(existing);
});

module.exports = { addExerciseToWorkout, removeExerciseFromWorkout };